alter type event_type add value 'create_journal_entry';

create function event_create_journal_entry() returns trigger as $$
  begin

    perform create_journal_entry(new.entity_id, new.payload);

    return new;
  end;
$$ language plpgsql;

create trigger create_journal_entry
  after insert
  on event_store
  for each row
  when (new.type = 'create_journal_entry')
  execute procedure event_create_journal_entry();

---
drop trigger create_journal_entry on event_store;
drop function event_create_journal_entry();
