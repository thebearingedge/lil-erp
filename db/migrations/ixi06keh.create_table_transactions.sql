create type transaction_type as enum ();

create table transactions (
  transaction_id   uuid             not null,
  transaction_type transaction_type not null,
  party_id         uuid             not null,
  party_type       party_type       not null,
  date             date             not null,
  memo             text
);

---
drop table transactions;
drop type transaction_type;
