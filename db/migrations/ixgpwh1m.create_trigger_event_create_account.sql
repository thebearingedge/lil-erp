alter type event_type add value 'create_account';

create function create_account(id uuid, payload jsonb) returns void as $$
  declare
    account accounts%rowtype;
  begin

    account = jsonb_populate_record(null::accounts, payload);

    account.id                = id;
    account.is_active         = true;
    account.is_system_account = false;

    insert into accounts
    values (account.*);

    return;
  end;
$$ language plpgsql;

create function event_create_account() returns trigger as $$
  begin
    perform create_account(new.entity_id, new.payload);
    return new;
  end;
$$ language plpgsql;

create trigger create_account
  after insert
  on event_store
  for each row
  when (new.type = 'create_account')
  execute procedure event_create_account();

---
drop trigger create_account on event_store;
drop function event_create_account();
drop function create_account(id uuid, payload jsonb);
delete from pg_enum using pg_type
 where pg_type.oid       = pg_enum.enumtypid
   and pg_type.typname   = 'event_type'
   and pg_enum.enumlabel = 'create_account';
