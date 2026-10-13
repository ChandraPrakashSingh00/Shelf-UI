import { IconButton } from "@shelf-ui/react";
import { useState } from "react";

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

export default function IconButtonLoading() {
  const [refreshing, setRefreshing] = useState(false);
  const [pending, setPending] = useState(18);

  const refresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      setPending((count) => count + 3);
    }, 1500);
  };

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <span aria-live="polite">
        {refreshing ? "Refreshing orders…" : `${pending} orders waiting to be packed`}
      </span>
      <IconButton label="Refresh orders" variant="outline" loading={refreshing} onClick={refresh}>
        <RefreshIcon />
      </IconButton>
    </div>
  );
}
