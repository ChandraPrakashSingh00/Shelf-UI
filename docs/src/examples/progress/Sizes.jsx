import { Progress } from "@codecps/ui";

export default function ProgressSizes() {
  return (
    <div style={{ display: "grid", gap: 20, width: "100%", maxWidth: 420 }}>
      <Progress size="sm" label="Small" value={40} />
      <Progress size="md" label="Medium" value={60} />
      <Progress size="lg" label="Large" value={80} />
    </div>
  );
}
