create type item_type as enum ();

create table items (
  item_id     uuid      unique not null,
  item_type   item_type not null,
  sku         varchar   unique not null,
  description text,
  is_active   boolean   not null default true,
  primary key (item_id, item_type, sku)
);

---
drop table items;
drop type item_type;
