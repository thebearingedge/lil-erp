create table default_accounts (
  accounts_payable_code    varchar      not null,
  accounts_payable_type    account_type not null,
  accounts_receivable_code varchar      not null,
  accounts_receivable_type account_type not null,
  check (accounts_payable_type = 'accounts_payable'),
  check (accounts_receivable_type = 'accounts_receivable'),
  foreign key (accounts_payable_code, accounts_payable_type)
          references accounts (code, type),
  foreign key (accounts_receivable_code, accounts_receivable_type)
          references accounts (code, type)
);

create function get_default_accounts_payable_code() returns varchar as $$
  declare
    code varchar;
  begin
    select accounts_payable_code
      into code
      from default_accounts;
    return code;
  end;
$$ language plpgsql;

create function get_default_accounts_receivable_code() returns varchar as $$
  declare
    code varchar;
  begin
    select accounts_receivable_code
      into code
      from default_accounts;
    return code;
  end;
$$ language plpgsql;

---
drop table default_accounts;
drop function get_default_accounts_payable_code();
drop function get_default_accounts_receivable_code();
