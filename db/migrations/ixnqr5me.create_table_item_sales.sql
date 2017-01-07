alter type transaction_type add value 'item_sale';

create table item_sales (
  trade_account_code varchar      not null
                                  default get_default_accounts_receivable_code(),
  trade_account_type account_type not null
                                  default 'accounts_receivable',
  primary key (transaction_id, transaction_type),
  foreign key (party_id, party_type)
          references parties (party_id, party_type),
  foreign key (trade_account_code, trade_account_type)
          references accounts (code, type),
  check (transaction_type = 'item_sale'),
  check (party_type = 'customer'),
  check (trade_account_type = 'accounts_receivable')
) inherits (transactions);

---
drop table item_sales;
delete from pg_enum using pg_type
 where pg_type.oid       = pg_enum.enumtypid
   and pg_type.typname   = 'transaction_type'
   and pg_enum.enumlabel = 'item_sale';
