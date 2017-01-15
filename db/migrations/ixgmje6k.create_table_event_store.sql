create type event_type as enum ();

create table event_store (
  event_id    bigserial      primary key,
  event_type  event_type     not null,
  stream_id   uuid           not null,
  payload     jsonb          not null,
  inserted_at timestamptz(6) not null default now()
);

---
drop table event_store;
drop type event_type;
