create table stock_status (
  line_item_id       uuid           not null,
  transaction_id     uuid           not null,
  transaction_date   date           not null,
  item_type          item_type      not null default 'inventory_item',
  sku                varchar        not null,
  move_quantity      numeric        not null,
  move_cost          monetary       not null,
  quantity           numeric        not null,
  average_cost       monetary       not null,
  inserted_at        timestamptz(6) not null,
  primary key (line_item_id),
  foreign key (line_item_id)
          references trade_line_items (line_item_id),
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
    later_status      stock_status;
  begin

    new.inserted_at = statement_timestamp();

    select quantity, average_cost
      into previous_quantity, previous_cost
      from stock_status
     where (item_type, sku) = (new.item_type, new.sku)
       and transaction_date < new.transaction_date
        or (transaction_date = new.transaction_date
            and
            inserted_at <= new.inserted_at)
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

create function stock_status_update_sku() returns trigger as $$
  begin

    with future_status as (
      select *
        from stock_status
       where (item_type, sku) = (new.item_type, new.sku)
         and transaction_date > new.transaction_date
          or (transaction_date = new.transaction_date
              and
              inserted_at >= new.inserted_at)
    )
    update stock_status as s
       set quantity     = coalesce(s.quantity + ns.move_quantity, s.quantity),
           average_cost = coalesce(
                            (s.quantity * s.average_cost + ns.move_cost)
                             /
                            (s.quantity + ns.move_quantity)
                          , s.average_cost)
      from (select lead(line_item_id) over w as line_item_id,
                   move_quantity,
                   move_cost
              from future_status
              window w as (order by transaction_date asc, inserted_at asc)
              ) as ns
     where s.line_item_id = ns.line_item_id;

    return new;
  end;
$$ language plpgsql;

create trigger update_sku
  after insert
  on stock_status
  for each row
  execute procedure stock_status_update_sku();

---
drop trigger handle_inbound on stock_status;
drop function stock_status_handle_inbound();
drop trigger update_sku on stock_status;
drop function stock_status_update_sku();
drop table stock_status;
