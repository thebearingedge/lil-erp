alter type event_type add value 'create_payment';

create function event_create_payment() returns trigger as $$
  begin

    perform create_payment(new.entity_id, new.payload);

    return new;
  end;
$$ language plpgsql;

create trigger create_payment
  after insert
  on event_store
  for each row
  when (new.type = 'create_payment')
  execute procedure event_create_payment();

---
drop trigger create_payment on event_store;
drop function event_create_payment();
