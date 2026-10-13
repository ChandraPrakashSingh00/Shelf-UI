import { Button, Dropdown } from "shelf-ui-react";

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
    >
      <path d={path} />
    </svg>
  );
}

const items = [
  { id: "edit", label: "Edit", icon: <Icon path="M4 20h4L19 9l-4-4L4 16v4Z" /> },
  { id: "share", label: "Share", icon: <Icon path="M4 12v7h16v-7M12 3v12M7 8l5-5 5 5" /> },
  { id: "transfer", label: "Transfer (owners only)", disabled: true },
  {
    id: "delete",
    label: "Delete",
    danger: true,
    icon: <Icon path="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13" />,
  },
];

export default function DropdownWithIcons() {
  return <Dropdown trigger={<Button variant="secondary">Options</Button>} items={items} />;
}
