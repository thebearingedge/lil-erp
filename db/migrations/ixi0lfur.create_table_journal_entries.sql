alter type transaction_type add value 'journal_entry';

create table journal_entries (
  primary key (transaction_id, transaction_type),
  foreign key (party_id, party_type)
          references parties (party_id, party_type)
) inherits (transactions);

---
drop table journal_entries;
delete from pg_enum using pg_type
 where pg_type.oid       = pg_enum.enumtypid
   and pg_type.typname   = 'transaction_type'
   and pg_enum.enumlabel = 'journal_entry';
