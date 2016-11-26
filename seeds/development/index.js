export const seed = async knex => {

  const { tables } = await knex
      .select(knex.raw('array_to_json(array_agg(tablename)) as tables'))
      .from('pg_tables')
      .where('schemaname', 'public')
      .whereNot('tablename', 'like', '%migration%')
      .first()

  await knex.raw(`truncate table ${tables} restart identity`)

  await knex
    .insert([
      { code: '1000', name: 'Assets' },
      { code: '2000', name: 'Liabilities' },
      { code: '3000', name: 'Equity' },
      { code: '4000', name: 'Revenue' },
      { code: '5000', name: 'Cost of Goods Sold' },
      { code: '6000', name: 'Expenses' }
    ])
    .into('accounts')
}
