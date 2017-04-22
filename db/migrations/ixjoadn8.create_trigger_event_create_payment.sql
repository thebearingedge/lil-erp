alter type event_type add value 'create_payment';

create function create_payment(stream_id uuid, payload jsonb) returns void as $$
  declare
    payment             payments%rowtype;
    journal_entry_json  jsonb;
    debit_account_code  varchar;
    credit_account_code varchar;
  begin

    payment = jsonb_populate_record(null::payments, payload);

    payment.transaction_id   = stream_id;
    payment.transaction_type = 'payment';

    select p.party_type
      into payment.party_type
      from parties as p
     where p.party_id = payment.party_id
     limit 1;

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

    select a.account_type
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
      'date', payment.date,
      'ledger_entries', jsonb_build_array(
        jsonb_build_object(
          'debit_account_code', debit_account_code,
          'credit_account_code', credit_account_code,
          'amount', payment.amount
        )
      )
    );

    insert into event_store (
      event_type,
      stream_id,
      payload
    )
    values (
      'create_journal_entry',
      payment.transaction_id,
      journal_entry_json
    );

    return;
  end;
$$ language plpgsql;

create function event_create_payment() returns trigger as $$
  begin
    perform create_payment(new.stream_id, new.payload);
    return new;
  end;
$$ language plpgsql;

create trigger create_payment
  after insert
  on event_store
  for each row
  when (new.event_type = 'create_payment')
  execute procedure event_create_payment();

---
drop trigger create_payment on event_store;
drop function event_create_payment();
drop function create_payment(stream_id uuid, payload jsonb);
delete from pg_enum using pg_type
 where pg_type.oid       = pg_enum.enumtypid
   and pg_type.typname   = 'event_type'
   and pg_enum.enumlabel = 'create_payment';
