import { act, fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef, useState } from "react";
import { renderToString } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import { CommandPalette } from "./CommandPalette.jsx";

const exportOrders = vi.fn();

const items = [
  { id: "dashboard", label: "Dashboard", group: "Go to", shortcut: ["G", "D"] },
  {
    id: "orders",
    label: "Orders",
    description: "Track and fulfil customer orders",
    group: "Go to",
    keywords: ["sales", "shipments"],
  },
  { id: "reports", label: "Reports", group: "Go to", disabled: true },
  { id: "create-product", label: "Create product", group: "Actions" },
  {
    id: "export",
    label: "Export orders",
    description: "Download a CSV of this month's orders",
    group: "Actions",
    onSelect: exportOrders,
  },
];

const option = (name) => screen.getByRole("option", { name });
const optionNames = () =>
  screen
    .getAllByRole("option")
    .map((element) => element.getAttribute("aria-labelledby"))
    .map((id) => document.getElementById(id).textContent);

function Harness(props) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" onClick={() => setOpen(true)}>
        Open palette
      </button>
      <CommandPalette items={items} hotkey={null} open={open} onOpenChange={setOpen} {...props} />
    </>
  );
}

async function openHarness(props = {}) {
  const user = userEvent.setup();
  render(<Harness {...props} />);
  await user.click(screen.getByRole("button", { name: "Open palette" }));
  const input = screen.getByRole("combobox", { name: "Search commands" });
  return { user, input };
}

const pressKey = (key, init = {}) =>
  fireEvent.keyDown(document.activeElement ?? document.body, { key, ...init });

