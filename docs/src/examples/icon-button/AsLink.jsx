import { IconButton } from "@shelf-ui/react";
import { Link } from "react-router";

function UserIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21a8 8 0 0 1 16 0" />
    </svg>
  );
}

function BagIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 8h14l-1 13H6L5 8Z" />
      <path d="M9 8V6a3 3 0 0 1 6 0v2" />
    </svg>
  );
}

export default function IconButtonAsLink() {
  return (
    <nav aria-label="Account" style={{ display: "flex", gap: 8 }}>
      {/* Still a real link: it can be opened in a new tab or copied. */}
      <IconButton asChild label="Your account" tooltip>
        <Link to="/components/link">
          <UserIcon />
        </Link>
      </IconButton>
      <IconButton asChild label="Shopping bag" variant="outline" tooltip>
        <a href="#bag">
          <BagIcon />
        </a>
      </IconButton>
    </nav>
  );
}
