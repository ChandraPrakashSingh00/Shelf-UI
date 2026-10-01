import { Combobox } from "@codecps/ui";

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

const products = [
  { value: "SKU-1001", label: "Cotton kurta, indigo", description: "₹1,299 · Apparel" },
  { value: "SKU-1002", label: "Wireless earbuds", description: "₹2,499 · Electronics" },
  { value: "SKU-1003", label: "Steel water bottle, 1 L", description: "₹549 · Home & kitchen" },
  {
    value: "SKU-1004",
    label: "Banarasi silk saree",
    description: "Out of stock",
    disabled: true,
  },
  { value: "SKU-1005", label: "Pressure cooker, 5 L", description: "₹2,150 · Home & kitchen" },
  { value: "SKU-1006", label: "Running shoes", description: "₹3,199 · Footwear" },
  { value: "SKU-1007", label: "Masala chai, 250 g", description: "₹320 · Grocery" },
  { value: "SKU-1008", label: "Cotton bedsheet, double", description: "₹899 · Home & kitchen" },
];

export default function ComboboxProductSearch() {
  return (
    <div style={{ width: "100%", maxWidth: 360 }}>
      <Combobox
        label="Add a product to the order"
        placeholder="Search by product name"
        leftIcon={<SearchIcon />}
        options={products}
        emptyMessage="No products match your search"
      />
    </div>
  );
}
