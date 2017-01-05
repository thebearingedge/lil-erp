alter type transaction_type add value 'payment';

create table payments (
  transaction_id       uuid              unique not null,
  transaction_type     transaction_type  not null,
  party_id             uuid              not null,
  party_type           party_type        not null,
  payment_method_id    uuid              not null,
  amount               monetary          not null,
  trade_account_code   varchar           not null,
  trade_account_type   account_type      not null,
  payment_account_code varchar           not null,
  payment_account_type account_type      not null,
  primary key (transaction_id, transaction_type),
  foreign key (transaction_id, transaction_type)
          references transactions (transaction_id, transaction_type),
  foreign key (party_id, party_type)
          references parties (party_id, party_type),
  foreign key (payment_method_id)
          references payment_methods (id),
  foreign key (trade_account_code, trade_account_type)
          references accounts (code, type),
  foreign key (payment_account_code, payment_account_type)
          references accounts (code, type),
  check (transaction_type = 'payment'),
  check (party_type in ('customer', 'vendor')),
  check (amount > 0),
  check (trade_account_type in ('accounts_payable', 'accounts_receivable')),
  check (payment_account_type in ('cash', 'credit_cards'))
);
---

drop table payments;
