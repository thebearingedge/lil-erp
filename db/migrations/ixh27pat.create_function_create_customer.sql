create function create_customer(id uuid, payload jsonb) returns void as $$
  begin

    return;
  end;
$$ language plpgsql;

---
drop function create_customer(id uuid, payload jsonb);
