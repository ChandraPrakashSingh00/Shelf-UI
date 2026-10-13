import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { StrictMode, createRef, useRef, useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { Button } from "../Button/Button.jsx";
import { Input } from "../Input/Input.jsx";
import { Modal } from "../Modal/Modal.jsx";
import { Tooltip } from "../Tooltip/Tooltip.jsx";
import { Popover } from "./Popover.jsx";

const shareContent = (
  <>
    <Input label="Project link" defaultValue="https://example.com/p/storefront-web" readOnly />
    <Button>Copy link</Button>
  </>
);

function renderPopover(props = {}, children = shareContent) {
  const user = userEvent.setup();
  render(
    <>
      <Popover trigger={<Button>Share</Button>} title="Share project" {...props}>
        {children}
      </Popover>
      <button type="button">Outside</button>
      <p>Plain text</p>
    </>,
  );
  return { user, trigger: screen.getByRole("button", { name: "Share" }) };
}

describe("Popover", () => {
  it("renders a closed dialog trigger", () => {
    const { trigger } = renderPopover();
    expect(trigger).toHaveAttribute("aria-haspopup", "dialog");
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(trigger).not.toHaveAttribute("aria-controls");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("opens on click as a non-modal dialog named by its title, and moves focus inside", async () => {
    const { user, trigger } = renderPopover();
    await user.click(trigger);

    const dialog = screen.getByRole("dialog", { name: "Share project" });
    expect(dialog).not.toHaveAttribute("aria-modal");
    expect(screen.getByRole("heading", { name: "Share project" })).toBeInTheDocument();
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(trigger).toHaveAttribute("aria-controls", dialog.id);
    expect(screen.getByLabelText("Project link")).toHaveFocus();
  });

  it("renders right after the trigger, so Tab moves through it and on to the page", async () => {
    const { user, trigger } = renderPopover();
    await user.tab();
    await user.keyboard("{Enter}");

    const dialog = screen.getByRole("dialog");
    expect(trigger.nextElementSibling).toBe(dialog);
    expect(screen.getByLabelText("Project link")).toHaveFocus();

    await user.tab();
    expect(screen.getByRole("button", { name: "Copy link" })).toHaveFocus();

    // Focus leaving the popover closes it and stays where it went.
    await user.tab();
    expect(screen.getByRole("button", { name: "Outside" })).toHaveFocus();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("stays open when Shift+Tab returns to the trigger, where Escape closes it", async () => {
    const { user, trigger } = renderPopover();
    await user.click(trigger);

    await user.tab({ shift: true });
    expect(trigger).toHaveFocus();
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it("closes on Escape inside, returns focus to the trigger and keeps the key from outer handlers", async () => {
    const onOuterKeyDown = vi.fn();
    const user = userEvent.setup();
    render(
      <div onKeyDown={onOuterKeyDown}>
        <Popover trigger={<Button>Share</Button>} title="Share project">
          {shareContent}
        </Popover>
      </div>,
    );
    const trigger = screen.getByRole("button", { name: "Share" });
    await user.click(trigger);
    await user.keyboard("{Escape}");

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(trigger).toHaveFocus();
    expect(onOuterKeyDown).not.toHaveBeenCalled();
  });

  it("closes on a click outside without moving focus to the trigger", async () => {
    const { user, trigger } = renderPopover();

    await user.click(trigger);
    await user.click(screen.getByRole("button", { name: "Outside" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Outside" })).toHaveFocus();

    await user.click(trigger);
    await user.click(screen.getByText("Plain text"));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(trigger).not.toHaveFocus();
  });

  it("toggles from the trigger and keeps the trigger's own click handler", async () => {
    const onClick = vi.fn();
    const { user, trigger } = renderPopover({ trigger: <Button onClick={onClick}>Share</Button> });

    await user.click(trigger);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    await user.click(trigger);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(onClick).toHaveBeenCalledTimes(2);
  });

  it("has an optional close button that returns focus to the trigger", async () => {
    const { user, trigger } = renderPopover({ showCloseButton: true, closeLabel: "Dismiss" });
    await user.click(trigger);
    await user.click(screen.getByRole("button", { name: "Dismiss" }));

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it("focuses initialFocusRef, or the panel itself when it has nothing focusable", async () => {
    function WithInitialFocus() {
      const copyRef = useRef(null);
      return (
        <Popover trigger={<Button>Share</Button>} title="Share project" initialFocusRef={copyRef}>
          <Input
            label="Project link"
            defaultValue="https://example.com/p/storefront-web"
            readOnly
          />
          <Button ref={copyRef}>Copy link</Button>
        </Popover>
      );
    }
    const user = userEvent.setup();
    const { unmount } = render(<WithInitialFocus />);
    await user.click(screen.getByRole("button", { name: "Share" }));
    expect(screen.getByRole("button", { name: "Copy link" })).toHaveFocus();
    unmount();

    renderPopover({ title: undefined }, "Build minutes reset on the 1st of every month.");
    await user.click(screen.getByRole("button", { name: "Share" }));
    expect(screen.getByRole("dialog")).toHaveFocus();
  });

  it("is named by `label` without a title, and by its trigger without either", async () => {
    const { user } = renderPopover({ title: undefined, label: "Share options" });
    await user.click(screen.getByRole("button", { name: "Share" }));
    expect(screen.getByRole("dialog", { name: "Share options" })).toBeInTheDocument();

    render(
      <Popover trigger={<Button>Build minutes</Button>}>
        Build minutes reset on the 1st of every month.
      </Popover>,
    );
    await user.click(screen.getByRole("button", { name: "Build minutes" }));
    expect(screen.getByRole("dialog", { name: "Build minutes" })).toBeInTheDocument();
  });

  it("supports controlled usage", async () => {
    const onOpenChange = vi.fn();
    const user = userEvent.setup();
    const { rerender } = render(
      <Popover
        trigger={<Button>Share</Button>}
        title="Share project"
        open={false}
        onOpenChange={onOpenChange}
      >
        {shareContent}
      </Popover>,
    );
    const trigger = screen.getByRole("button", { name: "Share" });

    await user.click(trigger);
    expect(onOpenChange).toHaveBeenLastCalledWith(true);
    // The parent did not update `open`, so it stays closed.
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    rerender(
      <Popover
        trigger={<Button>Share</Button>}
        title="Share project"
        open
        onOpenChange={onOpenChange}
      >
        {shareContent}
      </Popover>,
    );
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByLabelText("Project link")).toHaveFocus();

    await user.keyboard("{Escape}");
    expect(onOpenChange).toHaveBeenLastCalledWith(false);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByLabelText("Project link")).toHaveFocus();
  });

  it("returns focus to the trigger when your own code closes it while focus is inside", async () => {
    function RenameProject() {
      const [open, setOpen] = useState(false);
      return (
        <Popover
          trigger={<Button>Rename</Button>}
          title="Rename project"
          open={open}
          onOpenChange={setOpen}
        >
          <Input label="Project name" defaultValue="storefront-web" />
          <Button onClick={() => setOpen(false)}>Save</Button>
        </Popover>
      );
    }
    const user = userEvent.setup();
    render(<RenameProject />);
    const trigger = screen.getByRole("button", { name: "Rename" });

    await user.click(trigger);
    await user.click(screen.getByRole("button", { name: "Save" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it("still returns focus on Escape after the parent ignored a click outside", async () => {
    function IgnoresFirstClose() {
      const [open, setOpen] = useState(false);
      const ignoredRef = useRef(false);
      const handleOpenChange = (next) => {
        if (!next && !ignoredRef.current) {
          ignoredRef.current = true;
          return;
        }
        setOpen(next);
      };
      return (
        <>
          <Popover
            trigger={<Button>Share</Button>}
            title="Share project"
            open={open}
            onOpenChange={handleOpenChange}
          >
            {shareContent}
          </Popover>
          <p>Plain text</p>
        </>
      );
    }
    const user = userEvent.setup();
    render(<IgnoresFirstClose />);
    const trigger = screen.getByRole("button", { name: "Share" });

    await user.click(trigger);
    await user.click(screen.getByText("Plain text"));
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    await user.click(screen.getByLabelText("Project link"));
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it("can start open, also under StrictMode, and keeps focus inside", () => {
    render(
      <StrictMode>
        <Popover trigger={<Button>Share</Button>} title="Share project" defaultOpen>
          {shareContent}
        </Popover>
      </StrictMode>,
    );
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByLabelText("Project link")).toHaveFocus();
  });

  it("applies side and align classes, and passes className, other props and the ref to the panel", async () => {
    const ref = createRef();
    const { user, trigger } = renderPopover({
      ref,
      side: "top",
      align: "end",
      className: "custom-popover",
      "data-testid": "share-panel",
    });
    await user.click(trigger);

    const dialog = screen.getByRole("dialog");
    expect(ref.current).toBe(dialog);
    expect(dialog).toHaveClass(
      "shelf-popover__content",
      "shelf-popover__content--top",
      "shelf-popover__content--end",
      "custom-popover",
    );
    expect(dialog).toHaveAttribute("data-testid", "share-panel");
    expect(dialog.parentElement).toHaveClass("shelf-popover");
    expect(dialog.parentElement).not.toHaveClass("custom-popover");
  });

  it("defaults to the bottom side and start alignment", async () => {
    const { user, trigger } = renderPopover();
    await user.click(trigger);
    expect(screen.getByRole("dialog")).toHaveClass(
      "shelf-popover__content--bottom",
      "shelf-popover__content--start",
    );
  });

  it("closes only itself on Escape inside a Modal", async () => {
    const user = userEvent.setup();
    render(
      <Modal open onClose={vi.fn()} title="Project settings">
        <Popover trigger={<Button>Share</Button>} title="Share project">
          {shareContent}
        </Popover>
      </Modal>,
    );
    const trigger = screen.getByRole("button", { name: "Share" });
    await user.click(trigger);
    await user.keyboard("{Escape}");

    expect(screen.queryByRole("dialog", { name: "Share project" })).not.toBeInTheDocument();
    expect(screen.getByRole("dialog", { name: "Project settings" })).toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it("accepts a Tooltip-wrapped trigger", async () => {
    const user = userEvent.setup();
    render(
      <Popover
        trigger={
          <Tooltip content="Share this project">
            <Button aria-label="Share">⤴</Button>
          </Tooltip>
        }
        title="Share project"
      >
        {shareContent}
      </Popover>,
    );
    const trigger = screen.getByRole("button", { name: "Share" });
    expect(trigger).toHaveAttribute("aria-haspopup", "dialog");

    await user.click(trigger);
    expect(screen.getByRole("dialog", { name: "Share project" })).toBeInTheDocument();
    expect(trigger).toHaveAttribute("aria-expanded", "true");
  });
});
