import { Avatar, Button, Card, Skeleton } from "shelf-ui-react";
import { useState } from "react";

export default function SkeletonLoading() {
  const [loading, setLoading] = useState(true);

  return (
    <div style={{ display: "grid", gap: 16, width: "100%", maxWidth: 380 }}>
      {/* aria-busy tells assistive technology this region is still loading. */}
      <Card aria-busy={loading}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {loading ? (
            <>
              <Skeleton variant="circular" width={40} />
              <div style={{ flex: 1 }}>
                <Skeleton width="35%" />
                <Skeleton width="85%" />
              </div>
            </>
          ) : (
            <>
              <Avatar name="Aditi Rao" alt="" />
              <div>
                <strong>Aditi Rao</strong>
                <div>Deployed storefront-web to production</div>
              </div>
            </>
          )}
        </div>
      </Card>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          fontSize: 14,
        }}
      >
        {/* Skeletons are hidden from screen readers, so a status message says what's happening. */}
        <span role="status">{loading ? "Loading activity…" : "Activity loaded."}</span>
        <Button size="sm" variant="secondary" onClick={() => setLoading(!loading)}>
          {loading ? "Show content" : "Show skeleton"}
        </Button>
      </div>
    </div>
  );
}
