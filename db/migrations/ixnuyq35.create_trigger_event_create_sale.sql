alter type event_type add value 'create_sale';

create function create_sale(id uuid, payload jsonb) returns void as $$
  declare
    sale      trades%rowtype;
    line_item trade_line_items%rowtype;
  begin

    sale = jsonb_populate_record(null::trades, payload);

    sale.transaction_id     = id;
    sale.transaction_type   = 'sale';
    sale.party_type         = 'customer';
    sale.trade_account_code = coalesce(
      sale.trade_account_code,
      get_default_accounts_receivable_code()
    );
    sale.trade_account_type = 'accounts_receivable';

    insert into trades
    values (sale.*);

    for line_item in select * from jsonb_populate_recordset(
      null::trade_line_items,
      payload->'line_items'
    )
      loop
        line_item.id               = uuid_generate_v4();
        line_item.transaction_id   = sale.transaction_id;
        line_item.transaction_type = sale.transaction_type;
        insert into trade_line_items
        values (line_item.*);
      end loop;

    return;
  end;
$$ language plpgsql;

create function event_create_sale() returns trigger as $$
  begin
    perform create_sale(new.entity_id, new.payload);
    return new;
  end;
$$ language plpgsql;

create trigger create_sale
  after insert
  on event_store
  for each row
  when (new.type = 'create_sale')
  execute procedure event_create_sale();

---
drop trigger create_sale on event_store;
drop function event_create_sale();
drop function create_sale(id uuid, payload jsonb);
delete from pg_enum using pg_type
 where pg_type.oid       = pg_enum.enumtypid
   and pg_type.typname   = 'event_type'
   and pg_enum.enumlabel = 'create_sale';
