import { Button, Tag } from "@codecps/ui";
import { useEffect, useRef, useState } from "react";

const appliedFilters = [
  { id: "colour", label: "Red" },
  { id: "price", label: "Under ₹999" },
  { id: "brand", label: "Fabindia" },
  { id: "rating", label: "4★ & above" },
];

export default function TagFilterBar() {
  const [filters, setFilters] = useState(appliedFilters);
  const tagRefs = useRef(new Map());
  const resultsRef = useRef(null);
  // What to focus once the list has re-rendered: a tag's id, or "results".
  const focusTarget = useRef(null);

  useEffect(() => {
    const target = focusTarget.current;
    if (target === null) return;
    focusTarget.current = null;
    if (target === "results") resultsRef.current?.focus();
    else tagRefs.current.get(target)?.querySelector("button")?.focus();
  }, [filters]);

  // A removed tag takes its focused button with it: move focus to the next tag
  // (or the previous one), and to the results when none are left.
  const remove = (id) => {
    const index = filters.findIndex((filter) => filter.id === id);
    const neighbour = filters[index + 1] ?? filters[index - 1];
    focusTarget.current = neighbour ? neighbour.id : "results";
    setFilters((current) => current.filter((filter) => filter.id !== id));
  };

  const clearAll = () => {
    focusTarget.current = "results";
    setFilters([]);
  };

  const restore = () => {
    focusTarget.current = appliedFilters[0].id;
    setFilters(appliedFilters);
  };

  const productCount = 24 + (appliedFilters.length - filters.length) * 118;

  return (
    <div style={{ display: "grid", gap: 12, width: "100%", maxWidth: 480 }}>
      <div
        role="group"
        aria-label="Applied filters"
        style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8 }}
      >
        {filters.map((filter) => (
          <Tag
            key={filter.id}
            ref={(node) => {
              if (node) tagRefs.current.set(filter.id, node);
              else tagRefs.current.delete(filter.id);
            }}
            variant="primary"
            removeLabel="Remove filter"
            onRemove={() => remove(filter.id)}
          >
            {filter.label}
          </Tag>
        ))}
        {filters.length > 0 ? (
          <Button variant="ghost" size="sm" onClick={clearAll}>
            Clear all
          </Button>
        ) : (
          <Button variant="outline" size="sm" onClick={restore}>
            Restore filters
          </Button>
        )}
      </div>
      <p ref={resultsRef} tabIndex={-1} aria-live="polite" style={{ margin: 0 }}>
        Showing <strong>{productCount.toLocaleString("en-IN")}</strong> kurtas
      </p>
    </div>
  );
}
