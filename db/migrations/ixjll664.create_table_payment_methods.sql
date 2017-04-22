create table payment_methods (
  payment_method_id uuid    not null default uuid_generate_v4(),
  name              varchar unique not null,
  is_active         boolean not null default true,
  primary key (payment_method_id)
);
---

drop table payment_methods;
