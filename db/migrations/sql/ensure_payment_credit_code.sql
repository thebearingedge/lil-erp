create function ensure_payment_credit_code() returns trigger as $$
  declare
    _party_type varchar;
  begin

    select party_type
      into _party_type
      from parties
     where id = new.party_id
     limit 1;

    new.credit_code =
      case
        when
          _party_type = 'vendor'
        then
          get_default_trade_payable()
        when
          _party_type = 'customer'
        then
          get_default_trade_receivable()
      end;

    return new;
  end;
$$ language plpgsql;

create trigger ensure_payment_credit_code
  before insert or
         update of credit_code
  on payments
  for each row
  when (new.credit_code is null)
  execute procedure ensure_payment_credit_code();
