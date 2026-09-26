import { Button, Tooltip } from "@codecps/ui";

function Icon({ path }) {
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
      aria-hidden="true"
    >
      <path d={path} />
    </svg>
  );
}

const actions = [
  {
    label: "Copy link",
    hint: "Copy a link to this deployment",
    path: "M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7",
  },
  {
    label: "Download logs",
    hint: "Download the build logs",
    path: "M12 3v12M7 10l5 5 5-5M5 21h14",
  },
  {
    label: "Redeploy",
    hint: "Redeploy the same commit",
    path: "M21 12a9 9 0 1 1-3-6.7L21 8M21 3v5h-5",
  },
];

export default function TooltipIconButtons() {
  return (
    <div style={{ display: "flex", gap: 8 }}>
      {actions.map((action) => (
        <Tooltip key={action.label} content={action.hint}>
          <Button variant="outline" aria-label={action.label}>
            <Icon path={action.path} />
          </Button>
        </Tooltip>
      ))}
    </div>
  );
}
