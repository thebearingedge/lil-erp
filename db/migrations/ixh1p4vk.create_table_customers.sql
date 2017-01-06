alter type party_type add value 'customer';

create table customers (
  primary key (party_id, party_type),
  unique (party_id),
  check (party_type = 'customer')
) inherits (parties);

---
drop table customers;
