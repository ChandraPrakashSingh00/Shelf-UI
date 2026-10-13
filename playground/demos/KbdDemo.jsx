import { Kbd } from "@shelf-ui/react";

export function KbdDemo() {
  return (
    <div className="pg-stack">
      <div className="pg-row">
        <Kbd>Esc</Kbd>
        <Kbd>Enter</Kbd>
        <Kbd keys={["Ctrl", "S"]} />
        <Kbd keys={["Ctrl", "Shift", "D"]} />
        <Kbd keys={["G", "O"]} separator="then" />
        <Kbd size="sm" keys={["Alt", "N"]} />
      </div>
      <p className="pg-muted" style={{ margin: 0 }}>
        Press <Kbd size="sm">/</Kbd> to search products, or <Kbd size="sm">?</Kbd> to see every
        shortcut.
      </p>
    </div>
  );
}
