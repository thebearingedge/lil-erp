create function get_default_inventory_revenue() returns varchar as $$
  declare
    _code varchar;
  begin
    select inventory_revenue
      into _code
      from default_accounts;
    return _code;
  end;
$$ language plpgsql;

create function get_default_inventory_assets() returns varchar as $$
  declare
    _code varchar;
  begin
    select inventory_assets
      into _code
      from default_accounts;
    return _code;
  end;
$$ language plpgsql;

create function get_default_inventory_cost() returns varchar as $$
  declare
    _code varchar;
  begin
    select inventory_cost
      into _code
      from default_accounts;
    return _code;
  end;
$$ language plpgsql;

create function get_default_trade_payable() returns varchar as $$
  declare
    _code varchar;
  begin
    select trade_payable
      into _code
      from default_accounts;
    return _code;
  end;
$$ language plpgsql;

create function get_default_trade_receivable() returns varchar as $$
  declare
    _code varchar;
  begin
    select trade_receivable
      into _code
      from default_accounts;
    return _code;
  end;
$$ language plpgsql;
