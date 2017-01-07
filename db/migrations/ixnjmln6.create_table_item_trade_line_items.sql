create table item_trade_line_items (
  id               uuid             not null,
  transaction_id   uuid             not null,
  transaction_type transaction_type not null,
  item_type        item_type,
  sku              varchar,
  quantity         numeric,
  description      text,
  line_total       monetary
);

---
drop table item_trade_line_items;
