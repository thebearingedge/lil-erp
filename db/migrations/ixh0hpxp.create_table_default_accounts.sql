create table default_accounts (
  accounts_payable_code    varchar      not null,
  accounts_payable_type    account_type not null default 'accounts_payable',
  accounts_receivable_code varchar      not null,
  accounts_receivable_type account_type not null default 'accounts_receivable',
  inventory_sales_code     varchar      not null,
  inventory_sales_type     account_type not null default 'inventory_sales',
  inventory_cost_code      varchar      not null,
  inventory_cost_type      account_type not null default 'cost_of_goods_sold',
  inventory_assets_code    varchar      not null,
  inventory_assets_type    account_type not null default 'inventory_assets',
  foreign key (accounts_payable_code, accounts_payable_type)
          references accounts (code, account_type)
          on update cascade,
  foreign key (accounts_receivable_code, accounts_receivable_type)
          references accounts (code, account_type)
          on update cascade,
  check (accounts_payable_type = 'accounts_payable'),
  check (accounts_receivable_type = 'accounts_receivable'),
  check (inventory_sales_type = 'inventory_sales'),
  check (inventory_assets_type = 'inventory_assets'),
  check (inventory_cost_type = 'cost_of_goods_sold')
);

create function get_default_accounts_payable_code() returns varchar as $$
  declare
    code varchar;
  begin
    select accounts_payable_code
      into code
      from default_accounts;
    return code;
  end;
$$ language plpgsql;

create function get_default_accounts_receivable_code() returns varchar as $$
  declare
    code varchar;
  begin
    select accounts_receivable_code
      into code
      from default_accounts;
    return code;
  end;
$$ language plpgsql;

create function get_default_inventory_sales_code() returns varchar as $$
  declare
    code varchar;
  begin
    select inventory_sales_code
      into code
      from default_accounts;
    return code;
  end;
$$ language plpgsql;

create function get_default_inventory_cost_code() returns varchar as $$
  declare
    code varchar;
  begin
    select inventory_cost_code
      into code
      from default_accounts;
    return code;
  end;
$$ language plpgsql;

create function get_default_inventory_assets_code() returns varchar as $$
  declare
    code varchar;
  begin
    select inventory_assets_code
      into code
      from default_accounts;
    return code;
  end;
$$ language plpgsql;

---
drop table default_accounts;
drop function get_default_accounts_payable_code();
drop function get_default_accounts_receivable_code();
drop function get_default_inventory_sales_code();
drop function get_default_inventory_cost_code();
drop function get_default_inventory_assets_code();
