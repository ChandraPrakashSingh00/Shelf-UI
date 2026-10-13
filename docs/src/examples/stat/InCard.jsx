import { Card, Stat } from "shelf-ui-react";

export default function StatInCard() {
  return (
    <Card title="Diwali sale" description="1–5 November" style={{ width: "100%", maxWidth: 560 }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 9rem), 1fr))",
          gap: 16,
        }}
      >
        <Stat variant="plain" size="sm" label="Sales" value="₹18,42,600" change={64} />
        <Stat variant="plain" size="sm" label="Orders" value="5,212" change={48.5} />
        <Stat
          variant="plain"
          size="sm"
          label="Conversion"
          value="4.8%"
          change={0}
          description="Same as last year"
        />
      </div>
    </Card>
  );
}
