import { Badge, Switch } from "shelf-ui-react";
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
        {maintenance ? "example.com is offline" : "example.com is live"}
      </Badge>
    </div>
  );
}
