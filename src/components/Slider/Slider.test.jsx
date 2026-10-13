import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef } from "react";
import { describe, expect, it, vi } from "vitest";
import { Slider } from "./Slider.jsx";

const fillOf = (slider) => slider.style.getPropertyValue("--shelf-slider-fill");

describe("Slider", () => {
  it("renders a focusable range input linked to its label", async () => {
    const user = userEvent.setup();
    const { container } = render(<Slider label="Volume" />);

    const slider = screen.getByRole("slider", { name: "Volume" });
    expect(slider).toHaveAttribute("type", "range");
    expect(slider).toHaveAttribute("min", "0");
    expect(slider).toHaveAttribute("max", "100");
    expect(slider).toHaveAttribute("step", "1");
    expect(container.firstChild).toHaveClass("shelf-field", "shelf-slider", "shelf-slider--md");

    await user.tab();
    expect(slider).toHaveFocus();
  });

  it("starts at min, not the browser's midpoint, when uncontrolled", () => {
    render(<Slider label="Team size" min={1} max={50} />);
    const slider = screen.getByRole("slider");
    expect(slider).toHaveValue("1");
    expect(fillOf(slider)).toBe("0%");
  });

  it("shows the current value next to the label, hidden from assistive technology", () => {
    render(<Slider label="Volume" defaultValue={40} />);

    expect(screen.getByText("40")).toHaveAttribute("aria-hidden", "true");
    expect(screen.getByRole("slider")).not.toHaveAttribute("aria-valuetext");
  });

  it("can hide the value", () => {
    render(<Slider label="Volume" defaultValue={40} showValue={false} />);
    expect(screen.queryByText("40")).not.toBeInTheDocument();
  });

  it("uses formatValue for the visible value and aria-valuetext", () => {
    render(
      <Slider
        label="Monthly budget"
        min={1000}
        max={50000}
        step={1000}
        defaultValue={12000}
        formatValue={(value) => `₹${value.toLocaleString("en-IN")}`}
      />,
    );

    expect(screen.getByRole("slider")).toHaveAttribute("aria-valuetext", "₹12,000");
    expect(screen.getByText("₹12,000")).toHaveAttribute("aria-hidden", "true");
  });

  it("reports numbers after the native onChange and updates itself (uncontrolled)", () => {
    const calls = [];
    render(
      <Slider
        label="Volume"
        onChange={(event) => calls.push(`change:${event.target.value}`)}
        onValueChange={(value) => calls.push(value)}
      />,
    );
    const slider = screen.getByRole("slider");

    fireEvent.change(slider, { target: { value: "65" } });
    expect(calls).toEqual(["change:65", 65]);
    expect(slider).toHaveValue("65");
    expect(fillOf(slider)).toBe("65%");
    expect(screen.getByText("65")).toBeInTheDocument();
  });

  it("returns to its default value when its form is reset", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <form>
        <Slider label="Volume" defaultValue={40} onValueChange={onValueChange} />
        <button type="reset">Reset</button>
      </form>,
    );
    const slider = screen.getByRole("slider");

    fireEvent.change(slider, { target: { value: "75" } });
    expect(slider).toHaveValue("75");
    await user.click(screen.getByRole("button", { name: "Reset" }));
    expect(slider).toHaveValue("40");
    expect(fillOf(slider)).toBe("40%");
    expect(screen.getByText("40")).toBeInTheDocument();
    expect(onValueChange).toHaveBeenLastCalledWith(40);
  });

  it("supports controlled usage", () => {
    const onValueChange = vi.fn();
    const { rerender } = render(
      <Slider
        label="Storage"
        min={10}
        max={500}
        step={10}
        value={100}
        onValueChange={onValueChange}
      />,
    );
    const slider = screen.getByRole("slider");

    fireEvent.change(slider, { target: { value: "250" } });
    expect(onValueChange).toHaveBeenCalledWith(250);
    // The parent did not update `value`, so the slider stays put.
    expect(slider).toHaveValue("100");

    rerender(
      <Slider
        label="Storage"
        min={10}
        max={500}
        step={10}
        value={250}
        onValueChange={onValueChange}
      />,
    );
    expect(slider).toHaveValue("250");
    expect(screen.getByText("250")).toBeInTheDocument();
  });

  it("clamps the value to the range and rounds it to a step, like the browser", () => {
    const renderStorage = (value) => (
      <Slider label="Storage" min={10} max={500} step={10} value={value} onValueChange={vi.fn()} />
    );
    const { rerender } = render(renderStorage(640));
    const slider = screen.getByRole("slider");
    expect(slider).toHaveValue("500");
    expect(fillOf(slider)).toBe("100%");

    rerender(renderStorage(-5));
    expect(slider).toHaveValue("10");
    expect(fillOf(slider)).toBe("0%");

    rerender(renderStorage(74));
    expect(slider).toHaveValue("70");

    rerender(renderStorage("120"));
    expect(slider).toHaveValue("120");
    expect(screen.getByText("120")).toBeInTheDocument();
  });

  it("keeps decimal steps free of floating-point noise", () => {
    render(<Slider label="Opacity" min={0} max={1} step={0.1} defaultValue={0.3} />);
    expect(screen.getByRole("slider")).toHaveValue("0.3");
    expect(screen.getByText("0.3")).toBeInTheDocument();
  });

  it("describes the slider with its helper text", () => {
    render(<Slider label="Volume" helperText="Applies to notification sounds." />);
    expect(screen.getByRole("slider")).toHaveAccessibleDescription(
      "Applies to notification sounds.",
    );
  });

  it("marks the field disabled", () => {
    const { container } = render(<Slider label="Log retention" defaultValue={7} disabled />);
    expect(screen.getByRole("slider")).toBeDisabled();
    expect(container.firstChild).toHaveClass("shelf-field--disabled");
  });

  it("applies the sm size", () => {
    const { container } = render(<Slider label="Volume" size="sm" />);
    expect(container.firstChild).toHaveClass("shelf-slider--sm");
  });

  it("forwards the ref and native attributes to the input, className and style to the wrapper", () => {
    const ref = createRef();
    const { container } = render(
      <Slider
        ref={ref}
        id="volume"
        name="volume"
        label="Volume"
        className="custom"
        style={{ maxWidth: 320 }}
        data-testid="volume-input"
      />,
    );

    const slider = screen.getByRole("slider");
    expect(ref.current).toBe(slider);
    expect(slider).toHaveAttribute("id", "volume");
    expect(slider).toHaveAttribute("name", "volume");
    expect(slider).toHaveAttribute("data-testid", "volume-input");
    expect(container.firstChild).toHaveClass("shelf-slider", "custom");
    expect(container.firstChild).toHaveStyle({ maxWidth: "320px" });
  });
});
