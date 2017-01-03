create type event_type as enum ();

create table event_store (
  id          bigserial      primary key,
  type        event_type     not null,
  entity_id   uuid           not null,
  payload     jsonb          not null,
  inserted_at timestamptz(6) not null default now()
);

---
drop table event_store;
drop type event_type;
