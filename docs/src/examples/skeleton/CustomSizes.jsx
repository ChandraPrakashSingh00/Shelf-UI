import { Skeleton } from "shelf-ui-react";

export default function SkeletonCustomSizes() {
  return (
    <div style={{ display: "grid", gap: 16, width: "100%", maxWidth: 420 }}>
      {/* A chart or image: numbers are pixels, strings are CSS lengths */}
      <Skeleton variant="rectangular" height={160} />
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <Skeleton variant="circular" width={56} />
        <Skeleton variant="rectangular" width="40%" height="2.5rem" />
        {/* Without the shimmer */}
        <Skeleton variant="rectangular" width={96} height="2.5rem" animated={false} />
      </div>
    </div>
  );
}
