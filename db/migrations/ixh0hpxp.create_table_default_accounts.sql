-- up
create table default_accounts (
  accounts_payable_code    varchar      not null,
  accounts_payable_type    account_type not null,
  accounts_receivable_code varchar      not null,
  accounts_receivable_type account_type not null,
  foreign key (accounts_payable_code, accounts_payable_type)
          references accounts (code, type),
  foreign key (accounts_receivable_code, accounts_receivable_type)
          references accounts (code, type)
);
---

-- down
drop table default_accounts;
