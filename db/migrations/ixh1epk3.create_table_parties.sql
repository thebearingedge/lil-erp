create type party_type as enum ('general_journal');

create table parties (
  party_id   uuid       not null,
  party_type party_type not null,
  name       varchar    not null,
  notes      text,
  is_active  boolean    not null default true,
  primary key (party_id, party_type)
);

insert into parties (
  party_id,
  party_type,
  name
)
values (
  uuid_generate_v4(),
  'general_journal',
  uuid_generate_v4()
);

---
drop table parties;
drop type party_type;
