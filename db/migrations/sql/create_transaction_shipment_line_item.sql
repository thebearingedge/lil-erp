create function create_transaction_shipment_line_item() returns trigger as $$
  declare
    shipment_date     timestamptz;
    shipment_party_id uuid;
    transaction_id    uuid;
    inventory_item    record;
  begin

    select date, party_id
      into shipment_date, shipment_party_id
      from shipments
     where id = new.shipment_id;

    with create_transaction as (
      insert into transactions (
             transaction_type,
             date,
             party_id
      )
      values (
        'shipment_line_item',
        shipment_date,
        shipment_party_id
      )
      returning id
    )
    select id
    into transaction_id
    from create_transaction;

    if new.shipment_type = 'item_receipt' then
      insert into ledger_entries (
             transaction_id,
             debit_code,
             credit_code,
             amount
      )
      values (
        transaction_id,
        '1300',
        '2100',
        new.line_total
      );
    elsif new.shipment_type = 'item_sale' then
      select revenue_code,
             cost_code,
             asset_code,
             coalesce(average_cost, 0) as average_cost
        into inventory_item
        from inventory_items
             left join stock_moves
             on inventory_items.sku = stock_moves.sku
       where inventory_items.sku = new.sku
             order by stock_moves.shipment_date desc,
                      stock_moves.created_at desc
       limit 1;

      insert into ledger_entries (
             transaction_id,
             debit_code,
             credit_code,
             amount
      )
      values (
        transaction_id,
        '1200',
        '4000',
        new.line_total
      ), (
        transaction_id,
        '5000',
        '1300',
        inventory_item.average_cost * new.quantity
      );
    end if;

    return new;
  end;
$$ language plpgsql;

create trigger create_transaction
  after insert
  on shipment_line_items
  for each row execute procedure create_transaction_shipment_line_item();
