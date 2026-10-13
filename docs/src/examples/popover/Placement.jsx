import { Button, Popover } from "@shelf-ui/react";

// Each button sits where its popover has room: "Right" opens from the left edge, "Left" from the right.
const sides = [
  { side: "right", label: "Right", text: "Opens to the right of its button." },
  { side: "top", label: "Top", text: "Opens above its button." },
  { side: "bottom", label: "Bottom", text: "Opens below its button." },
  { side: "left", label: "Left", text: "Opens to the left of its button." },
];

const alignments = ["start", "center", "end"];

const row = { display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: 12 };

export default function PopoverPlacement() {
  return (
    <div style={{ display: "grid", gap: 32, width: "100%", paddingBlock: "4rem" }}>
      <div style={row}>
        {sides.map(({ side, label, text }) => (
          <Popover
            key={side}
            side={side}
            align="center"
            trigger={<Button variant="outline">{label}</Button>}
          >
            {text}
          </Popover>
        ))}
      </div>
      <div style={row}>
        {alignments.map((align) => (
          <Popover
            key={align}
            align={align}
            trigger={<Button variant="outline">Align {align}</Button>}
          >
            Lines up with the {align} of its button.
          </Popover>
        ))}
      </div>
    </div>
  );
}
