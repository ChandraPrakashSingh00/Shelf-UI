import { Alert, Badge, Button, Input, Tabs } from "@codecps/ui";
import { useId, useState } from "react";
import { CodeBlock } from "./CodeBlock.jsx";
import { SegmentedControl } from "./SegmentedControl.jsx";

const RADIUS_PRESETS = {
  sharp: { label: "Sharp", sm: "2px", md: "4px", lg: "6px" },
  default: { label: "Default", sm: "6px", md: "8px", lg: "12px" },
  round: { label: "Round", sm: "10px", md: "14px", lg: "20px" },
};

const RADIUS_OPTIONS = Object.keys(RADIUS_PRESETS);
const SWATCHES = ["#086ffd", "#7c3aed", "#0f766e", "#e11d48", "#ea580c"];

/** Derives the primary palette from one color with `color-mix()`. */
function themeTokens(primary, radius) {
  const preset = RADIUS_PRESETS[radius];
  return {
    light: {
      "--cps-color-primary": primary,
      "--cps-color-primary-hover": `color-mix(in srgb, ${primary} 88%, black)`,
      "--cps-color-primary-active": `color-mix(in srgb, ${primary} 76%, black)`,
      "--cps-color-primary-subtle": `color-mix(in srgb, ${primary} 10%, white)`,
      "--cps-color-primary-border": `color-mix(in srgb, ${primary} 35%, white)`,
      "--cps-color-primary-text": `color-mix(in srgb, ${primary} 78%, black)`,
      "--cps-color-focus": primary,
      "--cps-focus-ring-soft": `color-mix(in srgb, ${primary} 22%, transparent)`,
      "--cps-radius-sm": preset.sm,
      "--cps-radius-md": preset.md,
      "--cps-radius-lg": preset.lg,
    },
    dark: {
      "--cps-color-primary-subtle": `color-mix(in srgb, ${primary} 16%, transparent)`,
      "--cps-color-primary-border": `color-mix(in srgb, ${primary} 42%, transparent)`,
      "--cps-color-primary-text": `color-mix(in srgb, ${primary} 60%, white)`,
      "--cps-color-focus": `color-mix(in srgb, ${primary} 70%, white)`,
    },
  };
}

// Tokens defined in terms of others (like --cps-color-info) resolve where they
// are declared, so a preview scoped to one element has to redeclare them.
// A theme set on :root, like the snippet below, doesn't need these.
const SCOPED_ALIASES = {
  "--cps-color-info": "var(--cps-color-primary)",
  "--cps-color-info-subtle": "var(--cps-color-primary-subtle)",
  "--cps-color-info-border": "var(--cps-color-primary-border)",
  "--cps-color-info-text": "var(--cps-color-primary-text)",
};

const block = (selector, tokens) =>
  `${selector} {\n${Object.entries(tokens)
    .map(([name, value]) => `  ${name}: ${value};`)
    .join("\n")}\n}`;

/** Live theme preview: pick a primary color and radius, copy the CSS. */
export function ThemeBuilder() {
  const [primary, setPrimary] = useState("#086ffd");
  const [radius, setRadius] = useState("default");
  const scopeClass = `docs-theme-${useId().replace(/[^\w-]/g, "")}`;
  const { light, dark } = themeTokens(primary, radius);

  const previewCss = [
    block(`.${scopeClass}`, { ...light, ...SCOPED_ALIASES }),
    block(`[data-cps-theme="dark"] .${scopeClass}`, dark),
  ].join("\n");
  const snippet = [block(":root", light), block('[data-cps-theme="dark"]', dark)].join("\n\n");

  return (
    <div className="docs-theme-builder">
      <style>{previewCss}</style>
      <div className="docs-theme-builder__controls">
        <fieldset className="docs-control">
          <legend>Primary color</legend>
          <div className="docs-swatches">
            {SWATCHES.map((color) => (
              <button
                key={color}
                type="button"
                className="docs-swatch"
                style={{ backgroundColor: color }}
                aria-label={`Use ${color}`}
                aria-pressed={primary === color}
                onClick={() => setPrimary(color)}
              />
            ))}
            <label className="docs-color-input">
              <input type="color" value={primary} onChange={(event) => setPrimary(event.target.value)} />
              Custom
            </label>
          </div>
        </fieldset>
        <SegmentedControl
          legend="Corner radius"
          options={RADIUS_OPTIONS}
          value={radius}
          onChange={setRadius}
          getLabel={(option) => RADIUS_PRESETS[option].label}
        />
      </div>

      <div className={`docs-theme-builder__preview ${scopeClass}`}>
        <div className="docs-theme-builder__row">
          <Button>Primary</Button>
          <Button variant="outline">Outline</Button>
          <Badge variant="primary">New</Badge>
        </div>
        <Input label="Workspace" placeholder="acme" />
        <Tabs defaultValue="overview">
          <Tabs.List aria-label="Theme preview">
            <Tabs.Tab value="overview">Overview</Tabs.Tab>
            <Tabs.Tab value="settings">Settings</Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel value="overview">Selected tabs use the primary color.</Tabs.Panel>
          <Tabs.Panel value="settings">So do focus rings and links.</Tabs.Panel>
        </Tabs>
        <Alert variant="info" title="Info alerts follow the primary color" />
      </div>

      <CodeBlock code={snippet} language="css" title="theme.css" />
    </div>
  );
}
