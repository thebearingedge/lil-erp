alter type event_type add value 'create_vendor';

create function create_vendor(id uuid, payload jsonb) returns void as $$
  declare
    vendor vendors%rowtype;
  begin

    vendor = jsonb_populate_record(null::vendors, payload);

    vendor.party_id   = id;
    vendor.party_type = 'vendor';
    vendor.is_active  = true;

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
