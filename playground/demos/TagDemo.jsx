import { Button, Tag } from "@codecps/ui";
import { useState } from "react";

const FILTERS = ["Red", "Under ₹999", "Fabindia", "4★ & above"];

export function TagDemo() {
  const [filters, setFilters] = useState(FILTERS);

  return (
    <div className="pg-stack">
      <div className="pg-row">
        <Tag>Electronics</Tag>
        <Tag variant="primary">Bestseller</Tag>
        <Tag variant="success">In stock</Tag>
        <Tag variant="warning">Only 3 left</Tag>
        <Tag variant="danger">Discontinued</Tag>
        <Tag size="sm">Small</Tag>
        <Tag size="sm" variant="success" onRemove={() => {}} disabled>
          Disabled
        </Tag>
      </div>
      <div className="pg-row" role="group" aria-label="Applied filters">
        {filters.map((filter) => (
          <Tag
            key={filter}
            variant="primary"
            removeLabel="Remove filter"
            onRemove={() => setFilters((current) => current.filter((item) => item !== filter))}
          >
            {filter}
          </Tag>
        ))}
        {filters.length > 0 ? (
          <Button size="sm" variant="ghost" onClick={() => setFilters([])}>
            Clear all
          </Button>
        ) : (
          <Button size="sm" variant="outline" onClick={() => setFilters(FILTERS)}>
            Restore filters
          </Button>
        )}
      </div>
    </div>
  );
}
