create function create_stock_move_shipment_line_item() returns trigger as $$
  declare
    _shipment_id           uuid    = new.shipment_id;
    _shipment_line_item_id uuid    = new.id;
    _sku                   varchar = new.sku;
    _line_total            numeric = new.line_total;
    _quantity              integer;
    _shipment_date         timestamp;
    _old_quantity_on_hand  integer;
    _old_average_cost      float;
    _new_quantity_on_hand  integer;
    _new_average_cost      float;
  begin

    _quantity = case
                  when
                    new.shipment_type = 'item_receipt'
                  then
                    new.quantity
                  when
                    new.shipment_type = 'item_sale'
                  then
                    -1 * new.quantity
                end;

    select date
      into _shipment_date
      from shipments
     where id = _shipment_id
     limit 1;

    with old_stock_move as (
      select quantity_on_hand, average_cost
        from stock_moves
       where sku = _sku
       order by shipment_date desc,
                created_at desc
       limit 1
    )
    select quantity_on_hand, average_cost
      into _old_quantity_on_hand, _old_average_cost
      from old_stock_move;

    _new_quantity_on_hand = _quantity + coalesce(_old_quantity_on_hand, 0);

    _new_average_cost = case
                          when
                            _quantity < 0
                          then
                            _old_average_cost
                          when
                            _old_average_cost is null and _quantity > 0
                          then
                            _line_total
                          else
                            ((_old_quantity_on_hand
                              *
                              _old_average_cost)
                            +
                            (_line_total))
                            /
                            (_quantity + _old_quantity_on_hand)
                        end;

    insert into stock_moves (
           shipment_date,
           shipment_line_item_id,
           sku,
           quantity,
           quantity_on_hand,
           average_cost
    )
    values (
      _shipment_date,
      _shipment_line_item_id,
      _sku,
      _quantity,
      _new_quantity_on_hand,
      _new_average_cost
    );

    return new;
  end;
$$ language plpgsql;

create trigger create_stock_move_shipment_line_item
  after insert
  on shipment_line_items
  for each row execute procedure create_stock_move_shipment_line_item();
