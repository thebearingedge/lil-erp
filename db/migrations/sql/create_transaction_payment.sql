create function create_transaction_payment() returns trigger as $$
  declare
    _date                 timestamptz = new.date;
    _party_id             uuid        = new.party_id;
    _payment_account_code varchar     = new.payment_account_code;
    _credit_code          varchar     = new.trade_account_code;
    _party_type           varchar;
    _amount               numeric;
    _transaction_id       uuid;
  begin

    select party_type
      into _party_type
      from parties
     where id = _party_id;

    _amount = case
                 when
                   _party_type = 'customer'
                 then
                   new.amount
                 when
                   _party_type = 'vendor'
                 then
                   -1 * new.amount
               end;

    with create_transaction as (
      insert into transactions (
             transaction_type,
             date,
             party_id
      )
      values (
        'payment',
        _date,
        _party_id
      )
      returning id
    )
    select id
      into _transaction_id
      from create_transaction;

    insert into ledger_entries (
           transaction_id,
           debit_code,
           credit_code,
           amount
    )
    values (
      _transaction_id,
      _payment_account_code,
      _credit_code,
      _amount
    );

    return new;
  end;
$$ language plpgsql;

create trigger create_transaction_payment
  after insert
  on payments
  for each row execute procedure create_transaction_payment();
