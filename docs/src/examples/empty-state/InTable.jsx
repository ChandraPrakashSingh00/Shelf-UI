import { Button, Card, EmptyState, Table } from "shelf-ui-react";

function PackageIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m3 7 9-4 9 4-9 4-9-4ZM3 7v10l9 4 9-4V7M12 11v10" />
    </svg>
  );
}

const columns = [
  { key: "id", header: "Order", rowHeader: true },
  { key: "customer", header: "Customer" },
  { key: "status", header: "Status" },
  { key: "amount", header: "Amount", numeric: true },
];

export default function EmptyStateInTable() {
  return (
    <Card
      title="Recent orders"
      description="Orders from the last 30 days"
      style={{ width: "100%", maxWidth: 640 }}
    >
      <Table
        aria-label="Recent orders"
        columns={columns}
        data={[]}
        emptyState={
          <EmptyState
            size="sm"
            headingLevel={4}
            icon={<PackageIcon />}
            title="No orders yet"
            description="Share your store link on WhatsApp or Instagram to get your first order."
            actions={<Button size="sm">Copy store link</Button>}
          />
        }
      />
    </Card>
  );
}
