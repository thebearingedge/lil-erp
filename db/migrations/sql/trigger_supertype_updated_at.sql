create function trigger_supertype_updated_at(subtype regclass, supertype regclass) returns void as $$
  begin
    execute format('
      create trigger supertype_updated_at
        after update
        on %I
        for each row
        execute procedure supertype_updated_at(%s)
      ', subtype, supertype);
  end;
$$ language plpgsql;
