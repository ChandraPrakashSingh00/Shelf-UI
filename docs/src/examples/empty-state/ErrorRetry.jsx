import { Button, EmptyState } from "@codecps/ui";
import { useState } from "react";

function CloudOffIcon() {
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
      <path d="M7 18h10.5a4 4 0 0 0 1.3-7.8A6 6 0 0 0 8.2 8.1 5 5 0 0 0 7 18Z" />
      <path d="M3 3l18 18" />
    </svg>
  );
}

export default function EmptyStateErrorRetry() {
  const [retrying, setRetrying] = useState(false);

  // Stands in for fetching the orders again.
  const retry = () => {
    setRetrying(true);
    setTimeout(() => setRetrying(false), 1500);
  };

  return (
    <EmptyState
      variant="bordered"
      tone="danger"
      icon={<CloudOffIcon />}
      title="Couldn't load orders"
      description="Check your internet connection and try again. If it keeps happening, contact support."
      actions={
        <Button variant="outline" loading={retrying} onClick={retry}>
          Retry
        </Button>
      }
      style={{ maxWidth: 560 }}
    />
  );
}
