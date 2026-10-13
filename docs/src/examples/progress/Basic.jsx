import { Progress } from "@shelf-ui/react";

export default function ProgressBasic() {
  return (
    <div style={{ width: "100%", maxWidth: 420 }}>
      <Progress label="Deploying storefront-web" value={62} showValue />
    </div>
  );
}
