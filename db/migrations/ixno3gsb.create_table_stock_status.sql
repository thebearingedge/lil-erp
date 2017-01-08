create table stock_status (
  trade_line_item_id uuid           not null,
  item_type          item_type      not null default 'inventory_item',
  sku                varchar        not null,
  move_quantity      numeric        not null,
  move_cost          monetary       not null,
  quantity           numeric        not null,
  average_cost       monetary       not null,
  transaction_date   timestamptz(6) not null,
  inserted_at        timestamptz(6) not null default statement_timestamp(),
  foreign key (trade_line_item_id)
          references trade_line_items (id),
  foreign key (item_type, sku)
          references inventory_items (item_type, sku)
          on update cascade,
  check (move_cost > 0),
  check (quantity > 0),
  check (average_cost > 0)
);

create function stock_status_handle_inbound() returns trigger as $$
  declare
    previous_quantity numeric;
    previous_cost     monetary;
  begin

    select quantity, average_cost
      into previous_quantity, previous_cost
      from stock_status
     where (item_type, sku) = (new.item_type, new.sku)
     order by transaction_date desc,
              inserted_at      desc
     limit 1;

    case
      when
        previous_quantity is null
      then
        new.quantity     = new.move_quantity;
        new.average_cost = new.move_cost / new.move_quantity;
      else
        new.quantity     = new.move_quantity + previous_quantity;
        new.average_cost =
          (previous_quantity * previous_cost + new.move_cost)
          /
          (previous_quantity + new.move_quantity);
    end case;

    return new;
  end;
$$ language plpgsql;

create trigger handle_inbound
  before insert
  on stock_status
  for each row
  when (new.move_quantity > 0)
  execute procedure stock_status_handle_inbound();

---
drop trigger handle_inbound on stock_status;
drop function stock_status_handle_inbound();
drop table stock_status;
