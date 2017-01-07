create table order_line_items (
  id          uuid       not null,
  order_id    uuid       not null,
  order_type  order_type not null,
  item_type   item_type,
  sku         varchar,
  quantity    numeric,
  description text,
  line_total  monetary
);

---
drop table order_line_items;
