create table brands (
  brand_id   uuid    not null default uuid_generate_v4(),
  brand_name varchar unique not null,
  is_active  boolean not null default true,
  primary key (brand_id)
);

---
drop table brands;
