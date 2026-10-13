import { Stat } from "@shelf-ui/react";

function Icon({ children }) {
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
      {children}
    </svg>
  );
}

const RupeeIcon = () => (
  <Icon>
    <path d="M6 4h12M6 9h12M13 20 6 13h3a4.5 4.5 0 0 0 0-9" />
  </Icon>
);

const BagIcon = () => (
  <Icon>
    <path d="M5 8h14l-1 12H6L5 8Z" />
    <path d="M9 8V6a3 3 0 0 1 6 0v2" />
  </Icon>
);

const ReceiptIcon = () => (
  <Icon>
    <path d="M6 3h12v18l-3-2-3 2-3-2-3 2V3Z" />
    <path d="M9 8h6M9 12h6" />
  </Icon>
);

const RefundIcon = () => (
  <Icon>
    <path d="M9 14 4 9l5-5" />
    <path d="M4 9h10.5a5.5 5.5 0 0 1 0 11H11" />
  </Icon>
);

export default function StatOverview() {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 13rem), 1fr))",
        gap: 16,
        width: "100%",
      }}
    >
      <Stat
        label="Revenue"
        value="₹4,52,300"
        change={12.5}
        changeLabel="vs last week"
        icon={<RupeeIcon />}
      />
      <Stat
        label="Orders"
        value="1,284"
        change={8.2}
        changeLabel="vs last week"
        icon={<BagIcon />}
      />
      <Stat
        label="Average order value"
        value="₹352"
        change={-3.1}
        changeLabel="vs last week"
        icon={<ReceiptIcon />}
      />
      <Stat
        label="Refunds"
        value="₹12,400"
        change={-18}
        changeLabel="vs last week"
        higherIsBetter={false}
        icon={<RefundIcon />}
      />
    </div>
  );
}
