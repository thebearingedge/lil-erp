create function create_account(id uuid, payload jsonb) returns void as $$
  declare
    account accounts%rowtype;
  begin

    select *
      into account
      from jsonb_populate_record(null::accounts, payload);

    select id, true, false
      into account.id, account.is_active, account.is_system_account;

    insert into accounts
    values (account.*);

    return;
  end;
$$ language plpgsql;

---
drop function create_account(id uuid, payload jsonb);
