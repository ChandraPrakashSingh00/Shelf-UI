import { Button, Stat } from "shelf-ui-react";
import { useState } from "react";

export default function StatLoading() {
  const [loading, setLoading] = useState(false);

  // Stands in for fetching fresh numbers from your API.
  const refresh = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1500);
  };

  return (
    <div style={{ display: "grid", gap: 16, width: "100%", maxWidth: 520 }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 11rem), 1fr))",
          gap: 16,
        }}
      >
        <Stat
          label="Today's sales"
          value="₹68,940"
          change={5.4}
          changeLabel="vs yesterday"
          loading={loading}
        />
        <Stat
          label="Orders today"
          value="214"
          change={-2}
          changeLabel="vs yesterday"
          loading={loading}
        />
      </div>
      <Button
        variant="outline"
        size="sm"
        loading={loading}
        onClick={refresh}
        style={{ justifySelf: "start" }}
      >
        Refresh
      </Button>
    </div>
  );
}
