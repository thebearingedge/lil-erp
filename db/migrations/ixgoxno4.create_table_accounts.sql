create type account_type as enum (
  'current_assets',
  'cash',
  'accounts_receivable',
  'inventory_assets',
  'fixed_assets',
  'current_liabilities',
  'accounts_payable',
  'credit_cards',
  'long_term_liabilities',
  'shareholders_equity',
  'contributed_capital',
  'shareholder_distributions',
  'retained_earnings',
  'revenue',
  'inventory_sales',
  'services_rendered',
  'other_revenue',
  'cost_of_goods_sold',
  'operating_expenses'
);

create type account_class as enum (
  'asset',
  'liability',
  'equity',
  'revenue',
  'expense'
);

create table accounts (
  id                uuid    primary key default uuid_generate_v4(),
  code              varchar unique not null,
  parent_code       varchar,
  class             account_class,
  type              account_type,
  name              varchar unique not null,
  description       text,
  is_system_account boolean not null default false,
  is_active         boolean not null default true,
  unique (code, class),
  unique (code, type),
  foreign key (parent_code, class) references accounts (code, class)
);

create function accounts_inherit_parent_account_type() returns trigger as $$
  begin

    select a.type
      into new.type
      from accounts as a
     where a.code = new.parent_code;

    return new;
  end;
$$ language plpgsql;

create trigger inherit_parent_account_type
  before insert or update of parent_code
  on accounts
  for each row
  when (new.is_system_account != true)
  execute procedure accounts_inherit_parent_account_type();

create function accounts_inherit_parent_account_class() returns trigger as $$
  begin

    select a.class
      into new.class
      from accounts as a
     where a.code = new.parent_code;

    return new;
  end;
$$ language plpgsql;

create trigger inherit_parent_account_class
  before insert or update of parent_code
  on accounts
  for each row
  when (new.is_system_account != true)
  execute procedure accounts_inherit_parent_account_class();

---

drop table accounts;
drop type account_type;
drop type account_class;
drop function accounts_inherit_parent_account_type();
drop function accounts_inherit_parent_account_class();
