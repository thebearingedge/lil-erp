alter type party_type add value 'customer';

create table customers (
  party_id   uuid       unique not null,
  party_type party_type not null,
  primary key (party_id, party_type),
  foreign key (party_id, party_type)
          references parties (party_id, party_type),
  check (party_type = 'customer')
);

---
drop table customers;
