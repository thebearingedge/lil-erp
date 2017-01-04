alter type party_type add value 'vendor';

create table vendors (
  party_id       uuid       unique not null,
  party_type     party_type check (party_type = 'vendor'),
  account_number varchar,
  website        varchar,
  primary key (party_id, party_type),
  foreign key (party_id, party_type)
          references parties (party_id, party_type)
);

---
drop table vendors;
