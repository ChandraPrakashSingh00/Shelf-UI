import { Card, DescriptionList } from "shelf-ui-react";

const rupees = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

const subtotal = 2598;
const discount = 200;
const gst = Math.round(subtotal * 0.18);
const total = subtotal - discount + gst;

const items = [
  { term: "Subtotal (3 items)", description: rupees.format(subtotal) },
  { term: "Coupon DIWALI200", description: `−${rupees.format(discount)}` },
  { term: "Shipping", description: "Free" },
  { term: "GST (18%)", description: rupees.format(gst) },
];

export default function DescriptionListOrderSummary() {
  return (
    <Card title="Price details" style={{ width: "100%", maxWidth: 380 }}>
      <DescriptionList items={items} align="end" divided>
        <DescriptionList.Item term={<strong>Total</strong>}>
          <strong>{rupees.format(total)}</strong>
        </DescriptionList.Item>
      </DescriptionList>
    </Card>
  );
}
