import { IconButton } from "shelf-ui-react";
import { useState } from "react";

function HeartIcon({ filled }) {
  const color = filled ? "var(--shelf-color-danger)" : "currentColor";
  return (
    <svg
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      fill={filled ? color : "none"}
      stroke={color}
      strokeWidth={2}
      strokeLinejoin="round"
    >
      <path d="M12 20s-7.5-4.4-9.2-9.1C1.7 7.6 3.8 4.5 7.1 4.5c2 0 3.6 1.1 4.9 2.9 1.3-1.8 2.9-2.9 4.9-2.9 3.3 0 5.4 3.1 4.3 6.4C19.5 15.6 12 20 12 20Z" />
    </svg>
  );
}

const products = [
  { id: "kurta", name: "Cotton kurta", price: 1299, tint: "var(--shelf-color-warning-subtle)" },
  {
    id: "sneakers",
    name: "Running sneakers",
    price: 2499,
    tint: "var(--shelf-color-primary-subtle)",
  },
];

export default function IconButtonWishlist() {
  const [saved, setSaved] = useState(["sneakers"]);

  const toggle = (id) =>
    setSaved((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );

  return (
    <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 16 }}>
      {products.map((product) => (
        <article
          key={product.id}
          style={{
            position: "relative",
            width: 180,
            overflow: "hidden",
            border: "1px solid var(--shelf-color-border)",
            borderRadius: "var(--shelf-radius-lg)",
            backgroundColor: "var(--shelf-color-surface)",
          }}
        >
          <div style={{ height: 120, backgroundColor: product.tint }} />
          {/* The label stays the same; aria-pressed tells whether the product is saved. */}
          <IconButton
            label={`Add ${product.name} to wishlist`}
            variant="secondary"
            shape="circle"
            size="sm"
            pressed={saved.includes(product.id)}
            onClick={() => toggle(product.id)}
            style={{ position: "absolute", top: 8, right: 8 }}
          >
            <HeartIcon filled={saved.includes(product.id)} />
          </IconButton>
          <div style={{ padding: 12 }}>
            <h4 style={{ margin: 0, fontSize: "var(--shelf-font-size-sm)" }}>{product.name}</h4>
            <p style={{ margin: "4px 0 0", fontWeight: 600 }}>
              ₹{product.price.toLocaleString("en-IN")}
            </p>
          </div>
        </article>
      ))}
    </div>
  );
}
