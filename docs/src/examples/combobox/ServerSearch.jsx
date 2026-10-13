import { Combobox } from "@shelf-ui/react";
import { useEffect, useState } from "react";

const customers = [
  { value: "CUS-2041", label: "Priya Sharma", description: "priya.sharma@example.com · Pune" },
  { value: "CUS-2042", label: "Rahul Verma", description: "rahul.verma@example.com · Delhi" },
  { value: "CUS-2043", label: "Ananya Iyer", description: "ananya.iyer@example.com · Chennai" },
  { value: "CUS-2044", label: "Arjun Nair", description: "arjun.nair@example.com · Kochi" },
  { value: "CUS-2045", label: "Sneha Reddy", description: "sneha.reddy@example.com · Hyderabad" },
  { value: "CUS-2046", label: "Vikram Singh", description: "vikram.singh@example.com · Jaipur" },
  { value: "CUS-2047", label: "Kavya Menon", description: "kavya.menon@example.com · Bengaluru" },
  { value: "CUS-2048", label: "Rohan Mehta", description: "rohan.mehta@example.com · Mumbai" },
];

// Stands in for a request to your API.
function searchCustomers(query) {
  const text = query.trim().toLowerCase();
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(
        customers.filter((customer) =>
          `${customer.label} ${customer.description}`.toLowerCase().includes(text),
        ),
      );
    }, 600);
  });
}

export default function ComboboxServerSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const canSearch = query.trim().length >= 2;

  useEffect(() => {
    if (!canSearch) return;
    let ignore = false;
    searchCustomers(query).then((matches) => {
      // Drop responses to an older query.
      if (ignore) return;
      setResults(matches);
      setLoading(false);
    });
    return () => {
      ignore = true;
    };
  }, [query, canSearch]);

  const handleInputChange = (text, reason) => {
    // Search while the user types, not when picking an option fills in the input.
    if (reason !== "input") return;
    setQuery(text);
    const searching = text.trim().length >= 2;
    setLoading(searching);
    if (!searching) setResults([]);
  };

  return (
    <div style={{ width: "100%", maxWidth: 360 }}>
      <Combobox
        label="Customer"
        placeholder="Search by name, email or city"
        options={results}
        filter={null}
        loading={loading}
        loadingMessage="Searching customers…"
        onInputChange={handleInputChange}
        emptyMessage={canSearch ? "No customers found" : "Type at least 2 letters"}
      />
    </div>
  );
}
