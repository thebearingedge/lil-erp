alter type event_type add value 'create_inventory_item';

create function create_inventory_item(id uuid, payload jsonb) returns void as $$
  declare
    item           items%rowtype;
    inventory_item inventory_items%rowtype;
  begin

    item = jsonb_populate_record(null::items, payload);

    item.item_id   = id;
    item.item_type = 'inventory_item';
    item.is_active = true;

    insert into items
    values (item.*);

    inventory_item = jsonb_populate_record(null::inventory_items, payload);

    inventory_item.item_id            = item.item_id;
    inventory_item.item_type          = item.item_type;
    inventory_item.sales_account_type = 'inventory_sales';
    inventory_item.sales_account_code = coalesce(
      inventory_item.sales_account_code,
      get_default_inventory_sales_code()
    );
    inventory_item.cost_account_type = 'cost_of_goods_sold';
    inventory_item.cost_account_code = coalesce(
      inventory_item.cost_account_code,
      get_default_inventory_cost_code()
    );
    inventory_item.asset_account_type = 'inventory_assets';
    inventory_item.asset_account_code = coalesce(
      inventory_item.asset_account_code,
      get_default_inventory_assets_code()
    );

    insert into inventory_items
    values (inventory_item.*);

    return;
  end;
$$ language plpgsql;

create function event_create_inventory_item() returns trigger as $$
  begin
    perform create_inventory_item(new.entity_id, new.payload);
    return new;
  end;
$$ language plpgsql;

create trigger create_inventory_item
  after insert
  on event_store
  for each row
  when (new.type = 'create_inventory_item')
  execute procedure event_create_inventory_item();

---
drop trigger create_inventory_item on event_store;
drop function event_create_inventory_item();
drop function create_inventory_item(id uuid, payload jsonb);
delete from pg_enum using pg_type
 where pg_type.oid       = pg_enum.enumtypid
   and pg_type.typname   = 'event_type'
   and pg_enum.enumlabel = 'create_inventory_item';
