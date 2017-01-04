create function create_journal_entry(id uuid, payload jsonb) returns void as $$
  declare
    trx   transactions%rowtype;
    entry journal_entries%rowtype;
  begin

    select date, memo
      into trx.date, trx.memo
      from jsonb_to_record(payload)
        as (date timestamptz(6), memo text);

    with system_party as (
      select p.party_id, p.party_type
        from parties as p
       where p.party_type = 'system'
       limit 1
    )
    select s.party_id, s.party_type
      into trx.party_id, trx.party_type
      from system_party as s;

    select id, 'journal_entry'
      into trx.transaction_id, trx.transaction_type;

    insert into transactions
    values (trx.*);

    insert into journal_entries
    values (trx.transaction_id, trx.transaction_type);

    insert into ledger_entries
    select uuid_generate_v4(),
           trx.transaction_id,
           trx.transaction_type,
           debit_account_code,
           credit_account_code,
           amount
      from jsonb_to_recordset(payload->'ledger_entries')
        as (
            debit_account_code  varchar,
            credit_account_code varchar,
            amount              monetary
           );

    return;
  end;
$$ language plpgsql;

---
drop function create_journal_entry(id uuid, payload jsonb);
