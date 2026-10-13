import { Button, Tooltip } from "shelf-ui-react";

const sides = [
  { side: "top", label: "Top" },
  { side: "right", label: "Right" },
  { side: "bottom", label: "Bottom" },
  { side: "left", label: "Left" },
];

export default function TooltipSides() {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 12 }}>
      {sides.map(({ side, label }) => (
        <Tooltip key={side} side={side} content={`Shown on the ${side}`}>
          <Button variant="outline">{label}</Button>
        </Tooltip>
      ))}
    </div>
  );
}
