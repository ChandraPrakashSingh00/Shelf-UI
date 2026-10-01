import { render, screen } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it } from "vitest";
import { Kbd } from "./Kbd.jsx";

describe("Kbd", () => {
  it("renders a single key as a medium <kbd>", () => {
    render(<Kbd>Esc</Kbd>);
    const key = screen.getByText("Esc");
    expect(key.tagName).toBe("KBD");
    expect(key).toHaveClass("cps-kbd", "cps-kbd--md", "cps-kbd--key");
  });

  it.each(["sm", "md"])("applies the %s size", (size) => {
    render(<Kbd size={size}>Enter</Kbd>);
    expect(screen.getByText("Enter")).toHaveClass(`cps-kbd--${size}`);
  });

  it("renders a combination as nested <kbd> elements joined by +", () => {
    const { container } = render(<Kbd keys={["Ctrl", "Shift", "P"]} />);

    const outer = container.firstChild;
    expect(outer.tagName).toBe("KBD");
    expect(outer).toHaveClass("cps-kbd", "cps-kbd--combination");
    expect(outer).not.toHaveClass("cps-kbd--key");

    const keys = Array.from(outer.querySelectorAll("kbd.cps-kbd__key"));
    expect(keys.map((key) => key.textContent)).toEqual(["Ctrl", "Shift", "P"]);
    expect(outer.querySelectorAll(".cps-kbd__separator")).toHaveLength(2);
    // Real spaces around the separators, so it reads "Ctrl + Shift + P".
    expect(outer).toHaveTextContent("Ctrl + Shift + P", { normalizeWhitespace: false });
  });

  it("uses a custom separator, e.g. for key sequences", () => {
    const { container } = render(<Kbd keys={["G", "O"]} separator="then" />);
    expect(container.firstChild).toHaveTextContent("G then O", { normalizeWhitespace: false });
  });

  it("allows repeated keys and single-key arrays", () => {
    const { container, rerender } = render(<Kbd keys={["G", "G"]} />);
    expect(container.querySelectorAll(".cps-kbd__key")).toHaveLength(2);

    rerender(<Kbd keys={["F1"]} />);
    expect(container.querySelectorAll(".cps-kbd__key")).toHaveLength(1);
    expect(container.querySelector(".cps-kbd__separator")).not.toBeInTheDocument();
  });

  it("prefers keys over children", () => {
    const { container } = render(<Kbd keys={["Alt", "S"]}>Ignored</Kbd>);
    expect(container.firstChild).not.toHaveTextContent("Ignored");
  });

  it("forwards the ref and native attributes, and merges className", () => {
    const ref = createRef();
    render(
      <Kbd ref={ref} className="custom" title="Command" data-testid="kbd">
        ⌘
      </Kbd>,
    );

    const key = screen.getByTestId("kbd");
    expect(ref.current).toBe(key);
    expect(key).toHaveClass("cps-kbd", "custom");
    expect(key).toHaveAttribute("title", "Command");
  });
});
