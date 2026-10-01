import { IconButton } from "@codecps/ui";
import { useState } from "react";

function HeartIcon({ filled = false }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth={2}
      strokeLinejoin="round"
    >
      <path d="M12 20s-7.5-4.4-9.2-9.1C1.7 7.6 3.8 4.5 7.1 4.5c2 0 3.6 1.1 4.9 2.9 1.3-1.8 2.9-2.9 4.9-2.9 3.3 0 5.4 3.1 4.3 6.4C19.5 15.6 12 20 12 20Z" />
    </svg>
  );
}

function RefreshIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 11a8 8 0 0 0-14.3-4.9L4 8M4 4v4h4M4 13a8 8 0 0 0 14.3 4.9L20 16M20 20v-4h-4" />
    </svg>
  );
}

const VARIANTS = ["ghost", "secondary", "outline", "primary", "danger"];

export function IconButtonDemo() {
  const [saved, setSaved] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const refresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  };

  return (
    <div className="pg-stack">
      <div className="pg-row">
        {VARIANTS.map((variant) => (
          <IconButton key={variant} label={`Refresh (${variant})`} variant={variant}>
            <RefreshIcon />
          </IconButton>
        ))}
      </div>
      <div className="pg-row">
        <IconButton label="Add to wishlist" size="sm" shape="circle" variant="outline">
          <HeartIcon />
        </IconButton>
        <IconButton label="Add to wishlist" shape="circle" variant="outline">
          <HeartIcon />
        </IconButton>
        <IconButton label="Add to wishlist" size="lg" shape="circle" variant="outline">
          <HeartIcon />
        </IconButton>
      </div>
      <div className="pg-row">
        <IconButton
          label="Add to wishlist"
          variant="secondary"
          pressed={saved}
          tooltip
          onClick={() => setSaved((value) => !value)}
        >
          <HeartIcon filled={saved} />
        </IconButton>
        <IconButton label="Refresh orders" variant="outline" loading={refreshing} onClick={refresh}>
          <RefreshIcon />
        </IconButton>
        <IconButton label="Refresh orders" disabled>
          <RefreshIcon />
        </IconButton>
        <span className="pg-muted">
          Wishlist: {saved ? "saved" : "not saved"} · hover or focus for the tooltip
        </span>
      </div>
    </div>
  );
}
