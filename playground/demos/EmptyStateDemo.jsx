import { Button, EmptyState } from "shelf-ui-react";

function CartIcon() {
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
      <circle cx="9" cy="20" r="1.25" />
      <circle cx="18" cy="20" r="1.25" />
      <path d="M2.5 3h2.6l2.4 12.1a1.5 1.5 0 0 0 1.5 1.2h8.9a1.5 1.5 0 0 0 1.5-1.1L21 7.5H6" />
    </svg>
  );
}

function AlertIcon() {
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
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v4.5M12 16h.01" />
    </svg>
  );
}

export function EmptyStateDemo() {
  return (
    <div className="pg-grid">
      <EmptyState
        icon={<CartIcon />}
        tone="primary"
        title="Your cart is empty"
        description="Free delivery on orders above ₹499."
        actions={<Button>Continue shopping</Button>}
      />
      <EmptyState
        variant="bordered"
        size="sm"
        title="No results for “earbuds under ₹500”"
        description="Try removing a filter."
        actions={
          <Button size="sm" variant="outline">
            Clear filters
          </Button>
        }
      />
      <EmptyState
        variant="bordered"
        tone="danger"
        icon={<AlertIcon />}
        title="Couldn't load orders"
        description="Check your connection and try again."
        actions={<Button variant="outline">Retry</Button>}
      />
    </div>
  );
}
