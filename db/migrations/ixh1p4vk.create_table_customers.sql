create table customers (
  id         uuid       primary key default uuid_generate_v4(),
  party_type party_type check (party_type = 'customer'),
  foreign key (id, party_type) references parties (id, type)
);

---
drop table customers;
