alter type transaction_type add value 'journal_entry';

create table journal_entries (
  transaction_id   uuid             unique not null,
  transaction_type transaction_type check (transaction_type = 'journal_entry'),
  primary key (transaction_id, transaction_type),
  foreign key (transaction_id, transaction_type)
          references transactions (transaction_id, transaction_type)
);

---
drop table journal_entries;
