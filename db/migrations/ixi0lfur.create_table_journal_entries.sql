alter type transaction_type add value 'journal_entry';

create table journal_entries (
  primary key (transaction_id, transaction_type),
  foreign key (party_id, party_type)
          references parties (party_id, party_type)
) inherits (transactions);

---
drop table journal_entries;
