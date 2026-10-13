import { act, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { StrictMode, createRef, useRef, useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { Input } from "../Input/Input.jsx";
import { Modal } from "../Modal/Modal.jsx";
import { AlertDialog } from "./AlertDialog.jsx";

function deferred() {
  let resolve;
  let reject;
  const promise = new Promise((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}

function Harness({ onClose, ...props }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button onClick={() => setOpen(true)}>Delete product</button>
      <AlertDialog
        open={open}
        onClose={() => {
          onClose?.();
          setOpen(false);
        }}
        title="Delete “Cotton Kurta – Blue”?"
        description="The product and its 3 variants will be removed from your store."
        confirmLabel="Delete product"
        {...props}
      />
    </>
  );
}

async function openHarness(props = {}) {
  const user = userEvent.setup();
  render(<Harness {...props} />);
  await user.click(screen.getByRole("button", { name: "Delete product" }));
  return user;
}

// The trigger has the same name as the confirm button, so look inside the dialog.
const getConfirmIn = () =>
  within(screen.getByRole("alertdialog")).getByRole("button", { name: "Delete product" });

describe("AlertDialog", () => {
  it("renders nothing while closed", () => {
    render(<AlertDialog open={false} onClose={vi.fn()} title="Hidden" />);
    expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument();
  });

  it("renders a modal alertdialog named by its title and described by its description", async () => {
    await openHarness();

    const dialog = screen.getByRole("alertdialog", { name: "Delete “Cotton Kurta – Blue”?" });
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(dialog).toHaveAccessibleDescription(
      "The product and its 3 variants will be removed from your store.",
    );
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent("Cotton Kurta");
  });

  it("has no description reference without a description", () => {
    render(<AlertDialog open onClose={vi.fn()} title="Sign out?" />);
    expect(screen.getByRole("alertdialog")).not.toHaveAttribute("aria-describedby");
  });

  it("moves focus to Cancel, the least destructive action, when it opens", async () => {
    await openHarness();
    expect(screen.getByRole("button", { name: "Cancel" })).toHaveFocus();
  });

  it("focuses initialFocusRef instead when provided", () => {
    function WithInitialFocus() {
      const inputRef = useRef(null);
      return (
        <AlertDialog open onClose={vi.fn()} title="Delete store?" initialFocusRef={inputRef}>
          <Input ref={inputRef} label="Type DELETE to confirm" />
        </AlertDialog>
      );
    }
    render(<WithInitialFocus />);
    expect(screen.getByLabelText("Type DELETE to confirm")).toHaveFocus();
  });

  it("traps Tab and Shift+Tab inside the dialog", async () => {
    const user = await openHarness({ children: <Input label="Reason" /> });
    const cancel = screen.getByRole("button", { name: "Cancel" });
    const confirm = getConfirmIn();
    const input = screen.getByLabelText("Reason");

    expect(cancel).toHaveFocus();
    await user.tab();
    expect(confirm).toHaveFocus();
    await user.tab();
    expect(input).toHaveFocus();
    await user.tab({ shift: true });
    expect(confirm).toHaveFocus();
  });

  it("closes from Cancel and returns focus to the trigger", async () => {
    const onClose = vi.fn();
    const user = await openHarness({ onClose });

    await user.click(screen.getByRole("button", { name: "Cancel" }));
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Delete product" })).toHaveFocus();
  });

  it("closes on Escape, unless closeOnEscape is false", async () => {
    const user = await openHarness();
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Delete product" })).toHaveFocus();

    const onClose = vi.fn();
    render(<AlertDialog open onClose={onClose} title="Stay" closeOnEscape={false} />);
    await user.keyboard("{Escape}");
    expect(onClose).not.toHaveBeenCalled();
  });

  it("keeps a surrounding Modal open on Escape even when closeOnEscape is false", async () => {
    const closeModal = vi.fn();
    const closeDialog = vi.fn();
    const user = userEvent.setup();
    const tree = (dialogOpen) => (
      <Modal open onClose={closeModal} title="Edit product">
        <AlertDialog
          open={dialogOpen}
          onClose={closeDialog}
          title="Discard changes?"
          closeOnEscape={false}
        />
      </Modal>
    );
    const { rerender } = render(tree(false));
    rerender(tree(true));
    expect(screen.getByRole("alertdialog")).toContainElement(document.activeElement);

    await user.keyboard("{Escape}");
    expect(closeDialog).not.toHaveBeenCalled();
    expect(closeModal).not.toHaveBeenCalled();
  });

  it("keeps an outer handler from seeing the Escape it handled", async () => {
    const outer = vi.fn();
    const user = userEvent.setup();
    render(
      <div onKeyDown={outer}>
        <AlertDialog open onClose={vi.fn()} title="Nested" />
      </div>,
    );
    await user.keyboard("{Escape}");
    expect(outer).not.toHaveBeenCalled();
  });

  it("ignores overlay clicks by default and closes on them with closeOnOverlayClick", async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    const { rerender } = render(<AlertDialog open onClose={onClose} title="Delete?" />);

    const overlay = screen.getByRole("alertdialog").parentElement;
    if (!overlay) throw new Error("overlay not found");
    await user.click(overlay);
    expect(onClose).not.toHaveBeenCalled();

    rerender(<AlertDialog open onClose={onClose} title="Delete?" closeOnOverlayClick />);
    await user.click(screen.getByText("Delete?"));
    expect(onClose).not.toHaveBeenCalled();
    await user.click(screen.getByRole("alertdialog").parentElement);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("calls onConfirm and then closes", async () => {
    const onConfirm = vi.fn();
    const onClose = vi.fn();
    const user = await openHarness({ onConfirm, onClose });

    await user.click(getConfirmIn());
    expect(onConfirm).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(onConfirm.mock.invocationCallOrder[0]).toBeLessThan(onClose.mock.invocationCallOrder[0]);
    expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument();
  });

  it("stays open after confirming when closeOnConfirm is false", async () => {
    const onConfirm = vi.fn();
    const onClose = vi.fn();
    const user = userEvent.setup();
    render(
      <AlertDialog
        open
        onClose={onClose}
        onConfirm={onConfirm}
        closeOnConfirm={false}
        title="Mark as shipped?"
        confirmLabel="Mark shipped"
      />,
    );

    await user.click(screen.getByRole("button", { name: "Mark shipped" }));
    expect(onConfirm).toHaveBeenCalledTimes(1);
    expect(onClose).not.toHaveBeenCalled();
  });

  it("shows a loading state while onConfirm's promise is pending, then closes when it resolves", async () => {
    const request = deferred();
    const onClose = vi.fn();
    const user = await openHarness({ onConfirm: () => request.promise, onClose });

    const confirm = getConfirmIn();
    await user.click(confirm);

    const dialog = screen.getByRole("alertdialog");
    expect(dialog).toHaveAttribute("aria-busy", "true");
    expect(confirm).toHaveAttribute("aria-busy", "true");
    expect(confirm).toHaveFocus();
    expect(screen.getByRole("button", { name: "Cancel" })).toHaveAttribute("aria-disabled", "true");

    // Neither Escape nor a second click does anything while it's busy.
    await user.keyboard("{Escape}");
    await user.click(confirm);
    expect(onClose).not.toHaveBeenCalled();
    expect(dialog).toBeInTheDocument();

    await act(async () => request.resolve());
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument();
  });

  it("stays open and re-enables its buttons when onConfirm's promise rejects, without swallowing the error", async () => {
    const processRef = globalThis.process;
    const savedListeners = processRef.listeners("unhandledRejection");
    const unhandled = [];
    const capture = (reason) => unhandled.push(reason);
    processRef.removeAllListeners("unhandledRejection");
    processRef.on("unhandledRejection", capture);

    try {
      const request = deferred();
      const onClose = vi.fn();
      const user = await openHarness({ onConfirm: () => request.promise, onClose });
      const confirm = getConfirmIn();
      await user.click(confirm);

      const error = new Error("Network error");
      await act(async () => request.reject(error));

      expect(screen.getByRole("alertdialog")).not.toHaveAttribute("aria-busy");
      expect(confirm).not.toHaveAttribute("aria-busy");
      expect(screen.getByRole("button", { name: "Cancel" })).not.toHaveAttribute("aria-disabled");
      expect(onClose).not.toHaveBeenCalled();
      await waitFor(() => expect(unhandled).toEqual([error]));
    } finally {
      processRef.off("unhandledRejection", capture);
      for (const listener of savedListeners) processRef.on("unhandledRejection", listener);
    }
  });

  it("doesn't call onClose after the promise resolves if the dialog was already closed", async () => {
    const request = deferred();
    const onClose = vi.fn();
    const { rerender } = render(
      <AlertDialog open onClose={onClose} onConfirm={() => request.promise} title="Delete?" />,
    );
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: "Confirm" }));

    rerender(
      <AlertDialog
        open={false}
        onClose={onClose}
        onConfirm={() => request.promise}
        title="Delete?"
      />,
    );
    await act(async () => request.resolve());
    expect(onClose).not.toHaveBeenCalled();
  });

  it("supports a controlled loading state", async () => {
    const onConfirm = vi.fn();
    const onClose = vi.fn();
    const user = userEvent.setup();
    render(<AlertDialog open loading onClose={onClose} onConfirm={onConfirm} title="Delete?" />);

    const confirm = screen.getByRole("button", { name: "Confirm" });
    expect(confirm).toHaveAttribute("aria-busy", "true");
    expect(screen.getByRole("button", { name: "Cancel" })).toHaveAttribute("aria-disabled", "true");

    await user.click(confirm);
    await user.click(screen.getByRole("button", { name: "Cancel" }));
    await user.keyboard("{Escape}");
    expect(onConfirm).not.toHaveBeenCalled();
    expect(onClose).not.toHaveBeenCalled();
  });

  it("keeps focus on Cancel when loading starts", () => {
    const { rerender } = render(<AlertDialog open onClose={vi.fn()} title="Delete?" />);
    const cancel = screen.getByRole("button", { name: "Cancel" });
    expect(cancel).toHaveFocus();

    rerender(<AlertDialog open loading onClose={vi.fn()} title="Delete?" />);
    expect(cancel).toHaveFocus();
    expect(cancel).toBeEnabled();
  });

  it("disables the confirm button with confirmDisabled", async () => {
    const onConfirm = vi.fn();
    const user = userEvent.setup();
    render(
      <AlertDialog open onClose={vi.fn()} onConfirm={onConfirm} title="Delete?" confirmDisabled />,
    );

    const confirm = screen.getByRole("button", { name: "Confirm" });
    expect(confirm).toBeDisabled();
    await user.click(confirm);
    expect(onConfirm).not.toHaveBeenCalled();
  });

  it("uses custom button labels", () => {
    render(
      <AlertDialog
        open
        onClose={vi.fn()}
        title="Cancel order #1042?"
        confirmLabel="Cancel order"
        cancelLabel="Keep order"
      />,
    );
    expect(screen.getByRole("button", { name: "Cancel order" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Keep order" })).toHaveFocus();
  });

  it("styles the confirm button and icon by variant", () => {
    const { rerender } = render(<AlertDialog open onClose={vi.fn()} title="Delete?" />);
    const dialog = screen.getByRole("alertdialog");
    expect(dialog).toHaveClass("shelf-modal", "shelf-modal--sm", "shelf-alert-dialog--danger");
    expect(screen.getByRole("button", { name: "Confirm" })).toHaveClass("shelf-button--danger");
    expect(dialog.querySelector(".shelf-alert-dialog__icon")).toHaveAttribute(
      "aria-hidden",
      "true",
    );

    rerender(<AlertDialog open onClose={vi.fn()} title="Publish?" variant="primary" size="md" />);
    expect(dialog).toHaveClass("shelf-alert-dialog--primary", "shelf-modal--md");
    expect(screen.getByRole("button", { name: "Confirm" })).toHaveClass("shelf-button--primary");
  });

  it("renders a custom icon, or none with icon={null}", () => {
    const { rerender } = render(
      <AlertDialog open onClose={vi.fn()} title="Delete?" icon={<span data-testid="bin" />} />,
    );
    expect(screen.getByTestId("bin")).toBeInTheDocument();

    rerender(<AlertDialog open onClose={vi.fn()} title="Delete?" icon={null} />);
    expect(screen.getByRole("alertdialog").querySelector(".shelf-alert-dialog__icon")).toBeNull();
  });

  it("renders extra content below the description", () => {
    render(
      <AlertDialog open onClose={vi.fn()} title="Cancel order?">
        <Input label="Reason" />
      </AlertDialog>,
    );
    expect(screen.getByLabelText("Reason").closest(".shelf-alert-dialog__extra")).not.toBeNull();
  });

  it("forwards the ref, className and other props to the dialog panel", () => {
    const ref = createRef();
    render(
      <AlertDialog
        ref={ref}
        open
        onClose={vi.fn()}
        title="Delete?"
        className="custom"
        data-testid="panel"
      />,
    );
    const dialog = screen.getByRole("alertdialog");
    expect(ref.current).toBe(dialog);
    expect(dialog).toHaveClass("shelf-alert-dialog", "custom");
    expect(dialog).toHaveAttribute("data-testid", "panel");
  });

  it("locks page scroll while open and restores focus on close, also under StrictMode", async () => {
    const user = userEvent.setup();
    render(
      <StrictMode>
        <Harness />
      </StrictMode>,
    );
    await user.click(screen.getByRole("button", { name: "Delete product" }));
    expect(document.body.style.overflow).toBe("hidden");
    expect(screen.getByRole("button", { name: "Cancel" })).toHaveFocus();

    await user.keyboard("{Escape}");
    expect(document.body.style.overflow).toBe("");
    expect(screen.getByRole("button", { name: "Delete product" })).toHaveFocus();
  });
});
