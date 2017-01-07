alter table schema_journal
  drop constraint schema_journal_pkey,
  add primary key (timestamp, migration_id);

---
alter table schema_journal
  drop constraint schema_journal_pkey,
  add primary key (timestamp);
