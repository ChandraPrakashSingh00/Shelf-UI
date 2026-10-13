import { render, screen } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it } from "vitest";
import { Spinner } from "./Spinner.jsx";

describe("Spinner", () => {
  it('renders a status with a visually hidden "Loading…" label', () => {
    render(<Spinner />);

    const status = screen.getByRole("status");
    expect(status).toHaveTextContent("Loading…");
    expect(status).toHaveClass("shelf-spinner-status", "shelf-spinner-status--md");
    expect(screen.getByText("Loading…")).toHaveClass("shelf-visually-hidden");
  });

  it("reuses the decorative spinner icon, hidden from screen readers", () => {
    render(<Spinner />);

    const icon = screen.getByRole("status").querySelector("svg");
    expect(icon).toHaveClass("shelf-spinner");
    expect(icon).toHaveAttribute("aria-hidden", "true");
  });

  it("uses a custom label", () => {
    render(<Spinner label="Loading build logs…" />);
    expect(screen.getByRole("status")).toHaveTextContent("Loading build logs…");
  });

  it('is decorative with label=""', () => {
    const { container } = render(<Spinner label="" />);

    const spinner = container.firstElementChild;
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
    expect(spinner).not.toHaveAttribute("role");
    expect(spinner).toHaveAttribute("aria-hidden", "true");
    expect(spinner.querySelector(".shelf-visually-hidden")).toBeNull();
    expect(spinner.querySelector("svg")).toBeInTheDocument();
  });

  it.each(["sm", "md", "lg"])("applies the %s size", (size) => {
    render(<Spinner size={size} />);
    expect(screen.getByRole("status")).toHaveClass(`shelf-spinner-status--${size}`);
  });

  it("does not use the internal primitive's class on its root", () => {
    render(<Spinner />);
    expect(screen.getByRole("status")).not.toHaveClass("shelf-spinner");
  });

  it("forwards the ref and native attributes, and merges className", () => {
    const ref = createRef();
    render(<Spinner ref={ref} className="custom" id="logs-spinner" style={{ color: "white" }} />);

    const status = screen.getByRole("status");
    expect(ref.current).toBe(status);
    expect(status).toHaveClass("shelf-spinner-status", "custom");
    expect(status).toHaveAttribute("id", "logs-spinner");
    expect(status.style.color).toBe("white");
  });
});
