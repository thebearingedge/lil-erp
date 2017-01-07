alter type event_type add value 'create_item_receipt';

create function create_item_receipt(id uuid, payload jsonb) returns void as $$
  declare
    receipt   item_receipts%rowtype;
    line_item item_receipt_line_items%rowtype;
  begin

    receipt = jsonb_populate_record(null::item_receipts, payload);

    receipt.transaction_id     = id;
    receipt.transaction_type   = 'item_receipt';
    receipt.party_type         = 'vendor';
    receipt.trade_account_code = coalesce(
      receipt.trade_account_code,
      get_default_accounts_payable_code()
    );
    receipt.trade_account_type = 'accounts_payable';

    insert into item_receipts
    values (receipt.*);

    for line_item in select * from jsonb_populate_recordset(
      null::item_receipt_line_items,
      payload->'line_items'
    )
      loop
        line_item.id               = uuid_generate_v4();
        line_item.transaction_id   = receipt.transaction_id;
        line_item.transaction_type = receipt.transaction_type;
        insert into item_receipt_line_items
        values (line_item.*);
      end loop;

    return;
  end;
$$ language plpgsql;

create function event_create_item_receipt() returns trigger as $$
  begin
    perform create_item_receipt(new.entity_id, new.payload);
    return new;
  end;
$$ language plpgsql;

create trigger create_item_receipt
  after insert
  on event_store
  for each row
  when (new.type = 'create_item_receipt')
  execute procedure event_create_item_receipt();

---
drop trigger create_item_receipt on event_store;
drop function event_create_item_receipt();
drop function create_item_receipt(id uuid, payload jsonb);
delete from pg_enum using pg_type
 where pg_type.oid       = pg_enum.enumtypid
   and pg_type.typname   = 'event_type'
   and pg_enum.enumlabel = 'create_item_receipt';
