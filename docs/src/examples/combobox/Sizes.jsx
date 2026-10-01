import { Combobox } from "@codecps/ui";

const categories = ["Apparel", "Beauty", "Electronics", "Footwear", "Grocery", "Home & kitchen"];

export default function ComboboxSizes() {
  return (
    <div style={{ display: "grid", gap: 16, width: "100%", maxWidth: 320 }}>
      <Combobox size="sm" label="Small" placeholder="Category" options={categories} />
      <Combobox label="Medium (default)" placeholder="Category" options={categories} />
      <Combobox size="lg" label="Large" placeholder="Category" options={categories} />
      <Combobox label="Disabled" options={categories} defaultValue="Electronics" disabled />
    </div>
  );
}
