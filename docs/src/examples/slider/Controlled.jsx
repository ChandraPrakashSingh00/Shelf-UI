import { Button, Slider } from "shelf-ui-react";
import { useState } from "react";

const PRICE_PER_BUILD = 499;

export default function SliderControlled() {
  const [builds, setBuilds] = useState(2);

  return (
    <div style={{ display: "grid", gap: 16, width: "100%", maxWidth: 360 }}>
      <Slider label="Concurrent builds" min={1} max={10} value={builds} onValueChange={setBuilds} />
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
        }}
      >
        <span>
          <strong>₹{(builds * PRICE_PER_BUILD).toLocaleString("en-IN")}</strong> per month
        </span>
        <Button size="sm" variant="outline" onClick={() => setBuilds(2)}>
          Reset
        </Button>
      </div>
    </div>
  );
}
