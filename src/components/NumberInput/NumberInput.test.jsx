import { act, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef, useState } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { NumberInput } from "./NumberInput.jsx";

const spinbutton = () => screen.getByRole("spinbutton");
const increase = () => screen.getByRole("button", { name: "Increase" });
const decrease = () => screen.getByRole("button", { name: "Decrease" });

afterEach(() => {
  vi.useRealTimers();
});

describe("NumberInput", () => {
  it("renders a labelled spinbutton with its range", () => {
    const { container } = render(
      <NumberInput label="Quantity" min={1} max={10} defaultValue={2} />,
    );

    const input = screen.getByRole("spinbutton", { name: "Quantity" });
    expect(input).toHaveAttribute("type", "text");
    expect(input).toHaveAttribute("inputmode", "numeric");
    expect(input).toHaveValue("2");
    expect(input).toHaveAttribute("aria-valuenow", "2");
    expect(input).toHaveAttribute("aria-valuemin", "1");
    expect(input).toHaveAttribute("aria-valuemax", "10");
    expect(input).not.toHaveAttribute("aria-invalid");
    expect(container.firstChild).toHaveClass(
      "shelf-field",
      "shelf-field--md",
      "shelf-number-input-field",
    );
  });

  it("starts empty by default, without aria-valuenow", () => {
    render(<NumberInput label="Discount" />);
    expect(spinbutton()).toHaveValue("");
    expect(spinbutton()).not.toHaveAttribute("aria-valuenow");
    expect(spinbutton()).not.toHaveAttribute("aria-valuemin");
  });

  it("keeps the − and + buttons out of the Tab order", async () => {
    const user = userEvent.setup();
    render(
      <>
        <NumberInput label="Quantity" defaultValue={1} />
        <button type="button">Next</button>
      </>,
    );

    expect(decrease()).toHaveAttribute("tabindex", "-1");
    expect(increase()).toHaveAttribute("tabindex", "-1");
    expect(increase()).toHaveAttribute("aria-controls", spinbutton().id);

    await user.tab();
    expect(spinbutton()).toHaveFocus();
    await user.tab();
    expect(screen.getByRole("button", { name: "Next" })).toHaveFocus();
  });

  it("steps with the arrow keys, Page Up / Page Down, Home and End", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <NumberInput
        label="Quantity"
        min={1}
        max={50}
        defaultValue={5}
        onValueChange={onValueChange}
      />,
    );

    await user.click(spinbutton());
    await user.keyboard("{ArrowUp}");
    expect(spinbutton()).toHaveValue("6");
    expect(onValueChange).toHaveBeenLastCalledWith(6);

    await user.keyboard("{ArrowDown}{ArrowDown}");
    expect(spinbutton()).toHaveValue("4");

    await user.keyboard("{PageUp}");
    expect(spinbutton()).toHaveValue("14");

    await user.keyboard("{PageDown}{PageDown}");
    expect(spinbutton()).toHaveValue("1");

    await user.keyboard("{End}");
    expect(spinbutton()).toHaveValue("50");
    expect(spinbutton()).toHaveAttribute("aria-valuenow", "50");

    await user.keyboard("{Home}");
    expect(spinbutton()).toHaveValue("1");
  });

  it("clamps stepping to the range and disables the button at each limit", async () => {
    const user = userEvent.setup();
    render(<NumberInput label="Quantity" min={1} max={3} defaultValue={2} />);

    expect(decrease()).toBeEnabled();
    await user.click(increase());
    expect(spinbutton()).toHaveValue("3");
    expect(increase()).toBeDisabled();

    await user.click(spinbutton());
    await user.keyboard("{ArrowUp}{PageUp}");
    expect(spinbutton()).toHaveValue("3");

    await user.keyboard("{PageDown}");
    expect(spinbutton()).toHaveValue("1");
    expect(decrease()).toBeDisabled();
    expect(increase()).toBeEnabled();
  });

  it("uses a custom step and large step, without floating-point noise", async () => {
    const user = userEvent.setup();
    render(<NumberInput label="Weight (kg)" min={0} step={0.1} largeStep={1} defaultValue={0.1} />);

    expect(spinbutton()).toHaveAttribute("inputmode", "decimal");
    await user.click(increase());
    await user.click(increase());
    expect(spinbutton()).toHaveValue("0.3");

    await user.click(spinbutton());
    await user.keyboard("{PageUp}");
    expect(spinbutton()).toHaveValue("1.3");
  });

  it("starts stepping from zero when empty, clamped to the range", async () => {
    const user = userEvent.setup();
    const { unmount } = render(<NumberInput label="Quantity" min={1} max={10} />);
    await user.click(increase());
    expect(spinbutton()).toHaveValue("1");
    unmount();

    render(<NumberInput label="Temperature" />);
    await user.click(decrease());
    expect(spinbutton()).toHaveValue("-1");
  });

  it("accepts typed numbers and ignores invalid characters", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<NumberInput label="Quantity" min={1} max={100} onValueChange={onValueChange} />);

    await user.type(spinbutton(), "1a2-.");
    expect(spinbutton()).toHaveValue("12");
    expect(onValueChange.mock.calls).toEqual([[1], [12]]);
    expect(spinbutton()).toHaveAttribute("aria-valuenow", "12");
  });

  it("allows a minus sign only when the range includes negative numbers", async () => {
    const user = userEvent.setup();
    render(<NumberInput label="Adjust stock" min={-50} max={50} />);

    await user.type(spinbutton(), "-7");
    expect(spinbutton()).toHaveValue("-7");
  });

  it("keeps an incomplete number while typing and restores the value on blur", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<NumberInput label="Price" precision={2} onValueChange={onValueChange} />);

    await user.type(spinbutton(), "4.");
    expect(spinbutton()).toHaveValue("4.");
    expect(onValueChange).toHaveBeenLastCalledWith(4);

    await user.tab();
    expect(spinbutton()).toHaveValue("4");
  });

  it("clamps and rounds a typed value on blur and on Enter", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <NumberInput
        label="Quantity"
        min={1}
        max={10}
        defaultValue={2}
        onValueChange={onValueChange}
      />,
    );

    await user.clear(spinbutton());
    await user.type(spinbutton(), "25");
    // Out of range while typing: the field is marked invalid until it's committed.
    expect(spinbutton()).toHaveAttribute("aria-invalid", "true");
    await user.keyboard("{Enter}");
    expect(spinbutton()).toHaveValue("10");
    expect(onValueChange).toHaveBeenLastCalledWith(10);
    expect(spinbutton()).not.toHaveAttribute("aria-invalid");

    await user.clear(spinbutton());
    await user.type(spinbutton(), "0");
    await user.tab();
    expect(spinbutton()).toHaveValue("1");
  });

  it("keeps an out-of-range value with clampOnBlur={false}", async () => {
    const user = userEvent.setup();
    render(<NumberInput label="Quantity" max={10} clampOnBlur={false} />);

    await user.type(spinbutton(), "12");
    await user.tab();
    expect(spinbutton()).toHaveValue("12");
    expect(spinbutton()).toHaveAttribute("aria-invalid", "true");
  });

  it("reports null when cleared, or restores the value with allowEmpty={false}", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    const { unmount } = render(
      <NumberInput label="Quantity" defaultValue={3} onValueChange={onValueChange} />,
    );
    await user.clear(spinbutton());
    expect(onValueChange).toHaveBeenLastCalledWith(null);
    expect(spinbutton()).not.toHaveAttribute("aria-valuenow");
    unmount();

    const onRequiredChange = vi.fn();
    render(
      <NumberInput
        label="Quantity"
        defaultValue={3}
        allowEmpty={false}
        onValueChange={onRequiredChange}
      />,
    );
    await user.clear(spinbutton());
    expect(spinbutton()).toHaveValue("");
    await user.tab();
    expect(spinbutton()).toHaveValue("3");
    expect(onRequiredChange).not.toHaveBeenCalled();
  });

  it("keeps the full keyboard, with its minus key, when negative numbers are allowed", () => {
    const { rerender } = render(<NumberInput label="Temperature" />);
    expect(spinbutton()).not.toHaveAttribute("inputmode");

    rerender(<NumberInput label="Temperature" min={-20} max={40} step={0.5} />);
    expect(spinbutton()).not.toHaveAttribute("inputmode");

    rerender(<NumberInput label="Temperature" min={0} />);
    expect(spinbutton()).toHaveAttribute("inputmode", "numeric");

    rerender(<NumberInput label="Temperature" min={0} step={0.5} />);
    expect(spinbutton()).toHaveAttribute("inputmode", "decimal");
  });

  it("edits very small and very large values as plain decimals, never in exponent notation", async () => {
    const user = userEvent.setup();
    render(
      <>
        <NumberInput label="Rate" step={0.0000001} defaultValue={0.0000005} />
        <NumberInput label="Total" value={1e21} />
      </>,
    );
    const rate = screen.getByRole("spinbutton", { name: "Rate" });
    const total = screen.getByRole("spinbutton", { name: "Total" });
    expect(rate).toHaveValue("0.0000005");
    expect(total).toHaveValue("1000000000000000000000");

    await user.click(rate);
    await user.keyboard("{End}1");
    expect(rate).toHaveValue("0.00000051");
    expect(rate).toHaveAttribute("aria-valuenow", "5.1e-7");
  });

  it("does not allow a decimal point when the precision is 0", async () => {
    const user = userEvent.setup();
    render(<NumberInput label="Quantity" />);
    await user.type(spinbutton(), "2.5");
    expect(spinbutton()).toHaveValue("25");
  });

  it("rounds to the precision on blur", async () => {
    const user = userEvent.setup();
    render(<NumberInput label="Price" step={0.05} />);
    await user.type(spinbutton(), "12.345");
    await user.tab();
    expect(spinbutton()).toHaveValue("12.35");
  });

  it("shows formatValue while not focused, the raw number while editing, and sets aria-valuetext", async () => {
    const user = userEvent.setup();
    render(
      <NumberInput
        label="Selling price"
        defaultValue={1299}
        step={50}
        formatValue={(value) => `₹${value.toLocaleString("en-IN")}`}
      />,
    );

    expect(spinbutton()).toHaveValue("₹1,299");
    expect(spinbutton()).toHaveAttribute("aria-valuetext", "₹1,299");

    await user.click(spinbutton());
    expect(spinbutton()).toHaveValue("1299");
    await user.keyboard("{ArrowUp}");
    expect(spinbutton()).toHaveValue("1349");
    expect(spinbutton()).toHaveAttribute("aria-valuetext", "₹1,349");

    await user.tab();
    expect(spinbutton()).toHaveValue("₹1,349");
  });

  it("does not change on mouse wheel", () => {
    render(<NumberInput label="Quantity" defaultValue={4} />);
    fireEvent.wheel(spinbutton(), { deltaY: -100 });
    fireEvent.wheel(spinbutton(), { deltaY: 100 });
    expect(spinbutton()).toHaveValue("4");
  });

  it("supports controlled usage", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    const { rerender } = render(
      <NumberInput label="Quantity" value={2} onValueChange={onValueChange} />,
    );

    await user.click(increase());
    expect(onValueChange).toHaveBeenCalledWith(3);
    // The parent did not update `value`.
    expect(spinbutton()).toHaveValue("2");

    rerender(<NumberInput label="Quantity" value={7} onValueChange={onValueChange} />);
    expect(spinbutton()).toHaveValue("7");

    rerender(<NumberInput label="Quantity" value={null} onValueChange={onValueChange} />);
    expect(spinbutton()).toHaveValue("");
  });

  it("works as a controlled field with state", async () => {
    const user = userEvent.setup();
    function Cart() {
      const [quantity, setQuantity] = useState(1);
      return (
        <>
          <NumberInput label="Quantity" min={1} value={quantity} onValueChange={setQuantity} />
          <output>₹{quantity * 499}</output>
        </>
      );
    }
    render(<Cart />);

    await user.click(increase());
    await user.click(increase());
    expect(screen.getByRole("status")).toHaveTextContent("₹1497");
  });

  it("repeats while a button is held and stops on release", () => {
    vi.useFakeTimers();
    const onValueChange = vi.fn();
    render(<NumberInput label="Quantity" defaultValue={1} onValueChange={onValueChange} />);

    fireEvent.pointerDown(increase(), { button: 0 });
    act(() => vi.advanceTimersByTime(399));
    expect(onValueChange).not.toHaveBeenCalled();

    act(() => vi.advanceTimersByTime(75 * 3 + 1));
    expect(spinbutton()).toHaveValue("4");

    fireEvent.pointerUp(window);
    // The click that ends the hold doesn't add another step.
    fireEvent.click(increase());
    act(() => vi.advanceTimersByTime(1000));
    expect(spinbutton()).toHaveValue("4");

    // A plain click still steps once.
    fireEvent.pointerDown(increase(), { button: 0 });
    fireEvent.pointerUp(window);
    fireEvent.click(increase());
    expect(spinbutton()).toHaveValue("5");
  });

  it("stops repeating at a limit and when unmounted", () => {
    vi.useFakeTimers();
    const { unmount } = render(<NumberInput label="Quantity" max={3} defaultValue={1} />);

    fireEvent.pointerDown(increase(), { button: 0 });
    act(() => vi.advanceTimersByTime(2000));
    expect(spinbutton()).toHaveValue("3");
    expect(increase()).toBeDisabled();
    expect(vi.getTimerCount()).toBe(0);

    fireEvent.pointerDown(decrease(), { button: 0 });
    unmount();
    expect(vi.getTimerCount()).toBe(0);
  });

  it("does not step when disabled or read-only", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    const { container, rerender } = render(
      <NumberInput label="Quantity" defaultValue={2} disabled onValueChange={onValueChange} />,
    );

    expect(spinbutton()).toBeDisabled();
    expect(increase()).toBeDisabled();
    expect(decrease()).toBeDisabled();
    expect(container.firstChild).toHaveClass("shelf-field--disabled");

    rerender(
      <NumberInput label="Quantity" defaultValue={2} readOnly onValueChange={onValueChange} />,
    );
    expect(spinbutton()).toHaveAttribute("readonly");
    expect(increase()).toBeDisabled();
    await user.click(spinbutton());
    await user.keyboard("{ArrowUp}{End}");
    expect(spinbutton()).toHaveValue("2");
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it("describes the input with helper text, or the error instead", () => {
    const { rerender } = render(<NumberInput label="Quantity" helperText="Maximum 10 per order" />);
    expect(spinbutton()).toHaveAccessibleDescription("Maximum 10 per order");

    rerender(
      <NumberInput
        label="Quantity"
        helperText="Maximum 10 per order"
        error="Only 3 left in stock"
      />,
    );
    expect(spinbutton()).toHaveAttribute("aria-invalid", "true");
    expect(spinbutton()).toHaveAccessibleDescription("Only 3 left in stock");
    expect(screen.queryByText("Maximum 10 per order")).not.toBeInTheDocument();
  });

  it("marks required fields natively, with the asterisk hidden from the name", () => {
    render(<NumberInput label="Quantity" required />);
    expect(screen.getByRole("spinbutton", { name: "Quantity" })).toBeRequired();
  });

  it("submits the number through a hidden input and resets with the form", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    const { container } = render(
      <form>
        <NumberInput
          label="Price"
          name="price"
          defaultValue={1299}
          formatValue={(value) => `₹${value.toLocaleString("en-IN")}`}
          onValueChange={onValueChange}
        />
        <button type="reset">Reset</button>
      </form>,
    );
    const form = container.querySelector("form");

    expect(spinbutton()).not.toHaveAttribute("name");
    expect(new FormData(form).get("price")).toBe("1299");

    await user.click(spinbutton());
    await user.keyboard("{ArrowUp}");
    expect(new FormData(form).get("price")).toBe("1300");

    await user.click(screen.getByRole("button", { name: "Reset" }));
    expect(spinbutton()).toHaveValue("₹1,299");
    expect(new FormData(form).get("price")).toBe("1299");
    expect(onValueChange).toHaveBeenLastCalledWith(1299);
  });

  it("submits an empty string when empty and nothing when disabled", () => {
    const { container, rerender } = render(
      <form>
        <NumberInput label="Quantity" name="quantity" />
      </form>,
    );
    const form = container.querySelector("form");
    expect(new FormData(form).get("quantity")).toBe("");

    rerender(
      <form>
        <NumberInput label="Quantity" name="quantity" defaultValue={2} disabled />
      </form>,
    );
    expect(new FormData(form).has("quantity")).toBe(false);
  });

  it("renders the compact variant as − value +", () => {
    const { container } = render(
      <NumberInput aria-label="Quantity" variant="compact" size="sm" defaultValue={1} />,
    );

    expect(container.firstChild).toHaveClass(
      "shelf-number-input-field--compact",
      "shelf-field--sm",
    );
    const box = container.querySelector(".shelf-number-input");
    expect(box).toHaveClass("shelf-number-input--compact");
    const [first, , last] = box.children;
    expect(first).toBe(decrease());
    expect(last).toBe(increase());
    expect(screen.getByRole("spinbutton", { name: "Quantity" })).toBeInTheDocument();
  });

  it("uses custom button labels", () => {
    render(
      <NumberInput
        label="Quantity"
        decrementLabel="Remove one"
        incrementLabel="Add one"
        defaultValue={1}
      />,
    );
    expect(screen.getByRole("button", { name: "Remove one" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Add one" })).toBeInTheDocument();
  });

  it("forwards the ref and native attributes to the input, className and style to the wrapper", () => {
    const ref = createRef();
    const onKeyDown = vi.fn();
    const { container } = render(
      <NumberInput
        ref={ref}
        id="qty"
        label="Quantity"
        placeholder="0"
        className="custom"
        style={{ maxWidth: 200 }}
        inputClassName="custom-input"
        data-testid="qty-input"
        onKeyDown={onKeyDown}
      />,
    );

    const input = spinbutton();
    expect(ref.current).toBe(input);
    expect(input).toHaveAttribute("id", "qty");
    expect(input).toHaveAttribute("placeholder", "0");
    expect(input).toHaveAttribute("data-testid", "qty-input");
    expect(input).toHaveClass("shelf-number-input__control", "custom-input");
    expect(input).not.toHaveAttribute("size");
    expect(container.firstChild).toHaveClass("custom");
    expect(container.firstChild).toHaveStyle({ maxWidth: "200px" });

    fireEvent.keyDown(input, { key: "ArrowUp" });
    expect(onKeyDown).toHaveBeenCalledTimes(1);
    expect(input).toHaveValue("1");
  });

  it("lets a consumer's onKeyDown prevent stepping", () => {
    render(
      <NumberInput
        label="Quantity"
        defaultValue={1}
        onKeyDown={(event) => event.preventDefault()}
      />,
    );
    fireEvent.keyDown(spinbutton(), { key: "ArrowUp" });
    expect(spinbutton()).toHaveValue("1");
  });
});
