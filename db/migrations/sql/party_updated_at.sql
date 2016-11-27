create function party_updated_at() returns trigger as $$
  begin
    update parties
    set updated_at = now()
    where id = old.id;
    return new;
  end;
$$ language plpgsql;
