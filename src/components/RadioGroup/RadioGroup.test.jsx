import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef } from "react";
import { describe, expect, it, vi } from "vitest";
import { Radio, RadioGroup } from "./RadioGroup.jsx";

function Regions(props) {
  return (
    <RadioGroup label="Deployment region" {...props}>
      <Radio value="mumbai" label="Mumbai" />
      <Radio value="hyderabad" label="Hyderabad" />
      <Radio value="singapore" label="Singapore" disabled />
      <Radio value="frankfurt" label="Frankfurt" />
    </RadioGroup>
  );
}

function renderRegions(props = {}) {
  const user = userEvent.setup();
  const result = render(<Regions {...props} />);
  return { user, ...result };
}

const radio = (name) => screen.getByRole("radio", { name });

describe("RadioGroup", () => {
  it("renders a fieldset with the radiogroup role, named by its legend", () => {
    renderRegions();

    const group = screen.getByRole("radiogroup", { name: "Deployment region" });
    const legend = screen.getByText("Deployment region");
    expect(group.tagName).toBe("FIELDSET");
    expect(legend.tagName).toBe("LEGEND");
    expect(group).toHaveAttribute("aria-labelledby", legend.id);
    expect(screen.getAllByRole("radio")).toHaveLength(4);
    // Nothing is selected by default.
    expect(screen.getAllByRole("radio").filter((input) => input.checked)).toHaveLength(0);
  });

  it("gives every radio the same name, generated unless provided", () => {
    const { rerender } = renderRegions();
    const names = screen.getAllByRole("radio").map((input) => input.getAttribute("name"));
    expect(names[0]).toBeTruthy();
    expect(new Set(names).size).toBe(1);
    expect(radio("Hyderabad")).toHaveAttribute("value", "hyderabad");

    rerender(<Regions name="region" />);
    for (const input of screen.getAllByRole("radio")) {
      expect(input).toHaveAttribute("name", "region");
    }
  });

  it("selects a radio when its label is clicked (uncontrolled)", async () => {
    const onValueChange = vi.fn();
    const { user } = renderRegions({ defaultValue: "mumbai", onValueChange });
    expect(radio("Mumbai")).toBeChecked();

    await user.click(screen.getByText("Hyderabad"));
    expect(radio("Hyderabad")).toBeChecked();
    expect(radio("Mumbai")).not.toBeChecked();
    expect(onValueChange).toHaveBeenCalledTimes(1);
    expect(onValueChange).toHaveBeenCalledWith("hyderabad");
  });

  it("supports controlled usage", async () => {
    const onValueChange = vi.fn();
    const { user, rerender } = renderRegions({ value: "mumbai", onValueChange });

    await user.click(radio("Frankfurt"));
    expect(onValueChange).toHaveBeenCalledWith("frankfurt");
    // The parent did not update `value`, so the selection stays put.
    expect(radio("Mumbai")).toBeChecked();
    expect(radio("Frankfurt")).not.toBeChecked();

    rerender(<Regions value="frankfurt" onValueChange={onValueChange} />);
    expect(radio("Frankfurt")).toBeChecked();
    expect(radio("Mumbai")).not.toBeChecked();
  });

  it("runs a radio's own onChange before selecting it", async () => {
    const calls = [];
    const user = userEvent.setup();
    render(
      <RadioGroup label="Plan" onValueChange={(value) => calls.push(`value:${value}`)}>
        <Radio
          value="pro"
          label="Pro"
          onChange={(event) => calls.push(`change:${event.target.value}`)}
        />
      </RadioGroup>,
    );

    await user.click(radio("Pro"));
    expect(calls).toEqual(["change:pro", "value:pro"]);
  });

  it("is a single Tab stop that lands on the selected radio", async () => {
    const user = userEvent.setup();
    render(
      <>
        <button type="button">Before</button>
        <Regions defaultValue="hyderabad" />
        <button type="button">After</button>
      </>,
    );

    await user.tab();
    await user.tab();
    expect(radio("Hyderabad")).toHaveFocus();
    await user.tab();
    expect(screen.getByRole("button", { name: "After" })).toHaveFocus();
  });

  it("moves the selection with the arrow keys, skipping disabled radios", async () => {
    const onValueChange = vi.fn();
    const { user } = renderRegions({ defaultValue: "hyderabad", onValueChange });
    await user.tab();

    await user.keyboard("{ArrowDown}");
    expect(radio("Frankfurt")).toHaveFocus();
    expect(radio("Frankfurt")).toBeChecked();
    expect(onValueChange).toHaveBeenLastCalledWith("frankfurt");

    await user.keyboard("{ArrowRight}");
    expect(radio("Mumbai")).toBeChecked();

    await user.keyboard("{ArrowUp}");
    expect(radio("Frankfurt")).toBeChecked();
    await user.keyboard("{ArrowLeft}");
    expect(radio("Hyderabad")).toBeChecked();
  });

  it("selects the focused radio with Space", async () => {
    const onValueChange = vi.fn();
    const { user } = renderRegions({ onValueChange });

    await user.tab();
    expect(radio("Mumbai")).toHaveFocus();
    await user.keyboard(" ");
    expect(radio("Mumbai")).toBeChecked();
    expect(onValueChange).toHaveBeenCalledWith("mumbai");
  });

  it("does not select a disabled radio", async () => {
    const onValueChange = vi.fn();
    const { user } = renderRegions({ onValueChange });
    const singapore = radio("Singapore");
    expect(singapore).toBeDisabled();
    expect(singapore.closest(".shelf-radio")).toHaveClass("shelf-radio--disabled");

    await user.click(screen.getByText("Singapore"));
    expect(singapore).not.toBeChecked();
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it("disables every radio when the group is disabled", async () => {
    const { user } = renderRegions({ disabled: true, defaultValue: "mumbai" });
    const group = screen.getByRole("radiogroup");
    expect(group).toBeDisabled();
    expect(group).toHaveClass("shelf-radio-group--disabled");
    for (const input of screen.getAllByRole("radio")) {
      expect(input).toBeDisabled();
    }

    await user.click(screen.getByText("Hyderabad"));
    expect(radio("Mumbai")).toBeChecked();
  });

  it("describes the group with its description and error, and marks it invalid", () => {
    const { rerender } = renderRegions({
      description: "Pick the region closest to your users.",
      error: "Choose a region to continue.",
    });
    const group = screen.getByRole("radiogroup");
    expect(group).toHaveAccessibleDescription(
      "Pick the region closest to your users. Choose a region to continue.",
    );
    expect(group).toHaveAttribute("aria-invalid", "true");
    expect(group).toHaveClass("shelf-radio-group--invalid");

    rerender(<Regions error />);
    expect(group).toHaveAttribute("aria-invalid", "true");
    expect(group).not.toHaveAccessibleDescription();

    rerender(<Regions />);
    expect(group).not.toHaveAttribute("aria-invalid");
    expect(group).not.toHaveClass("shelf-radio-group--invalid");
  });

  it("describes a radio with its own description", () => {
    render(
      <RadioGroup label="Plan">
        <Radio value="pro" label="Pro" description="₹2,999 per month" />
      </RadioGroup>,
    );
    expect(radio("Pro")).toHaveAccessibleDescription("₹2,999 per month");
  });

  it("marks every radio required without adding the asterisk to the name", () => {
    renderRegions({ required: true });
    const group = screen.getByRole("radiogroup", { name: "Deployment region" });
    expect(group).toHaveAttribute("aria-required", "true");
    for (const input of screen.getAllByRole("radio")) {
      expect(input).toBeRequired();
    }
  });

  it("applies orientation and size", () => {
    const { rerender } = renderRegions();
    const group = screen.getByRole("radiogroup");
    expect(group).toHaveClass("shelf-radio-group--md");
    expect(group).not.toHaveClass("shelf-radio-group--horizontal");
    expect(group).toHaveAttribute("aria-orientation", "vertical");

    rerender(<Regions orientation="horizontal" size="sm" />);
    expect(group).toHaveClass("shelf-radio-group--sm", "shelf-radio-group--horizontal");
    expect(group).toHaveAttribute("aria-orientation", "horizontal");
  });

  it("submits the selected value with its form", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <form>
        <Regions name="region" defaultValue="mumbai" />
      </form>,
    );
    const form = container.querySelector("form");

    expect(new FormData(form).get("region")).toBe("mumbai");
    await user.click(screen.getByText("Frankfurt"));
    expect(new FormData(form).get("region")).toBe("frankfurt");
  });

  it("returns to its default value when its form is reset, and stays there", async () => {
    const user = userEvent.setup();
    const { rerender } = render(
      <form>
        <Regions defaultValue="mumbai" />
        <button type="reset">Reset</button>
      </form>,
    );

    await user.click(screen.getByText("Frankfurt"));
    expect(radio("Frankfurt")).toBeChecked();
    await user.click(screen.getByRole("button", { name: "Reset" }));
    expect(radio("Mumbai")).toBeChecked();

    // A later render must not bring back the selection from before the reset.
    rerender(
      <form>
        <Regions defaultValue="mumbai" description="Pick the region closest to your users." />
        <button type="reset">Reset</button>
      </form>,
    );
    expect(radio("Mumbai")).toBeChecked();
    expect(radio("Frankfurt")).not.toBeChecked();
  });

  it("forwards refs and props, and merges class names", () => {
    const groupRef = createRef();
    const radioRef = createRef();
    render(
      <RadioGroup ref={groupRef} label="Plan" className="custom-group" data-testid="plan-group">
        <Radio
          ref={radioRef}
          value="pro"
          label="Pro"
          className="custom-radio"
          style={{ marginTop: 4 }}
          data-testid="pro-input"
        />
      </RadioGroup>,
    );

    const group = screen.getByRole("radiogroup");
    expect(groupRef.current).toBe(group);
    expect(group).toHaveClass("shelf-radio-group", "custom-group");
    expect(group).toHaveAttribute("data-testid", "plan-group");

    const input = radio("Pro");
    expect(radioRef.current).toBe(input);
    expect(input).toHaveAttribute("data-testid", "pro-input");
    const option = input.closest(".shelf-radio");
    expect(option).toHaveClass("custom-radio");
    expect(option).toHaveStyle({ marginTop: "4px" });
  });

  it("explains misuse outside <RadioGroup>", () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => render(<Radio value="orphan" label="Orphan" />)).toThrow(
      "<Radio> must be rendered inside <RadioGroup>.",
    );
  });
});
