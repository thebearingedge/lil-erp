create function get_default_inventory_revenue() returns varchar as $$
  declare
    code varchar;
  begin
    select inventory_revenue
      into code
      from default_accounts;
    return code;
  end;
$$ language plpgsql;

create function get_default_inventory_assets() returns varchar as $$
  declare
    code varchar;
  begin
    select inventory_assets
      into code
      from default_accounts;
    return code;
  end;
$$ language plpgsql;

create function get_default_inventory_cost() returns varchar as $$
  declare
    code varchar;
  begin
    select inventory_cost
      into code
      from default_accounts;
    return code;
  end;
$$ language plpgsql;
