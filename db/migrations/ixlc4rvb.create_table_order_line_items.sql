create table order_line_items (
  id          uuid       not null,
  order_id    uuid       not null,
  order_type  order_type not null,
  item_type   item_type,
  sku         varchar,
  quantity    numeric,
  description text,
  line_total  monetary,
  primary key (id),
  foreign key (order_id, order_type)
          references orders (order_id, order_type),
  foreign key (item_type, sku)
          references items (item_type, sku)
          on update cascade
);

---
drop table order_line_items;
