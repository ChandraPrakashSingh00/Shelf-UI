import { Progress } from "@codecps/ui";

export default function ProgressVariants() {
  return (
    <div style={{ display: "grid", gap: 20, width: "100%", maxWidth: 420 }}>
      <Progress label="Uploading invoices" value={48} showValue />
      <Progress label="Backup complete" value={100} showValue variant="success" />
      <Progress label="Import: 12 rows skipped" value={70} showValue variant="warning" />
      <Progress label="Deployment failed" value={35} showValue variant="danger" />
    </div>
  );
}
