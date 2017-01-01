create function inherit_parent_account_type() returns trigger as $$
  begin

    select a.type
      into new.type
      from accounts as a
     where a.code = new.parent_code;

    return new;
  end;
$$ language plpgsql;

create trigger inherit_parent_account_type
  before insert or update of parent_code
  on accounts
  for each row
  when (new.is_system_account != true)
  execute procedure inherit_parent_account_type();

create function inherit_parent_account_class() returns trigger as $$
  begin

    select a.class
      into new.class
      from accounts as a
     where a.code = new.parent_code;

    return new;
  end;
$$ language plpgsql;

create trigger inherit_parent_account_class
  before insert or update of parent_code
  on accounts
  for each row
  when (new.is_system_account != true)
  execute procedure inherit_parent_account_class();
