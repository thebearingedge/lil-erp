alter type transaction_type add value 'item_receipt';

create table item_receipts (
  trade_account_code varchar      not null
                                  default get_default_accounts_payable_code(),
  trade_account_type account_type not null
                                  default 'accounts_payable',
  primary key (transaction_id, transaction_type),
  foreign key (party_id, party_type)
          references parties (party_id, party_type),
  foreign key (trade_account_code, trade_account_type)
          references accounts (code, type),
  check (transaction_type = 'item_receipt'),
  check (party_type = 'vendor'),
  check (trade_account_type = 'accounts_payable')
) inherits (transactions);

---
drop table item_receipts;
delete from pg_enum using pg_type
 where pg_type.oid       = pg_enum.enumtypid
   and pg_type.typname   = 'transaction_type'
   and pg_enum.enumlabel = 'item_receipt';
