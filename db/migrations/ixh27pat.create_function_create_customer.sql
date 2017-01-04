create function create_customer(id uuid, payload jsonb) returns void as $$
  declare
    party parties%rowtype;
  begin

    select name, notes
      into party.name, party.notes
      from jsonb_to_record(payload)
        as (name varchar, notes text);

    select id, 'customer', true
      into party.party_id, party.party_type, party.is_active;

    insert into parties
    values (party.*);

    insert into customers (party_id, party_type)
    values (id, 'customer');

    return;
  end;
$$ language plpgsql;

---
drop function create_customer(id uuid, payload jsonb);
