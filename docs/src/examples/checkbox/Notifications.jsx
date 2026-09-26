import { Checkbox } from "@codecps/ui";

const notifications = [
  {
    id: "deployment-failed",
    label: "Deployment failed",
    description: "When a production or preview build fails.",
    defaultChecked: true,
  },
  {
    id: "deployment-ready",
    label: "Deployment ready",
    description: "Each time a new version goes live.",
  },
  {
    id: "usage-report",
    label: "Weekly usage report",
    description: "Bandwidth, build minutes and spend in ₹, every Monday.",
    defaultChecked: true,
  },
  {
    id: "product-updates",
    label: "Product updates",
    description: "New features from the CodeCPS team, about once a month.",
  },
];

export default function CheckboxNotifications() {
  return (
    <fieldset
      style={{ width: "100%", maxWidth: 420, minWidth: 0, margin: 0, padding: 0, border: 0 }}
    >
      <legend style={{ marginBottom: 12, padding: 0, fontSize: 14, fontWeight: 600 }}>
        Email notifications
      </legend>
      <div style={{ display: "grid", gap: 16 }}>
        {notifications.map((notification) => (
          <Checkbox
            key={notification.id}
            name="notifications"
            value={notification.id}
            label={notification.label}
            description={notification.description}
            defaultChecked={notification.defaultChecked}
          />
        ))}
      </div>
    </fieldset>
  );
}
