create function create_stock_move_receipt_line_item() returns trigger as $$
  declare
    sign integer;
    receipt_line_id uuid;
  begin
    receipt_line_id := new.id;
    select
      case when new.receipt_type = 'goods_received_note' then 1
           when new.receipt_type = 'shipment' then -1
      end
    into sign;
    insert into stock_moves (receipt_line_item_id, sku, quantity)
      values (receipt_line_id, new.sku, new.quantity * sign);
    return new;
  end;
$$ language plpgsql;

create trigger create_stock_move
  after insert
  on receipt_line_items
  for each row execute procedure create_stock_move_receipt_line_item();
