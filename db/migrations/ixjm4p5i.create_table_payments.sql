alter type transaction_type add value 'payment';

create table payments (
  payment_method_id    uuid         not null,
  amount               monetary     not null,
  trade_account_code   varchar      not null,
  trade_account_type   account_type not null,
  payment_account_code varchar      not null,
  payment_account_type account_type not null,
  primary key (transaction_id, transaction_type),
  foreign key (party_id, party_type)
          references parties (party_id, party_type),
  foreign key (payment_method_id)
          references payment_methods (payment_method_id),
  foreign key (trade_account_code, trade_account_type)
          references accounts (code, account_type),
  foreign key (payment_account_code, payment_account_type)
          references accounts (code, account_type),
  check (transaction_type = 'payment'),
  check (amount > 0),
  check ((party_type        = 'customer' and
         trade_account_type = 'accounts_receivable')
         or
         (party_type         = 'vendor' and
          trade_account_type = 'accounts_payable')),
  check (payment_account_type in ('cash', 'credit_cards'))
) inherits (transactions);

---
drop table payments;
delete from pg_enum using pg_type
 where pg_type.oid       = pg_enum.enumtypid
   and pg_type.typname   = 'transaction_type'
   and pg_enum.enumlabel = 'payment';
