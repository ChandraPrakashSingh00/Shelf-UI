import { Button, EmptyState } from "@shelf-ui/react";

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

export default function EmptyStateEmptyCart() {
  return (
    <EmptyState
      icon={<CartIcon />}
      tone="primary"
      title="Your cart is empty"
      description="Looks like you haven't added anything yet. Free delivery on orders above ₹499."
      actions={
        <>
          <Button asChild>
            <a href="#deals">Continue shopping</a>
          </Button>
          <Button asChild variant="ghost">
            <a href="#wishlist">View wishlist</a>
          </Button>
        </>
      }
    />
  );
}
