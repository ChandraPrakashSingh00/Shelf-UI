import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef } from "react";
import { describe, expect, it, vi } from "vitest";
import { Button } from "./Button.jsx";

describe("Button", () => {
  it("renders a native button that does not submit forms by default", async () => {
    const onSubmit = vi.fn((event) => event.preventDefault());
    render(
      <form onSubmit={onSubmit}>
        <Button>Start Project</Button>
      </form>,
    );

    const button = screen.getByRole("button", { name: "Start Project" });
    expect(button).toHaveAttribute("type", "button");

    await userEvent.click(button);
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('submits the surrounding form when type="submit"', async () => {
    const onSubmit = vi.fn((event) => event.preventDefault());
    render(
      <form onSubmit={onSubmit}>
        <Button type="submit">Save</Button>
      </form>,
    );

    await userEvent.click(screen.getByRole("button", { name: "Save" }));
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it("defaults to the primary variant and medium size", () => {
    render(<Button>Default</Button>);
    const button = screen.getByRole("button");
    expect(button).toHaveClass("cps-button--primary", "cps-button--md");
  });

  it.each(["primary", "secondary", "outline", "ghost", "danger"])(
    "applies the %s variant",
    (variant) => {
      render(<Button variant={variant}>Label</Button>);
      expect(screen.getByRole("button")).toHaveClass(`cps-button--${variant}`);
    },
  );

  it.each(["sm", "md", "lg"])("applies the %s size", (size) => {
    render(<Button size={size}>Label</Button>);
    expect(screen.getByRole("button")).toHaveClass(`cps-button--${size}`);
  });

  it("calls onClick when activated with the mouse or keyboard", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Click me</Button>);

    await user.tab();
    expect(screen.getByRole("button")).toHaveFocus();
    await user.keyboard("{Enter}");
    await user.keyboard(" ");
    await user.click(screen.getByRole("button"));

    expect(onClick).toHaveBeenCalledTimes(3);
  });

  it("does not respond to interaction when disabled", async () => {
    const onClick = vi.fn();
    render(
      <Button disabled onClick={onClick}>
        Disabled
      </Button>,
    );

    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
    await userEvent.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  it("shows a spinner, marks itself busy and blocks clicks while loading", async () => {
    const onClick = vi.fn();
    render(
      <Button loading leftIcon={<svg data-testid="left-icon" />} onClick={onClick}>
        Saving
      </Button>,
    );

    const button = screen.getByRole("button", { name: "Saving" });
    expect(button).toHaveAttribute("aria-disabled", "true");
    expect(button).toHaveAttribute("aria-busy", "true");
    expect(button.querySelector(".cps-spinner")).toBeInTheDocument();
    expect(screen.queryByTestId("left-icon")).not.toBeInTheDocument();

    await userEvent.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  it("keeps keyboard focus when it switches to loading, and ignores activation", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    const { rerender } = render(<Button onClick={onClick}>Save</Button>);

    await user.tab();
    rerender(
      <Button loading onClick={onClick}>
        Save
      </Button>,
    );

    const button = screen.getByRole("button", { name: "Save" });
    expect(button).toHaveFocus();
    await user.keyboard("{Enter}");
    expect(onClick).not.toHaveBeenCalled();
  });

  it("does not submit its form while loading", async () => {
    const onSubmit = vi.fn((event) => event.preventDefault());
    render(
      <form onSubmit={onSubmit}>
        <Button type="submit" loading>
          Save
        </Button>
      </form>,
    );

    await userEvent.click(screen.getByRole("button", { name: "Save" }));
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("renders decorative icons without changing the accessible name", () => {
    render(
      <Button leftIcon={<svg />} rightIcon={<svg />}>
        Continue
      </Button>,
    );
    expect(screen.getByRole("button", { name: "Continue" })).toBeInTheDocument();
  });

  it("renders its child with button styling when asChild is set", async () => {
    const onButtonClick = vi.fn();
    const onLinkClick = vi.fn((event) => event.preventDefault());
    render(
      <Button asChild variant="outline" size="lg" onClick={onButtonClick}>
        <a href="/pricing" className="custom-link" onClick={onLinkClick}>
          View pricing
        </a>
      </Button>,
    );

    const link = screen.getByRole("link", { name: "View pricing" });
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/pricing");
    expect(link).not.toHaveAttribute("type");
    expect(link).toHaveClass("cps-button", "cps-button--outline", "cps-button--lg", "custom-link");

    await userEvent.click(link);
    expect(onLinkClick).toHaveBeenCalledTimes(1);
    expect(onButtonClick).toHaveBeenCalledTimes(1);
  });

  it("forwards refs and native attributes, and merges className", () => {
    const ref = createRef();
    render(
      <Button ref={ref} className="custom" aria-label="Close panel" fullWidth>
        ×
      </Button>,
    );

    const button = screen.getByRole("button", { name: "Close panel" });
    expect(ref.current).toBe(button);
    expect(button).toHaveClass("cps-button", "cps-button--full-width", "custom");
  });
});
