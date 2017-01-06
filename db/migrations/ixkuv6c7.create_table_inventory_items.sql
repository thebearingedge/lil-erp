alter type item_type add value 'inventory_item';

create table inventory_items (
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
  foreign key (brand_id)
          references brands (brand_id),
  foreign key (sales_account_code, sales_account_type)
          references accounts (code, type)
          on update cascade,
  foreign key (cost_account_code, cost_account_type)
          references accounts (code, type)
          on update cascade,
  foreign key (asset_account_code, asset_account_type)
          references accounts (code, type)
          on update cascade,
  unique (sku),
  check (item_type = 'inventory_item'),
  check (sales_account_type = 'inventory_sales'),
  check (cost_account_type = 'cost_of_goods_sold'),
  check (asset_account_type = 'inventory_assets')
) inherits (items);

---
drop table inventory_items;