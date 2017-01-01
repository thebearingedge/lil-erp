create function set_payment_account_type() returns trigger as $$
  begin

    select a.type
      into new.payment_account_type
      from accounts as a
     where a.code = new.payment_account_code;

    return new;
  end;
$$ language plpgsql;

create trigger set_payment_account_type
  before insert or
         update of payment_account_type
  on payments
  for each row
  when (new.payment_account_type is null)
  execute procedure set_payment_account_type()
