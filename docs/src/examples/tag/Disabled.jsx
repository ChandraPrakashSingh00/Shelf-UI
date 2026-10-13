import { Tag } from "@shelf-ui/react";

export default function TagDisabled() {
  return (
    <div style={{ display: "grid", gap: 8, justifyItems: "center" }}>
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 8 }}>
        <Tag onRemove={() => {}} disabled>
          Region: South India
        </Tag>
        <Tag onRemove={() => {}} disabled>
          Warehouse: Chennai
        </Tag>
      </div>
      <p style={{ margin: 0, color: "var(--shelf-color-text-muted)", fontSize: 14 }}>
        Filters set by your store manager can't be removed.
      </p>
    </div>
  );
}
