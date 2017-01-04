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

---
drop function create_vendor(id uuid, payload jsonb);
