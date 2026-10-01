import { IconButton } from "@codecps/ui";

function ShareIcon() {
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
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <path d="m8.6 13.5 6.8 4M15.4 6.5l-6.8 4" />
    </svg>
  );
}

function TrashIcon() {
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
      <path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3" />
    </svg>
  );
}

export default function IconButtonVariants() {
  return (
    <>
      <IconButton label="Share product">
        <ShareIcon />
      </IconButton>
      <IconButton label="Share product" variant="secondary">
        <ShareIcon />
      </IconButton>
      <IconButton label="Share product" variant="outline">
        <ShareIcon />
      </IconButton>
      <IconButton label="Share product" variant="primary">
        <ShareIcon />
      </IconButton>
      <IconButton label="Delete product" variant="danger">
        <TrashIcon />
      </IconButton>
    </>
  );
}
