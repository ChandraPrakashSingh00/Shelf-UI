import { Alert } from "@codecps/ui";

function RocketIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        d="M5 15c-1.5 1.5-2 5-2 5s3.5-.5 5-2m6-11a9 9 0 0 1 6-3 9 9 0 0 1-3 6l-6 6-3-3 6-6ZM9 12l-3-1 3-3h3m0 9 1 3 3-3v-3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function AlertCustomIcon() {
  return (
    <div style={{ display: "grid", gap: 12, width: "100%" }}>
      <Alert
        variant="info"
        icon={<RocketIcon />}
        title="Deploy previews are here"
        description="Every pull request now gets its own preview URL."
      />
      <Alert variant="info" icon={null} description="An alert without an icon." />
    </div>
  );
}
