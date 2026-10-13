import { render, screen } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it } from "vitest";
import { Stat } from "./Stat.jsx";

const change = (container) => container.querySelector(".shelf-stat__change");

describe("Stat", () => {
  it("pairs the label and value in a description list", () => {
    render(<Stat label="Revenue" value="₹4,52,300" />);

    const term = screen.getByRole("term");
    expect(term).toHaveTextContent("Revenue");
    expect(term.tagName).toBe("DT");
    const [value] = screen.getAllByRole("definition");
    expect(value).toHaveTextContent("₹4,52,300");
    expect(term.parentElement.tagName).toBe("DL");
  });

  it("shows an increase with an up arrow, green by default, and says so to screen readers", () => {
    const { container } = render(
      <Stat label="Orders" value="1,284" change={12.5} changeLabel="vs last week" />,
    );

    const row = change(container);
    expect(row).toHaveTextContent("Increased by 12.5% vs last week");
    expect(row).toHaveClass("shelf-stat__change--positive");
    expect(screen.getByText("Increased by")).toHaveClass("shelf-visually-hidden");
    expect(row.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
  });

  it("shows a decrease in red, formatted as an absolute value", () => {
    const { container } = render(<Stat label="Average order value" value="₹352" change={-3.2} />);

    const row = change(container);
    expect(row).toHaveTextContent("Decreased by 3.2%");
    expect(row).not.toHaveTextContent("-3.2");
    expect(row).toHaveClass("shelf-stat__change--negative");
  });

  it("reverses the colors when a lower value is better", () => {
    const { container, rerender } = render(
      <Stat label="Refunds" value="₹12,400" change={-18} higherIsBetter={false} />,
    );
    expect(change(container)).toHaveClass("shelf-stat__change--positive");

    rerender(<Stat label="Refunds" value="₹12,400" change={4} higherIsBetter={false} />);
    expect(change(container)).toHaveClass("shelf-stat__change--negative");
    expect(change(container)).toHaveTextContent("Increased by 4%");
  });

  it("treats zero as neutral", () => {
    const { container } = render(
      <Stat label="Returns" value="32" change={0} changeLabel="vs yesterday" />,
    );
    const row = change(container);
    expect(row).toHaveClass("shelf-stat__change--neutral");
    expect(row).toHaveTextContent("No change, 0% vs yesterday");
  });

  it("formats the change with formatChange and localizes the hidden labels", () => {
    const { container } = render(
      <Stat
        label="New customers"
        value="342"
        change={48}
        formatChange={(n) => `${n} customers`}
        trendLabels={{ increase: "बढ़त" }}
      />,
    );
    expect(change(container)).toHaveTextContent("बढ़त 48 customers");
  });

  it("leaves out the change row without a change, and shows a changeLabel alone", () => {
    const { container, rerender } = render(<Stat label="Revenue" value="₹4,52,300" />);
    expect(change(container)).not.toBeInTheDocument();
    expect(screen.getAllByRole("definition")).toHaveLength(1);

    rerender(<Stat label="Revenue" value="₹4,52,300" change={Number.NaN} changeLabel="Today" />);
    expect(change(container)).toHaveTextContent(/^Today$/);
    expect(change(container).querySelector("svg")).not.toBeInTheDocument();
  });

  it("renders a description and a decorative icon", () => {
    const { container } = render(
      <Stat
        label="Pending orders"
        value="18"
        description="Ship within 24 hours"
        icon={<svg data-testid="icon" />}
      />,
    );

    expect(screen.getByText("Ship within 24 hours").tagName).toBe("DD");
    const icon = container.querySelector(".shelf-stat__icon");
    expect(icon).toHaveAttribute("aria-hidden", "true");
    expect(icon).toContainElement(screen.getByTestId("icon"));
    expect(container.firstChild).toHaveClass("shelf-stat--with-icon");
  });

  it("shows placeholders and a hidden status while loading", () => {
    const { container } = render(
      <Stat label="Revenue" value="₹4,52,300" change={12} changeLabel="vs last week" loading />,
    );

    expect(container.firstChild).toHaveAttribute("aria-busy", "true");
    expect(screen.getByText("Revenue")).toBeInTheDocument();
    expect(screen.queryByText("₹4,52,300")).not.toBeInTheDocument();
    expect(screen.getByText("Loading…")).toHaveClass("shelf-visually-hidden");
    expect(container.querySelectorAll(".shelf-skeleton")).toHaveLength(2);
    expect(screen.queryByText("vs last week")).not.toBeInTheDocument();
  });

  it("applies variant and size classes, defaulting to card and md", () => {
    const { container, rerender } = render(<Stat label="Orders" value="1,284" />);
    expect(container.firstChild).toHaveClass("shelf-stat", "shelf-stat--card", "shelf-stat--md");
    expect(container.firstChild).not.toHaveAttribute("aria-busy");

    rerender(<Stat label="Orders" value="1,284" variant="plain" size="sm" />);
    expect(container.firstChild).toHaveClass("shelf-stat--plain", "shelf-stat--sm");
  });

  it("forwards the ref, className and other props to the root", () => {
    const ref = createRef();
    const { container } = render(
      <Stat ref={ref} label="Orders" value="1,284" className="custom" id="orders-stat" />,
    );
    expect(ref.current).toBe(container.firstChild);
    expect(container.firstChild).toHaveClass("custom");
    expect(container.firstChild).toHaveAttribute("id", "orders-stat");
  });
});
