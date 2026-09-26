import { Textarea } from "@codecps/ui";

export default function TextareaSizes() {
  return (
    <div style={{ display: "grid", gap: 12, width: "100%", maxWidth: 420 }}>
      <Textarea size="sm" rows={2} aria-label="Small textarea" placeholder="Small" />
      <Textarea size="md" rows={2} aria-label="Medium textarea" placeholder="Medium" />
      <Textarea size="lg" rows={2} aria-label="Large textarea" placeholder="Large" />
    </div>
  );
}
