import { ToggleGroup } from "shelf-ui-react";
import { useState } from "react";

function GridIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinejoin="round"
    >
      <rect x="4" y="4" width="6.5" height="6.5" rx="1" />
      <rect x="13.5" y="4" width="6.5" height="6.5" rx="1" />
      <rect x="4" y="13.5" width="6.5" height="6.5" rx="1" />
      <rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1" />
    </svg>
  );
}

function ListIcon() {
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
      <path d="M9 6h11M9 12h11M9 18h11M4 6h.01M4 12h.01M4 18h.01" />
    </svg>
  );
}

const products = [
  { name: "Wireless earbuds", price: "₹1,999" },
  { name: "Smart watch", price: "₹4,499" },
  { name: "Power bank", price: "₹1,299" },
];

export default function ToggleGroupViewSwitcher() {
  const [view, setView] = useState("grid");

  return (
    <div style={{ display: "grid", gap: 16, width: "100%", maxWidth: 420 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <strong>Electronics · 3 products</strong>
        {/* Icon-only items need an aria-label. */}
        <ToggleGroup aria-label="View" size="sm" value={view} onValueChange={setView}>
          <ToggleGroup.Item value="grid" aria-label="Grid view">
            <GridIcon />
          </ToggleGroup.Item>
          <ToggleGroup.Item value="list" aria-label="List view">
            <ListIcon />
          </ToggleGroup.Item>
        </ToggleGroup>
      </div>
      <ul
        style={{
          display: "grid",
          gridTemplateColumns: view === "grid" ? "repeat(3, minmax(0, 1fr))" : "1fr",
          gap: 8,
          margin: 0,
          padding: 0,
          listStyle: "none",
        }}
      >
        {products.map((product) => (
          <li
            key={product.name}
            style={{
              display: "flex",
              flexDirection: view === "grid" ? "column" : "row",
              justifyContent: "space-between",
              gap: 4,
              padding: 12,
              border: "1px solid var(--shelf-color-border)",
              borderRadius: "var(--shelf-radius-md)",
              fontSize: 14,
            }}
          >
            <span>{product.name}</span>
            <strong>{product.price}</strong>
          </li>
        ))}
      </ul>
    </div>
  );
}
