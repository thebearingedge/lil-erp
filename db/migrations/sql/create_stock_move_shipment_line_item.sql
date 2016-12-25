create function create_stock_move_shipment_line_item() returns trigger as $$
  declare
    sign integer;
    average_cost float;
    shipment_date timestamp;
    shipment_line_item_id uuid;
    new_quantity_on_hand integer;
  begin

    shipment_line_item_id := new.id;

    select s.date
    into shipment_date
    from shipments as s
    where s.id = new.shipment_id
    limit 1;

    select
      case when new.shipment_type = 'goods_received_note' then 1
           when new.shipment_type = 'shipment' then -1
      end
    into sign;

    with previous_quantity as (
      select sm.quantity_on_hand
      from stock_moves as sm
      where sm.sku = new.sku
      order by sm.shipment_date desc
      limit 1
    )
    select coalesce(sum(quantity_on_hand), 0) + sign * new.quantity
    into new_quantity_on_hand
    from previous_quantity;

    insert into stock_moves (
      shipment_date,
      shipment_line_item_id,
      sku,
      quantity,
      quantity_on_hand
    )
    values (
      shipment_date,
      shipment_line_item_id,
      new.sku,
      new.quantity * sign,
      new_quantity_on_hand
    );

    return new;
  end;
$$ language plpgsql;

create trigger create_stock_move
  after insert
  on shipment_line_items
  for each row execute procedure create_stock_move_shipment_line_item();
