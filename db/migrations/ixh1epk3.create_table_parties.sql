create type party_type as enum ('system');

create table parties (
  id         uuid       unique not null default uuid_generate_v4(),
  party_type party_type not null,
  name       varchar    not null,
  notes      text,
  is_active  boolean    not null default true,
  primary key (id, party_type)
);

insert into parties (party_type, name)
values ('system', uuid_generate_v4()::text);

---
drop table parties;
drop type party_type;