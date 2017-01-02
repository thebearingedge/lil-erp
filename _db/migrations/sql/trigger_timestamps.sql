create function set_created_at() returns trigger as $$
  begin
    new.created_at = now();
    return new;
  end;
$$ language plpgsql;

create function set_updated_at() returns trigger as $$
  begin
    new.updated_at = now();
    return new;
  end;
$$ language plpgsql;

create function keep_created_at() returns trigger as $$
  begin
    new.created_at = old.created_at;
    return new;
  end;
$$ language plpgsql;

create function trigger_timestamps(table_name regclass) returns void as $$
  begin
    execute format('
      alter table %I
        add column "created_at" timestamptz,
        add column "updated_at" timestamptz
    ', table_name);
    execute format('
      create trigger set_created_at_insert
        before insert
        on %I
        for each row
        execute procedure set_created_at()
      ', table_name);
    execute format('
      create trigger set_updated_at_insert
        before insert
        on %I
        for each row
        execute procedure set_updated_at()
    ', table_name);
    execute format('
      create trigger keep_created_at_update
        before update
        on %I
        for each row
        execute procedure keep_created_at()
    ', table_name);
    execute format('
      create trigger set_updated_at_update
        before update
        on %I
        for each row
        when (new.* is distinct from old.*)
        execute procedure set_updated_at()
      ', table_name);
  end;
$$ language plpgsql;
