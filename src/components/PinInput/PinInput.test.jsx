import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef, useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { PinInput } from "./PinInput.jsx";

const boxes = () => screen.getAllByRole("textbox");
const box = (number, of = 6) => screen.getByRole("textbox", { name: `Digit ${number} of ${of}` });
const values = () => boxes().map((input) => input.value);

describe("PinInput", () => {
  it("renders a labelled group of boxes", () => {
    const { container } = render(<PinInput label="Enter OTP" />);

    const group = screen.getByRole("group", { name: "Enter OTP" });
    expect(boxes()).toHaveLength(6);
    expect(group).toContainElement(box(1));
    expect(box(1)).toHaveAttribute("inputmode", "numeric");
    expect(box(1)).toHaveAttribute("autocomplete", "one-time-code");
    expect(box(2)).toHaveAttribute("autocomplete", "off");
    expect(container.firstChild).toHaveClass("cps-field", "cps-field--md", "cps-pin-input-field");
  });

  it("keeps only the box that takes the next character in the Tab order", async () => {
    const user = userEvent.setup();
    render(<PinInput label="Enter OTP" defaultValue="12" />);

    expect(box(3)).toHaveAttribute("tabindex", "0");
    expect(boxes().filter((input) => input.tabIndex === 0)).toHaveLength(1);

    await user.tab();
    expect(box(3)).toHaveFocus();
  });

  it("fills the boxes while typing and calls onComplete once all are filled", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    const onComplete = vi.fn();
    render(
      <PinInput
        label="Enter OTP"
        length={4}
        onValueChange={onValueChange}
        onComplete={onComplete}
      />,
    );

    await user.click(box(1, 4));
    await user.keyboard("12");
    expect(values()).toEqual(["1", "2", "", ""]);
    expect(box(3, 4)).toHaveFocus();
    expect(onComplete).not.toHaveBeenCalled();

    await user.keyboard("34");
    expect(onValueChange.mock.calls.map(([code]) => code)).toEqual(["1", "12", "123", "1234"]);
    expect(onComplete).toHaveBeenCalledTimes(1);
    expect(onComplete).toHaveBeenCalledWith("1234");
    expect(box(4, 4)).toHaveFocus();
  });

  it("ignores characters that aren't allowed", async () => {
    const user = userEvent.setup();
    render(<PinInput label="Enter OTP" length={4} />);

    await user.click(box(1, 4));
    await user.keyboard("a1 -b2");
    expect(values()).toEqual(["1", "2", "", ""]);
  });

  it("accepts letters and digits with type alphanumeric", async () => {
    const user = userEvent.setup();
    render(<PinInput label="Order verification code" type="alphanumeric" length={5} />);

    const first = screen.getByRole("textbox", { name: "Character 1 of 5" });
    expect(first).toHaveAttribute("inputmode", "text");
    await user.click(first);
    await user.keyboard("A7k-9!Q");
    expect(values()).toEqual(["A", "7", "k", "9", "Q"]);
  });

  it("clears with Backspace, moving back from an empty box", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<PinInput label="Enter OTP" defaultValue="1234" onValueChange={onValueChange} />);

    await user.click(box(5));
    // Box 5 is empty: Backspace clears box 4 and moves there.
    expect(box(5)).toHaveFocus();
    await user.keyboard("{Backspace}");
    expect(values()).toEqual(["1", "2", "3", "", "", ""]);
    expect(box(4)).toHaveFocus();

    await user.keyboard("{Backspace}{Backspace}");
    expect(values()).toEqual(["1", "", "", "", "", ""]);
    expect(box(2)).toHaveFocus();
    expect(onValueChange).toHaveBeenLastCalledWith("1");
  });

  it("clears a filled box with Backspace or Delete, shifting the rest back", async () => {
    const user = userEvent.setup();
    render(<PinInput label="Enter OTP" defaultValue="123456" />);

    await user.click(box(6));
    await user.keyboard("{Backspace}");
    expect(values().join("")).toBe("12345");
    expect(box(6)).toHaveFocus();

    await user.click(box(2));
    await user.keyboard("{Delete}");
    expect(values()).toEqual(["1", "3", "4", "5", "", ""]);
    expect(box(2)).toHaveFocus();
  });

  it("replaces the character of a filled box, even with the same character", async () => {
    const user = userEvent.setup();
    const onComplete = vi.fn();
    render(<PinInput label="Enter OTP" defaultValue="123456" onComplete={onComplete} />);

    await user.click(box(3));
    await user.keyboard("9");
    expect(values().join("")).toBe("129456");
    expect(box(4)).toHaveFocus();
    // The code changed and is still complete.
    expect(onComplete).toHaveBeenCalledWith("129456");

    await user.keyboard("4");
    expect(values().join("")).toBe("129456");
    expect(box(5)).toHaveFocus();
  });

  it("moves between filled boxes with the arrow keys, Home and End", async () => {
    const user = userEvent.setup();
    render(<PinInput label="Enter OTP" defaultValue="123" />);

    await user.click(box(2));
    await user.keyboard("{ArrowLeft}");
    expect(box(1)).toHaveFocus();
    await user.keyboard("{ArrowLeft}");
    expect(box(1)).toHaveFocus();

    await user.keyboard("{ArrowRight}{ArrowRight}{ArrowRight}");
    expect(box(4)).toHaveFocus();
    // Box 5 is empty and not reachable yet.
    await user.keyboard("{ArrowRight}");
    expect(box(4)).toHaveFocus();

    await user.keyboard("{Home}");
    expect(box(1)).toHaveFocus();
    await user.keyboard("{End}");
    expect(box(4)).toHaveFocus();
  });

  it("sends focus back to the next box to fill when an empty box further on is clicked", async () => {
    const user = userEvent.setup();
    render(<PinInput label="Enter OTP" defaultValue="1" />);

    await user.click(box(5));
    expect(box(2)).toHaveFocus();
  });

  it("distributes a pasted code, keeping only allowed characters", async () => {
    const user = userEvent.setup();
    const onComplete = vi.fn();
    render(<PinInput label="Enter OTP" onComplete={onComplete} />);

    await user.click(box(1));
    await user.paste("482 913");
    expect(values()).toEqual(["4", "8", "2", "9", "1", "3"]);
    expect(onComplete).toHaveBeenCalledWith("482913");
    expect(box(6)).toHaveFocus();
  });

  it("pastes a full code from the first box, and a partial one from the focused box", async () => {
    const user = userEvent.setup();
    render(<PinInput label="Enter OTP" defaultValue="111111" />);

    await user.click(box(3));
    await user.paste("99");
    expect(values().join("")).toBe("119911");
    expect(box(5)).toHaveFocus();

    await user.paste("246810");
    expect(values().join("")).toBe("246810");
  });

  it("distributes an SMS code autofilled into the first box", () => {
    const onComplete = vi.fn();
    render(<PinInput label="Enter OTP" onComplete={onComplete} />);

    fireEvent.change(box(1), { target: { value: "730215" } });
    expect(values()).toEqual(["7", "3", "0", "2", "1", "5"]);
    expect(onComplete).toHaveBeenCalledWith("730215");
  });

  it("keeps a whole code autofilled over a filled first box", () => {
    const onComplete = vi.fn();
    const { unmount } = render(
      <PinInput label="Enter OTP" defaultValue="1" onComplete={onComplete} />,
    );

    // The code starts with the digit already in the box.
    fireEvent.change(box(1), { target: { value: "123456" } });
    expect(values().join("")).toBe("123456");
    expect(onComplete).toHaveBeenLastCalledWith("123456");
    unmount();

    // The code ends with it.
    render(<PinInput label="Enter OTP" defaultValue="1" />);
    fireEvent.change(box(1), { target: { value: "654321" } });
    expect(values().join("")).toBe("654321");

    // Inserted next to the old digit (caret before or after it), the old digit is dropped.
    fireEvent.change(box(1), { target: { value: "6987654" } });
    expect(values().join("")).toBe("987654");
    fireEvent.change(box(1), { target: { value: "1234569" } });
    expect(values().join("")).toBe("123456");
  });

  it("handles input from virtual keyboards without key events", () => {
    render(<PinInput label="Enter OTP" defaultValue="12" />);

    fireEvent.change(box(3), { target: { value: "5" } });
    expect(values().join("")).toBe("125");
    expect(box(4)).toHaveFocus();

    // A filled box whose text becomes "58" (caret after the old character) takes the new one.
    fireEvent.change(box(3), { target: { value: "58" } });
    expect(values().join("")).toBe("128");

    fireEvent.change(box(3), { target: { value: "" } });
    expect(values().join("")).toBe("12");

    fireEvent.change(box(2), { target: { value: "x" } });
    expect(values().join("")).toBe("12");
  });

  it("supports controlled usage", async () => {
    const user = userEvent.setup();
    function Verify() {
      const [code, setCode] = useState("");
      return (
        <>
          <PinInput label="Enter OTP" length={4} value={code} onValueChange={setCode} />
          <button type="button" onClick={() => setCode("")}>
            Clear
          </button>
          <output>{code}</output>
        </>
      );
    }
    render(<Verify />);

    await user.click(box(1, 4));
    await user.keyboard("5678");
    expect(screen.getByRole("status")).toHaveTextContent("5678");

    await user.click(screen.getByRole("button", { name: "Clear" }));
    expect(values()).toEqual(["", "", "", ""]);
    expect(box(1, 4)).toHaveAttribute("tabindex", "0");
  });

  it("drops invalid characters from a controlled value", () => {
    render(<PinInput label="Enter OTP" length={4} value="1a2b345" onValueChange={() => {}} />);
    expect(values()).toEqual(["1", "2", "3", "4"]);
  });

  it("masks the characters", () => {
    render(<PinInput label="UPI PIN" length={4} mask defaultValue="12" />);
    const inputs = document.querySelectorAll(".cps-pin-input__box");
    expect(inputs).toHaveLength(4);
    for (const input of inputs) expect(input).toHaveAttribute("type", "password");
  });

  it("shows a placeholder in each box and uses custom box labels", () => {
    render(
      <PinInput
        label="Enter OTP"
        length={4}
        placeholder="○"
        getInputLabel={(index, length) => `OTP digit ${index + 1} of ${length}`}
      />,
    );
    const first = screen.getByRole("textbox", { name: "OTP digit 1 of 4" });
    expect(first).toHaveAttribute("placeholder", "○");
  });

  it("describes the boxes with helper text, or the error instead", () => {
    const { container, rerender } = render(
      <PinInput label="Enter OTP" helperText="Sent to +91 98XXX XX210" />,
    );
    expect(box(1)).toHaveAccessibleDescription("Sent to +91 98XXX XX210");

    rerender(<PinInput label="Enter OTP" helperText="Sent to +91 98XXX XX210" error="Wrong OTP" />);
    for (const input of boxes()) {
      expect(input).toHaveAttribute("aria-invalid", "true");
      expect(input).toHaveAccessibleDescription("Wrong OTP");
    }
    expect(container.firstChild).toHaveClass("cps-field--invalid");
  });

  it("disables every box", () => {
    const { container } = render(<PinInput label="Enter OTP" disabled />);
    for (const input of boxes()) expect(input).toBeDisabled();
    expect(container.firstChild).toHaveClass("cps-field--disabled");
  });

  it("focuses the next box to fill with autoFocus, and via the label", async () => {
    const user = userEvent.setup();
    render(<PinInput label="Enter OTP" defaultValue="12" autoFocus />);
    expect(box(3)).toHaveFocus();

    box(1).blur();
    await user.click(screen.getByText("Enter OTP"));
    expect(box(3)).toHaveFocus();
  });

  it("submits the code through a hidden input and resets with the form", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <form>
        <PinInput label="Enter OTP" name="otp" length={4} defaultValue="12" required />
        <button type="reset">Reset</button>
      </form>,
    );
    const form = container.querySelector("form");
    expect(new FormData(form).get("otp")).toBe("12");
    for (const input of boxes()) expect(input).toBeRequired();

    await user.click(box(3, 4));
    await user.keyboard("34");
    expect(new FormData(form).get("otp")).toBe("1234");

    await user.click(screen.getByRole("button", { name: "Reset" }));
    expect(values()).toEqual(["1", "2", "", ""]);
    expect(new FormData(form).get("otp")).toBe("12");
  });

  it("forwards the ref to the first box, props to the group, className and style to the wrapper", () => {
    const ref = createRef();
    const { container } = render(
      <PinInput
        ref={ref}
        id="otp"
        aria-label="One-time password"
        size="lg"
        className="custom"
        style={{ maxWidth: 320 }}
        data-testid="otp-group"
      />,
    );

    expect(ref.current).toBe(box(1));
    expect(box(1)).toHaveAttribute("id", "otp");
    expect(box(2)).toHaveAttribute("id", "otp-2");
    const group = screen.getByRole("group", { name: "One-time password" });
    expect(group).toHaveAttribute("data-testid", "otp-group");
    expect(container.firstChild).toHaveClass("custom", "cps-field--lg");
    expect(container.firstChild).toHaveStyle({ maxWidth: "320px" });

    ref.current.focus();
    expect(box(1)).toHaveFocus();
  });
});
