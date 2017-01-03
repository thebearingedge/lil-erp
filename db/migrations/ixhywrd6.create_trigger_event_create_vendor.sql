alter type event_type add value 'create_vendor';

create function event_create_vendor() returns trigger as $$
  begin

    perform create_vendor(new.entity_id, new.payload);

    return new;
  end;
$$ language plpgsql;

create trigger create_vendor
  after insert
  on event_store
  for each row
  when (new.type = 'create_vendor')
  execute procedure event_create_vendor();

---
drop trigger create_vendor on event_store;
drop function event_create_vendor();
