import { Pagination } from "shelf-ui-react";

export default function PaginationSizes() {
  return (
    <div style={{ display: "grid", gap: 16, justifyItems: "center" }}>
      <Pagination size="sm" totalPages={10} defaultPage={3} label="Small pagination" />
      <Pagination size="md" totalPages={10} defaultPage={3} label="Medium pagination" />
    </div>
  );
}
