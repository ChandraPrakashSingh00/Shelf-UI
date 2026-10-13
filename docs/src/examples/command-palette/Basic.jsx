import { Button, CommandPalette } from "@shelf-ui/react";
import { useState } from "react";

const commands = [
  { id: "dashboard", label: "Dashboard", group: "Go to" },
  { id: "orders", label: "Orders", group: "Go to", keywords: ["sales", "shipments"] },
  { id: "products", label: "Products", group: "Go to", keywords: ["catalogue", "inventory"] },
  { id: "customers", label: "Customers", group: "Go to", keywords: ["users", "buyers"] },
  { id: "new-product", label: "Add a product", group: "Actions" },
  { id: "new-coupon", label: "Create a coupon", group: "Actions", keywords: ["discount"] },
  { id: "export", label: "Export this month's orders", group: "Actions", keywords: ["csv"] },
];

export default function CommandPaletteBasic() {
  const [open, setOpen] = useState(false);
  const [lastCommand, setLastCommand] = useState(null);

  return (
    <div style={{ display: "grid", justifyItems: "center", gap: 12 }}>
      <Button variant="outline" onClick={() => setOpen(true)}>
        Open command palette
      </Button>
      <p style={{ margin: 0, fontSize: 14 }}>
        {lastCommand ? `Ran “${lastCommand}”` : "Pick a command to run it."}
      </p>
      <CommandPalette
        open={open}
        onOpenChange={setOpen}
        hotkey={null}
        items={commands}
        onSelect={(item) => setLastCommand(item.label)}
      />
    </div>
  );
}
