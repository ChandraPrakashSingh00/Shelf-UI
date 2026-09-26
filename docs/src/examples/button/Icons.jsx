import { Button } from "@codecps/ui";

function PlusIcon() {
  return (
    <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth={2}>
      <path d="M12 5v14M5 12h14" strokeLinecap="round" />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth={2}>
      <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function ButtonWithIcons() {
  return (
    <>
      <Button leftIcon={<PlusIcon />}>New project</Button>
      <Button variant="outline" rightIcon={<ArrowRightIcon />}>
        Continue
      </Button>
      {/* Icon-only buttons need an accessible name. */}
      <Button variant="ghost" aria-label="Add item">
        <PlusIcon />
      </Button>
    </>
  );
}
