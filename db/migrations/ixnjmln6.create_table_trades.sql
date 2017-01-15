alter type transaction_type add value 'sale';
alter type transaction_type add value 'purchase';

create table trades (
  trade_account_code varchar      not null
                                  default get_default_accounts_payable_code(),
  trade_account_type account_type not null
                                  default 'accounts_payable',
  primary key (transaction_id, transaction_type),
  foreign key (party_id, party_type)
          references parties (party_id, party_type),
  foreign key (trade_account_code, trade_account_type)
          references accounts (code, account_type),
  check (
    (party_type         = 'vendor' and
     trade_account_type = 'accounts_payable' and
     transaction_type   = 'purchase')
     or
    (party_type         = 'customer' and
     trade_account_type = 'accounts_receivable' and
     transaction_type   = 'sale')
  )
) inherits (transactions);

---
drop table trades;
delete from pg_enum using pg_type
 where pg_type.oid       = pg_enum.enumtypid
   and pg_type.typname   = 'transaction_type'
   and pg_enum.enumlabel = 'sale'
    or pg_enum.enumlabel = 'purchase';
