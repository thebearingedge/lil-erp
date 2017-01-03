create function create_account(id uuid, payload jsonb) returns void as $$
  declare
    account accounts%rowtype;
  begin

    select *
      into account
      from jsonb_populate_record(null::accounts, payload);

    account.id                = id;
    account.is_system_account = false;
    account.is_active         = true;

    insert into accounts
    values (account.*);


    return;
  end;
$$ language plpgsql;

---

drop function create_account(id uuid, payload jsonb);
