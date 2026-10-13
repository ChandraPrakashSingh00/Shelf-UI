import { IconButton } from "shelf-ui-react";

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
      <circle cx="9" cy="20" r="1.5" />
      <circle cx="18" cy="20" r="1.5" />
      <path d="M2 3h3l2.7 12.2a2 2 0 0 0 2 1.6h7.8a2 2 0 0 0 2-1.5L21 8H6" />
    </svg>
  );
}

const sizes = ["sm", "md", "lg"];

export default function IconButtonSizesShapes() {
  return (
    <div style={{ display: "grid", gap: 16, justifyItems: "center" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        {sizes.map((size) => (
          <IconButton key={size} label="Add to cart" variant="outline" size={size}>
            <CartIcon />
          </IconButton>
        ))}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        {sizes.map((size) => (
          <IconButton key={size} label="Add to cart" variant="primary" shape="circle" size={size}>
            <CartIcon />
          </IconButton>
        ))}
      </div>
    </div>
  );
}
