import { Kbd } from "@shelf-ui/react";

const shortcuts = [
  { keys: ["G", "O"], separator: "then", action: "Go to orders" },
  { keys: ["G", "P"], separator: "then", action: "Go to products" },
  { keys: ["/"], action: "Search products" },
  { keys: ["Ctrl", "Enter"], action: "Mark order as shipped" },
  { keys: ["?"], action: "Show all shortcuts" },
];

export default function KbdShortcutList() {
  return (
    <section
      aria-labelledby="kbd-shortcuts-title"
      style={{
        width: "100%",
        maxWidth: 400,
        padding: 16,
        border: "1px solid var(--shelf-color-border)",
        borderRadius: "var(--shelf-radius-lg)",
        backgroundColor: "var(--shelf-color-surface)",
      }}
    >
      <h4 id="kbd-shortcuts-title" style={{ margin: "0 0 12px" }}>
        Keyboard shortcuts
      </h4>
      <dl style={{ display: "grid", gap: 10, margin: 0 }}>
        {shortcuts.map((shortcut) => (
          <div
            key={shortcut.action}
            style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}
          >
            <dt>{shortcut.action}</dt>
            <dd style={{ margin: 0 }}>
              {/* "then" reads as a sequence: press G, release, then press O. */}
              <Kbd keys={shortcut.keys} separator={shortcut.separator} size="sm" />
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
