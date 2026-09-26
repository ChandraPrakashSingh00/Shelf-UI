import { Progress } from "@codecps/ui";

export default function ProgressBasic() {
  return (
    <div style={{ width: "100%", maxWidth: 420 }}>
      <Progress label="Deploying codecps-web" value={62} showValue />
    </div>
  );
}
