import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef } from "react";
import { describe, expect, it, vi } from "vitest";
import { EmptyState } from "./EmptyState.jsx";

describe("EmptyState", () => {
  it("renders the title as a level-3 heading with a description", () => {
    render(
      <EmptyState
        title="Your cart is empty"
        description="Looks like you haven't added anything yet."
      />,
    );

    expect(
      screen.getByRole("heading", { level: 3, name: "Your cart is empty" }),
    ).toBeInTheDocument();
    const description = screen.getByText("Looks like you haven't added anything yet.");
    expect(description.tagName).toBe("P");
  });

  it("uses headingLevel for the heading, clamped to 2–6", () => {
    const { rerender } = render(<EmptyState title="No orders yet" headingLevel={2} />);
    expect(screen.getByRole("heading", { level: 2, name: "No orders yet" })).toBeInTheDocument();

    rerender(<EmptyState title="No orders yet" headingLevel={1} />);
    expect(screen.getByRole("heading", { level: 2 })).toBeInTheDocument();

    rerender(<EmptyState title="No orders yet" headingLevel={9} />);
    expect(screen.getByRole("heading", { level: 6 })).toBeInTheDocument();
  });

  it("shows a decorative icon, or an image instead of it", () => {
    const { container, rerender } = render(
      <EmptyState title="No results" icon={<svg data-testid="icon" />} />,
    );
    const icon = container.querySelector(".cps-empty-state__icon");
    expect(icon).toHaveAttribute("aria-hidden", "true");
    expect(icon).toContainElement(screen.getByTestId("icon"));

    rerender(
      <EmptyState
        title="No results"
        icon={<svg data-testid="icon" />}
        image={<img src="/empty-box.svg" alt="An empty box" />}
      />,
    );
    expect(screen.getByRole("img", { name: "An empty box" })).toBeInTheDocument();
    expect(screen.queryByTestId("icon")).not.toBeInTheDocument();
  });

  it("renders actions and extra children", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <EmptyState
        title="No products match your filters"
        actions={<button onClick={onClick}>Clear filters</button>}
      >
        <p>Try “earbuds” instead of “wireless earbuds under ₹500”.</p>
      </EmptyState>,
    );

    await user.click(screen.getByRole("button", { name: "Clear filters" }));
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(screen.getByText(/Try “earbuds”/)).toBeInTheDocument();
  });

  it("leaves out the optional parts when they're not given", () => {
    const { container } = render(<EmptyState title="Nothing here" />);
    expect(container.querySelector(".cps-empty-state__icon")).not.toBeInTheDocument();
    expect(container.querySelector(".cps-empty-state__description")).not.toBeInTheDocument();
    expect(container.querySelector(".cps-empty-state__actions")).not.toBeInTheDocument();
  });

  it("applies size, variant, tone and align classes with defaults", () => {
    const { container, rerender } = render(<EmptyState title="No orders yet" />);
    expect(container.firstChild).toHaveClass(
      "cps-empty-state",
      "cps-empty-state--md",
      "cps-empty-state--plain",
      "cps-empty-state--neutral",
      "cps-empty-state--align-center",
    );

    rerender(
      <EmptyState
        title="Couldn't load orders"
        size="sm"
        variant="bordered"
        tone="danger"
        align="start"
      />,
    );
    expect(container.firstChild).toHaveClass(
      "cps-empty-state--sm",
      "cps-empty-state--bordered",
      "cps-empty-state--danger",
      "cps-empty-state--align-start",
    );
  });

  it("forwards the ref, className and other props such as role to the root", () => {
    const ref = createRef();
    const { container } = render(
      <EmptyState ref={ref} role="status" className="custom" title="No results found" />,
    );
    expect(ref.current).toBe(container.firstChild);
    expect(screen.getByRole("status")).toHaveClass("cps-empty-state", "custom");
    expect(screen.getByRole("status")).toHaveTextContent("No results found");
  });
});
