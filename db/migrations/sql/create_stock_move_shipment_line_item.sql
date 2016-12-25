create function create_stock_move_shipment_line_item() returns trigger as $$
  declare
    sign integer;
    shipment_date timestamp;
    shipment_line_item_id uuid;
  begin

    shipment_line_item_id := new.id;

    select date
    into shipment_date
    from shipments
    where id = new.shipment_id
    limit 1;

    select
      case when new.shipment_type = 'goods_received_note' then 1
           when new.shipment_type = 'shipment' then -1
      end
    into sign;

    insert into stock_moves (shipment_date, shipment_line_item_id, sku, quantity)
    values (shipment_date, shipment_line_item_id, new.sku, new.quantity * sign);

    return new;
  end;
$$ language plpgsql;

create trigger create_stock_move
  after insert
  on shipment_line_items
  for each row execute procedure create_stock_move_shipment_line_item();
