import { render, screen } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it } from "vitest";
import { Divider } from "./Divider.jsx";

describe("Divider", () => {
  it("renders a horizontal <hr> separator by default", () => {
    render(<Divider />);
    const divider = screen.getByRole("separator");
    expect(divider.tagName).toBe("HR");
    expect(divider).toHaveClass(
      "shelf-divider",
      "shelf-divider--horizontal",
      "shelf-divider--solid",
      "shelf-divider--spacing-md",
    );
    expect(divider).not.toHaveAttribute("aria-hidden");
  });

  it("renders a vertical separator as a span with aria-orientation, so it can sit in a <p>", () => {
    render(<Divider orientation="vertical" />);
    const divider = screen.getByRole("separator");
    expect(divider.tagName).toBe("SPAN");
    expect(divider).toHaveAttribute("aria-orientation", "vertical");
    expect(divider).toHaveClass("shelf-divider--vertical");
  });

  it("keeps a label readable as plain text, outside any separator role", () => {
    render(<Divider label="OR" />);
    expect(screen.queryByRole("separator")).not.toBeInTheDocument();

    const label = screen.getByText("OR");
    expect(label).toHaveClass("shelf-divider__label");
    expect(label.parentElement).toHaveClass(
      "shelf-divider--labelled",
      "shelf-divider--label-center",
    );
  });

  it.each(["start", "center", "end"])("positions the label at the %s", (labelPosition) => {
    render(<Divider label="More options" labelPosition={labelPosition} />);
    expect(screen.getByText("More options").parentElement).toHaveClass(
      `shelf-divider--label-${labelPosition}`,
    );
  });

  it("supports a label on a vertical divider", () => {
    render(<Divider orientation="vertical" label="OR" />);
    expect(screen.getByText("OR").parentElement).toHaveClass(
      "shelf-divider--vertical",
      "shelf-divider--labelled",
    );
  });

  it("ignores an empty label", () => {
    render(<Divider label="" />);
    expect(screen.getByRole("separator").tagName).toBe("HR");
  });

  it("applies the dashed variant and spacing", () => {
    render(<Divider variant="dashed" spacing="lg" />);
    expect(screen.getByRole("separator")).toHaveClass(
      "shelf-divider--dashed",
      "shelf-divider--spacing-lg",
    );
  });

  it("hides a decorative divider from assistive technology", () => {
    const { container, rerender } = render(<Divider decorative />);
    expect(screen.queryByRole("separator")).not.toBeInTheDocument();
    expect(container.firstChild).toHaveAttribute("aria-hidden", "true");

    rerender(<Divider decorative orientation="vertical" />);
    expect(container.firstChild).not.toHaveAttribute("role");
    expect(container.firstChild).toHaveAttribute("aria-hidden", "true");

    rerender(<Divider decorative label="OR" />);
    expect(container.firstChild).toHaveAttribute("aria-hidden", "true");
  });

  it("forwards the ref and native attributes, and merges className", () => {
    const hrRef = createRef();
    const divRef = createRef();
    render(
      <>
        <Divider ref={hrRef} className="custom" data-testid="hr" />
        <Divider ref={divRef} orientation="vertical" data-testid="vertical" />
      </>,
    );

    expect(hrRef.current).toBe(screen.getByTestId("hr"));
    expect(screen.getByTestId("hr")).toHaveClass("shelf-divider", "custom");
    expect(divRef.current).toBe(screen.getByTestId("vertical"));
  });
});
