import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef } from "react";
import { describe, expect, it, vi } from "vitest";
import { Select } from "./Select.jsx";

const frameworks = ["Vite", "Next.js", "Astro"];

describe("Select", () => {
  it("renders a native select named by its label, with string options", () => {
    render(<Select label="Framework" options={frameworks} />);

    const select = screen.getByRole("combobox", { name: "Framework" });
    expect(select.tagName).toBe("SELECT");
    expect(
      within(select)
        .getAllByRole("option")
        .map((option) => option.textContent),
    ).toEqual(frameworks);
    expect(select).toHaveValue("Vite");
    expect(select).not.toHaveAttribute("aria-invalid");
  });

  it("renders option objects with their own values, labels and disabled state", () => {
    render(
      <Select
        label="Plan"
        defaultValue="pro"
        options={[
          { value: "hobby", label: "Hobby" },
          { value: "pro", label: "Pro" },
          { value: "enterprise", label: "Enterprise", disabled: true },
          { value: "custom" },
        ]}
      />,
    );

    expect(screen.getByRole("combobox", { name: "Plan" })).toHaveValue("pro");
    expect(screen.getByRole("option", { name: "Hobby" })).toHaveAttribute("value", "hobby");
    expect(screen.getByRole("option", { name: "Enterprise" })).toBeDisabled();
    expect(screen.getByRole("option", { name: "custom" })).toHaveAttribute("value", "custom");
  });

  it("renders option and optgroup children when options is omitted", () => {
    const { container } = render(
      <Select label="Region" defaultValue="sin1">
        <optgroup label="Asia Pacific">
          <option value="bom1">Mumbai</option>
          <option value="sin1">Singapore</option>
        </optgroup>
        <optgroup label="Europe">
          <option value="fra1">Frankfurt</option>
        </optgroup>
      </Select>,
    );

    expect(screen.getByRole("combobox", { name: "Region" })).toHaveValue("sin1");
    expect(container.querySelectorAll("optgroup")).toHaveLength(2);
    expect(screen.getAllByRole("option")).toHaveLength(3);
  });

  it("starts on a disabled placeholder option when it has no value", () => {
    render(<Select label="Framework" placeholder="Choose a framework" options={frameworks} />);

    const select = screen.getByRole("combobox", { name: "Framework" });
    const placeholder = screen.getByRole("option", { name: "Choose a framework" });
    expect(select).toHaveValue("");
    expect(select.options[0]).toBe(placeholder);
    expect(placeholder).toBeDisabled();
    expect(placeholder.selected).toBe(true);
  });

  it("keeps defaultValue or value over the placeholder", () => {
    render(
      <>
        <Select label="Default" placeholder="Choose" options={frameworks} defaultValue="Astro" />
        <Select
          label="Controlled"
          placeholder="Choose"
          options={frameworks}
          value="Next.js"
          onChange={() => {}}
        />
      </>,
    );

    expect(screen.getByLabelText("Default")).toHaveValue("Astro");
    expect(screen.getByLabelText("Controlled")).toHaveValue("Next.js");
  });

  it("fails native validation while a required select shows its placeholder", async () => {
    const user = userEvent.setup();
    render(
      <Select label="Role" required placeholder="Select a role" options={["Admin", "Viewer"]} />,
    );

    const select = screen.getByRole("combobox", { name: "Role" });
    expect(select).toBeRequired();
    expect(select).toBeInvalid();

    await user.selectOptions(select, "Viewer");
    expect(select).toBeValid();
  });

  it("updates when an option is picked and reports it with onChange", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Select label="Framework" options={frameworks} onChange={onChange} />);

    const select = screen.getByRole("combobox", { name: "Framework" });
    await user.selectOptions(select, "Astro");
    expect(select).toHaveValue("Astro");
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange.mock.calls[0][0].target).toBe(select);
  });

  it("stays on a controlled value until the parent updates it", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const { rerender } = render(
      <Select label="Framework" options={frameworks} value="Vite" onChange={onChange} />,
    );

    const select = screen.getByRole("combobox", { name: "Framework" });
    await user.selectOptions(select, "Astro");
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(select).toHaveValue("Vite");

    rerender(<Select label="Framework" options={frameworks} value="Astro" onChange={onChange} />);
    expect(select).toHaveValue("Astro");
  });

  it("describes the select with helper text, or with the error that replaces it", () => {
    const { rerender } = render(
      <Select label="Region" helperText="Where your functions run." options={["Mumbai"]} />,
    );

    const select = screen.getByLabelText("Region");
    expect(select).toHaveAccessibleDescription("Where your functions run.");

    rerender(
      <Select
        label="Region"
        helperText="Where your functions run."
        error="Choose a region."
        options={["Mumbai"]}
      />,
    );
    expect(select).toHaveAttribute("aria-invalid", "true");
    expect(select).toHaveAccessibleDescription("Choose a region.");
    expect(screen.queryByText("Where your functions run.")).not.toBeInTheDocument();
  });

  it("supports error={true} and keeps a consumer-provided aria-describedby", () => {
    render(
      <>
        <span id="billing-hint">Changes apply from the next invoice.</span>
        <Select label="Plan" error aria-describedby="billing-hint" options={["Pro"]} />
      </>,
    );

    const select = screen.getByLabelText("Plan");
    expect(select).toHaveAttribute("aria-invalid", "true");
    expect(select).toHaveAccessibleDescription("Changes apply from the next invoice.");
  });

  it("is reachable with Tab, but not when disabled", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <>
        <Select label="Framework" options={frameworks} />
        <Select label="Plan" options={["Pro"]} disabled />
        <button type="button">Next</button>
      </>,
    );

    await user.tab();
    expect(screen.getByLabelText("Framework")).toHaveFocus();
    await user.tab();
    expect(screen.getByRole("button", { name: "Next" })).toHaveFocus();

    expect(screen.getByLabelText("Plan")).toBeDisabled();
    expect(container.querySelectorAll(".cps-field")[1]).toHaveClass("cps-field--disabled");
  });

  it("applies the size to the field and hides its icons from assistive technology", () => {
    const { container } = render(
      <Select
        label="Region"
        size="lg"
        leftIcon={<svg data-testid="globe" />}
        options={["Mumbai"]}
      />,
    );

    const select = screen.getByRole("combobox", { name: "Region" });
    expect(container.firstChild).toHaveClass("cps-field", "cps-field--lg");
    expect(select).not.toHaveAttribute("size");
    expect(container.querySelector(".cps-select")).toHaveClass("cps-select--with-icon");
    expect(screen.getByTestId("globe").parentElement).toHaveAttribute("aria-hidden", "true");
    expect(container.querySelector(".cps-select__chevron")).toHaveAttribute("aria-hidden", "true");
  });

  it("forwards the ref and native attributes to the select, and submits with its form", () => {
    const ref = createRef();
    const { container } = render(
      <form aria-label="Deploy settings">
        <Select
          ref={ref}
          id="region"
          name="region"
          label="Region"
          defaultValue="sin1"
          className="custom-field"
          style={{ maxWidth: 240 }}
          selectClassName="custom-select"
          options={[
            { value: "bom1", label: "Mumbai" },
            { value: "sin1", label: "Singapore" },
          ]}
        />
      </form>,
    );

    const select = screen.getByLabelText("Region");
    expect(ref.current).toBe(select);
    expect(select).toHaveAttribute("id", "region");
    expect(select).toHaveClass("cps-select__control", "custom-select");

    const field = container.querySelector(".cps-field");
    expect(field).toHaveClass("custom-field");
    expect(field).toHaveStyle({ maxWidth: "240px" });
    expect(new FormData(screen.getByRole("form")).get("region")).toBe("sin1");
  });
});
