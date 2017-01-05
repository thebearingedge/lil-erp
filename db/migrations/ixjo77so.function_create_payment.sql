create function create_payment(id uuid, payload jsonb) returns void as $$
  declare
    trx                 transactions%rowtype;
    payment             payments%rowtype;
    journal_entry_json  jsonb;
    debit_account_code  varchar;
    credit_account_code varchar;
  begin

    trx = jsonb_populate_record(null::transactions, payload);

    select id, 'payment', p.party_type
      into trx.transaction_id, trx.transaction_type, trx.party_type
      from parties as p
     where p.party_id = trx.party_id
     limit 1;

    insert into transactions
    values (trx.*);

    payment = jsonb_populate_record(null::payments, payload);

    payment.transaction_id   = trx.transaction_id;
    payment.transaction_type = trx.transaction_type;
    payment.party_type       = trx.party_type;

    case
      when
        payment.party_type = 'customer'
      then
        payment.trade_account_type = 'accounts_receivable';
        payment.trade_account_code = coalesce(
          payment.trade_account_code,
          get_default_accounts_receivable_code()
        );
      when
        payment.party_type = 'vendor'
      then
        payment.trade_account_type = 'accounts_payable';
        payment.trade_account_code = coalesce(
          payment.trade_account_code,
          get_default_accounts_payable_code()
        );
    end case;

    select a.type
      into payment.payment_account_type
      from accounts as a
     where a.code = payment.payment_account_code;

    insert into payments
    values (payment.*);


    case
      when
        payment.trade_account_type = 'accounts_receivable'
      then
        debit_account_code  = payment.payment_account_code;
        credit_account_code = payment.trade_account_code;
      when
        payment.trade_account_type = 'accounts_payable'
      then
        debit_account_code  = payment.trade_account_code;
        credit_account_code = payment.payment_account_code;
    end case;


    journal_entry_json = jsonb_build_object(
      'date', trx.date,
      'ledger_entries', jsonb_build_array(
        jsonb_build_object(
          'debit_account_code', debit_account_code,
          'credit_account_code', credit_account_code,
          'amount', payment.amount
        )
      )
    );

    insert into event_store (
      type,
      entity_id,
      payload
    )
    values (
      'create_journal_entry',
      trx.transaction_id,
      journal_entry_json
    );

    return;
  end;
$$ language plpgsql;
---

drop function create_payment(id uuid, payload jsonb);
