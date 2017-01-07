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
  id                uuid          unique not null default uuid_generate_v4(),
  code              varchar       primary key,
  parent_code       varchar,
  class             account_class,
  type              account_type,
  name              varchar       unique not null,
  description       text,
  is_system_account boolean       not null default false,
  is_active         boolean       not null default true,
  unique (code, class),
  unique (code, type),
  foreign key (parent_code, class)
          references accounts (code, class)
);

create function inherit_parent_account() returns trigger as $$
  begin

    select a.type, a.class
      into new.type, new.class
      from accounts as a
     where a.code = new.parent_code;

    return new;
  end;
$$ language plpgsql;

create trigger inherit_parent_account
  before insert or update of parent_code
  on accounts
  for each row
  when (new.is_system_account != true)
  execute procedure inherit_parent_account();

---
drop table accounts;
drop type account_type;
drop type account_class;
drop function inherit_parent_account();
