import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef, useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { Checkbox } from "./Checkbox.jsx";

const environments = ["Production", "Preview"];

// A "select all" checkbox driving a list, as in the docs.
function Environments() {
  const [selected, setSelected] = useState(["Production"]);
  const allSelected = selected.length === environments.length;

  return (
    <>
      <Checkbox
        label="All environments"
        checked={allSelected}
        indeterminate={selected.length > 0 && !allSelected}
        onCheckedChange={(checked) => setSelected(checked ? environments : [])}
      />
      {environments.map((name) => (
        <Checkbox
          key={name}
          label={name}
          checked={selected.includes(name)}
          onCheckedChange={(checked) =>
            setSelected((current) =>
              checked ? [...current, name] : current.filter((item) => item !== name),
            )
          }
        />
      ))}
    </>
  );
}

describe("Checkbox", () => {
  it("renders a native checkbox named by its label, and the label toggles it", async () => {
    const user = userEvent.setup();
    render(<Checkbox label="Deploy on push" />);

    const checkbox = screen.getByRole("checkbox", { name: "Deploy on push" });
    expect(checkbox).toHaveAttribute("type", "checkbox");
    expect(checkbox).not.toBeChecked();
    expect(checkbox).not.toHaveAttribute("aria-invalid");

    await user.click(screen.getByText("Deploy on push"));
    expect(checkbox).toBeChecked();
  });

  it("toggles with Space and reports the new state with onCheckedChange", async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(<Checkbox label="Weekly report" defaultChecked onCheckedChange={onCheckedChange} />);

    const checkbox = screen.getByRole("checkbox", { name: "Weekly report" });
    expect(checkbox).toBeChecked();

    await user.tab();
    expect(checkbox).toHaveFocus();
    await user.keyboard(" ");
    expect(checkbox).not.toBeChecked();
    expect(onCheckedChange).toHaveBeenLastCalledWith(false);

    await user.click(checkbox);
    expect(checkbox).toBeChecked();
    expect(onCheckedChange).toHaveBeenLastCalledWith(true);
  });

  it("runs a native onChange first, which can cancel the change", async () => {
    const user = userEvent.setup();
    const calls = [];
    const { rerender } = render(
      <Checkbox
        label="Terms"
        onChange={() => calls.push("onChange")}
        onCheckedChange={() => calls.push("onCheckedChange")}
      />,
    );

    const checkbox = screen.getByRole("checkbox", { name: "Terms" });
    await user.click(checkbox);
    expect(calls).toEqual(["onChange", "onCheckedChange"]);

    const onCheckedChange = vi.fn();
    rerender(
      <Checkbox
        label="Terms"
        onChange={(event) => event.preventDefault()}
        onCheckedChange={onCheckedChange}
      />,
    );
    await user.click(checkbox);
    expect(onCheckedChange).not.toHaveBeenCalled();
    expect(checkbox).toBeChecked();
  });

  it("supports controlled usage", async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    const { rerender } = render(
      <Checkbox label="Production" checked={false} onCheckedChange={onCheckedChange} />,
    );

    const checkbox = screen.getByRole("checkbox", { name: "Production" });
    await user.click(checkbox);
    expect(onCheckedChange).toHaveBeenCalledWith(true);
    // The parent did not update `checked`, so the checkbox stays unchecked.
    expect(checkbox).not.toBeChecked();

    rerender(<Checkbox label="Production" checked onCheckedChange={onCheckedChange} />);
    expect(checkbox).toBeChecked();
  });

  it("shows the mixed state while indeterminate, controlled by the prop", async () => {
    const user = userEvent.setup();
    const { container, rerender } = render(<Checkbox label="All environments" indeterminate />);

    const checkbox = screen.getByRole("checkbox", { name: "All environments" });
    expect(checkbox).toBePartiallyChecked();
    expect(container.firstChild).toHaveClass("cps-checkbox--indeterminate");

    // A click clears the DOM property natively, but the prop still says "mixed".
    await user.click(checkbox);
    expect(checkbox).toBePartiallyChecked();

    rerender(<Checkbox label="All environments" indeterminate={false} />);
    expect(checkbox).not.toBePartiallyChecked();
    expect(container.firstChild).not.toHaveClass("cps-checkbox--indeterminate");
  });

  it("drives a list as a select-all checkbox", async () => {
    const user = userEvent.setup();
    render(<Environments />);

    const all = screen.getByRole("checkbox", { name: "All environments" });
    expect(all).toBePartiallyChecked();

    await user.click(all);
    expect(all).toBeChecked();
    expect(all).not.toBePartiallyChecked();
    expect(screen.getByRole("checkbox", { name: "Preview" })).toBeChecked();

    await user.click(screen.getByRole("checkbox", { name: "Production" }));
    expect(all).toBePartiallyChecked();

    await user.click(screen.getByRole("checkbox", { name: "Preview" }));
    expect(all).not.toBeChecked();
    expect(all).not.toBePartiallyChecked();
  });

  it("describes the checkbox with its description and error, and marks it invalid", () => {
    const { container } = render(
      <Checkbox
        label="Accept the terms"
        description="Read them before continuing."
        error="You must accept the terms."
      />,
    );

    const checkbox = screen.getByRole("checkbox", { name: "Accept the terms" });
    expect(checkbox).toHaveAttribute("aria-invalid", "true");
    expect(checkbox).toHaveAccessibleDescription(
      "Read them before continuing. You must accept the terms.",
    );
    expect(container.firstChild).toHaveClass("cps-checkbox--invalid");
  });

  it("supports error={true} and keeps a consumer-provided aria-describedby", () => {
    render(
      <>
        <span id="billing-hint">Needed for GST invoices.</span>
        <Checkbox label="Business account" error aria-describedby="billing-hint" />
      </>,
    );

    const checkbox = screen.getByRole("checkbox", { name: "Business account" });
    expect(checkbox).toHaveAttribute("aria-invalid", "true");
    expect(checkbox).toHaveAccessibleDescription("Needed for GST invoices.");
  });

  it("marks required checkboxes natively without adding the asterisk to the name", () => {
    render(<Checkbox label="I agree" required />);
    expect(screen.getByRole("checkbox", { name: "I agree" })).toBeRequired();
  });

  it("can't be toggled when disabled", async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    const { container } = render(
      <Checkbox label="Locked setting" disabled onCheckedChange={onCheckedChange} />,
    );

    const checkbox = screen.getByRole("checkbox", { name: "Locked setting" });
    expect(checkbox).toBeDisabled();
    expect(container.firstChild).toHaveClass("cps-checkbox--disabled");

    await user.click(checkbox);
    await user.click(screen.getByText("Locked setting"));
    expect(checkbox).not.toBeChecked();
    expect(onCheckedChange).not.toHaveBeenCalled();
  });

  it("applies size classes, defaulting to md, and works without a visible label", () => {
    const { container, rerender } = render(<Checkbox aria-label="Select row" />);

    const checkbox = screen.getByRole("checkbox", { name: "Select row" });
    expect(container.firstChild).toHaveClass("cps-checkbox", "cps-checkbox--md");
    expect(container.querySelector("label")).not.toBeInTheDocument();

    rerender(<Checkbox aria-label="Select row" size="sm" />);
    expect(container.firstChild).toHaveClass("cps-checkbox--sm");
    expect(checkbox).not.toHaveAttribute("size");
  });

  it("forwards the ref and native attributes to the input, and className and style to the root", () => {
    const ref = createRef();
    const { container } = render(
      <form aria-label="Notifications">
        <Checkbox
          ref={ref}
          id="email-alerts"
          name="alerts"
          value="email"
          label="Email alerts"
          defaultChecked
          className="custom"
          style={{ marginTop: 8 }}
        />
      </form>,
    );

    const checkbox = screen.getByRole("checkbox", { name: "Email alerts" });
    expect(ref.current).toBe(checkbox);
    expect(checkbox).toHaveAttribute("id", "email-alerts");

    const root = container.querySelector(".cps-checkbox");
    expect(root).toHaveClass("custom");
    expect(root).toHaveStyle({ marginTop: "8px" });
    expect(new FormData(screen.getByRole("form")).get("alerts")).toBe("email");
  });

  it("returns to its default state when its form is reset", async () => {
    const user = userEvent.setup();
    render(
      <form>
        <Checkbox label="Product updates" defaultChecked />
        <button type="reset">Reset</button>
      </form>,
    );

    const checkbox = screen.getByRole("checkbox", { name: "Product updates" });
    await user.click(checkbox);
    expect(checkbox).not.toBeChecked();

    await user.click(screen.getByRole("button", { name: "Reset" }));
    expect(checkbox).toBeChecked();
  });
});
