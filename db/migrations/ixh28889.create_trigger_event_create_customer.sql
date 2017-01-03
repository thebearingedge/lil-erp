alter type event_type add value 'create_customer';

create function event_create_customer() returns trigger as $$
  begin

    perform create_customer(new.entity_id, new.payload);

    return new;
  end;
$$ language plpgsql;

create trigger create_customer
  after insert
  on event_store
  for each row
  when (new.type = 'create_customer')
  execute procedure event_create_customer();

---
drop trigger create_customer on event_store;
drop function event_create_customer();
