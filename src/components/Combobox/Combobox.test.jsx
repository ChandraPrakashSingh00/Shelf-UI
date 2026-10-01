import { fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef, useState } from "react";
import { renderToString } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { Combobox } from "./Combobox.jsx";

const cities = ["Mumbai", "Navi Mumbai", "Delhi", "Bengaluru", "Chennai", "Kolhāpur"];

const warehouses = [
  { value: "bom", label: "Mumbai", description: "Bhiwandi · Maharashtra" },
  { value: "del", label: "Delhi", description: "Gurugram · Haryana" },
  { value: "blr", label: "Bengaluru", description: "Hoskote · Karnataka", disabled: true },
  { value: "maa", label: "Chennai", description: "Sriperumbudur · Tamil Nadu" },
];

function setup(props = {}) {
  const user = userEvent.setup();
  const utils = render(<Combobox label="City" options={cities} {...props} />);
  const input = screen.getByRole("combobox", { name: "City" });
  return { user, input, ...utils };
}

const optionNames = () => screen.getAllByRole("option").map((option) => option.textContent);

describe("Combobox", () => {
  it("renders a collapsed combobox input named by its label", () => {
    const { input } = setup();

    expect(input.tagName).toBe("INPUT");
    expect(input).toHaveAttribute("aria-autocomplete", "list");
    expect(input).toHaveAttribute("aria-expanded", "false");
    expect(input).toHaveAttribute("autocomplete", "off");
    expect(input).not.toHaveAttribute("aria-controls");
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("opens and filters as you type, ignoring case and accents, and highlights the match", async () => {
    const { user, input, container } = setup();

    await user.type(input, "mum");
    const listbox = screen.getByRole("listbox", { name: "City" });
    expect(input).toHaveAttribute("aria-expanded", "true");
    expect(input).toHaveAttribute("aria-controls", listbox.id);
    expect(optionNames()).toEqual(["Mumbai", "Navi Mumbai"]);
    expect(
      Array.from(container.querySelectorAll(".cps-combobox__match")).map((match) => [
        match.textContent,
        match.parentElement.textContent,
      ]),
    ).toEqual([
      ["Mum", "Mumbai"],
      ["Mum", "Navi Mumbai"],
    ]);

    await user.clear(input);
    await user.type(input, "KOLHA");
    expect(optionNames()).toEqual(["Kolhāpur"]);
  });

  it("doesn't highlight an option until you move into the list (manual selection)", async () => {
    const { user, input } = setup();
    await user.type(input, "del");

    expect(input).not.toHaveAttribute("aria-activedescendant");
    await user.keyboard("{Enter}");
    expect(screen.getByRole("listbox")).toBeInTheDocument();
  });

  it("moves the active option with the arrow keys, skipping disabled options and wrapping", async () => {
    const { user, input } = setup({ options: warehouses });
    input.focus();

    await user.keyboard("{ArrowDown}");
    const options = screen.getAllByRole("option");
    expect(input).toHaveAttribute("aria-activedescendant", options[0].id);
    expect(options[0]).toHaveClass("cps-combobox__option--active");

    await user.keyboard("{ArrowDown}{ArrowDown}");
    expect(input).toHaveAttribute("aria-activedescendant", options[3].id);
    expect(options[2]).toHaveAttribute("aria-disabled", "true");

    await user.keyboard("{ArrowDown}");
    expect(input).toHaveAttribute("aria-activedescendant", options[0].id);
    await user.keyboard("{ArrowUp}");
    expect(input).toHaveAttribute("aria-activedescendant", options[3].id);
  });

  it("opens on ArrowUp at the last option, and on either arrow at the selected option", async () => {
    const { user, input, unmount } = setup({ options: warehouses });
    input.focus();

    await user.keyboard("{ArrowUp}");
    expect(input).toHaveAttribute("aria-activedescendant", screen.getAllByRole("option")[3].id);
    unmount();

    render(<Combobox label="Warehouse" options={warehouses} defaultValue="del" />);
    const other = screen.getByRole("combobox", { name: "Warehouse" });
    other.focus();
    await user.keyboard("{ArrowUp}");
    const selected = screen.getByRole("option", { selected: true });
    expect(selected).toHaveTextContent("Delhi");
    expect(other).toHaveAttribute("aria-activedescendant", selected.id);
  });

  it("opens with Alt+ArrowDown without highlighting an option, and closes with Alt+ArrowUp", async () => {
    const { user, input } = setup();
    input.focus();

    await user.keyboard("{Alt>}{ArrowDown}{/Alt}");
    expect(screen.getByRole("listbox")).toBeInTheDocument();
    expect(input).not.toHaveAttribute("aria-activedescendant");

    await user.keyboard("{Alt>}{ArrowUp}{/Alt}");
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("selects the active option with Enter, fills the input and closes", async () => {
    const onValueChange = vi.fn();
    const onInputChange = vi.fn();
    const { user, input } = setup({ options: warehouses, onValueChange, onInputChange });

    await user.type(input, "che");
    await user.keyboard("{ArrowDown}{Enter}");

    expect(onValueChange).toHaveBeenCalledWith("maa");
    expect(onInputChange).toHaveBeenLastCalledWith("Chennai", "select");
    expect(input).toHaveValue("Chennai");
    expect(input).toHaveAttribute("aria-expanded", "false");
    expect(input).toHaveFocus();
  });

  it("selects an option on click, keeps focus in the input and marks it selected", async () => {
    const onValueChange = vi.fn();
    const { user, input } = setup({ options: warehouses, onValueChange });

    await user.type(input, "d");
    await user.click(screen.getByRole("option", { name: /Delhi/ }));
    expect(onValueChange).toHaveBeenCalledWith("del");
    expect(input).toHaveValue("Delhi");
    expect(input).toHaveFocus();

    // Reopening lists every option again, with the selection checked.
    await user.keyboard("{ArrowDown}");
    expect(screen.getAllByRole("option")).toHaveLength(4);
    expect(screen.getByRole("option", { selected: true })).toHaveTextContent("Delhi");
  });

  it("shows option descriptions and ignores clicks on disabled options", async () => {
    const onValueChange = vi.fn();
    const { user, input } = setup({ options: warehouses, onValueChange });
    input.focus();
    await user.keyboard("{ArrowDown}");

    expect(screen.getByRole("option", { name: /Delhi/ })).toHaveTextContent(
      "DelhiGurugram · Haryana",
    );
    const disabled = screen.getByRole("option", { name: /Bengaluru/ });
    await user.click(disabled);
    expect(onValueChange).not.toHaveBeenCalled();
    expect(screen.getByRole("listbox")).toBeInTheDocument();

    await user.hover(screen.getByRole("option", { name: /Chennai/ }));
    expect(input).toHaveAttribute(
      "aria-activedescendant",
      screen.getByRole("option", { name: /Chennai/ }).id,
    );
    await user.hover(disabled);
    expect(input).toHaveAttribute(
      "aria-activedescendant",
      screen.getByRole("option", { name: /Chennai/ }).id,
    );
  });

  it("closes on Escape, then clears the selection on a second Escape", async () => {
    const onValueChange = vi.fn();
    const { user, input } = setup({ defaultValue: "Delhi", onValueChange });
    expect(input).toHaveValue("Delhi");

    input.focus();
    await user.keyboard("{ArrowDown}");
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    expect(input).toHaveValue("Delhi");
    expect(onValueChange).not.toHaveBeenCalled();

    await user.keyboard("{Escape}");
    expect(input).toHaveValue("");
    expect(onValueChange).toHaveBeenCalledWith(null);
  });

  it("keeps Escape from closing a surrounding dialog while it handles it", async () => {
    const onParentKeyDown = vi.fn();
    const user = userEvent.setup();
    render(
      <div onKeyDown={(event) => onParentKeyDown(event.key)}>
        <Combobox label="City" options={cities} defaultValue="Pune" clearable={false} />
      </div>,
    );
    const input = screen.getByRole("combobox");
    input.focus();

    await user.keyboard("{ArrowDown}{Escape}");
    expect(onParentKeyDown).not.toHaveBeenCalledWith("Escape");
    // Nothing left to close or clear: Escape reaches the parent.
    await user.keyboard("{Escape}");
    expect(onParentKeyDown).toHaveBeenCalledWith("Escape");
  });

  it("puts the selected label back when you leave the field", async () => {
    const onInputChange = vi.fn();
    const user = userEvent.setup();
    render(
      <>
        <Combobox
          label="City"
          options={cities}
          defaultValue="Delhi"
          onInputChange={onInputChange}
        />
        <button type="button">Next</button>
      </>,
    );
    const input = screen.getByRole("combobox");

    await user.type(input, "xyz");
    expect(input).toHaveValue("Delhixyz");
    await user.tab();
    expect(input).toHaveValue("Delhi");
    expect(onInputChange).toHaveBeenLastCalledWith("Delhi", "restore");
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("selects an option whose whole label was typed when you leave the field", async () => {
    const onValueChange = vi.fn();
    const { user, input } = setup({ onValueChange });

    await user.type(input, "chennai ");
    await user.tab();
    expect(onValueChange).toHaveBeenCalledWith("Chennai");
    expect(input).toHaveValue("Chennai");
  });

  it("clears the value when the text is erased, unless clearable is false", async () => {
    const onValueChange = vi.fn();
    const { user, input, rerender } = setup({ defaultValue: "Delhi", onValueChange });

    await user.clear(input);
    expect(onValueChange).toHaveBeenCalledWith(null);
    // With nothing selected, every option is listed.
    expect(screen.getAllByRole("option")).toHaveLength(cities.length);

    rerender(
      <Combobox
        label="City"
        options={cities}
        value="Delhi"
        clearable={false}
        onValueChange={onValueChange}
      />,
    );
    expect(input).toHaveValue("Delhi");
    expect(screen.queryByRole("button", { name: "Clear" })).not.toBeInTheDocument();
    onValueChange.mockClear();

    await user.clear(input);
    await user.keyboard("{Escape}{Escape}");
    expect(input).toHaveValue("");
    await user.tab();
    expect(input).toHaveValue("Delhi");
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it("clears with the clear button, which stays out of the Tab order", async () => {
    const onValueChange = vi.fn();
    const { user, input } = setup({ defaultValue: "Mumbai", onValueChange });

    const clear = screen.getByRole("button", { name: "Clear" });
    expect(clear).toHaveAttribute("tabindex", "-1");
    await user.click(clear);

    expect(onValueChange).toHaveBeenCalledWith(null);
    expect(input).toHaveValue("");
    expect(input).toHaveFocus();
    expect(screen.queryByRole("button", { name: "Clear" })).not.toBeInTheDocument();
  });

  it("toggles the full list with the chevron button", async () => {
    const { user, input } = setup({ defaultValue: "Chennai", toggleLabel: "Show cities" });

    const toggle = screen.getByRole("button", { name: "Show cities" });
    expect(toggle).toHaveAttribute("tabindex", "-1");
    await user.click(toggle);
    expect(input).toHaveFocus();
    expect(toggle).toHaveAttribute("aria-expanded", "true");
    expect(optionNames()).toEqual(cities);
    expect(input).toHaveAttribute(
      "aria-activedescendant",
      screen.getByRole("option", { selected: true }).id,
    );

    await user.click(toggle);
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("opens on focus with openOnFocus, and closes with Tab without selecting", async () => {
    const onValueChange = vi.fn();
    const user = userEvent.setup();
    render(<Combobox label="City" options={cities} openOnFocus onValueChange={onValueChange} />);

    await user.tab();
    expect(screen.getByRole("listbox")).toBeInTheDocument();
    await user.keyboard("{ArrowDown}");
    await user.tab();
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it("shows and announces the empty message", async () => {
    const { user, input } = setup({ emptyMessage: "We don't deliver there yet" });

    await user.type(input, "xyz");
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    expect(input).toHaveAttribute("aria-expanded", "false");
    expect(screen.getByRole("status")).toHaveTextContent("We don't deliver there yet");
    expect(screen.getByText("We don't deliver there yet", { selector: "div" })).toHaveAttribute(
      "aria-hidden",
      "true",
    );
  });

  it("shows a loading state and marks the input busy", async () => {
    const { user, input, container, rerender } = setup({ options: [], loading: true });

    expect(input).toHaveAttribute("aria-busy", "true");
    expect(container.querySelector(".cps-combobox__spinner")).toBeInTheDocument();
    await user.type(input, "pu");
    expect(screen.getByRole("status")).toHaveTextContent("Loading…");
    expect(screen.getByText("Loading…", { selector: "div" })).toBeInTheDocument();

    rerender(<Combobox label="City" options={["Pune", "Puducherry"]} filter={null} />);
    expect(input).not.toHaveAttribute("aria-busy");
    expect(optionNames()).toEqual(["Pune", "Puducherry"]);
    expect(screen.getByRole("status")).toBeEmptyDOMElement();
  });

  it("shows options as given with filter={null}, and uses a custom filter", async () => {
    const { user, input, rerender } = setup({ filter: null });
    await user.type(input, "zzz");
    expect(optionNames()).toEqual(cities);

    const startsWith = vi.fn((option, query) => option.label.toLowerCase().startsWith(query));
    rerender(<Combobox label="City" options={cities} filter={startsWith} />);
    await user.clear(input);
    await user.type(input, "n");
    expect(optionNames()).toEqual(["Navi Mumbai"]);
    expect(startsWith).toHaveBeenCalledWith({ value: "Mumbai", label: "Mumbai" }, "n");
  });

  it("supports a controlled value, and follows it in the input", async () => {
    function Controlled() {
      const [city, setCity] = useState("Delhi");
      return (
        <>
          <Combobox label="City" options={warehouses} value={city} onValueChange={setCity} />
          <button type="button" onClick={() => setCity("bom")}>
            Pick Mumbai
          </button>
          <p data-testid="selected">{String(city)}</p>
        </>
      );
    }
    const user = userEvent.setup();
    render(<Controlled />);
    const input = screen.getByRole("combobox");
    expect(input).toHaveValue("");

    await user.click(screen.getByRole("button", { name: "Pick Mumbai" }));
    expect(input).toHaveValue("Mumbai");

    await user.type(input, "{Control>}a{/Control}che");
    await user.keyboard("{ArrowDown}{Enter}");
    expect(screen.getByTestId("selected")).toHaveTextContent("maa");
    expect(input).toHaveValue("Chennai");
  });

  it("stays on a controlled value until the parent updates it", async () => {
    const onValueChange = vi.fn();
    const { user, input } = setup({ value: "Delhi", onValueChange });

    await user.type(input, "{Control>}a{/Control}pu");
    await user.keyboard("{ArrowDown}{Enter}");
    expect(onValueChange).toHaveBeenCalledWith("Kolhāpur");
    await user.tab();
    expect(input).toHaveValue("Delhi");
  });

  it("calls onOpenChange once per change when leaving with a typed label", async () => {
    const onOpenChange = vi.fn();
    const { user, input } = setup({ onOpenChange });

    await user.type(input, "chennai");
    expect(onOpenChange.mock.calls).toEqual([[true]]);
    // Focus moves elsewhere with a click, without a Tab key press to close the list first.
    fireEvent.blur(input);
    expect(onOpenChange.mock.calls).toEqual([[true], [false]]);
    expect(input).toHaveValue("Chennai");
  });

  it("calls onOpenChange once when the toggle button opens or closes an unfocused field", async () => {
    const onOpenChange = vi.fn();
    const { user, input, unmount } = setup({ openOnFocus: true, onOpenChange });

    await user.click(screen.getByRole("button", { name: "Show options" }));
    expect(input).toHaveFocus();
    expect(input).toHaveAttribute("aria-expanded", "true");
    expect(onOpenChange.mock.calls).toEqual([[true]]);
    unmount();

    // A list that starts open, with the input not focused: the toggle closes it for good.
    onOpenChange.mockClear();
    const view = setup({ openOnFocus: true, defaultOpen: true, onOpenChange });
    expect(view.input).toHaveAttribute("aria-expanded", "true");
    await view.user.click(screen.getByRole("button", { name: "Show options" }));
    expect(view.input).toHaveFocus();
    expect(view.input).toHaveAttribute("aria-expanded", "false");
    expect(onOpenChange.mock.calls).toEqual([[false]]);
  });

  it("leaves Enter to an IME that is still composing (keyCode 229 in Safari)", async () => {
    const onValueChange = vi.fn();
    const { user, input } = setup({ onValueChange });

    await user.type(input, "del");
    await user.keyboard("{ArrowDown}");
    expect(input).toHaveAttribute("aria-activedescendant");
    fireEvent.keyDown(input, { key: "Enter", keyCode: 229 });
    expect(onValueChange).not.toHaveBeenCalled();
    expect(input).toHaveAttribute("aria-expanded", "true");
  });

  it("puts the selected label back when the parent doesn't accept a typed label", async () => {
    const onValueChange = vi.fn();
    const { user, input } = setup({ value: "Delhi", onValueChange });

    await user.type(input, "{Control>}a{/Control}Chennai");
    await user.tab();
    expect(onValueChange).toHaveBeenCalledWith("Chennai");
    expect(input).toHaveValue("Delhi");
  });

  it("keeps the typed text when a value set from outside leaves the server results", async () => {
    const fruits = ["Apple", "Banana", "Cherry"];
    function ServerSearch() {
      const [fruit, setFruit] = useState(null);
      const [query, setQuery] = useState("");
      const results = fruits.filter((name) => name.toLowerCase().includes(query.toLowerCase()));
      return (
        <>
          <button type="button" onClick={() => setFruit("Cherry")}>
            Use last order
          </button>
          <Combobox
            label="Fruit"
            options={results}
            filter={null}
            value={fruit}
            onValueChange={setFruit}
            onInputChange={(text) => setQuery(text)}
          />
        </>
      );
    }
    const user = userEvent.setup();
    render(<ServerSearch />);
    const input = screen.getByRole("combobox", { name: "Fruit" });

    await user.click(screen.getByRole("button", { name: "Use last order" }));
    expect(input).toHaveValue("Cherry");

    // The results for "b" no longer include Cherry.
    await user.type(input, "{Control>}a{/Control}b");
    expect(input).toHaveValue("b");
    expect(optionNames()).toEqual(["Banana"]);

    await user.tab();
    expect(input).toHaveValue("Cherry");
  });

  it("supports a controlled input value with reasons in onInputChange", async () => {
    function ControlledText({ onInputChange }) {
      const [text, setText] = useState("");
      return (
        <Combobox
          label="City"
          options={cities}
          inputValue={text}
          onInputChange={(next, reason) => {
            onInputChange(next, reason);
            setText(next.toUpperCase());
          }}
        />
      );
    }
    const onInputChange = vi.fn();
    const user = userEvent.setup();
    render(<ControlledText onInputChange={onInputChange} />);
    const input = screen.getByRole("combobox");

    await user.type(input, "d");
    expect(onInputChange).toHaveBeenLastCalledWith("d", "input");
    expect(input).toHaveValue("D");

    await user.keyboard("{ArrowDown}{Enter}");
    expect(onInputChange).toHaveBeenLastCalledWith("Delhi", "select");
    expect(input).toHaveValue("DELHI");
  });

  it("submits the selected value through a hidden input and resets with its form", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <form aria-label="Checkout">
        <Combobox
          label="City"
          name="city"
          options={warehouses}
          defaultValue="del"
          onValueChange={onValueChange}
        />
        <button type="reset">Reset</button>
      </form>,
    );
    const form = screen.getByRole("form");
    const input = screen.getByRole("combobox");
    expect(new FormData(form).get("city")).toBe("del");
    // Only the hidden input has the name.
    expect(input).not.toHaveAttribute("name");

    await user.type(input, "{Control>}a{/Control}chen");
    await user.keyboard("{ArrowDown}{Enter}");
    expect(new FormData(form).get("city")).toBe("maa");

    await user.click(screen.getByRole("button", { name: "Reset" }));
    expect(input).toHaveValue("Delhi");
    expect(new FormData(form).get("city")).toBe("del");
    expect(onValueChange).toHaveBeenLastCalledWith("del");

    await user.clear(input);
    expect(new FormData(form).get("city")).toBe("");
  });

  it("requires a selected option, not just typed text", async () => {
    const user = userEvent.setup();
    render(
      <form aria-label="Address">
        <Combobox label="State" options={["Maharashtra", "Karnataka"]} required name="state" />
      </form>,
    );
    const form = screen.getByRole("form");
    const input = screen.getByRole("combobox", { name: "State" });
    expect(input).toHaveAttribute("aria-required", "true");
    expect(input).not.toHaveAttribute("required");
    expect(screen.getByText("*")).toHaveAttribute("aria-hidden", "true");
    expect(form.checkValidity()).toBe(false);

    await user.type(input, "Karna");
    expect(form.checkValidity()).toBe(false);

    await user.keyboard("{ArrowDown}{Enter}");
    expect(input).toHaveValue("Karnataka");
    expect(form.checkValidity()).toBe(true);

    // The browser points the user at the hidden required input: focus goes on to the combobox.
    await user.clear(input);
    expect(form.checkValidity()).toBe(false);
    input.blur();
    form.querySelector("input[required]").focus();
    expect(input).toHaveFocus();
  });

  it("selects a typed label on Enter, so the form submits it", async () => {
    const user = userEvent.setup();
    const submitted = [];
    render(
      <form
        aria-label="Address"
        onSubmit={(event) => {
          event.preventDefault();
          submitted.push(new FormData(event.currentTarget).get("state"));
        }}
      >
        <Combobox label="State" options={["Maharashtra", "Karnataka"]} required name="state" />
        <button type="submit">Save</button>
      </form>,
    );
    const input = screen.getByRole("combobox", { name: "State" });

    // Only part of a label: nothing is selected, and the required field blocks submitting.
    await user.type(input, "Karna{Enter}");
    expect(submitted).toEqual([]);

    await user.type(input, "taka{Enter}");
    expect(input).toHaveValue("Karnataka");
    expect(input).toHaveAttribute("aria-expanded", "false");
    expect(submitted).toEqual(["Karnataka"]);
  });

  it("describes the input with helper text, or with the error that replaces it", () => {
    const { input, rerender } = setup({ helperText: "We deliver to 120+ cities." });
    expect(input).toHaveAccessibleDescription("We deliver to 120+ cities.");
    expect(input).not.toHaveAttribute("aria-invalid");

    rerender(
      <Combobox
        label="City"
        options={cities}
        helperText="We deliver to 120+ cities."
        error="Choose a delivery city."
      />,
    );
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAccessibleDescription("Choose a delivery city.");
  });

  it("can't be changed while disabled or read-only", async () => {
    const { user, input, container, rerender } = setup({
      disabled: true,
      defaultValue: "Delhi",
      name: "city",
    });

    expect(input).toBeDisabled();
    expect(container.firstChild).toHaveClass("cps-field--disabled");
    expect(screen.getByRole("button", { name: "Show options" })).toBeDisabled();
    expect(screen.queryByRole("button", { name: "Clear" })).not.toBeInTheDocument();
    expect(container.querySelector('input[type="hidden"]')).toBeDisabled();

    rerender(<Combobox label="City" options={cities} defaultValue="Delhi" readOnly />);
    input.focus();
    await user.keyboard("{ArrowDown}{Escape}");
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    expect(input).toHaveValue("Delhi");
    expect(input).toHaveAttribute("readonly");
  });

  it("supports a controlled open state", async () => {
    const onOpenChange = vi.fn();
    const { user, input, rerender } = setup({ open: false, onOpenChange });

    input.focus();
    await user.keyboard("{ArrowDown}");
    expect(onOpenChange).toHaveBeenCalledWith(true);
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();

    rerender(<Combobox label="City" options={cities} open onOpenChange={onOpenChange} />);
    expect(screen.getByRole("listbox")).toBeInTheDocument();
  });

  it("sets the list's max height and scrolls the active option into view", async () => {
    const scrollIntoView = vi.fn();
    Element.prototype.scrollIntoView = scrollIntoView;
    const { user, input, container } = setup({ maxHeight: 200 });

    input.focus();
    await user.keyboard("{ArrowDown}{ArrowDown}");
    expect(
      container
        .querySelector(".cps-combobox__popup")
        .style.getPropertyValue("--cps-combobox-max-height"),
    ).toBe("200px");
    expect(scrollIntoView).toHaveBeenLastCalledWith({ block: "nearest" });
    delete Element.prototype.scrollIntoView;
  });

  it("applies the size and hides decorative icons", () => {
    const { container } = setup({ size: "lg", leftIcon: <svg data-testid="pin" /> });
    expect(container.firstChild).toHaveClass("cps-field", "cps-field--lg", "cps-combobox");
    expect(screen.getByTestId("pin").parentElement).toHaveAttribute("aria-hidden", "true");
  });

  it("forwards the ref and native attributes to the input, className and style to the wrapper", () => {
    const ref = createRef();
    const onFocus = vi.fn();
    const { container } = render(
      <Combobox
        ref={ref}
        id="city"
        label="City"
        options={cities}
        placeholder="Search cities"
        className="custom-field"
        style={{ maxWidth: 320 }}
        data-testid="city-input"
        onFocus={onFocus}
      />,
    );

    const input = screen.getByRole("combobox");
    expect(ref.current).toBe(input);
    expect(input).toHaveAttribute("id", "city");
    expect(input).toHaveAttribute("placeholder", "Search cities");
    expect(input).toHaveAttribute("data-testid", "city-input");
    expect(container.firstChild).toHaveClass("custom-field");
    expect(container.firstChild).toHaveStyle({ maxWidth: "320px" });

    fireEvent.focus(input);
    expect(onFocus).toHaveBeenCalledTimes(1);
  });

  it("renders on the server with the selected label in the input", () => {
    const html = renderToString(
      <Combobox label="City" options={warehouses} defaultValue="del" name="city" />,
    );
    expect(html).toContain('role="combobox"');
    expect(html).toContain('value="Delhi"');
    expect(html).toContain('name="city" value="del"');
  });

  it("names the list with aria-label when there's no visible label", async () => {
    const user = userEvent.setup();
    render(<Combobox aria-label="Search products" options={["Kurta", "Saree"]} />);
    const input = screen.getByRole("combobox", { name: "Search products" });

    await user.type(input, "k");
    expect(screen.getByRole("listbox", { name: "Search products" })).toBeInTheDocument();
    expect(within(screen.getByRole("listbox")).getAllByRole("option")).toHaveLength(1);
  });
});
