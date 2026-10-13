import { Pagination } from "@shelf-ui/react";
import { useState } from "react";

const PAGE_SIZE = 3;

const projects = [
  { name: "storefront-web", owner: "Aarav Sharma" },
  { name: "storefront-api", owner: "Priya Nair" },
  { name: "storefront-docs", owner: "Rohan Mehta" },
  { name: "billing-service", owner: "Ananya Iyer" },
  { name: "mobile-app", owner: "Vikram Singh" },
  { name: "admin-dashboard", owner: "Sneha Reddy" },
  { name: "analytics-pipeline", owner: "Karan Patel" },
  { name: "auth-gateway", owner: "Meera Joshi" },
  { name: "notification-worker", owner: "Arjun Das" },
  { name: "search-indexer", owner: "Kavya Menon" },
  { name: "invoice-generator", owner: "Rahul Gupta" },
  { name: "status-page", owner: "Ishita Bose" },
];

export default function PaginationControlled() {
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(projects.length / PAGE_SIZE);
  const first = (page - 1) * PAGE_SIZE;
  const pageProjects = projects.slice(first, first + PAGE_SIZE);

  return (
    <div style={{ display: "grid", gap: 16, width: "100%", maxWidth: 420 }}>
      <ul style={{ display: "grid", gap: 8, margin: 0, padding: 0, listStyle: "none" }}>
        {pageProjects.map((project) => (
          <li
            key={project.name}
            style={{ display: "flex", justifyContent: "space-between", gap: 12 }}
          >
            <strong>{project.name}</strong>
            <span>{project.owner}</span>
          </li>
        ))}
      </ul>
      <p role="status" style={{ margin: 0 }}>
        Showing {first + 1}–{first + pageProjects.length} of {projects.length} projects
      </p>
      <Pagination
        totalPages={totalPages}
        page={page}
        onPageChange={setPage}
        label="Projects pages"
      />
    </div>
  );
}
