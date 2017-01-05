alter type party_type add value 'customer';

create table customers (
  party_id   uuid       unique not null,
  party_type party_type not null check (party_type = 'customer'),
  primary key (party_id, party_type),
  foreign key (party_id, party_type)
          references parties (party_id, party_type)
);

---
drop table customers;
