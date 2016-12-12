create function create_transaction_receipt_line_item() returns trigger as $$
  declare
    receipt_date timestamp;
    transaction_id uuid;
  begin
    select date
    into receipt_date
    from receipts
    where id = new.receipt_id;
    with create_transaction as (
      insert into transactions (transaction_type, date)
      values ('stock_move', receipt_date)
      returning id
    )
    select id
    into transaction_id
    from create_transaction;
    if new.receipt_type = 'goods_received_note' then
      insert into ledger_entries (transaction_id, debit_code, credit_code, amount)
      values (transaction_id, '1300', '2100', new.line_total);
    end if;
    return new;
  end;
$$ language plpgsql;

create trigger create_transaction
  after insert
  on receipt_line_items
  for each row execute procedure create_transaction_receipt_line_item();
