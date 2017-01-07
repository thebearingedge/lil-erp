create type order_type as enum ();

create table orders (
  order_id   uuid           not null,
  order_type order_type     not null,
  party_id   uuid           not null,
  party_type party_type     not null,
  date       timestamptz(6) not null
);

---
drop table orders;
drop type order_type;
