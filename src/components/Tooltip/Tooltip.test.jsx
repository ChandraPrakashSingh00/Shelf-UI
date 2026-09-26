import { act, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Button } from "../Button/Button.jsx";
import { Dropdown } from "../Dropdown/Dropdown.jsx";
import { Tooltip } from "./Tooltip.jsx";

// jsdom's `:focus-visible` heuristic keeps state from earlier tests, so stub it:
// the focused element matches, unless a test simulates focus from a click or tap.
let focusFromPointer = false;
beforeEach(() => {
  focusFromPointer = false;
  const matches = Element.prototype.matches;
  vi.spyOn(Element.prototype, "matches").mockImplementation(function (selector) {
    if (selector === ":focus-visible") return !focusFromPointer && this === document.activeElement;
    return matches.call(this, selector);
  });
});

function renderTooltip(props = {}) {
  const user = userEvent.setup();
  render(
    <>
      <Tooltip content="Copies the public link" {...props}>
        <Button aria-label="Copy link">⧉</Button>
      </Tooltip>
      <button type="button">Outside</button>
    </>,
  );
  return { user, trigger: screen.getByRole("button", { name: "Copy link" }) };
}

const advance = (ms) => act(() => vi.advanceTimersByTime(ms));

describe("Tooltip", () => {
  it("renders only its trigger while closed", () => {
    const { trigger } = renderTooltip();
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
    expect(trigger).not.toHaveAttribute("aria-describedby");
  });

  // Hover timing runs on fake timers, with pointer events from fireEvent:
  // user-event waits on real timers between actions.
  describe("on hover", () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });
    afterEach(() => {
      vi.useRealTimers();
    });

    it("opens after the delay and describes the trigger while open", () => {
      const { trigger } = renderTooltip();

      fireEvent.pointerOver(trigger);
      advance(299);
      expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();

      advance(1);
      const tooltip = screen.getByRole("tooltip");
      expect(tooltip).toHaveTextContent("Copies the public link");
      expect(trigger).toHaveAttribute("aria-describedby", tooltip.id);
      expect(trigger).toHaveAccessibleDescription("Copies the public link");
    });

    it("closes shortly after the pointer leaves, but stays open while the pointer is on the tooltip", () => {
      const { trigger } = renderTooltip({ delay: 0 });
      fireEvent.pointerOver(trigger);
      const tooltip = screen.getByRole("tooltip");

      // Moving from the trigger onto the tooltip keeps it open.
      fireEvent.pointerOut(trigger, { relatedTarget: tooltip });
      advance(1000);
      expect(tooltip).toBeInTheDocument();

      fireEvent.pointerOut(tooltip);
      advance(99);
      expect(screen.getByRole("tooltip")).toBeInTheDocument();
      advance(1);
      expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
      expect(trigger).not.toHaveAttribute("aria-describedby");
    });

    it("doesn't open when the pointer leaves before the delay", () => {
      const { trigger } = renderTooltip({ delay: 500 });
      fireEvent.pointerOver(trigger);
      advance(400);
      fireEvent.pointerOut(trigger);
      advance(1000);
      expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
    });

    it("ignores touch", () => {
      const { trigger } = renderTooltip({ delay: 0 });
      fireEvent.pointerOver(trigger, { pointerType: "touch" });
      advance(1000);
      expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
    });

    it("stays open while the trigger has keyboard focus, even when the pointer leaves", () => {
      const { trigger } = renderTooltip({ delay: 0 });
      act(() => trigger.focus());
      fireEvent.pointerOver(trigger);
      fireEvent.pointerOut(trigger);
      advance(1000);
      expect(screen.getByRole("tooltip")).toBeInTheDocument();
    });
  });

  it("opens immediately on keyboard focus and closes when focus moves away", async () => {
    const { user, trigger } = renderTooltip();

    await user.tab();
    expect(trigger).toHaveFocus();
    expect(screen.getByRole("tooltip")).toHaveTextContent("Copies the public link");

    await user.tab();
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
  });

  it("doesn't open when a click or tap focuses the trigger", () => {
    const { trigger } = renderTooltip();
    focusFromPointer = true;
    act(() => trigger.focus());
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
  });

  it("closes on Escape without moving focus, before any other Escape handler runs", async () => {
    const onKeyDown = vi.fn();
    const user = userEvent.setup();
    render(
      <div onKeyDown={onKeyDown}>
        <Tooltip content="Deploys the main branch">
          <Button>Deploy</Button>
        </Tooltip>
      </div>,
    );
    const trigger = screen.getByRole("button", { name: "Deploy" });

    await user.tab();
    expect(screen.getByRole("tooltip")).toBeInTheDocument();
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
    expect(onKeyDown).not.toHaveBeenCalled();

    // Once the tooltip is closed, Escape reaches the page again.
    await user.keyboard("{Escape}");
    expect(onKeyDown).toHaveBeenCalledTimes(1);
  });

  it("never opens when disabled", async () => {
    const { user } = renderTooltip({ disabled: true, defaultOpen: true });
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();

    await user.tab();
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
  });

  it("doesn't open with empty content", () => {
    render(
      <Tooltip content="">
        <button type="button">Rename</button>
      </Tooltip>,
    );
    const trigger = screen.getByRole("button", { name: "Rename" });
    act(() => trigger.focus());
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
    expect(trigger).not.toHaveAttribute("aria-describedby");
  });

  it("supports controlled usage", async () => {
    const onOpenChange = vi.fn();
    const user = userEvent.setup();
    const { rerender } = render(
      <Tooltip content="Last deployed 5 minutes ago" open={false} onOpenChange={onOpenChange}>
        <Button>Status</Button>
      </Tooltip>,
    );

    await user.tab();
    expect(onOpenChange).toHaveBeenLastCalledWith(true);
    // The parent did not update `open`, so it stays closed.
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();

    rerender(
      <Tooltip content="Last deployed 5 minutes ago" open onOpenChange={onOpenChange}>
        <Button>Status</Button>
      </Tooltip>,
    );
    expect(screen.getByRole("tooltip")).toBeInTheDocument();

    await user.keyboard("{Escape}");
    expect(onOpenChange).toHaveBeenLastCalledWith(false);
    expect(screen.getByRole("tooltip")).toBeInTheDocument();
  });

  it("can start open with defaultOpen", () => {
    renderTooltip({ defaultOpen: true });
    expect(screen.getByRole("tooltip")).toBeInTheDocument();
  });

  it("keeps the trigger's own ref, event handlers and description", async () => {
    const ref = createRef();
    const onFocus = vi.fn();
    const onBlur = vi.fn();
    const user = userEvent.setup();
    render(
      <>
        <p id="copy-hint">Anyone with the link can view the project.</p>
        <Tooltip content="Copy link">
          <button
            ref={ref}
            type="button"
            aria-describedby="copy-hint"
            onFocus={onFocus}
            onBlur={onBlur}
          >
            Copy
          </button>
        </Tooltip>
      </>,
    );
    const trigger = screen.getByRole("button", { name: "Copy" });
    expect(ref.current).toBe(trigger);

    await user.tab();
    expect(onFocus).toHaveBeenCalledTimes(1);
    const tooltip = screen.getByRole("tooltip");
    expect(trigger).toHaveAttribute("aria-describedby", `copy-hint ${tooltip.id}`);

    await user.tab();
    expect(onBlur).toHaveBeenCalledTimes(1);
    expect(trigger).toHaveAttribute("aria-describedby", "copy-hint");
  });

  it("lets the trigger's own handler cancel opening with preventDefault", async () => {
    const user = userEvent.setup();
    render(
      <Tooltip content="Copy link">
        <Button onFocus={(event) => event.preventDefault()}>Copy</Button>
      </Tooltip>,
    );
    await user.tab();
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
  });

  it("puts className on the bubble, in a portal, and passes other props and the ref to the trigger", () => {
    const ref = createRef();
    render(
      <Tooltip
        ref={ref}
        content="Deploys the main branch"
        className="custom-tooltip"
        defaultOpen
        id="deploy-button"
        data-testid="deploy"
      >
        <Button>Deploy</Button>
      </Tooltip>,
    );

    const trigger = screen.getByRole("button", { name: "Deploy" });
    expect(ref.current).toBe(trigger);
    expect(trigger).toHaveAttribute("id", "deploy-button");
    expect(trigger).toHaveAttribute("data-testid", "deploy");

    const tooltip = screen.getByRole("tooltip");
    expect(tooltip).toHaveClass("cps-tooltip", "custom-tooltip");
    expect(trigger).not.toHaveClass("custom-tooltip");
    expect(tooltip.parentElement).toBe(document.body);
  });

  it("sits above the trigger and flips below when there's no room, following the trigger on resize", () => {
    const triggerRect = { top: 300, left: 400, width: 32, height: 32 };
    vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(function () {
      return this.getAttribute("role") === "tooltip"
        ? { top: 0, left: 0, width: 120, height: 28 }
        : triggerRect;
    });
    renderTooltip({ defaultOpen: true });

    const tooltip = screen.getByRole("tooltip");
    expect(tooltip).toHaveAttribute("data-side", "top");
    expect(tooltip).toHaveStyle({ position: "fixed", top: "264px", left: "356px" });

    triggerRect.top = 4;
    act(() => window.dispatchEvent(new Event("resize")));
    expect(tooltip).toHaveAttribute("data-side", "bottom");
    expect(tooltip).toHaveStyle({ top: "44px", left: "356px" });
  });

  it("can be the trigger of a Dropdown", async () => {
    const user = userEvent.setup();
    render(
      <Dropdown
        trigger={
          <Tooltip content="More actions">
            <Button aria-label="More">⋯</Button>
          </Tooltip>
        }
        items={[
          { id: "rename", label: "Rename" },
          { id: "archive", label: "Archive" },
        ]}
      />,
    );
    const trigger = screen.getByRole("button", { name: "More" });
    expect(trigger).toHaveAttribute("aria-haspopup", "menu");

    await user.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("menuitem", { name: "Rename" })).toHaveFocus();
  });
});
