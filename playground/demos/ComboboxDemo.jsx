import { Combobox } from "@shelf-ui/react";
import { useEffect, useState } from "react";

const cities = [
  "Ahmedabad",
  "Bengaluru",
  "Chennai",
  "Delhi",
  "Hyderabad",
  "Jaipur",
  "Kochi",
  "Kolkata",
  "Lucknow",
  "Mumbai",
  "Navi Mumbai",
  "Pune",
];

const products = [
  { value: "SKU-1001", label: "Cotton kurta, indigo", description: "₹1,299 · Apparel" },
  { value: "SKU-1002", label: "Wireless earbuds", description: "₹2,499 · Electronics" },
  { value: "SKU-1004", label: "Banarasi silk saree", description: "Out of stock", disabled: true },
  { value: "SKU-1005", label: "Pressure cooker, 5 L", description: "₹2,150 · Home & kitchen" },
  { value: "SKU-1007", label: "Masala chai, 250 g", description: "₹320 · Grocery" },
];

const customers = [
  { value: "CUS-2041", label: "Priya Sharma", description: "Pune" },
  { value: "CUS-2042", label: "Rahul Verma", description: "Delhi" },
  { value: "CUS-2043", label: "Ananya Iyer", description: "Chennai" },
  { value: "CUS-2044", label: "Arjun Nair", description: "Kochi" },
];

// Fakes a server search with a delay.
function useCustomerSearch(query) {
  const [state, setState] = useState({ query: "", results: [] });
  useEffect(() => {
    if (query.trim() === "") return;
    const timer = setTimeout(() => {
      const text = query.trim().toLowerCase();
      setState({
        query,
        results: customers.filter((customer) => customer.label.toLowerCase().includes(text)),
      });
    }, 500);
    return () => clearTimeout(timer);
  }, [query]);
  const settled = query.trim() === "" || state.query === query;
  return { results: query.trim() === "" ? [] : state.results, loading: !settled };
}

export function ComboboxDemo() {
  const [city, setCity] = useState("Pune");
  const [query, setQuery] = useState("");
  const { results, loading } = useCustomerSearch(query);

  return (
    <div className="pg-grid">
      <div className="pg-stack">
        <Combobox
          label="Delivery city"
          placeholder="Search cities"
          options={cities}
          value={city}
          onValueChange={setCity}
          helperText="Free delivery on orders above ₹499."
        />
        <span className="pg-muted">Selected: {city ?? "none"}</span>
      </div>
      <Combobox
        label="Add a product"
        placeholder="Search products"
        options={products}
        openOnFocus
      />
      <Combobox
        label="Customer"
        placeholder="Type a name"
        options={results}
        filter={null}
        loading={loading}
        onInputChange={(text, reason) => {
          if (reason === "input") setQuery(text);
        }}
        emptyMessage={query.trim() ? "No customers found" : "Start typing to search"}
      />
      <Combobox
        label="Billing state"
        size="sm"
        required
        options={["Karnataka", "Maharashtra", "Tamil Nadu"]}
        error="Choose a state for GST."
      />
      <Combobox
        label="Warehouse"
        options={["Mumbai – Bhiwandi"]}
        defaultValue="Mumbai – Bhiwandi"
        disabled
      />
    </div>
  );
}
