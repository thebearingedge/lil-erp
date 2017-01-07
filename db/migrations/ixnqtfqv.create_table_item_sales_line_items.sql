create table item_sale_line_items (
  primary key (id),
  foreign key (transaction_id, transaction_type)
          references item_sales (transaction_id, transaction_type),
  foreign key (item_type, sku)
          references items (item_type, sku)
          on update cascade,
  check (transaction_type = 'item_sale')
) inherits (trade_line_items);

---
drop table item_sale_line_items;
