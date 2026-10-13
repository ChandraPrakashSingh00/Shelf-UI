import { Alert, Badge, Button, Input, Tabs } from "@shelf-ui/react";
import { useId, useState } from "react";
import { CodeBlock } from "./CodeBlock.jsx";
import { SegmentedControl } from "./SegmentedControl.jsx";

const RADIUS_PRESETS = {
  sharp: { label: "Sharp", sm: "2px", md: "4px", lg: "6px" },
  default: { label: "Default", sm: "6px", md: "8px", lg: "12px" },
  round: { label: "Round", sm: "10px", md: "14px", lg: "20px" },
};

const RADIUS_OPTIONS = Object.keys(RADIUS_PRESETS);
const SWATCHES = ["#6938ef", "#2970ff", "#0f766e", "#e11d48", "#ea580c"];

/** Derives the primary palette from one color with `color-mix()`. */
function themeTokens(primary, radius) {
  const preset = RADIUS_PRESETS[radius];
  return {
    light: {
      "--shelf-color-primary": primary,
      "--shelf-color-primary-hover": `color-mix(in srgb, ${primary} 88%, black)`,
      "--shelf-color-primary-active": `color-mix(in srgb, ${primary} 76%, black)`,
      "--shelf-color-primary-subtle": `color-mix(in srgb, ${primary} 10%, white)`,
      "--shelf-color-primary-border": `color-mix(in srgb, ${primary} 35%, white)`,
      "--shelf-color-primary-text": `color-mix(in srgb, ${primary} 78%, black)`,
      "--shelf-color-focus": primary,
      "--shelf-focus-ring-soft": `color-mix(in srgb, ${primary} 22%, transparent)`,
      "--shelf-radius-sm": preset.sm,
      "--shelf-radius-md": preset.md,
      "--shelf-radius-lg": preset.lg,
    },
    dark: {
      "--shelf-color-primary-subtle": `color-mix(in srgb, ${primary} 16%, transparent)`,
      "--shelf-color-primary-border": `color-mix(in srgb, ${primary} 42%, transparent)`,
      "--shelf-color-primary-text": `color-mix(in srgb, ${primary} 60%, white)`,
      "--shelf-color-focus": `color-mix(in srgb, ${primary} 70%, white)`,
    },
  };
}

// Tokens defined in terms of others (like --shelf-color-info) resolve where they
// are declared, so a preview scoped to one element has to redeclare them.
// A theme set on :root, like the snippet below, doesn't need these.
const SCOPED_ALIASES = {
  "--shelf-color-info": "var(--shelf-color-primary)",
  "--shelf-color-info-subtle": "var(--shelf-color-primary-subtle)",
  "--shelf-color-info-border": "var(--shelf-color-primary-border)",
  "--shelf-color-info-text": "var(--shelf-color-primary-text)",
};

const block = (selector, tokens) =>
  `${selector} {\n${Object.entries(tokens)
    .map(([name, value]) => `  ${name}: ${value};`)
    .join("\n")}\n}`;

/** Live theme preview: pick a primary color and radius, copy the CSS. */
export function ThemeBuilder() {
  const [primary, setPrimary] = useState("#6938ef");
  const [radius, setRadius] = useState("default");
  const scopeClass = `docs-theme-${useId().replace(/[^\w-]/g, "")}`;
  const { light, dark } = themeTokens(primary, radius);

  const previewCss = [
    block(`.${scopeClass}`, { ...light, ...SCOPED_ALIASES }),
    block(`[data-shelf-theme="dark"] .${scopeClass}`, dark),
  ].join("\n");
  const snippet = [block(":root", light), block('[data-shelf-theme="dark"]', dark)].join("\n\n");

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
              <input
                type="color"
                value={primary}
                onChange={(event) => setPrimary(event.target.value)}
              />
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
