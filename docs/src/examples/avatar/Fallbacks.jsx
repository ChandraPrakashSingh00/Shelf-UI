import { Avatar } from "@codecps/ui";

function BotIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="1.25em"
      height="1.25em"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="4" y="8" width="16" height="12" rx="3" />
      <path d="M12 8V4M9 14h.01M15 14h.01" />
    </svg>
  );
}

export default function AvatarFallbacks() {
  return (
    <>
      {/* No image: initials from the name */}
      <Avatar name="Arjun Nair" />
      {/* This image fails to load, so the initials show instead */}
      <Avatar src="/missing.png" name="Kavya Reddy" />
      {/* Custom fallback content */}
      <Avatar name="CodeCPS Deploy Bot" fallback={<BotIcon />} />
      {/* No name either: a decorative user icon */}
      <Avatar />
    </>
  );
}
