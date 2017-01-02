create function create_transaction_shipment_line_item() returns trigger as $$
  declare
    _shipment_id          uuid    = new.shipment_id;
    _shipment_type        varchar = new.shipment_type;
    _sku                  varchar = new.sku;
    _quantity             integer = new.quantity;
    _line_total           numeric = new.line_total;
    _date                 timestamptz;
    _party_id             uuid;
    _transaction_id       uuid;
    _revenue_account_code varchar;
    _cost_account_code    varchar;
    _asset_account_code   varchar;
    _average_cost         float;
  begin

    select date, party_id
      into _date, _party_id
      from shipments
     where id = _shipment_id;

    with create_transaction as (
      insert into transactions (
             type,
             date,
             party_id
      )
      values (
        'shipment',
        _date,
        _party_id
      )
      returning id
    )
    select id
      into _transaction_id
      from create_transaction;

    select revenue_account_code,
           cost_account_code,
           asset_account_code,
           coalesce(average_cost, 0)
      into _revenue_account_code,
           _cost_account_code,
           _asset_account_code,
           _average_cost
      from inventory_items
           left join stock_moves
           on inventory_items.sku = stock_moves.sku
     where inventory_items.sku = _sku
     order by stock_moves.shipment_date desc,
              stock_moves.created_at desc
     limit 1;

    if _shipment_type = 'item_receipt' then
      insert into ledger_entries (
             transaction_id,
             debit_account_code,
             credit_account_code,
             amount
      )
      values (
        _transaction_id,
        _asset_account_code,
        get_default_trade_payable(),
        _line_total
      );
    elsif _shipment_type = 'item_sale' then
      insert into ledger_entries (
             transaction_id,
             debit_account_code,
             credit_account_code,
             amount
      )
      values (
        _transaction_id,
        get_default_trade_receivable(),
        _revenue_account_code,
        _line_total
      ), (
        _transaction_id,
        _cost_account_code,
        _asset_account_code,
        _quantity * _average_cost
      );
    end if;

    return new;
  end;
$$ language plpgsql;

create trigger create_transaction_shipment_line_item
  after insert
  on shipment_line_items
  for each row execute procedure create_transaction_shipment_line_item();
