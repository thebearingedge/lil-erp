create table brands (
  brand_id   uuid primary key default uuid_generate_v4(),
  brand_name varchar unique not null,
  is_active  boolean not null default true
);

---
drop table brands;
