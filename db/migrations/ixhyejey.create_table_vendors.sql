alter type party_type add value 'vendor';

create table vendors (
  party_id       uuid    not null,
  party_type     party_type,
  account_number varchar,
  website        varchar,
  primary key (party_id, party_type),
  foreign key (party_id, party_type)
          references parties (party_id, party_type),
  check (party_type = 'vendor')
);

---
drop table vendors;
delete from pg_enum using pg_type
 where pg_type.oid       = pg_enum.enumtypid
   and pg_type.typname   = 'party_type'
   and pg_enum.enumlabel = 'vendor';
