alter type party_type add value 'vendor';

create table vendors (
  account_number varchar,
  website        varchar,
  primary key (party_id, party_type),
  unique (party_id),
  check (party_type = 'vendor')
) inherits (parties);

---
drop table vendors;
