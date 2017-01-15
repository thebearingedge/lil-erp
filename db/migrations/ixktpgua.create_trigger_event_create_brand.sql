alter type event_type add value 'create_brand';

create function create_brand(stream_id uuid, payload jsonb) returns void as $$
  declare
    brand brands%rowtype;
  begin

    brand = jsonb_populate_record(null::brands, payload);

    brand.brand_id  = stream_id;
    brand.is_active = true;

    insert into brands
    values (brand.*);

    return;
  end;
$$ language plpgsql;

create function event_create_brand() returns trigger as $$
  begin
    perform create_brand(new.stream_id, new.payload);
    return new;
  end;
$$ language plpgsql;

create trigger create_brand
  after insert
  on event_store
  for each row
  when (new.event_type = 'create_brand')
  execute procedure event_create_brand();

---
drop trigger create_brand on event_store;
drop function event_create_brand();
drop function create_brand(stream_id uuid, payload jsonb);
delete from pg_enum using pg_type
 where pg_type.oid       = pg_enum.enumtypid
   and pg_type.typname   = 'event_type'
   and pg_enum.enumlabel = 'create_brand';
