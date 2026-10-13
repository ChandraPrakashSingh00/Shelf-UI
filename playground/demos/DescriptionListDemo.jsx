import { Card, DescriptionList } from "shelf-ui-react";

const specifications = [
  { term: "Brand", description: "Sonic Wave" },
  { term: "Model", description: "SW-141" },
  { term: "Battery life", description: "Up to 42 hours" },
  { term: "Bluetooth", description: "5.3" },
  { term: "Water resistance", description: "IPX4" },
  { term: "Warranty", description: "1 year" },
];

export function DescriptionListDemo() {
  return (
    <div className="pg-stack">
      <div className="pg-grid">
        <Card title="Price details">
          <DescriptionList
            align="end"
            divided
            items={[
              { term: "Subtotal (3 items)", description: "₹2,598" },
              { term: "Shipping", description: "Free" },
              { term: "GST (18%)", description: "₹468" },
            ]}
          >
            <DescriptionList.Item term={<strong>Total</strong>}>
              <strong>₹3,066</strong>
            </DescriptionList.Item>
          </DescriptionList>
        </Card>
        <Card title="Customer">
          <DescriptionList layout="vertical" columns={2} size="sm">
            <DescriptionList.Item term="Name">Aarav Mehta</DescriptionList.Item>
            <DescriptionList.Item term="Phone">+91 98765 43210</DescriptionList.Item>
            <DescriptionList.Item term="Address" fullWidth>
              Flat 402, Baner Road, Pune 411045
            </DescriptionList.Item>
          </DescriptionList>
        </Card>
      </div>
      <DescriptionList items={specifications} columns={3} divided />
    </div>
  );
}
