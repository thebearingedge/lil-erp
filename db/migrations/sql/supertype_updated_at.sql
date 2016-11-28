create function supertype_updated_at() returns trigger as $$
  begin
    execute format('
      update %I
      set updated_at = now()
      where id = new.id;
      return new;
    ', tg_argv[0]);
  end;
$$ language plpgsql;
