import { Badge, Button, Popover } from "shelf-ui-react";
import { useState } from "react";

const alerts = [
  { id: "failed", label: "Failed deployments" },
  { id: "previews", label: "Preview deployments ready" },
  { id: "usage", label: "Weekly usage report" },
];

export default function PopoverQuickSettings() {
  const [enabled, setEnabled] = useState({ failed: true, previews: true, usage: false });

  const toggle = (id) => setEnabled((current) => ({ ...current, [id]: !current[id] }));

  return (
    <Popover
      trigger={<Button variant="outline">Notifications</Button>}
      title="Email notifications"
      showCloseButton
    >
      <div style={{ display: "grid", gap: 4 }}>
        {alerts.map(({ id, label }) => (
          <Button
            key={id}
            variant="ghost"
            fullWidth
            aria-pressed={enabled[id]}
            onClick={() => toggle(id)}
            style={{ justifyContent: "space-between" }}
          >
            {label}
            <Badge size="sm" variant={enabled[id] ? "success" : "neutral"} aria-hidden="true">
              {enabled[id] ? "On" : "Off"}
            </Badge>
          </Button>
        ))}
      </div>
    </Popover>
  );
}
