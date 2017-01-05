alter type event_type add value 'create_brand';

create function create_brand(id uuid, payload jsonb) returns void as $$
  declare
    brand brands%rowtype;
  begin

    select *
      into brand
      from jsonb_populate_record(null::brands, payload);

    select id, true
      into brand.brand_id, brand.is_active;

    insert into brands
    values (brand.*);

    return;
  end;
$$ language plpgsql;

create function event_create_brand() returns trigger as $$
  begin

    perform create_brand(new.entity_id, new.payload);

    return new;
  end;
$$ language plpgsql;

create trigger create_brand
  after insert
  on event_store
  for each row
  when (new.type = 'create_brand')
  execute procedure event_create_brand();

---
drop trigger create_brand on event_store;
drop function event_create_brand();
drop function create_brand(id uuid, payload jsonb);
