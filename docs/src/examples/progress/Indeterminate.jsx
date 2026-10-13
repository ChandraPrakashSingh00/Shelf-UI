import { Progress } from "shelf-ui-react";

export default function ProgressIndeterminate() {
  return (
    <div style={{ width: "100%", maxWidth: 420 }}>
      {/* No value: we can't tell how long this will take. */}
      <Progress label="Preparing your workspace…" />
    </div>
  );
}
