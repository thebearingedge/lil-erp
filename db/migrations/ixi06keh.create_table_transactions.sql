create type transaction_type as enum ();

create table transactions (
  transaction_id   uuid             unique not null,
  transaction_type transaction_type not null,
  party_id         uuid             not null,
  party_type       party_type       not null,
  date             timestamptz(6)   not null,
  memo             text,
  primary key (transaction_id, transaction_type),
  foreign key (party_id, party_type)
          references parties (party_id, party_type)
);
---

drop table transactions;
drop type transaction_type;
