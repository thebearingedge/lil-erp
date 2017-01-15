create table purchase_order_line_items (
  primary key (line_item_id),
  foreign key (order_id, order_type)
          references purchase_orders (order_id, order_type),
  foreign key (item_type, sku)
          references items (item_type, sku)
          on update cascade
) inherits (order_line_items);

---
drop table purchase_order_line_items;
