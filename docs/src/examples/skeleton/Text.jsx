import { Skeleton } from "@shelf-ui/react";

export default function SkeletonText() {
  return (
    <div style={{ width: "100%", maxWidth: 420 }}>
      {/* Text skeletons take the font size around them: this one stands in for a heading. */}
      <Skeleton width="45%" style={{ fontSize: "1.5rem" }} />
      <Skeleton lines={3} />
    </div>
  );
}
