create type party_type as enum ('system');

create table parties (
  party_id   uuid       unique not null,
  party_type party_type not null,
  name       varchar    not null,
  notes      text,
  is_active  boolean    not null default true,
  primary key (party_id, party_type)
);

---
drop table parties;
drop type party_type;
