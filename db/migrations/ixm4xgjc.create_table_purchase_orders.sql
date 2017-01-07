alter type order_type add value 'purchase_order';

create table purchase_orders (
  primary key (order_id, order_type),
  foreign key (party_id, party_type)
          references parties (party_id, party_type),
  check (party_type = 'vendor'),
  check (order_type = 'purchase_order')
) inherits (orders);

---
drop table purchase_orders;
delete from pg_enum using pg_type
 where pg_type.oid       = pg_enum.enumtypid
   and pg_type.typname   = 'order_type'
   and pg_enum.enumlabel = 'purchase_order';
