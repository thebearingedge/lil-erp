create type party_type as enum (
  'customer'
);

create table parties (
  id        uuid       unique not null default uuid_generate_v4(),
  type      party_type not null,
  name      varchar    not null,
  notes     text,
  is_active boolean    not null default true,
  primary key (id, type)
);

---
drop table parties;
drop type party_type;
