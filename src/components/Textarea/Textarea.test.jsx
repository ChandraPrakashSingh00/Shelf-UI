import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { StrictMode, createRef } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Textarea } from "./Textarea.jsx";

// jsdom has no layout. Fake one for textareas: 20px per line, 8px of padding
// top and bottom, 1px borders, 78px (3 rows) at `height: auto`, and an optional
// max-height.
function mockTextareaLayout({ maxHeight = Infinity } = {}) {
  const scrollHeight = vi
    .spyOn(Element.prototype, "scrollHeight", "get")
    .mockImplementation(function () {
      return this instanceof HTMLTextAreaElement ? this.value.split("\n").length * 20 + 16 : 0;
    });
  vi.spyOn(HTMLElement.prototype, "offsetHeight", "get").mockImplementation(function () {
    const height = Number.parseFloat(this.style.height);
    return Math.min(Number.isNaN(height) ? 78 : height, maxHeight);
  });
  vi.spyOn(Element.prototype, "clientHeight", "get").mockImplementation(function () {
    return this.offsetHeight - 2;
  });
  return { scrollHeight };
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("Textarea", () => {
  it("renders a labelled multi-line text field with three rows by default", () => {
    render(<Textarea label="Project description" placeholder="What are you building?" />);

    const textarea = screen.getByRole("textbox", { name: "Project description" });
    expect(textarea.tagName).toBe("TEXTAREA");
    expect(textarea).toHaveAttribute("rows", "3");
    expect(textarea).toHaveAttribute("placeholder", "What are you building?");
    expect(textarea).not.toHaveAttribute("aria-invalid");
  });

  it("exposes helper text as the accessible description", () => {
    render(<Textarea label="Bio" helperText="Shown on your public profile." />);
    expect(screen.getByLabelText("Bio")).toHaveAccessibleDescription(
      "Shown on your public profile.",
    );
  });

  it("marks the textarea invalid and describes it with the error, replacing helper text", () => {
    render(<Textarea label="Feedback" helperText="Be specific." error="Feedback is required." />);

    const textarea = screen.getByLabelText("Feedback");
    expect(textarea).toHaveAttribute("aria-invalid", "true");
    expect(textarea).toHaveAccessibleDescription("Feedback is required.");
    expect(screen.queryByText("Be specific.")).not.toBeInTheDocument();
  });

  it("supports error={true} to mark the field invalid without a message", () => {
    render(<Textarea label="Notes" error />);
    const textarea = screen.getByLabelText("Notes");
    expect(textarea).toHaveAttribute("aria-invalid", "true");
    expect(textarea).not.toHaveAccessibleDescription();
  });

  it("marks required textareas natively without adding the asterisk to the name", () => {
    render(<Textarea label="Message" required />);
    expect(screen.getByRole("textbox", { name: "Message" })).toBeRequired();
  });

  it("counts characters while uncontrolled, with or without a maximum", async () => {
    const user = userEvent.setup();
    render(
      <>
        <Textarea label="Deployment note" showCount maxLength={140} defaultValue="Hi" />
        <Textarea label="Release notes" showCount />
      </>,
    );

    const note = screen.getByLabelText("Deployment note");
    expect(note).toHaveAttribute("maxlength", "140");
    expect(note).toHaveAccessibleDescription("2 / 140");
    await user.type(note, " team");
    expect(note).toHaveAccessibleDescription("7 / 140");

    const releaseNotes = screen.getByLabelText("Release notes");
    expect(releaseNotes).toHaveAccessibleDescription("0 characters");
    await user.type(releaseNotes, "a");
    expect(releaseNotes).toHaveAccessibleDescription("1 character");
  });

  it("counts a controlled value and flags one longer than maxLength", () => {
    const { rerender } = render(
      <Textarea label="Bio" showCount maxLength={10} value="Hello" onChange={() => {}} />,
    );
    expect(screen.getByText("5 / 10")).not.toHaveClass("cps-textarea__count--over");

    rerender(
      <Textarea label="Bio" showCount maxLength={10} value="Hello, CodeCPS" onChange={() => {}} />,
    );
    expect(screen.getByText("14 / 10")).toHaveClass("cps-textarea__count--over");
  });

  it("keeps a consumer-provided aria-describedby alongside the message and the count", () => {
    render(
      <>
        <span id="external-hint">Visible to your whole team</span>
        <Textarea
          id="summary"
          label="Summary"
          helperText="Markdown is supported."
          showCount
          aria-describedby="external-hint"
        />
      </>,
    );

    const textarea = screen.getByLabelText("Summary");
    expect(textarea).toHaveAttribute(
      "aria-describedby",
      "external-hint summary-message summary-count",
    );
    expect(textarea).toHaveAccessibleDescription(
      "Visible to your whole team Markdown is supported. 0 characters",
    );
  });

  it("resets the count along with its form", async () => {
    const user = userEvent.setup();
    render(
      <form>
        <Textarea label="Message" showCount maxLength={280} />
        <button type="reset">Clear</button>
      </form>,
    );

    const textarea = screen.getByLabelText("Message");
    await user.type(textarea, "Ship it");
    expect(textarea).toHaveAccessibleDescription("7 / 280");

    await user.click(screen.getByRole("button", { name: "Clear" }));
    expect(textarea).toHaveValue("");
    await waitFor(() => expect(textarea).toHaveAccessibleDescription("0 / 280"));
  });

  it("accepts typing, reports changes and can't be edited when disabled", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <>
        <Textarea label="Notes" onChange={onChange} />
        <Textarea label="Plan details" disabled defaultValue="Enterprise" />
      </>,
    );

    const notes = screen.getByLabelText("Notes");
    await user.type(notes, "Hi");
    expect(notes).toHaveValue("Hi");
    expect(onChange).toHaveBeenCalledTimes(2);

    const planDetails = screen.getByLabelText("Plan details");
    expect(planDetails).toBeDisabled();
    await user.type(planDetails, "x");
    expect(planDetails).toHaveValue("Enterprise");
  });

  it("applies size and resize classes without leaking a native size attribute", () => {
    const { container, rerender } = render(<Textarea label="Notes" size="lg" />);

    const textarea = screen.getByLabelText("Notes");
    expect(container.firstChild).toHaveClass("cps-field", "cps-field--lg");
    expect(textarea).toHaveClass("cps-textarea", "cps-textarea--resize-vertical");
    expect(textarea).not.toHaveAttribute("size");

    rerender(<Textarea label="Notes" resize="none" />);
    expect(container.firstChild).toHaveClass("cps-field--md");
    expect(textarea).toHaveClass("cps-textarea--resize-none");
  });

  it("grows and shrinks with its content when autoResize is set", async () => {
    mockTextareaLayout();
    const user = userEvent.setup();
    render(<Textarea label="Commit message" autoResize rows={1} />);

    const textarea = screen.getByLabelText("Commit message");
    expect(textarea).toHaveClass("cps-textarea--auto-resize");
    expect(textarea).not.toHaveClass("cps-textarea--resize-vertical");
    // One line: 20px of text + 16px of padding + 2px of borders.
    expect(textarea.style.height).toBe("38px");

    await user.type(textarea, "Fix build cache{Enter}{Enter}Keys include the lockfile.");
    expect(textarea.style.height).toBe("78px");

    await user.clear(textarea);
    expect(textarea.style.height).toBe("38px");
  });

  it("follows a controlled value and scrolls once a max-height stops it", () => {
    mockTextareaLayout({ maxHeight: 60 });
    const { rerender } = render(
      <Textarea label="Notes" autoResize value="One line" onChange={() => {}} />,
    );

    const textarea = screen.getByLabelText("Notes");
    expect(textarea.style.height).toBe("38px");
    expect(textarea.style.overflowY).toBe("");

    rerender(
      <Textarea label="Notes" autoResize value={"One\nTwo\nThree\nFour"} onChange={() => {}} />,
    );
    expect(textarea.style.height).toBe("98px");
    expect(textarea.style.overflowY).toBe("auto");
  });

  it("fits again when its width changes", () => {
    const { scrollHeight } = mockTextareaLayout();
    let width = 320;
    vi.spyOn(HTMLElement.prototype, "offsetWidth", "get").mockImplementation(() => width);
    let notifyResize;
    vi.stubGlobal(
      "ResizeObserver",
      class {
        constructor(callback) {
          notifyResize = callback;
        }
        observe() {}
        disconnect() {}
      },
    );
    vi.stubGlobal("requestAnimationFrame", (callback) => {
      callback();
      return 1;
    });
    vi.stubGlobal("cancelAnimationFrame", () => {});

    render(<Textarea label="Notes" autoResize defaultValue="A sentence that wraps when narrow" />);
    const textarea = screen.getByLabelText("Notes");
    expect(textarea.style.height).toBe("38px");

    // Same width (e.g. only the height changed): nothing to do.
    scrollHeight.mockReturnValue(56);
    notifyResize([]);
    expect(textarea.style.height).toBe("38px");

    // Narrower: the same text now wraps onto two lines.
    width = 160;
    notifyResize([]);
    expect(textarea.style.height).toBe("58px");
  });

  it("hands the height back to rows when autoResize is turned off", () => {
    mockTextareaLayout();
    const { rerender } = render(<Textarea label="Notes" autoResize defaultValue="Hello" />);

    const textarea = screen.getByLabelText("Notes");
    expect(textarea.style.height).toBe("38px");

    rerender(<Textarea label="Notes" defaultValue="Hello" />);
    expect(textarea.style.height).toBe("");
    expect(textarea).toHaveClass("cps-textarea--resize-vertical");
  });

  it("stays fitted under StrictMode's simulated remount", () => {
    mockTextareaLayout();
    render(
      <StrictMode>
        <Textarea label="Notes" autoResize defaultValue={"One\nTwo"} />
      </StrictMode>,
    );
    expect(screen.getByLabelText("Notes").style.height).toBe("58px");
  });

  it("forwards the ref and native attributes to the textarea, and className and style to the wrapper", () => {
    const ref = createRef();
    const { container } = render(
      <Textarea
        ref={ref}
        id="bio"
        name="bio"
        label="Bio"
        className="custom-field"
        style={{ maxWidth: 400 }}
        textareaClassName="custom-textarea"
        data-testid="bio-textarea"
      />,
    );

    const textarea = screen.getByLabelText("Bio");
    expect(ref.current).toBe(textarea);
    expect(textarea).toHaveAttribute("id", "bio");
    expect(textarea).toHaveAttribute("name", "bio");
    expect(textarea).toHaveAttribute("data-testid", "bio-textarea");
    expect(textarea).toHaveClass("cps-textarea", "custom-textarea");
    expect(container.firstChild).toHaveClass("cps-field", "custom-field");
    expect(container.firstChild).toHaveStyle({ maxWidth: "400px" });
  });
});
