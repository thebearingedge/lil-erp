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
      { code: '1100', name: 'Cash', parent_code: '1000' },
      { code: '1200', name: 'Receivables', parent_code: '1000' },
      { code: '1300', name: 'Inventory', parent_code: '1000' },
      { code: '1400', name: 'Prepaid Expenses', parent_code: '1000' },
      { code: '1500', name: 'Fixed Assets', parent_code: '1000' },
      { code: '2000', name: 'Liabilities' },
      { code: '2100', name: 'Payables', parent_code: '2000' },
      { code: '2200', name: 'Accrued Expenses', parent_code: '2000' },
      { code: '2300', name: 'Sales Tax Payable', parent_code: '2000' },
      { code: '2400', name: 'Long-Term Debts', parent_code: '2000' },
      { code: '3000', name: 'Equity' },
      { code: '3100', name: 'Member Contributions', parent_code: '3000' },
      { code: '3200', name: 'Member Distributions', parent_code: '3000' },
      { code: '3300', name: 'Retained Earnings', parent_code: '3000' },
      { code: '4000', name: 'Revenue' },
      { code: '4100', name: 'Inventory Sales', parent_code: '4000' },
      { code: '4200', name: 'Services Rendered', parent_code: '4000' },
      { code: '5000', name: 'Cost of Goods Sold' },
      { code: '5700', name: 'Freight', parent_code: '5000' },
      { code: '6000', name: 'Expenses' },
      { code: '6200', name: 'Bank Charges', parent_code: '6000' },
      { code: '6750', name: 'Professional Services', parent_code: '6000' },
      { code: '7200', name: 'Rent', parent_code: '6000' },
      { code: '7500', name: 'Utilities', parent_code: '6000' }
    ])
    .into('accounts')
}
