create domain monetary as numeric(20, 5);

create table ledger_entries (
  transaction_id      uuid             unique not null,
  transaction_type    transaction_type not null,
  debit_account_code  varchar          not null,
  credit_account_code varchar          not null,
  amount              monetary         not null,
  foreign key (transaction_id, transaction_type)
          references transactions (id, transaction_type),
  foreign key (debit_account_code)
          references accounts (code)
          on update cascade,
  foreign key (credit_account_code)
          references accounts (code)
          on update cascade
);

---
drop table ledger_entries;
drop domain monetary;
