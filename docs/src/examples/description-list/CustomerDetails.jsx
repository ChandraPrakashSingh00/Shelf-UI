import { Avatar, Badge, Card, DescriptionList } from "shelf-ui-react";

export default function DescriptionListCustomerDetails() {
  return (
    <Card style={{ width: "100%", maxWidth: 560 }}>
      <Card.Header>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Avatar name="Aarav Mehta" />
          <div>
            <Card.Title>Aarav Mehta</Card.Title>
            <Card.Description>Customer since March 2024</Card.Description>
          </div>
        </div>
      </Card.Header>
      <Card.Content>
        <DescriptionList layout="vertical" columns={2}>
          <DescriptionList.Item term="Email">aarav.mehta@example.com</DescriptionList.Item>
          <DescriptionList.Item term="Phone">+91 98765 43210</DescriptionList.Item>
          <DescriptionList.Item term="Orders">12</DescriptionList.Item>
          <DescriptionList.Item term="Lifetime value">₹38,450</DescriptionList.Item>
          <DescriptionList.Item term="Preferred payment">UPI</DescriptionList.Item>
          <DescriptionList.Item term="Segment">
            <Badge variant="primary">Loyal</Badge>
          </DescriptionList.Item>
          <DescriptionList.Item term="Shipping address" fullWidth>
            Flat 402, Sunshine Residency, Baner Road, Pune, Maharashtra 411045
          </DescriptionList.Item>
        </DescriptionList>
      </Card.Content>
    </Card>
  );
}
