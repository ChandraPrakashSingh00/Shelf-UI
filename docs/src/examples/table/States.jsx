import { Button, EmptyState, Table } from "@codecps/ui";
import { useState } from "react";

function ReturnIcon() {
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
      <path d="M9 14 4 9l5-5" />
      <path d="M4 9h10.5a5.5 5.5 0 0 1 0 11H11" />
    </svg>
  );
}

const rupees = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

const returns = [
  { id: "R-311", order: 1031, product: "Cotton kurta, size M", reason: "Too small", refund: 899 },
  { id: "R-310", order: 1027, product: "Wireless earbuds", reason: "Not working", refund: 1999 },
  { id: "R-309", order: 1019, product: "Steel water bottle", reason: "Damaged", refund: 449 },
];

const columns = [
  { key: "id", header: "Return", rowHeader: true },
  { key: "order", header: "Order", render: (row) => `#${row.order}` },
  { key: "product", header: "Product" },
  { key: "reason", header: "Reason" },
  { key: "refund", header: "Refund", numeric: true, render: (row) => rupees.format(row.refund) },
];

const states = ["With data", "Loading", "Empty"];

export default function TableStates() {
  const [state, setState] = useState("Empty");

  return (
    <div style={{ display: "grid", gap: 12, width: "100%" }}>
      <div
        role="group"
        aria-label="Table state"
        style={{ display: "flex", flexWrap: "wrap", gap: 8 }}
      >
        {states.map((name) => (
          <Button
            key={name}
            size="sm"
            variant={state === name ? "secondary" : "ghost"}
            aria-pressed={state === name}
            onClick={() => setState(name)}
          >
            {name}
          </Button>
        ))}
      </div>
      <Table
        caption="Return requests"
        columns={columns}
        data={state === "With data" ? returns : []}
        loading={state === "Loading"}
        loadingRows={3}
        emptyState={
          <EmptyState
            size="sm"
            headingLevel={4}
            icon={<ReturnIcon />}
            title="No return requests"
            description="When customers ask to return an item, the requests show up here."
          />
        }
      />
    </div>
  );
}
