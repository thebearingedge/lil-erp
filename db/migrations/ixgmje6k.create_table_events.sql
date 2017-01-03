create type event_type as enum (
  'create_account'
);

create table events (
  id          bigserial primary key,
  type        event_type,
  entity_id   uuid not null,
  payload     jsonb not null,
  inserted_at timestamptz(6) not null
              default now()
);

---

drop table events;
drop type event_type;
