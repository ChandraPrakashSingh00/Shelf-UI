import { Card } from "shelf-ui-react";

export default function CardVariants() {
  return (
    <div
      style={{
        display: "grid",
        gap: 16,
        gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
        width: "100%",
      }}
    >
      <Card variant="outlined" title="Outlined">
        The default: a border on the page surface.
      </Card>
      <Card variant="elevated" title="Elevated">
        A soft shadow lifts it off the page.
      </Card>
      <Card variant="filled" title="Filled">
        A tinted surface without a border.
      </Card>
    </div>
  );
}
