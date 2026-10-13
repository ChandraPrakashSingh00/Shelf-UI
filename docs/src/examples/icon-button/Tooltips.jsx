import { IconButton } from "@shelf-ui/react";

function EyeIcon() {
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
      <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function PrinterIcon() {
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
      <path d="M6 9V3h12v6M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
      <path d="M6 14h12v7H6z" />
    </svg>
  );
}

function TruckIcon() {
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
      <path d="M2 5h12v11H2zM14 9h4l4 4v3h-8" />
      <circle cx="6" cy="18" r="2" />
      <circle cx="18" cy="18" r="2" />
    </svg>
  );
}

function XCircleIcon() {
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
      <circle cx="12" cy="12" r="9" />
      <path d="m15 9-6 6M9 9l6 6" />
    </svg>
  );
}

export default function IconButtonTooltips() {
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
        width: "100%",
        maxWidth: 440,
        padding: "12px 16px",
        border: "1px solid var(--shelf-color-border)",
        borderRadius: "var(--shelf-radius-lg)",
        backgroundColor: "var(--shelf-color-surface)",
      }}
    >
      <div>
        <strong>Order #ORD-10428</strong>
        <div style={{ color: "var(--shelf-color-text-muted)", fontSize: 14 }}>
          Ananya Sharma · Pune · ₹3,450
        </div>
      </div>
      <div role="group" aria-label="Order actions" style={{ display: "flex", gap: 4 }}>
        <IconButton label="View order" size="sm" tooltip>
          <EyeIcon />
        </IconButton>
        <IconButton label="Print invoice" size="sm" tooltip>
          <PrinterIcon />
        </IconButton>
        <IconButton label="Track shipment" size="sm" tooltip>
          <TruckIcon />
        </IconButton>
        <IconButton label="Cancel order" size="sm" tooltip tooltipSide="bottom">
          <XCircleIcon />
        </IconButton>
      </div>
    </div>
  );
}
