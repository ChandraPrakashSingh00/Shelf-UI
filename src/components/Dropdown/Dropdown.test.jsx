import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Button } from "../Button/Button.jsx";
import { Dropdown } from "./Dropdown.jsx";

const archive = vi.fn();

const items = [
  { id: "edit", label: "Edit" },
  { id: "duplicate", label: "Duplicate", disabled: true },
  { id: "archive", label: "Archive", onSelect: archive },
  { id: "delete", label: "Delete", danger: true },
];

function renderDropdown(props = {}) {
  const onSelect = vi.fn();
  const user = userEvent.setup();
  render(
    <>
      <Dropdown trigger={<Button>Actions</Button>} items={items} onSelect={onSelect} {...props} />
      <button>Outside</button>
    </>,
  );
  const trigger = screen.getByRole("button", { name: "Actions" });
  return { user, trigger, onSelect };
}

const menuItem = (name) => screen.getByRole("menuitem", { name });

describe("Dropdown", () => {
  it("renders a closed menu button", () => {
    const { trigger } = renderDropdown();
    expect(trigger).toHaveAttribute("aria-haspopup", "menu");
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  it("opens on click, is labelled by the trigger and focuses the first enabled item", async () => {
    const { user, trigger } = renderDropdown();
    await user.click(trigger);

    const menu = screen.getByRole("menu", { name: "Actions" });
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(trigger).toHaveAttribute("aria-controls", menu.id);
    expect(screen.getAllByRole("menuitem")).toHaveLength(4);
    expect(menuItem("Edit")).toHaveFocus();
  });

  it("uses the label prop as the menu name when given", async () => {
    const { user, trigger } = renderDropdown({ label: "Project actions" });
    await user.click(trigger);
    expect(screen.getByRole("menu", { name: "Project actions" })).toBeInTheDocument();
  });

  it("moves focus with arrow keys, Home and End, skipping disabled items and wrapping", async () => {
    const { user, trigger } = renderDropdown();
    await user.click(trigger);

    await user.keyboard("{ArrowDown}");
    expect(menuItem("Archive")).toHaveFocus();
    await user.keyboard("{ArrowDown}");
    expect(menuItem("Delete")).toHaveFocus();
    await user.keyboard("{ArrowDown}");
    expect(menuItem("Edit")).toHaveFocus();
    await user.keyboard("{ArrowUp}");
    expect(menuItem("Delete")).toHaveFocus();
    await user.keyboard("{Home}");
    expect(menuItem("Edit")).toHaveFocus();
    await user.keyboard("{End}");
    expect(menuItem("Delete")).toHaveFocus();
  });

  it("selects an item with Enter, closes and returns focus to the trigger", async () => {
    const { user, trigger, onSelect } = renderDropdown();
    await user.click(trigger);
    await user.keyboard("{ArrowDown}{Enter}");

    expect(onSelect).toHaveBeenCalledWith("archive");
    expect(archive).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it("does not select disabled items", async () => {
    const { user, trigger, onSelect } = renderDropdown();
    await user.click(trigger);

    expect(menuItem("Duplicate")).toBeDisabled();
    await user.click(menuItem("Duplicate"));
    expect(onSelect).not.toHaveBeenCalled();
    expect(screen.getByRole("menu")).toBeInTheDocument();
  });

  it("closes on Escape and returns focus to the trigger", async () => {
    const { user, trigger } = renderDropdown();
    await user.click(trigger);
    await user.keyboard("{Escape}");

    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(trigger).toHaveFocus();
  });

  it("opens from the keyboard: ArrowDown focuses the first item, ArrowUp the last", async () => {
    const { user, trigger } = renderDropdown();

    await user.tab();
    expect(trigger).toHaveFocus();
    await user.keyboard("{ArrowDown}");
    expect(menuItem("Edit")).toHaveFocus();

    await user.keyboard("{Escape}");
    await user.keyboard("{ArrowUp}");
    expect(menuItem("Delete")).toHaveFocus();
  });

  it("opens with Enter on the trigger", async () => {
    const { user, trigger } = renderDropdown();
    trigger.focus();
    await user.keyboard("{Enter}");
    expect(menuItem("Edit")).toHaveFocus();
  });

  it("closes when clicking outside", async () => {
    const { user, trigger } = renderDropdown();
    await user.click(trigger);
    await user.click(screen.getByRole("button", { name: "Outside" }));

    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Outside" })).toHaveFocus();
  });

  it("keeps the trigger's own click handler working", async () => {
    const onTriggerClick = vi.fn();
    const user = userEvent.setup();
    render(<Dropdown trigger={<Button onClick={onTriggerClick}>More</Button>} items={items} />);

    await user.click(screen.getByRole("button", { name: "More" }));
    expect(onTriggerClick).toHaveBeenCalledTimes(1);
    expect(screen.getByRole("menu")).toBeInTheDocument();
  });

  it("supports controlled open state", async () => {
    const onOpenChange = vi.fn();
    const { user, trigger } = renderDropdown({ open: false, onOpenChange });

    await user.click(trigger);
    expect(onOpenChange).toHaveBeenCalledWith(true);
    // The parent did not update `open`, so the menu stays closed.
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });
});
