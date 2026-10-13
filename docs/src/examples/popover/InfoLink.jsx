import { Button, Popover } from "@shelf-ui/react";

function InfoIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 16v-4M12 8h.01" />
    </svg>
  );
}

export default function PopoverInfoLink() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
      <span>Build minutes: 4,210 of 6,000 used</span>
      <Popover
        label="About build minutes"
        trigger={
          <Button variant="ghost" size="sm" aria-label="About build minutes">
            <InfoIcon />
          </Button>
        }
      >
        <p style={{ margin: "0 0 8px" }}>
          Build minutes reset on the 1st of every month. Extra minutes cost ₹0.50 each.
        </p>
        <a href="#usage">See usage by project</a>
      </Popover>
    </div>
  );
}
