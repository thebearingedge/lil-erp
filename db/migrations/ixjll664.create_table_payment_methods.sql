create table payment_methods (
  id        uuid    primary key default uuid_generate_v4(),
  name      varchar unique not null,
  is_active boolean not null default true
);
---

drop table payment_methods;
