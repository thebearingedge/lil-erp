alter type event_type add value 'create_purchase';

create function create_purchase(stream_id uuid, payload jsonb) returns void as $$
  declare
    purchase           trades%rowtype;
    trade_account_code jsonb;
    journal_entry_json jsonb;
    ledger_entry_json  jsonb[];
  begin

    trade_account_code = coalesce(
      payload->'trade_account_code',
      to_jsonb(get_default_accounts_payable_code())
    );

    payload = payload || jsonb_build_object(
      'transaction_id',     stream_id,
      'transaction_type',   'purchase',
      'party_type',         'vendor',
      'trade_account_type', 'accounts_payable',
      'trade_account_code', trade_account_code
    );

    purchase = jsonb_populate_record(null::trades, payload);

    insert into trades
    values (purchase.*);

    with line_items as (
      select p.line_item || jsonb_build_object(
        'line_item_id',     uuid_generate_v4(),
        'transaction_id',   purchase.transaction_id,
        'transaction_type', purchase.transaction_type
      )
        from (select jsonb_array_elements(payload->'line_items')
                  as line_item)
          as p
    ), inserted_line_items as (
      insert into trade_line_items
      select *
        from jsonb_populate_recordset(
               null::trade_line_items,
               to_jsonb(array(select * from line_items))
             )
      returning *
    ), inventory_line_items as (
      select *
        from inserted_line_items
       where item_type = 'inventory_item'
    ), stock_moves as (
      insert into stock_status (
        line_item_id,
        item_type,
        sku,
        move_quantity,
        move_cost,
        transaction_id,
        transaction_date
      )
      select l.line_item_id,
             l.item_type,
             l.sku,
             l.quantity,
             l.line_total,
             purchase.transaction_id,
             purchase.date
        from inventory_line_items as l
      returning *
    ), new_ledger_entries as (
      select array_agg(jsonb_build_object(
               'debit_account_code', ii.asset_account_code,
               'credit_account_code', purchase.trade_account_code,
               'amount', l.line_total
             ))
        from inventory_line_items as l
        join inventory_items as ii using (item_type, sku)
    )
    select *
      into ledger_entry_json
      from new_ledger_entries;

    journal_entry_json = jsonb_build_object(
      'date', purchase.date,
      'ledger_entries', to_jsonb(ledger_entry_json)
    );

    insert into event_store (
      event_type,
      stream_id,
      payload
    )
    values (
      'create_journal_entry',
      purchase.transaction_id,
      journal_entry_json
    );

    return;
  end;
$$ language plpgsql;

create function event_create_purchase() returns trigger as $$
  begin
    perform create_purchase(new.stream_id, new.payload);
    return new;
  end;
$$ language plpgsql;

create trigger create_purchase
  after insert
  on event_store
  for each row
  when (new.event_type = 'create_purchase')
  execute procedure event_create_purchase();

---
drop trigger create_purchase on event_store;
drop function event_create_purchase();
drop function create_purchase(stream_id uuid, payload jsonb);
delete from pg_enum using pg_type
 where pg_type.oid       = pg_enum.enumtypid
   and pg_type.typname   = 'event_type'
   and pg_enum.enumlabel = 'create_purchase';
