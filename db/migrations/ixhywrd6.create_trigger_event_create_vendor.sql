alter type event_type add value 'create_vendor';

create function create_vendor(id uuid, payload jsonb) returns void as $$
  declare
    party  parties%rowtype;
    vendor vendors%rowtype;
  begin

    select name, notes
      into party.name, party.notes
      from jsonb_to_record(payload)
        as (name varchar, notes text);

    select id, 'vendor', true
      into party.party_id, party.party_type, party.is_active;

    insert into parties
    values (party.*);

    select account_number, website
      into vendor.account_number, vendor.website
      from jsonb_to_record(payload)
        as (account_number varchar, website varchar);

    select id, 'vendor'
      into vendor.party_id, vendor.party_type;

    insert into vendors
    values (vendor.*);

    return;
  end;
$$ language plpgsql;

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
drop function create_vendor(id uuid, payload jsonb);
