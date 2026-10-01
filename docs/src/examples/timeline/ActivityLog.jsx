import { Timeline } from "@codecps/ui";

function Icon({ children }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {children}
    </svg>
  );
}

const TagIcon = () => (
  <Icon>
    <path d="M3 12V3h9l9 9-9 9-9-9Z" />
    <circle cx="7.5" cy="7.5" r="1" />
  </Icon>
);
const BoxIcon = () => (
  <Icon>
    <path d="m3 7 9-4 9 4-9 4-9-4ZM3 7v10l9 4 9-4V7M12 11v10" />
  </Icon>
);
const EyeIcon = () => (
  <Icon>
    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
    <circle cx="12" cy="12" r="3" />
  </Icon>
);
const PlusIcon = () => (
  <Icon>
    <path d="M12 5v14M5 12h14" />
  </Icon>
);

export default function TimelineActivityLog() {
  return (
    // Every entry has happened, so there's no status to announce.
    <Timeline
      aria-label="Activity for Cotton kurta"
      size="sm"
      statusLabels={{ complete: null }}
      style={{ width: "100%", maxWidth: 420 }}
    >
      <Timeline.Item
        status="complete"
        icon={<TagIcon />}
        title="Price changed from ₹999 to ₹899"
        time="Priya Sharma · 6 Oct, 3:10 PM"
      />
      <Timeline.Item
        status="complete"
        icon={<BoxIcon />}
        title="Stock updated: +120 units"
        time="Bhiwandi warehouse · 5 Oct, 11:24 AM"
        description="Purchase order PO-2291 received."
      />
      <Timeline.Item
        status="complete"
        icon={<EyeIcon />}
        title="Product published"
        time="Rahul Verma · 2 Oct, 6:00 PM"
      />
      <Timeline.Item
        status="complete"
        icon={<PlusIcon />}
        title="Product created"
        time="Rahul Verma · 2 Oct, 4:45 PM"
      />
    </Timeline>
  );
}