describe("CommandPalette", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("renders nothing while closed", () => {
    render(<CommandPalette items={items} hotkey={null} />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("opens a labelled modal dialog with the search input focused", async () => {
    const { input } = await openHarness();

    const dialog = screen.getByRole("dialog", { name: "Command palette" });
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(input).toHaveFocus();
    expect(input).toHaveAttribute("placeholder", "Type a command or search…");
    expect(input).toHaveAttribute("aria-autocomplete", "list");
    expect(input).toHaveAttribute("aria-expanded", "true");
    expect(input).toHaveAttribute(
      "aria-controls",
      screen.getByRole("listbox", { name: "Command palette" }).id,
    );
    expect(document.body.style.overflow).toBe("hidden");
  });

  it("groups commands under labelled groups, in order of first use", async () => {
    await openHarness();

    const groups = screen.getAllByRole("group");
    expect(groups.map((group) => group.getAttribute("aria-labelledby"))).toHaveLength(2);
    expect(screen.getByRole("group", { name: "Go to" })).toBeInTheDocument();
    const actions = screen.getByRole("group", { name: "Actions" });
    expect(within(actions).getAllByRole("option")).toHaveLength(2);
    expect(screen.getByText("Go to")).toHaveAttribute("aria-hidden", "true");
    expect(optionNames()).toEqual([
      "Dashboard",
      "Orders",
      "Reports",
      "Create product",
      "Export orders",
    ]);
  });

  it("names options by their label and describes them by their description", async () => {
    await openHarness();

    const orders = option("Orders");
    expect(orders).toHaveAccessibleDescription("Track and fulfil customer orders");
    expect(option("Reports")).toHaveAttribute("aria-disabled", "true");
  });

  it("renders shortcuts as kbd elements hidden from assistive technology, and icons", async () => {
    const withIcon = [
      { id: "home", label: "Home", icon: <svg data-testid="home-icon" />, shortcut: ["G", "H"] },
    ];
    await openHarness({ items: withIcon });

    const home = option("Home");
    const keys = home.querySelectorAll("kbd.cps-command-palette__kbd");
    expect(Array.from(keys).map((key) => key.textContent)).toEqual(["G", "H"]);
    expect(keys[0].parentElement).toHaveAttribute("aria-hidden", "true");
    expect(screen.getByTestId("home-icon").parentElement).toHaveAttribute("aria-hidden", "true");
  });

  it("activates the first option and moves with the arrow keys, Home and End, skipping disabled and wrapping", async () => {
    const { user, input } = await openHarness();
    const expectActive = (name) => {
      expect(input).toHaveAttribute("aria-activedescendant", option(name).id);
      expect(option(name)).toHaveAttribute("aria-selected", "true");
      expect(option(name)).toHaveClass("cps-command-palette__option--active");
    };

    expectActive("Dashboard");
    await user.keyboard("{ArrowDown}");
    expectActive("Orders");
    await user.keyboard("{ArrowDown}");
    expectActive("Create product");
    await user.keyboard("{End}");
    expectActive("Export orders");
    await user.keyboard("{ArrowDown}");
    expectActive("Dashboard");
    await user.keyboard("{ArrowUp}");
    expectActive("Export orders");
    await user.keyboard("{Home}");
    expectActive("Dashboard");
    expect(option("Orders")).toHaveAttribute("aria-selected", "false");
  });

  it("runs the active command with Enter, closes and returns focus to the trigger", async () => {
    const onSelect = vi.fn();
    const { user } = await openHarness({ onSelect });

    await user.keyboard("{End}{Enter}");
    expect(exportOrders).toHaveBeenCalledWith(expect.objectContaining({ id: "export" }));
    expect(onSelect).toHaveBeenCalledWith(expect.objectContaining({ id: "export" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Open palette" })).toHaveFocus();
    expect(document.body.style.overflow).toBe("");
  });

  it("runs a command on click, but not a disabled one, keeping focus in the input", async () => {
    const onSelect = vi.fn();
    const { user, input } = await openHarness({ onSelect });

    await user.click(option("Reports"));
    expect(onSelect).not.toHaveBeenCalled();
    expect(input).toHaveFocus();

    await user.hover(option("Create product"));
    expect(input).toHaveAttribute("aria-activedescendant", option("Create product").id);

    await user.click(option("Create product"));
    expect(onSelect).toHaveBeenCalledWith(expect.objectContaining({ id: "create-product" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("closes before running a command, so the command can move focus", async () => {
    const user = userEvent.setup();
    function FocusHarness() {
      const [open, setOpen] = useState(false);
      return (
        <>
          <button type="button" onClick={() => setOpen(true)}>
            Open palette
          </button>
          <input aria-label="Search orders" />
          <CommandPalette
            hotkey={null}
            open={open}
            onOpenChange={setOpen}
            items={[
              {
                id: "search",
                label: "Search orders",
                onSelect: () => screen.getByRole("textbox", { name: "Search orders" }).focus(),
              },
            ]}
          />
        </>
      );
    }
    render(<FocusHarness />);
    await user.click(screen.getByRole("button", { name: "Open palette" }));
    await user.keyboard("{Enter}");

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: "Search orders" })).toHaveFocus();
  });

  it("ignores Enter and Escape that belong to an IME composition", async () => {
    const onSelect = vi.fn();
    const { input } = await openHarness({ onSelect });

    // Chrome and Firefox flag the event; Safari only sends keyCode 229.
    fireEvent.keyDown(input, { key: "Enter", isComposing: true });
    fireEvent.keyDown(input, { key: "Enter", keyCode: 229 });
    fireEvent.keyDown(input, { key: "Escape", isComposing: true });
    expect(onSelect).not.toHaveBeenCalled();
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    fireEvent.keyDown(input, { key: "Enter" });
    expect(onSelect).toHaveBeenCalledTimes(1);
  });

  it("stays open after running a command with closeOnSelect={false}", async () => {
    const onSelect = vi.fn();
    const { user } = await openHarness({ onSelect, closeOnSelect: false });

    await user.keyboard("{Enter}");
    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("filters by label, description and keywords, requiring every word, ignoring case and accents", async () => {
    const { user, input } = await openHarness();

    await user.type(input, "ORD");
    expect(optionNames()).toEqual(["Orders", "Export orders"]);

    await user.clear(input);
    await user.type(input, "shipments");
    expect(optionNames()).toEqual(["Orders"]);

    await user.clear(input);
    await user.type(input, "orders csv");
    expect(optionNames()).toEqual(["Export orders"]);
    // Groups without matches disappear.
    expect(screen.getAllByRole("group")).toHaveLength(1);

    await user.clear(input);
    await user.type(input, "créate");
    expect(optionNames()).toEqual(["Create product"]);
  });

  it("makes the first match active after typing", async () => {
    const { user, input } = await openHarness();

    await user.keyboard("{ArrowDown}");
    await user.type(input, "export");
    expect(input).toHaveAttribute("aria-activedescendant", option("Export orders").id);
  });

  it("shows and announces the empty message when nothing matches", async () => {
    const { user, input } = await openHarness({ emptyMessage: "No matching commands." });

    await user.type(input, "refund");
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    expect(input).toHaveAttribute("aria-expanded", "false");
    expect(input).not.toHaveAttribute("aria-activedescendant");
    expect(screen.getByRole("status")).toHaveTextContent("No matching commands.");

    // Enter does nothing without a match.
    await user.keyboard("{Enter}");
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("uses a custom filter, or shows every item with filter={null}", async () => {
    const byId = vi.fn((item, query) => item.id.startsWith(query));
    const { user, input } = await openHarness({ filter: byId });

    await user.type(input, "create");
    expect(optionNames()).toEqual(["Create product"]);
    expect(byId).toHaveBeenCalledWith(items[0], "create");
    await user.keyboard("{Escape}");

    render(<CommandPalette items={items} hotkey={null} filter={null} defaultOpen />);
    await user.type(screen.getByRole("combobox"), "no such command");
    expect(screen.getAllByRole("option")).toHaveLength(items.length);
  });

  it("closes on Escape, returning focus, without letting Escape reach the page", async () => {
    const onDocumentKeyDown = vi.fn();
    document.addEventListener("keydown", onDocumentKeyDown);
    const { user } = await openHarness();

    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Open palette" })).toHaveFocus();
    expect(onDocumentKeyDown).not.toHaveBeenCalledWith(expect.objectContaining({ key: "Escape" }));
    document.removeEventListener("keydown", onDocumentKeyDown);
  });

  it("closes on an overlay click, but not on clicks inside the dialog", async () => {
    const { user } = await openHarness();

    await user.click(screen.getByRole("combobox"));
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    const overlay = screen.getByRole("dialog").parentElement;
    await user.click(overlay);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("starts with an empty search every time it opens", async () => {
    const { user, input } = await openHarness();
    await user.type(input, "orders");
    await user.keyboard("{Escape}");

    await user.click(screen.getByRole("button", { name: "Open palette" }));
    expect(screen.getByRole("combobox")).toHaveValue("");
    expect(screen.getAllByRole("option")).toHaveLength(items.length);
  });

  it("toggles with the default Ctrl+K shortcut", async () => {
    const user = userEvent.setup();
    vi.stubGlobal("navigator", { ...navigator, platform: "Win32" });
    const onOpenChange = vi.fn();
    render(<CommandPalette items={items} onOpenChange={onOpenChange} />);

    await user.keyboard("{Control>}k{/Control}");
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(onOpenChange).toHaveBeenLastCalledWith(true);
    expect(screen.getByRole("combobox")).toHaveFocus();

    await user.keyboard("{Control>}k{/Control}");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(onOpenChange).toHaveBeenLastCalledWith(false);

    // ⌘K is not the shortcut on Windows.
    await user.keyboard("{Meta>}k{/Meta}");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("uses ⌘ for mod on Apple platforms", async () => {
    const user = userEvent.setup();
    vi.stubGlobal("navigator", { ...navigator, platform: "MacIntel" });
    render(<CommandPalette items={items} />);

    await user.keyboard("{Control>}k{/Control}");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    await user.keyboard("{Meta>}k{/Meta}");
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("supports a custom hotkey and turns it off with hotkey={null}", async () => {
    const user = userEvent.setup();
    vi.stubGlobal("navigator", { ...navigator, platform: "Linux x86_64" });
    const { rerender } = render(<CommandPalette items={items} hotkey="ctrl+shift+p" />);

    await user.keyboard("{Control>}k{/Control}");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    await user.keyboard("{Control>}{Shift>}P{/Shift}{/Control}");
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    await user.keyboard("{Escape}");

    rerender(<CommandPalette items={items} hotkey={null} />);
    await user.keyboard("{Control>}{Shift>}P{/Shift}{/Control}");
    await user.keyboard("{Control>}k{/Control}");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("prevents the browser's default for its shortcut, and skips key presses already handled", () => {
    render(
      <>
        <input
          aria-label="Notes"
          onKeyDown={(event) => event.key === "j" && event.preventDefault()}
        />
        <CommandPalette items={items} hotkey="ctrl+j" />
      </>,
    );

    const notes = screen.getByRole("textbox", { name: "Notes" });
    notes.focus();
    pressKey("j", { ctrlKey: true });
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    notes.blur();
    const event = new KeyboardEvent("keydown", {
      key: "j",
      ctrlKey: true,
      cancelable: true,
      bubbles: true,
    });
    act(() => {
      document.body.dispatchEvent(event);
    });
    expect(event.defaultPrevented).toBe(true);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("ignores held-down repeats and plain-key shortcuts while typing in a field", () => {
    render(
      <>
        <textarea aria-label="Review" />
        <CommandPalette items={items} hotkey="/" />
      </>,
    );

    const review = screen.getByRole("textbox", { name: "Review" });
    review.focus();
    pressKey("/");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    review.blur();
    pressKey("/", { repeat: true });
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    pressKey("/");
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("keeps a single hotkey listener on the document while it opens and closes", async () => {
    const user = userEvent.setup();
    vi.stubGlobal("navigator", { ...navigator, platform: "Win32" });
    const addListener = vi.spyOn(document, "addEventListener");
    render(<CommandPalette items={items} hotkey="mod+j" />);
    const keydownListeners = () =>
      addListener.mock.calls.filter(([type]) => type === "keydown").length;
    expect(keydownListeners()).toBe(1);

    await user.keyboard("{Control>}j{/Control}");
    await user.keyboard("{Control>}j{/Control}");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(keydownListeners()).toBe(1);
  });

  it("renders nothing on the server, even when open", () => {
    expect(renderToString(<CommandPalette items={items} defaultOpen />)).toBe("");
  });

  it("supports defaultOpen, custom labels, placeholder, footer, className and a ref to the panel", () => {
    const ref = createRef();
    render(
      <CommandPalette
        ref={ref}
        items={items}
        hotkey={null}
        defaultOpen
        label="Admin search"
        searchLabel="Search the admin"
        placeholder="Search orders, products…"
        footer={<span>Press Enter to open</span>}
        className="custom-palette"
        data-testid="palette"
      />,
    );

    const dialog = screen.getByRole("dialog", { name: "Admin search" });
    expect(ref.current).toBe(dialog);
    expect(dialog).toHaveClass("cps-command-palette", "custom-palette");
    expect(dialog).toHaveAttribute("data-testid", "palette");
    expect(screen.getByRole("listbox", { name: "Admin search" })).toBeInTheDocument();
    const input = screen.getByRole("combobox", { name: "Search the admin" });
    expect(input).toHaveAttribute("placeholder", "Search orders, products…");
    expect(screen.getByText("Press Enter to open").parentElement).toHaveClass(
      "cps-command-palette__footer",
    );
  });

  it("lists ungrouped commands without a group, and scrolls the active option into view", async () => {
    const scrollIntoView = vi.fn();
    Element.prototype.scrollIntoView = scrollIntoView;
    const plain = [
      { id: "one", label: "Order #1042" },
      { id: "two", label: "Order #1043" },
    ];
    const { user } = await openHarness({ items: plain });

    expect(screen.queryByRole("group")).not.toBeInTheDocument();
    expect(within(screen.getByRole("listbox")).getAllByRole("option")).toHaveLength(2);
    await user.keyboard("{ArrowDown}");
    expect(scrollIntoView).toHaveBeenLastCalledWith({ block: "nearest" });
    delete Element.prototype.scrollIntoView;
  });
});
