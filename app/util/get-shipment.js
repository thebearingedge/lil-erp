import { pick } from 'lodash'

const shipmentProps = [
  'party_id',
  'number',
  'date',
  'memo'
]

export function getShipment(doc, shipment_type) {
  return {
    ...pick(doc, shipmentProps),
    shipment_type
  }
}

const shipmentLineItemProps = [
  'sku',
  'quantity',
  'line_total'
]

export function getShipmentLineItems(doc, shipment_id, shipment_type) {
  return doc.line_items.map(line => ({
    ...pick(line, shipmentLineItemProps),
    shipment_id,
    shipment_type
  }))
}
