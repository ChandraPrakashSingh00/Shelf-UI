import { Button } from "@codecps/ui";
import { useState } from "react";
import { CodeBlock } from "./CodeBlock.jsx";

const PREVIEW_WIDTHS = {
  desktop: { label: "Desktop", maxWidth: "100%" },
  tablet: { label: "Tablet", maxWidth: "768px" },
  mobile: { label: "Mobile", maxWidth: "375px" },
};

/** Demo links point at "#…" placeholders; this keeps them from moving the docs page. */
// Runs in the bubble phase, after the example's own click handlers.
export function preventPlaceholderNavigation(event) {
  if (event.target instanceof Element && event.target.closest('a[href^="#"]')) {
    event.preventDefault();
  }
}

/** A live, interactive example with its source code underneath. */
export function ExampleBlock({ example }) {
  const [width, setWidth] = useState("desktop");
  const { Component } = example;

  return (
    <div className="docs-example">
      {example.responsive && (
        <div className="docs-example__toolbar" role="group" aria-label="Preview width">
          {Object.keys(PREVIEW_WIDTHS).map((key) => (
            <Button
              key={key}
              size="sm"
              variant={width === key ? "secondary" : "ghost"}
              aria-pressed={width === key}
              onClick={() => setWidth(key)}
            >
              {PREVIEW_WIDTHS[key].label}
            </Button>
          ))}
        </div>
      )}
      {/* Demo links point at "#…" placeholders; keep them from moving the docs page. */}
      <div
        className={example.minHeight ? "docs-preview docs-preview--top" : "docs-preview"}
        style={example.minHeight ? { minHeight: example.minHeight } : undefined}
        onClick={preventPlaceholderNavigation}
      >
        <div
          className="docs-preview__frame"
          data-width={example.responsive ? width : undefined}
          style={{ maxWidth: PREVIEW_WIDTHS[width].maxWidth }}
        >
          <Component />
        </div>
      </div>
      <CodeBlock code={example.code} language="jsx" />
    </div>
  );
}
