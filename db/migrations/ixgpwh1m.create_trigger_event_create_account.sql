alter type event_type add value 'create_account';

create function event_create_account() returns trigger as $$
  begin

    perform create_account(new.entity_id, new.payload);

    return new;
  end;
$$ language plpgsql;

create trigger create_account
  after insert
  on event_store
  for each row
  when (new.type = 'create_account')
  execute procedure event_create_account();

---
drop trigger create_account on event_store;
drop function event_create_account();
