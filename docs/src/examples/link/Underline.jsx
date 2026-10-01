import { Link } from "@codecps/ui";

export default function LinkUnderline() {
  return (
    <div style={{ display: "grid", gap: 16, width: "100%", maxWidth: 440 }}>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 24 }}>
        <Link href="#hover">Underline on hover</Link>
        <Link href="#always" underline="always">
          Always underlined
        </Link>
        <Link href="#none" underline="none">
          Never underlined
        </Link>
      </div>
      {/* Inside a paragraph, an underline tells links apart without relying on color. */}
      <p style={{ margin: 0, lineHeight: 1.6 }}>
        By placing this order, you agree to our{" "}
        <Link href="#terms" underline="always">
          terms of sale
        </Link>{" "}
        and{" "}
        <Link href="#returns" underline="always">
          7-day return policy
        </Link>
        .
      </p>
    </div>
  );
}
