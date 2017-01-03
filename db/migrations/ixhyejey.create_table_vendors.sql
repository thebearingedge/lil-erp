alter type party_type add value 'vendor';

create table vendors (
  id             uuid       primary key default uuid_generate_v4(),
  party_type     party_type check (party_type = 'vendor'),
  account_number varchar,
  website        varchar,
  foreign key (id, party_type)
          references parties (id, party_type)
);

---
drop table vendors;
