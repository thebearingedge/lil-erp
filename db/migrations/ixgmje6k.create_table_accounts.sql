-- up
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
  id                uuid primary key default uuid_generate_v4(),
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

---

-- down
drop table accounts;
drop type account_type;
drop type account_class;
