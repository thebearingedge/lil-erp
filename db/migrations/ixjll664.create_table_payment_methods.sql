create table payment_methods (
  id        uuid    not null default uuid_generate_v4(),
  name      varchar unique not null,
  is_active boolean not null default true,
  primary key (id)
);
---

drop table payment_methods;
