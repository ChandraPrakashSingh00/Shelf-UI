import { Pagination, Table } from "@shelf-ui/react";
import { useEffect, useState } from "react";

const PAGE_SIZE = 4;

const rupees = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

const customers = [
  { id: "c01", name: "Priya Sharma", city: "Mumbai", orders: 24, spent: 86450 },
  { id: "c02", name: "Rahul Verma", city: "Delhi", orders: 9, spent: 23990 },
  { id: "c03", name: "Ananya Iyer", city: "Bengaluru", orders: 41, spent: 152300 },
  { id: "c04", name: "Arjun Reddy", city: "Hyderabad", orders: 3, spent: 4797 },
  { id: "c05", name: "Sneha Patel", city: "Ahmedabad", orders: 17, spent: 51200 },
  { id: "c06", name: "Vikram Singh", city: "Jaipur", orders: 12, spent: 38750 },
  { id: "c07", name: "Kavya Menon", city: "Kochi", orders: 28, spent: 99999 },
  { id: "c08", name: "Rohan Das", city: "Kolkata", orders: 6, spent: 12400 },
  { id: "c09", name: "Meera Joshi", city: "Pune", orders: 33, spent: 118600 },
  { id: "c10", name: "Karan Patel", city: "Surat", orders: 1, spent: 649 },
];

// Stands in for your API: it sorts and pages the rows, then answers after a delay.
function fetchCustomers({ sort, page }) {
  const rows = [...customers];
  if (sort) {
    const direction = sort.direction === "desc" ? -1 : 1;
    rows.sort((a, b) => {
      const x = a[sort.key];
      const y = b[sort.key];
      return (typeof x === "string" ? x.localeCompare(y) : x - y) * direction;
    });
  }
  const start = (page - 1) * PAGE_SIZE;
  const response = { rows: rows.slice(start, start + PAGE_SIZE), total: rows.length };
  return new Promise((resolve) => setTimeout(() => resolve(response), 700));
}

const columns = [
  { key: "name", header: "Customer", rowHeader: true, sortable: true },
  { key: "city", header: "City", sortable: true },
  { key: "orders", header: "Orders", numeric: true, sortable: true },
  {
    key: "spent",
    header: "Total spent",
    numeric: true,
    sortable: true,
    render: (customer) => rupees.format(customer.spent),
  },
];

export default function TableServerSide() {
  const [sort, setSort] = useState({ key: "spent", direction: "desc" });
  const [page, setPage] = useState(1);
  const [result, setResult] = useState({ rows: [], total: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;
    fetchCustomers({ sort, page }).then((response) => {
      if (ignore) return;
      setResult(response);
      setLoading(false);
    });
    return () => {
      ignore = true;
    };
  }, [sort, page]);

  // A new sort order starts again from the first page.
  const handleSortChange = (nextSort) => {
    setSort(nextSort);
    setPage(1);
    setLoading(true);
  };

  const handlePageChange = (nextPage) => {
    setPage(nextPage);
    setLoading(true);
  };

  return (
    <div style={{ display: "grid", gap: 16, justifyItems: "center", width: "100%" }}>
      <Table
        caption="Top customers"
        columns={columns}
        data={result.rows}
        manualSort
        sort={sort}
        onSortChange={handleSortChange}
        loading={loading}
        loadingRows={PAGE_SIZE}
        loadingLabel="Loading customers…"
      />
      <Pagination
        size="sm"
        totalPages={Math.max(1, Math.ceil(result.total / PAGE_SIZE))}
        page={page}
        onPageChange={handlePageChange}
        label="Customer pages"
      />
    </div>
  );
}
