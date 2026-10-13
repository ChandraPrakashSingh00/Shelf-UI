import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef } from "react";
import { describe, expect, it, vi } from "vitest";
import { Switch } from "./Switch.jsx";

describe("Switch", () => {
  it("renders a checkbox with the switch role, named by its label", () => {
    const { container } = render(<Switch label="Auto-deploy" />);

    const control = screen.getByRole("switch", { name: "Auto-deploy" });
    expect(control).toHaveAttribute("type", "checkbox");
    expect(control).not.toBeChecked();
    expect(control).not.toHaveAttribute("aria-checked");
    expect(container.firstChild).toHaveClass("shelf-switch", "shelf-switch--md");
  });

  it("toggles when the label or the switch is clicked (uncontrolled)", async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(<Switch label="Auto-deploy" onCheckedChange={onCheckedChange} />);
    const control = screen.getByRole("switch");

    await user.click(screen.getByText("Auto-deploy"));
    expect(control).toBeChecked();
    expect(onCheckedChange).toHaveBeenLastCalledWith(true);

    await user.click(control);
    expect(control).not.toBeChecked();
    expect(onCheckedChange).toHaveBeenLastCalledWith(false);
    expect(onCheckedChange).toHaveBeenCalledTimes(2);
  });

  it("starts on with defaultChecked and toggles with Space", async () => {
    const user = userEvent.setup();
    render(<Switch label="Email notifications" defaultChecked />);
    const control = screen.getByRole("switch");
    expect(control).toBeChecked();

    await user.tab();
    expect(control).toHaveFocus();
    await user.keyboard(" ");
    expect(control).not.toBeChecked();
    await user.keyboard(" ");
    expect(control).toBeChecked();
  });

  it("runs the native onChange before onCheckedChange", async () => {
    const calls = [];
    render(
      <Switch
        label="Beta features"
        onChange={(event) => calls.push(`change:${event.target.checked}`)}
        onCheckedChange={(checked) => calls.push(`checked:${checked}`)}
      />,
    );

    await userEvent.click(screen.getByRole("switch"));
    expect(calls).toEqual(["change:true", "checked:true"]);
  });

  it("returns to its default state when its form is reset, and stays there", async () => {
    const user = userEvent.setup();
    const { rerender } = render(
      <form>
        <Switch label="Auto-deploy" description="Deploy every push." />
        <button type="reset">Reset</button>
      </form>,
    );
    const control = screen.getByRole("switch", { name: "Auto-deploy" });

    await user.click(control);
    expect(control).toBeChecked();
    await user.click(screen.getByRole("button", { name: "Reset" }));
    expect(control).not.toBeChecked();

    // A later render must not bring back the state from before the reset.
    rerender(
      <form>
        <Switch label="Auto-deploy" description="Deploy every push to main." />
        <button type="reset">Reset</button>
      </form>,
    );
    expect(control).not.toBeChecked();
  });

  it("supports controlled usage", async () => {
    const onCheckedChange = vi.fn();
    const { rerender } = render(
      <Switch label="Maintenance mode" checked={false} onCheckedChange={onCheckedChange} />,
    );
    const control = screen.getByRole("switch");

    await userEvent.click(control);
    expect(onCheckedChange).toHaveBeenCalledWith(true);
    // The parent did not update `checked`, so the switch stays off.
    expect(control).not.toBeChecked();

    rerender(<Switch label="Maintenance mode" checked onCheckedChange={onCheckedChange} />);
    expect(control).toBeChecked();
  });

  it("exposes the description as its accessible description, next to aria-describedby", () => {
    render(
      <>
        <span id="scope-hint">Applies to every project.</span>
        <Switch
          label="Auto-deploy"
          description="Deploy every push to the main branch."
          aria-describedby="scope-hint"
        />
      </>,
    );
    expect(screen.getByRole("switch")).toHaveAccessibleDescription(
      "Applies to every project. Deploy every push to the main branch.",
    );
  });

  it("cannot be toggled when disabled", async () => {
    const onCheckedChange = vi.fn();
    const { container } = render(
      <Switch label="Single sign-on" disabled onCheckedChange={onCheckedChange} />,
    );
    const control = screen.getByRole("switch");
    expect(control).toBeDisabled();
    expect(container.firstChild).toHaveClass("shelf-switch--disabled");

    await userEvent.click(screen.getByText("Single sign-on"));
    expect(control).not.toBeChecked();
    expect(onCheckedChange).not.toHaveBeenCalled();
  });

  it("marks required switches natively without adding the asterisk to the name", () => {
    render(<Switch label="Share usage data" required />);
    expect(screen.getByRole("switch", { name: "Share usage data" })).toBeRequired();
  });

  it.each(["sm", "md"])("applies the %s size", (size) => {
    const { container } = render(<Switch label="Size" size={size} />);
    expect(container.firstChild).toHaveClass(`shelf-switch--${size}`);
  });

  it("submits with its form like a checkbox", async () => {
    const { container } = render(
      <form>
        <Switch label="Weekly digest" name="digest" />
      </form>,
    );
    const form = container.querySelector("form");
    expect(new FormData(form).get("digest")).toBeNull();

    await userEvent.click(screen.getByRole("switch"));
    expect(new FormData(form).get("digest")).toBe("on");
  });

  it("forwards the ref and native attributes to the input, className and style to the wrapper", () => {
    const ref = createRef();
    const { container } = render(
      <Switch
        ref={ref}
        id="auto-deploy"
        label="Auto-deploy"
        className="custom"
        style={{ marginTop: 8 }}
        data-testid="switch-input"
      />,
    );

    const control = screen.getByRole("switch");
    expect(ref.current).toBe(control);
    expect(control).toHaveAttribute("id", "auto-deploy");
    expect(control).toHaveAttribute("data-testid", "switch-input");
    expect(container.firstChild).toHaveClass("shelf-switch", "custom");
    expect(container.firstChild).toHaveStyle({ marginTop: "8px" });
  });
});
