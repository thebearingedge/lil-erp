create function create_stock_move_shipment_line_item() returns trigger as $$
  declare
    shipment_line_item_id     uuid;
    shipment_date             timestamp;
    sign                      integer;
    previous_quantity_on_hand integer;
    previous_average_cost     float;
    new_quantity_on_hand      integer;
    new_average_cost          float;
  begin

    shipment_line_item_id = new.id;

    select s.date
      into shipment_date
      from shipments as s
     where s.id = new.shipment_id
     limit 1;

    select case
             when
               new.shipment_type = 'item_receipt'
             then
               1
             when
               new.shipment_type = 'item_sale'
             then
               -1
           end
      into sign;

    with previous_stock_move as (
      select sm.quantity_on_hand, sm.average_cost
        from stock_moves as sm
       where sm.sku = new.sku
       order by sm.shipment_date desc,
                sm.created_at desc
       limit 1
    )
    select quantity_on_hand, average_cost
      into previous_quantity_on_hand, previous_average_cost
      from previous_stock_move;

    select new.quantity * sign + coalesce(previous_quantity_on_hand, 0)
      into new_quantity_on_hand;

    select case
             when
               previous_average_cost is not null and sign < 0
             then
               previous_average_cost
             when
               previous_average_cost is null and sign > 0
             then
               new.line_total
             else
               ((previous_quantity_on_hand * previous_average_cost)
               +
               (new.line_total))
               /
               (new.quantity + previous_quantity_on_hand)
           end
      into new_average_cost;

    insert into stock_moves (
           shipment_date,
           shipment_line_item_id,
           sku,
           quantity,
           quantity_on_hand,
           average_cost
    )
    values (
      shipment_date,
      shipment_line_item_id,
      new.sku,
      new.quantity * sign,
      new_quantity_on_hand,
      new_average_cost
    );

    return new;
  end;
$$ language plpgsql;

create trigger create_stock_move
  after insert
  on shipment_line_items
  for each row execute procedure create_stock_move_shipment_line_item();
