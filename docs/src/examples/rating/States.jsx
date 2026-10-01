import { Rating } from "@codecps/ui";

export default function RatingStates() {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
        gap: 24,
        width: "100%",
        maxWidth: 600,
      }}
    >
      <Rating label="Small" size="sm" defaultValue={3} />
      <Rating label="Medium" defaultValue={3} />
      <Rating label="Large" size="lg" defaultValue={3} />
      <Rating label="Disabled" defaultValue={4} disabled />
      <Rating label="Out of 10" max={10} size="sm" defaultValue={8} />
    </div>
  );
}
