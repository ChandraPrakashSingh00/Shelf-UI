import { Button, Tooltip } from "@codecps/ui";
import { useState } from "react";

export default function TooltipControlled() {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
      <Tooltip
        content="Last deployed 5 minutes ago by Aarav Mehta"
        open={open}
        onOpenChange={setOpen}
      >
        <Button variant="outline">Production</Button>
      </Tooltip>
      <span>The tooltip is {open ? "open" : "closed"}.</span>
    </div>
  );
}
