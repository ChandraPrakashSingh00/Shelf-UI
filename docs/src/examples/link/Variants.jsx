import { Link } from "shelf-ui-react";

const footerLinks = [
  { href: "#about", label: "About us" },
  { href: "#shipping", label: "Shipping policy" },
  { href: "#returns", label: "Returns & refunds" },
  { href: "#contact", label: "Contact support" },
];

export default function LinkVariants() {
  return (
    <div style={{ display: "grid", gap: 20, width: "100%", maxWidth: 440 }}>
      <p style={{ margin: 0 }}>
        Your order ships in 2 days. <Link href="#orders">Track your order</Link>
      </p>

      {/* Muted links suit footers and secondary navigation. */}
      <nav aria-label="Customer help">
        <ul
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "8px 20px",
            margin: 0,
            padding: 0,
            listStyle: "none",
            fontSize: 14,
          }}
        >
          {footerLinks.map((link) => (
            <li key={link.href}>
              <Link href={link.href} variant="muted">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Inherit takes the color of the surrounding text, e.g. inside an alert. */}
      <p style={{ margin: 0, color: "var(--shelf-color-warning-text)" }}>
        Cash on delivery isn't available for 560001.{" "}
        <Link href="#payment" variant="inherit" underline="always">
          Choose another payment method
        </Link>
      </p>
    </div>
  );
}
