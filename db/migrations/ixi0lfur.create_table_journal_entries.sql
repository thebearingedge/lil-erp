alter type transaction_type add value 'journal_entry';

create table journal_entries (
  id               uuid             unique not null,
  transaction_type transaction_type check (transaction_type = 'journal_entry'),
  foreign key (id, transaction_type)
          references transactions (id, transaction_type)
);

---
drop table journal_entries;
