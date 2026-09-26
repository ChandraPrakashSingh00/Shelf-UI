import { Pagination } from "@codecps/ui";

export default function PaginationSiblingCount() {
  return (
    <div style={{ display: "grid", gap: 24, justifyItems: "center" }}>
      <Pagination totalPages={50} defaultPage={25} siblingCount={0} label="Build logs, compact" />
      <Pagination totalPages={50} defaultPage={25} label="Build logs" />
      <Pagination
        totalPages={50}
        defaultPage={25}
        siblingCount={2}
        boundaryCount={2}
        label="Build logs, wide"
      />
    </div>
  );
}
