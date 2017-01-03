import systemSeed from '../system'

export const seed = async knex => {

  const { tables } = await knex
      .select(knex.raw('array_to_json(array_agg(tablename)) as tables'))
      .from('pg_tables')
      .where('schemaname', 'public')
      .whereNot('tablename', '=', 'schema_journal')
      .first()

  await knex.raw(`truncate table ${tables} restart identity`)

  await systemSeed(knex)

}
