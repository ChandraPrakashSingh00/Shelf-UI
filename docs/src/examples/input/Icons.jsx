import { Input } from "@codecps/ui";

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth={2}>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" strokeLinecap="round" />
    </svg>
  );
}

export default function InputWithIcon() {
  return (
    <div style={{ width: "100%", maxWidth: 360 }}>
      <Input
        type="search"
        aria-label="Search projects"
        placeholder="Search projects…"
        leftIcon={<SearchIcon />}
      />
    </div>
  );
}
