import { Alert } from "shelf-ui-react";

export default function AlertVariants() {
  return (
    <div style={{ display: "grid", gap: 12, width: "100%" }}>
      <Alert
        variant="info"
        title="Scheduled maintenance"
        description="The dashboard is read-only on Sunday, 02:00–03:00 IST."
      />
      <Alert
        variant="success"
        title="Payment received"
        description="Invoice #1042 has been paid."
      />
      <Alert
        variant="warning"
        title="Usage at 90%"
        description="Upgrade your plan to avoid rate limits."
      />
      <Alert
        variant="error"
        title="Deployment failed"
        description="The build exited with code 1."
      />
    </div>
  );
}
