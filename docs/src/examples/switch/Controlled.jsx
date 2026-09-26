import { Badge, Switch } from "@codecps/ui";
import { useState } from "react";

export default function SwitchControlled() {
  const [maintenance, setMaintenance] = useState(false);

  return (
    <div style={{ display: "grid", gap: 12, justifyItems: "start" }}>
      <Switch
        label="Maintenance mode"
        description="Visitors see a “Back soon” page while you work."
        checked={maintenance}
        onCheckedChange={setMaintenance}
      />
      <Badge variant={maintenance ? "warning" : "success"}>
        {maintenance ? "codecps.in is offline" : "codecps.in is live"}
      </Badge>
    </div>
  );
}
