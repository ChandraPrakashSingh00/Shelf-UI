import { Kbd } from "@shelf-ui/react";

const shortcuts = [
  { keys: ["Ctrl", "S"], action: "Save the product" },
  { keys: ["Ctrl", "Shift", "D"], action: "Duplicate the product" },
  { keys: ["Alt", "N"], action: "Add a new variant" },
];

export default function KbdCombinations() {
  return (
    <ul style={{ display: "grid", gap: 12, margin: 0, padding: 0, listStyle: "none" }}>
      {shortcuts.map((shortcut) => (
        <li key={shortcut.action} style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Kbd keys={shortcut.keys} />
          <span>{shortcut.action}</span>
        </li>
      ))}
    </ul>
  );
}
