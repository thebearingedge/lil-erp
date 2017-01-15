alter type event_type add value 'create_journal_entry';

create function create_journal_entry(stream_id uuid, payload jsonb) returns void as $$
  declare
    journal_entry journal_entries%rowtype;
    ledger_entry  ledger_entries%rowtype;
  begin

    journal_entry = jsonb_populate_record(null::journal_entries, payload);

    journal_entry.transaction_id = stream_id;
    journal_entry.transaction_type = 'journal_entry';

    select p.party_id, p.party_type
      into journal_entry.party_id, journal_entry.party_type
      from parties as p
     where p.party_type = 'general_journal'
     limit 1;

    insert into journal_entries
    values (journal_entry.*);

    for ledger_entry in select * from jsonb_populate_recordset(
      null::ledger_entries,
      payload->'ledger_entries'
    )
      loop
        ledger_entry.entry_id         = uuid_generate_v4();
        ledger_entry.transaction_id   = journal_entry.transaction_id;
        ledger_entry.transaction_type = journal_entry.transaction_type;
        insert into ledger_entries
        values (ledger_entry.*);
      end loop;

    return;
  end;
$$ language plpgsql;

create function event_create_journal_entry() returns trigger as $$
  begin
    perform create_journal_entry(new.stream_id, new.payload);
    return new;
  end;
$$ language plpgsql;

create trigger create_journal_entry
  after insert
  on event_store
  for each row
  when (new.event_type = 'create_journal_entry')
  execute procedure event_create_journal_entry();

---
drop trigger create_journal_entry on event_store;
drop function event_create_journal_entry();
drop function create_journal_entry(stream_id uuid, payload jsonb);
delete from pg_enum using pg_type
 where pg_type.oid       = pg_enum.enumtypid
   and pg_type.typname   = 'event_type'
   and pg_enum.enumlabel = 'create_journal_entry';
