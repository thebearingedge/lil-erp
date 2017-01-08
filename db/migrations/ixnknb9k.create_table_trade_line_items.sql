create table trade_line_items (
  id               uuid             not null,
  transaction_id   uuid             not null,
  transaction_type transaction_type not null,
  item_type        item_type,
  sku              varchar,
  quantity         numeric,
  description      text,
  line_total       monetary,
  primary key (id),
  foreign key (transaction_id, transaction_type)
          references trades (transaction_id, transaction_type),
  foreign key (item_type, sku)
          references items (item_type, sku)
          on update cascade,
  check (transaction_type in ('sale', 'purchase'))
);

---
drop table trade_line_items;
