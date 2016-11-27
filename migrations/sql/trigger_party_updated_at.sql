create function trigger_party_updated_at(subtype regclass) returns void as $$
  begin
    execute format('
      create trigger party_updated_at
        after update
        on %I
        for each row
        execute procedure party_updated_at()
      ', subtype);
  end;
$$ language plpgsql;
