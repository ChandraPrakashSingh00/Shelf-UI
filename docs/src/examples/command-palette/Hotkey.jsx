import { Button, CommandPalette } from "@codecps/ui";
import { useState } from "react";

const commands = [
  { id: "orders", label: "Pending orders", group: "Orders" },
  { id: "returns", label: "Return requests", group: "Orders", keywords: ["refund", "rto"] },
  { id: "low-stock", label: "Low-stock products", group: "Inventory" },
  { id: "warehouses", label: "Warehouses", group: "Inventory", keywords: ["mumbai", "delhi"] },
];

const keyStyle = {
  padding: "1px 6px",
  border: "1px solid var(--cps-color-border)",
  borderBottomWidth: 2,
  borderRadius: "var(--cps-radius-sm)",
  backgroundColor: "var(--cps-color-surface-muted)",
  fontFamily: "inherit",
  fontSize: 12,
};

export default function CommandPaletteHotkey() {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ display: "grid", justifyItems: "center", gap: 12, textAlign: "center" }}>
      <p style={{ margin: 0, fontSize: 14 }}>
        Press <kbd style={keyStyle}>Ctrl</kbd> + <kbd style={keyStyle}>J</kbd> (
        <kbd style={keyStyle}>⌘</kbd> <kbd style={keyStyle}>J</kbd> on a Mac) anywhere on this page.
      </p>
      <Button variant="ghost" size="sm" onClick={() => setOpen(true)}>
        Or open it with a button
      </Button>
      {/* The default "mod+k" is taken by this site's search, so this example uses "mod+j". */}
      <CommandPalette open={open} onOpenChange={setOpen} hotkey="mod+j" items={commands} />
    </div>
  );
}
