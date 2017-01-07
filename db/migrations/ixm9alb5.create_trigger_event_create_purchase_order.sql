alter type event_type add value 'create_purchase_order';

create function create_purchase_order(id uuid, payload jsonb) returns void as $$
  declare
    po         purchase_orders%rowtype;
    line_item  purchase_order_line_items%rowtype;
  begin

    po = jsonb_populate_record(null::purchase_orders, payload);

    po.order_id   = id;
    po.order_type = 'purchase_order';
    po.party_type = 'vendor';

    insert into purchase_orders
    values (po.*);

    for line_item in select * from jsonb_populate_recordset(
      null::purchase_order_line_items,
      payload->'line_items'
    )
      loop
        line_item.id         = uuid_generate_v4();
        line_item.order_id   = po.order_id;
        line_item.order_type = po.order_type;
        insert into purchase_order_line_items
        values (line_item.*);
      end loop;

    return;
  end;
$$ language plpgsql;

create function event_create_purchase_order() returns trigger as $$
  begin
    perform create_purchase_order(new.entity_id, new.payload);
    return new;
  end;
$$ language plpgsql;

create trigger create_purchase_order
  after insert
  on event_store
  for each row
  when (new.type = 'create_purchase_order')
  execute procedure event_create_purchase_order();

---
drop trigger create_purchase_order on event_store;
drop function event_create_purchase_order();
drop function create_purchase_order(id uuid, payload jsonb);
delete from pg_enum using pg_type
 where pg_type.oid       = pg_enum.enumtypid
   and pg_type.typname   = 'event_type'
   and pg_enum.enumlabel = 'create_purchase_order';
