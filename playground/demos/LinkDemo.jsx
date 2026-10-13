import { Link } from "@shelf-ui/react";

export function LinkDemo() {
  return (
    <div className="pg-stack">
      <div className="pg-row">
        <Link href="#orders">Track your order</Link>
        <Link href="#help" variant="muted">
          Help centre
        </Link>
        <Link href="#none" underline="none">
          No underline
        </Link>
        <Link href="https://www.gst.gov.in" external>
          GST portal
        </Link>
      </div>
      <p className="pg-narrow" style={{ margin: 0 }}>
        By placing this order, you agree to our{" "}
        <Link href="#terms" underline="always">
          terms of sale
        </Link>{" "}
        and{" "}
        <Link href="#returns" variant="inherit" underline="always">
          return policy
        </Link>
        .
      </p>
    </div>
  );
}
