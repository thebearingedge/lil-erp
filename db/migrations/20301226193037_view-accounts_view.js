export const up = knex => {
  const balance = knex.raw(`
    coalesce(sum(
      case
        when le.debit_code = a.code
          then le.amount
        else
          -1 * le.amount
      end
    ), 0)::float as balance
  `)
  const view = knex
    .select('a.*', balance)
    .from('accounts as a')
    .leftJoin('ledger_entries as le', qb =>
      qb.on('a.code', '=', 'le.debit_code')
        .orOn('a.code', '=', 'le.credit_code')
    )
    .groupBy('a.code')

  return knex.raw(`create view "accounts_view" as ${view}`)
}

export const down = ({ raw }) =>
  raw('drop view "accounts_view"')
