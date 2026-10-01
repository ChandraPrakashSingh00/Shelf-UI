import { Banner, Button } from "@codecps/ui";

function TruckIcon() {
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
      <path d="M3 6h11v10H3zM14 10h4l3 3v3h-7" />
      <circle cx="7" cy="17.5" r="1.5" />
      <circle cx="17" cy="17.5" r="1.5" />
    </svg>
  );
}

export default function BannerStartAligned() {
  return (
    <Banner
      variant="neutral"
      align="start"
      icon={<TruckIcon />}
      action={
        <Button size="sm" variant="outline">
          Track order
        </Button>
      }
    >
      Order #OD-4821 from Bengaluru arrives tomorrow by 9 PM.
    </Banner>
  );
}
