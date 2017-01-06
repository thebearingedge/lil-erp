alter type event_type add value 'create_customer';

create function create_customer(id uuid, payload jsonb) returns void as $$
  declare
    party parties%rowtype;
  begin

    party = jsonb_populate_record(null::parties, payload);

    party.party_id   = id;
    party.party_type = 'customer';
    party.is_active  = true;

    insert into parties
    values (party.*);

    insert into customers (party_id, party_type)
    values (id, 'customer');

    return;
  end;
$$ language plpgsql;

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
drop function create_customer(id uuid, payload jsonb);
