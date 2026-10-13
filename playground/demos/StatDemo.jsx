import { Button, Stat } from "shelf-ui-react";
import { useState } from "react";

function RupeeIcon() {
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
      <path d="M6 4h12M6 9h12M13 20 6 13h3a4.5 4.5 0 0 0 0-9" />
    </svg>
  );
}

export function StatDemo() {
  const [loading, setLoading] = useState(false);

  const refresh = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1200);
  };

  return (
    <div className="pg-stack">
      <div className="pg-grid">
        <Stat
          label="Revenue"
          value="₹4,52,300"
          change={12.5}
          changeLabel="vs last week"
          icon={<RupeeIcon />}
          loading={loading}
        />
        <Stat
          label="Orders"
          value="1,284"
          change={8.2}
          changeLabel="vs last week"
          loading={loading}
        />
        <Stat
          label="Average order value"
          value="₹352"
          change={-3.1}
          changeLabel="vs last week"
          loading={loading}
        />
        <Stat
          label="Refunds"
          value="₹12,400"
          change={-18}
          changeLabel="vs last week"
          higherIsBetter={false}
          loading={loading}
        />
      </div>
      <div className="pg-row">
        <Stat variant="plain" size="sm" label="Returns today" value="32" change={0} />
        <Stat
          variant="plain"
          size="sm"
          label="Delivery time"
          value="2.4 days"
          change={-0.5}
          formatChange={(n) => `${Math.abs(n)} days`}
          higherIsBetter={false}
        />
        <Button size="sm" variant="outline" loading={loading} onClick={refresh}>
          Refresh
        </Button>
      </div>
    </div>
  );
}
