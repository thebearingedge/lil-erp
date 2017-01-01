create function ensure_payment_trade_account() returns trigger as $$
  declare
    _party_id   uuid    = new.party_id;
    _party_type varchar;
  begin

    select party_type
      into _party_type
      from parties
     where id = _party_id;

    case
      when
        _party_type = 'vendor'
      then
        new.trade_account_code =
          coalesce(new.trade_account_code, get_default_trade_payable());
        new.trade_account_type = 'accounts_payable';
      when
        _party_type = 'customer'
      then
        new.trade_account_code =
          coalesce(new.trade_account_code, get_default_trade_receivable());
        new.trade_account_type = 'accounts_receivable';
    end case;

    return new;
  end;
$$ language plpgsql;

create trigger ensure_payment_trade_account
  before insert or
         update of trade_account_code
  on payments
  for each row
  when (new.trade_account_code is null or
        new.trade_account_type is null)
  execute procedure ensure_payment_trade_account();
