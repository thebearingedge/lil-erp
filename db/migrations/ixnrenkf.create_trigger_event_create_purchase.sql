alter type event_type add value 'create_purchase';

create function create_purchase(id uuid, payload jsonb) returns void as $$
  declare
    purchase           trades%rowtype;
    trade_account_code jsonb;
    line_items         jsonb[];
  begin

    trade_account_code = coalesce(
      payload->'trade_account_code',
      to_jsonb(get_default_accounts_payable_code())
    );

    payload = payload || jsonb_build_object(
      'transaction_id',     id,
      'transaction_type',   'purchase',
      'party_type',         'vendor',
      'trade_account_type', 'accounts_payable',
      'trade_account_code', trade_account_code
    );

    purchase = jsonb_populate_record(null::trades, payload);

    insert into trades
    values (purchase.*);

    line_items = array(select jsonb_array_elements(payload->'line_items'));

    for i in 1..array_length(line_items, 1)
      loop
        line_items[i] = line_items[i] || jsonb_build_object(
          'id',               uuid_generate_v4(),
          'transaction_id',   purchase.transaction_id,
          'transaction_type', purchase.transaction_type
        );
      end loop;

    with inserted_line_items as (
      insert into trade_line_items
      select *
        from jsonb_populate_recordset(
               null::trade_line_items,
               to_jsonb(line_items)
             )
      returning *
    ), inventory_line_items as (
      select *
        from inserted_line_items
       where item_type = 'inventory_item'
    )
    insert into stock_status (
      trade_line_item_id,
      item_type,
      sku,
      move_quantity,
      move_cost,
      transaction_id,
      transaction_date
    )
    select l.id,
           l.item_type,
           l.sku,
           l.quantity,
           l.line_total,
           purchase.transaction_id,
           purchase.date
      from inventory_line_items as l;

    return;
  end;
$$ language plpgsql;

create function event_create_purchase() returns trigger as $$
  begin
    perform create_purchase(new.entity_id, new.payload);
    return new;
  end;
$$ language plpgsql;

create trigger create_purchase
  after insert
  on event_store
  for each row
  when (new.type = 'create_purchase')
  execute procedure event_create_purchase();

---
drop trigger create_purchase on event_store;
drop function event_create_purchase();
drop function create_purchase(id uuid, payload jsonb);
delete from pg_enum using pg_type
 where pg_type.oid       = pg_enum.enumtypid
   and pg_type.typname   = 'event_type'
   and pg_enum.enumlabel = 'create_purchase';
