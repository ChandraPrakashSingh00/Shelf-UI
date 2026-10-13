import { Stat } from "@shelf-ui/react";

const days = (change) => `${Math.abs(change)} ${Math.abs(change) === 1 ? "day" : "days"}`;

export default function StatLowerIsBetter() {
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
        label="Cancellation rate"
        value="2.1%"
        change={-0.6}
        changeLabel="vs September"
        higherIsBetter={false}
      />
      <Stat
        label="Average delivery time"
        value="2.4 days"
        change={-0.5}
        formatChange={days}
        changeLabel="vs September"
        higherIsBetter={false}
        description="Metro cities: 1.6 days"
      />
      <Stat
        label="Return requests"
        value="86"
        change={14}
        changeLabel="vs September"
        higherIsBetter={false}
      />
    </div>
  );
}
