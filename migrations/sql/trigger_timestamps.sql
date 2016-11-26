create function trigger_timestamps(table_name regclass) returns void as $$
  begin
    execute format('
      alter table %I
        add column "created_at" timestamptz,
        add column "updated_at" timestamptz
    ', table_name);
    execute format('
      create trigger set_created_at
        before insert
        on %I
        for each row
        execute procedure set_created_at()
      ', table_name);
    execute format('
      create trigger set_updated_at
        before insert or update
        on %I
        for each row
        execute procedure set_updated_at()
      ', table_name);
  end;
$$ language plpgsql;
