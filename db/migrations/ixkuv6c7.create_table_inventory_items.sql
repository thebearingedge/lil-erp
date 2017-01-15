alter type item_type add value 'inventory_item';

create table inventory_items (
  item_id            uuid         unique not null,
  item_type          item_type    not null,
  sku                varchar,
  brand_id           uuid,
  sales_account_code varchar      not null
                                  default get_default_inventory_sales_code(),
  sales_account_type account_type not null default 'inventory_sales',
  cost_account_code  varchar      not null
                                  default get_default_inventory_cost_code(),
  cost_account_type  account_type not null default 'cost_of_goods_sold',
  asset_account_code varchar      not null
                                  default get_default_inventory_assets_code(),
  asset_account_type account_type not null default 'inventory_assets',
  primary key (item_id, item_type, sku),
  foreign key (item_id, item_type, sku)
          references items (item_id, item_type, sku),
  foreign key (brand_id)
          references brands (brand_id),
  foreign key (sales_account_code, sales_account_type)
          references accounts (code, account_type)
          on update cascade,
  foreign key (cost_account_code, cost_account_type)
          references accounts (code, account_type)
          on update cascade,
  foreign key (asset_account_code, asset_account_type)
          references accounts (code, account_type)
          on update cascade,
  unique (item_type, sku),
  check (item_type = 'inventory_item'),
  check (sales_account_type = 'inventory_sales'),
  check (cost_account_type = 'cost_of_goods_sold'),
  check (asset_account_type = 'inventory_assets')
);

---
drop table inventory_items;
delete from pg_enum using pg_type
 where pg_type.oid       = pg_enum.enumtypid
   and pg_type.typname   = 'item_type'
   and pg_enum.enumlabel = 'inventory_item';
