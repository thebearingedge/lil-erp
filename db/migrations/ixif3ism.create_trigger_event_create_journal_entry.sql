alter type event_type add value 'create_journal_entry';

create function create_journal_entry(id uuid, payload jsonb) returns void as $$
  declare
    trx   transactions%rowtype;
    entry journal_entries%rowtype;
  begin

    select date, memo
      into trx.date, trx.memo
      from jsonb_to_record(payload)
        as (date timestamptz(6), memo text);

    select id, 'journal_entry', p.party_id, p.party_type
      into trx.transaction_id, trx.transaction_type, trx.party_id, trx.party_type
      from parties as p
     where p.party_type = 'general_journal'
     limit 1;

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

create function event_create_journal_entry() returns trigger as $$
  begin

    perform create_journal_entry(new.entity_id, new.payload);

    return new;
  end;
$$ language plpgsql;

create trigger create_journal_entry
  after insert
  on event_store
  for each row
  when (new.type = 'create_journal_entry')
  execute procedure event_create_journal_entry();

---
drop trigger create_journal_entry on event_store;
drop function event_create_journal_entry();
drop function create_journal_entry(id uuid, payload jsonb);
