import { Card, Skeleton } from "@shelf-ui/react";

export default function SkeletonCardPlaceholder() {
  return (
    <Card style={{ width: "100%", maxWidth: 360 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <Skeleton variant="circular" width={40} />
        <div style={{ flex: 1 }}>
          <Skeleton width="50%" />
          <Skeleton width="30%" />
        </div>
      </div>
      <Skeleton variant="rectangular" height={120} />
      <Skeleton lines={2} />
    </Card>
  );
}
