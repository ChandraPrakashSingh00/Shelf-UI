import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef, useRef, useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { Button } from "../Button/Button.jsx";
import { Input } from "../Input/Input.jsx";
import { Drawer } from "./Drawer.jsx";

function DrawerHarness({ children, ...props }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button onClick={() => setOpen(true)}>Open filters</button>
      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        title="Filter deployments"
        description="Show only the deployments you care about."
        footer={
          <>
            <Button variant="ghost">Reset</Button>
            <Button onClick={() => setOpen(false)}>Apply</Button>
          </>
        }
        {...props}
      >
        {children ?? <Input label="Branch" />}
      </Drawer>
    </>
  );
}

async function openHarness(props = {}) {
  const user = userEvent.setup();
  render(<DrawerHarness {...props} />);
  await user.click(screen.getByRole("button", { name: "Open filters" }));
  return user;
}

const overlayOf = (dialog) => {
  const overlay = dialog.parentElement;
  if (!overlay) throw new Error("overlay not found");
  return overlay;
};

describe("Drawer", () => {
  it("renders nothing while closed", () => {
    render(<Drawer open={false} onClose={vi.fn()} title="Hidden" />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("renders an accessible modal dialog named by its title and described by its description", async () => {
    await openHarness();

    const dialog = screen.getByRole("dialog", { name: "Filter deployments" });
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(dialog).toHaveAccessibleDescription("Show only the deployments you care about.");
    expect(screen.getByRole("heading", { name: "Filter deployments" })).toBeInTheDocument();
    expect(overlayOf(dialog)).toHaveClass("cps-drawer-overlay");
    expect(overlayOf(dialog).parentElement).toBe(document.body);
  });

  it("slides in from the right at the medium size by default", () => {
    render(<Drawer open onClose={vi.fn()} title="Details" />);
    expect(screen.getByRole("dialog")).toHaveClass(
      "cps-drawer",
      "cps-drawer--right",
      "cps-drawer--md",
    );
  });

  it.each([
    ["left", "sm"],
    ["right", "lg"],
    ["bottom", "md"],
  ])("applies the %s side and %s size", (side, size) => {
    render(<Drawer open onClose={vi.fn()} title="Details" side={side} size={size} />);
    expect(screen.getByRole("dialog")).toHaveClass(`cps-drawer--${side}`, `cps-drawer--${size}`);
  });

  it("moves focus to the first focusable element when opened", async () => {
    await openHarness();
    expect(screen.getByRole("button", { name: "Close" })).toHaveFocus();
  });

  it("focuses initialFocusRef when provided", () => {
    function WithInitialFocus() {
      const inputRef = useRef(null);
      return (
        <Drawer open onClose={vi.fn()} title="Rename" initialFocusRef={inputRef}>
          <Input ref={inputRef} label="Project name" />
        </Drawer>
      );
    }
    render(<WithInitialFocus />);
    expect(screen.getByLabelText("Project name")).toHaveFocus();
  });

  it("traps Tab and Shift+Tab inside the drawer", async () => {
    const user = await openHarness();
    const close = screen.getByRole("button", { name: "Close" });

    await user.tab();
    expect(screen.getByLabelText("Branch")).toHaveFocus();
    await user.tab();
    expect(screen.getByRole("button", { name: "Reset" })).toHaveFocus();
    await user.tab();
    expect(screen.getByRole("button", { name: "Apply" })).toHaveFocus();
    await user.tab();
    expect(close).toHaveFocus();
    await user.tab({ shift: true });
    expect(screen.getByRole("button", { name: "Apply" })).toHaveFocus();
  });

  it("closes on Escape, returns focus to the trigger and keeps Escape from reaching outer handlers", async () => {
    const user = userEvent.setup();
    const onOuterKeyDown = vi.fn();
    render(
      <div onKeyDown={onOuterKeyDown}>
        <DrawerHarness />
      </div>,
    );
    await user.click(screen.getByRole("button", { name: "Open filters" }));
    await user.keyboard("{Escape}");

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Open filters" })).toHaveFocus();
    expect(onOuterKeyDown).not.toHaveBeenCalled();
  });

  it("ignores Escape when closeOnEscape is false", async () => {
    const user = await openHarness({ closeOnEscape: false });
    await user.keyboard("{Escape}");
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("runs the consumer's onKeyDown first, which can prevent closing", async () => {
    const onKeyDown = vi.fn((event) => event.preventDefault());
    const user = await openHarness({ onKeyDown });
    await user.keyboard("{Escape}");

    expect(onKeyDown).toHaveBeenCalled();
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("closes on overlay click, but not on clicks inside or presses that started inside", async () => {
    const user = await openHarness();
    const dialog = screen.getByRole("dialog");

    await user.click(screen.getByText("Show only the deployments you care about."));
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    // Selecting text inside the drawer and releasing over the overlay.
    fireEvent.mouseDown(dialog);
    fireEvent.click(overlayOf(dialog));
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    await user.click(overlayOf(dialog));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("stays open on overlay click when closeOnOverlayClick is false", async () => {
    const user = await openHarness({ closeOnOverlayClick: false });
    await user.click(overlayOf(screen.getByRole("dialog")));
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("closes from the close button, which can be renamed or hidden", async () => {
    const user = await openHarness({ closeLabel: "Close filters" });
    await user.click(screen.getByRole("button", { name: "Close filters" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    render(<Drawer open onClose={vi.fn()} title="No close button" hideCloseButton />);
    expect(screen.queryByRole("button", { name: "Close" })).not.toBeInTheDocument();
  });

  it("locks page scroll while open and restores it on close", async () => {
    const user = await openHarness();
    expect(document.body.style.overflow).toBe("hidden");

    await user.keyboard("{Escape}");
    expect(document.body.style.overflow).toBe("");
  });

  it("forwards the ref to the panel and passes className and other props to it", () => {
    const ref = createRef();
    render(
      <Drawer
        ref={ref}
        open
        onClose={vi.fn()}
        aria-label="Project navigation"
        className="custom"
        data-testid="drawer"
        hideCloseButton
      >
        Links
      </Drawer>,
    );

    const dialog = screen.getByRole("dialog", { name: "Project navigation" });
    expect(ref.current).toBe(dialog);
    expect(dialog).toHaveClass("cps-drawer", "custom");
    expect(dialog).toHaveAttribute("data-testid", "drawer");
    expect(dialog).not.toHaveAttribute("aria-labelledby");
    expect(dialog.querySelector(".cps-drawer__header")).not.toBeInTheDocument();
    expect(dialog).toHaveTextContent("Links");
  });
});
