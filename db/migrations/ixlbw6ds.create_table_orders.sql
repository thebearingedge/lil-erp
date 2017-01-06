create type order_type as enum ('sales_order', 'purchase_order');

create table orders (
  order_id   uuid           not null,
  order_type order_type     not null,
  party_id   uuid           not null,
  party_type party_type     not null,
  date       timestamptz(6) not null,
  primary key (order_id, order_type),
  foreign key (party_id, party_type)
          references parties (party_id, party_type),
  check (
    (party_type = 'customer' and order_type = 'sales_order') or
    (party_type = 'vendor' and order_type = 'purchase_order')
  )
);

---
drop table orders;
drop type order_type;
