import { Card, Spinner } from "shelf-ui-react";

export default function SpinnerCentered() {
  return (
    <Card
      title="Build logs"
      description="storefront-web · main"
      style={{ width: "100%", maxWidth: 420 }}
    >
      <div aria-busy="true" style={{ display: "grid", placeItems: "center", minHeight: 160 }}>
        <Spinner size="lg" label="Loading build logs…" />
      </div>
    </Card>
  );
}
