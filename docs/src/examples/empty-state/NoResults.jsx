import { Button, EmptyState } from "@shelf-ui/react";
import { useState } from "react";

function SearchIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}

export default function EmptyStateNoResults() {
  const [filtered, setFiltered] = useState(true);

  return (
    // A status region that stays on the page, so screen readers announce what appears in it.
    <div role="status" style={{ width: "100%", maxWidth: 560 }}>
      {filtered ? (
        <EmptyState
          variant="bordered"
          icon={<SearchIcon />}
          title="No results for “wireless earbuds”"
          description="No products match the filters Under ₹500 and 4★ & above. Try removing a filter or searching for something else."
          actions={
            <Button variant="outline" onClick={() => setFiltered(false)}>
              Clear filters
            </Button>
          }
        />
      ) : (
        <div style={{ display: "grid", gap: 12, justifyItems: "start" }}>
          <p style={{ margin: 0 }}>Showing 48 results for “wireless earbuds”.</p>
          <Button size="sm" variant="ghost" onClick={() => setFiltered(true)}>
            Apply the filters again
          </Button>
        </div>
      )}
    </div>
  );
}
