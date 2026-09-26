import { describe, expect, it } from "vitest";
import { expr, formatJsx, withImport } from "./jsx.js";

describe("formatJsx", () => {
  it("leaves out defaults, false and empty props, and writes true as a bare attribute", () => {
    const code = formatJsx(
      "Button",
      { variant: "primary", size: "lg", loading: true, disabled: false, title: undefined },
      "Save",
      { defaults: { variant: "primary" } },
    );
    expect(code).toBe('<Button size="lg" loading>Save</Button>');
  });

  it("self-closes without children and formats numbers and expressions", () => {
    expect(formatJsx("Toast", { duration: 3000, onDismiss: expr("() => {}") })).toBe(
      "<Toast duration={3000} onDismiss={() => {}} />",
    );
  });

  it("breaks long elements onto one attribute per line", () => {
    const code = formatJsx("Input", {
      label: "Email address",
      placeholder: "you@company.com",
      helperText: "We never share it.",
    });
    expect(code).toBe(
      '<Input\n  label="Email address"\n  placeholder="you@company.com"\n  helperText="We never share it."\n/>',
    );
  });

  it("escapes quotes in props and JSX characters in children", () => {
    expect(formatJsx("Badge", { title: 'Say "hi"' }, "a < b")).toBe(
      '<Badge title={"Say \\"hi\\""}>{"a < b"}</Badge>',
    );
  });
});

describe("withImport", () => {
  it("prefixes the snippet with the named imports", () => {
    expect(withImport(["Button", "Card"], "<Card />")).toBe(
      'import { Button, Card } from "@codecps/ui";\n\n<Card />',
    );
  });
});
