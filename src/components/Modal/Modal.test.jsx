import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { StrictMode, useRef, useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { Button } from "../Button/Button.jsx";
import { Input } from "../Input/Input.jsx";
import { Modal } from "./Modal.jsx";

function ModalHarness({ children, ...props }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button onClick={() => setOpen(true)}>Open modal</button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Delete project"
        description="This action cannot be undone."
        footer={
          <>
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger">Delete</Button>
          </>
        }
        {...props}
      >
        {children ?? <Input label="Project name" />}
      </Modal>
    </>
  );
}

async function openHarness(props = {}) {
  const user = userEvent.setup();
  render(<ModalHarness {...props} />);
  await user.click(screen.getByRole("button", { name: "Open modal" }));
  return user;
}

describe("Modal", () => {
  it("renders nothing while closed", () => {
    render(<Modal open={false} onClose={vi.fn()} title="Hidden" />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("renders an accessible modal dialog named by its title and described by its description", async () => {
    await openHarness();

    const dialog = screen.getByRole("dialog", { name: "Delete project" });
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(dialog).toHaveAccessibleDescription("This action cannot be undone.");
    expect(screen.getByRole("heading", { name: "Delete project" })).toBeInTheDocument();
  });

  it("moves focus to the first focusable element when opened", async () => {
    await openHarness();
    expect(screen.getByRole("button", { name: "Close" })).toHaveFocus();
  });

  it("focuses initialFocusRef when provided", async () => {
    function WithInitialFocus() {
      const inputRef = useRef(null);
      return (
        <Modal open onClose={vi.fn()} title="Rename" initialFocusRef={inputRef}>
          <Input ref={inputRef} label="New name" />
        </Modal>
      );
    }
    render(<WithInitialFocus />);
    expect(screen.getByLabelText("New name")).toHaveFocus();
  });

  it("keeps focus on an autoFocus field, also under StrictMode, and still restores focus on close", async () => {
    const user = userEvent.setup();
    render(
      <StrictMode>
        <ModalHarness>
          <Input label="Project name" autoFocus />
        </ModalHarness>
      </StrictMode>,
    );
    await user.click(screen.getByRole("button", { name: "Open modal" }));
    expect(screen.getByLabelText("Project name")).toHaveFocus();

    await user.keyboard("{Escape}");
    expect(screen.getByRole("button", { name: "Open modal" })).toHaveFocus();
  });

  it("traps Tab and Shift+Tab inside the dialog", async () => {
    const user = await openHarness();
    const close = screen.getByRole("button", { name: "Close" });
    const input = screen.getByLabelText("Project name");
    const cancel = screen.getByRole("button", { name: "Cancel" });
    const confirm = screen.getByRole("button", { name: "Delete" });

    await user.tab();
    expect(input).toHaveFocus();
    await user.tab();
    expect(cancel).toHaveFocus();
    await user.tab();
    expect(confirm).toHaveFocus();
    await user.tab();
    expect(close).toHaveFocus();
    await user.tab({ shift: true });
    expect(confirm).toHaveFocus();
  });

  it("closes on Escape and returns focus to the trigger", async () => {
    const user = await openHarness();
    await user.keyboard("{Escape}");

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Open modal" })).toHaveFocus();
  });

  it("ignores Escape when closeOnEscape is false", async () => {
    const user = await openHarness({ closeOnEscape: false });
    await user.keyboard("{Escape}");
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("closes on overlay click but not on clicks inside the dialog", async () => {
    const user = await openHarness();

    await user.click(screen.getByText("This action cannot be undone."));
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    const overlay = screen.getByRole("dialog").parentElement;
    if (!overlay) throw new Error("overlay not found");
    await user.click(overlay);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("stays open on overlay click when closeOnOverlayClick is false", async () => {
    const user = await openHarness({ closeOnOverlayClick: false });
    const overlay = screen.getByRole("dialog").parentElement;
    if (!overlay) throw new Error("overlay not found");

    await user.click(overlay);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("closes from the close button, which can be hidden", async () => {
    const user = await openHarness();
    await user.click(screen.getByRole("button", { name: "Close" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    render(<Modal open onClose={vi.fn()} title="No close button" hideCloseButton />);
    expect(screen.queryByRole("button", { name: "Close" })).not.toBeInTheDocument();
  });

  it("locks page scroll while open and restores it on close", async () => {
    const user = await openHarness();
    expect(document.body.style.overflow).toBe("hidden");

    await user.keyboard("{Escape}");
    expect(document.body.style.overflow).toBe("");
  });
});
