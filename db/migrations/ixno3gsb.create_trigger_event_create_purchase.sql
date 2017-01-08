alter type event_type add value 'create_purchase';

create function create_purchase(id uuid, payload jsonb) returns void as $$
  declare
    purchase   trades%rowtype;
    line_item  trade_line_items%rowtype;
  begin

    purchase = jsonb_populate_record(null::trades, payload);

    purchase.transaction_id     = id;
    purchase.transaction_type   = 'purchase';
    purchase.party_type         = 'vendor';
    purchase.trade_account_code = coalesce(
      purchase.trade_account_code,
      get_default_accounts_payable_code()
    );
    purchase.trade_account_type = 'accounts_payable';

    insert into trades
    values (purchase.*);

    for line_item in select * from jsonb_populate_recordset(
      null::trade_line_items,
      payload->'line_items'
    )
      loop
        line_item.id               = uuid_generate_v4();
        line_item.transaction_id   = purchase.transaction_id;
        line_item.transaction_type = purchase.transaction_type;
        insert into trade_line_items
        values (line_item.*);
      end loop;

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
