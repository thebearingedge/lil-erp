alter type event_type add value 'create_sales_order';

create function create_sales_order(id uuid, payload jsonb) returns void as $$
  declare
    so         sales_orders%rowtype;
    line_item  sales_order_line_items%rowtype;
  begin

    so = jsonb_populate_record(null::sales_orders, payload);

    so.order_id   = id;
    so.order_type = 'sales_order';
    so.party_type = 'customer';

    insert into sales_orders
    values (so.*);

    for line_item in select * from jsonb_populate_recordset(
      null::sales_order_line_items,
      payload->'line_items'
    )
      loop
        line_item.id         = uuid_generate_v4();
        line_item.order_id   = so.order_id;
        line_item.order_type = so.order_type;
        insert into sales_order_line_items
        values (line_item.*);
      end loop;

    return;
  end;
$$ language plpgsql;

create function event_create_sales_order() returns trigger as $$
  begin
    perform create_sales_order(new.entity_id, new.payload);
    return new;
  end;
$$ language plpgsql;

create trigger create_sales_order
  after insert
  on event_store
  for each row
  when (new.type = 'create_sales_order')
  execute procedure event_create_sales_order();

---
drop trigger create_sales_order on event_store;
drop function event_create_sales_order();
drop function create_sales_order(id uuid, payload jsonb);
delete from pg_enum using pg_type
 where pg_type.oid       = pg_enum.enumtypid
   and pg_type.typname   = 'event_type'
   and pg_enum.enumlabel = 'create_sales_order';
