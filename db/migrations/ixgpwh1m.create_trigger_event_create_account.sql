create function event_create_account() returns trigger as $$
  begin

    perform create_account(new.entity_id, new.payload);

    return new;
  end;
$$ language plpgsql;

create trigger create_account
  after insert
  on events
  for each row
  when (new.type = 'create_account')
  execute procedure event_create_account();

---

drop trigger create_account on events;
drop function event_create_account();
