import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef, useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { ToggleGroup, ToggleGroupItem } from "./ToggleGroup.jsx";

function renderSizes(props = {}) {
  const user = userEvent.setup();
  const utils = render(
    <ToggleGroup label="Size" {...props}>
      <ToggleGroup.Item value="s">S</ToggleGroup.Item>
      <ToggleGroup.Item value="m">M</ToggleGroup.Item>
      <ToggleGroup.Item value="l">L</ToggleGroup.Item>
      <ToggleGroup.Item value="xl" disabled>
        XL
      </ToggleGroup.Item>
      <ToggleGroup.Item value="xxl">XXL</ToggleGroup.Item>
    </ToggleGroup>,
  );
  return { user, ...utils };
}

const item = (name) => screen.getByRole("button", { name });

describe("ToggleGroup", () => {
  it("renders a group of toggle buttons named by its visible label", () => {
    renderSizes();

    const group = screen.getByRole("group", { name: "Size" });
    expect(group).toHaveClass(
      "cps-toggle-group",
      "cps-toggle-group--md",
      "cps-toggle-group--outline",
    );
    expect(screen.getByText("Size")).toBeVisible();
    for (const name of ["S", "M", "L", "XL", "XXL"]) {
      expect(item(name)).toHaveAttribute("aria-pressed", "false");
      expect(item(name)).toHaveAttribute("type", "button");
    }
  });

  it("can be named with aria-label instead of a visible label", () => {
    render(
      <ToggleGroup aria-label="View">
        <ToggleGroup.Item value="grid">Grid</ToggleGroup.Item>
      </ToggleGroup>,
    );
    expect(screen.getByRole("group", { name: "View" })).toBeInTheDocument();
  });

  describe("single selection", () => {
    it("presses one item at a time and reports the value", async () => {
      const onValueChange = vi.fn();
      const { user } = renderSizes({ onValueChange });

      await user.click(item("M"));
      expect(item("M")).toHaveAttribute("aria-pressed", "true");
      expect(onValueChange).toHaveBeenLastCalledWith("m");

      await user.click(item("L"));
      expect(item("L")).toHaveAttribute("aria-pressed", "true");
      expect(item("M")).toHaveAttribute("aria-pressed", "false");
      expect(onValueChange).toHaveBeenLastCalledWith("l");
    });

    it("keeps the pressed item pressed on a second click by default", async () => {
      const onValueChange = vi.fn();
      const { user } = renderSizes({ defaultValue: "m", onValueChange });

      await user.click(item("M"));
      expect(item("M")).toHaveAttribute("aria-pressed", "true");
      expect(onValueChange).not.toHaveBeenCalled();
    });

    it("unpresses the pressed item with allowDeselect", async () => {
      const onValueChange = vi.fn();
      const { user } = renderSizes({ defaultValue: "m", allowDeselect: true, onValueChange });

      await user.click(item("M"));
      expect(item("M")).toHaveAttribute("aria-pressed", "false");
      expect(onValueChange).toHaveBeenCalledWith(null);
    });

    it("supports controlled usage", async () => {
      const onValueChange = vi.fn();
      const { user, rerender } = renderSizes({ value: "s", onValueChange });

      await user.click(item("L"));
      expect(onValueChange).toHaveBeenCalledWith("l");
      // The parent did not update `value`, so the pressed item stays put.
      expect(item("S")).toHaveAttribute("aria-pressed", "true");
      expect(item("L")).toHaveAttribute("aria-pressed", "false");

      rerender(
        <ToggleGroup label="Size" value={null}>
          <ToggleGroup.Item value="s">S</ToggleGroup.Item>
        </ToggleGroup>,
      );
      expect(item("S")).toHaveAttribute("aria-pressed", "false");
    });
  });

  describe("multiple selection", () => {
    function renderFilters(props = {}) {
      const user = userEvent.setup();
      render(
        <ToggleGroup type="multiple" aria-label="Order status" {...props}>
          <ToggleGroup.Item value="pending">Pending</ToggleGroup.Item>
          <ToggleGroup.Item value="shipped">Shipped</ToggleGroup.Item>
          <ToggleGroup.Item value="delivered">Delivered</ToggleGroup.Item>
        </ToggleGroup>,
      );
      return user;
    }

    it("toggles items independently and reports an array", async () => {
      const onValueChange = vi.fn();
      const user = renderFilters({ defaultValue: ["pending"], onValueChange });
      expect(item("Pending")).toHaveAttribute("aria-pressed", "true");

      await user.click(item("Delivered"));
      expect(onValueChange).toHaveBeenLastCalledWith(["pending", "delivered"]);
      expect(item("Delivered")).toHaveAttribute("aria-pressed", "true");

      await user.click(item("Pending"));
      expect(onValueChange).toHaveBeenLastCalledWith(["delivered"]);
      expect(item("Pending")).toHaveAttribute("aria-pressed", "false");

      await user.click(item("Delivered"));
      expect(onValueChange).toHaveBeenLastCalledWith([]);
    });

    it("supports controlled usage", async () => {
      function Controlled() {
        const [value, setValue] = useState(["shipped"]);
        return (
          <>
            <ToggleGroup
              type="multiple"
              aria-label="Order status"
              value={value}
              onValueChange={setValue}
            >
              <ToggleGroup.Item value="pending">Pending</ToggleGroup.Item>
              <ToggleGroup.Item value="shipped">Shipped</ToggleGroup.Item>
            </ToggleGroup>
            <output>{value.join(",")}</output>
          </>
        );
      }
      const user = userEvent.setup();
      render(<Controlled />);

      await user.click(item("Pending"));
      expect(screen.getByRole("status")).toHaveTextContent("shipped,pending");
      expect(item("Pending")).toHaveAttribute("aria-pressed", "true");
    });
  });

  describe("keyboard", () => {
    it("is a single Tab stop, on the pressed item", async () => {
      const { user } = renderSizes({ defaultValue: "l" });
      expect(item("L")).toHaveAttribute("tabindex", "0");
      expect(item("S")).toHaveAttribute("tabindex", "-1");

      await user.tab();
      expect(item("L")).toHaveFocus();
      await user.tab();
      expect(document.body).toHaveFocus();
    });

    it("puts the Tab stop on the first enabled item when nothing is pressed", async () => {
      const { user } = renderSizes();
      await user.tab();
      expect(item("S")).toHaveFocus();
      expect(item("M")).toHaveAttribute("tabindex", "-1");
    });

    it("skips a pressed item that is disabled", async () => {
      const { user } = renderSizes({ defaultValue: "xl" });
      await user.tab();
      expect(item("S")).toHaveFocus();
    });

    it("moves focus with ← → Home End, wrapping and skipping disabled items", async () => {
      const onValueChange = vi.fn();
      const { user } = renderSizes({ onValueChange });
      await user.tab();

      await user.keyboard("{ArrowRight}");
      expect(item("M")).toHaveFocus();
      await user.keyboard("{ArrowRight}{ArrowRight}");
      expect(item("XXL")).toHaveFocus();
      await user.keyboard("{ArrowRight}");
      expect(item("S")).toHaveFocus();
      await user.keyboard("{ArrowLeft}");
      expect(item("XXL")).toHaveFocus();
      await user.keyboard("{Home}");
      expect(item("S")).toHaveFocus();
      await user.keyboard("{End}");
      expect(item("XXL")).toHaveFocus();
      // ↑ ↓ belong to the vertical orientation.
      await user.keyboard("{ArrowDown}");
      expect(item("XXL")).toHaveFocus();

      // Moving focus doesn't press anything.
      expect(onValueChange).not.toHaveBeenCalled();
    });

    it("remembers the last focused item as the Tab stop", async () => {
      const user = userEvent.setup();
      render(
        <>
          <ToggleGroup aria-label="Size" defaultValue="s">
            <ToggleGroup.Item value="s">S</ToggleGroup.Item>
            <ToggleGroup.Item value="m">M</ToggleGroup.Item>
            <ToggleGroup.Item value="l">L</ToggleGroup.Item>
          </ToggleGroup>
          <button type="button">After</button>
        </>,
      );

      await user.tab();
      await user.keyboard("{ArrowRight}");
      expect(item("M")).toHaveFocus();
      expect(item("M")).toHaveAttribute("tabindex", "0");
      expect(item("S")).toHaveAttribute("tabindex", "-1");

      await user.tab();
      expect(item("After")).toHaveFocus();
      await user.tab({ shift: true });
      expect(item("M")).toHaveFocus();
    });

    it("moves the Tab stop off an item that becomes disabled", () => {
      const sizes = (disabledValue) => (
        <ToggleGroup aria-label="Size" defaultValue="m">
          <ToggleGroup.Item value="s">S</ToggleGroup.Item>
          <ToggleGroup.Item value="m" disabled={disabledValue === "m"}>
            M
          </ToggleGroup.Item>
        </ToggleGroup>
      );
      const { rerender } = render(sizes(null));
      expect(item("M")).toHaveAttribute("tabindex", "0");

      rerender(sizes("m"));
      expect(item("S")).toHaveAttribute("tabindex", "0");
    });

    it("toggles the focused item with Space and Enter", async () => {
      const { user } = renderSizes();
      await user.tab();
      await user.keyboard("{ArrowRight}");
      await user.keyboard(" ");
      expect(item("M")).toHaveAttribute("aria-pressed", "true");

      await user.keyboard("{ArrowRight}{Enter}");
      expect(item("L")).toHaveAttribute("aria-pressed", "true");
      expect(item("M")).toHaveAttribute("aria-pressed", "false");
    });

    it("uses ↑ ↓ in the vertical orientation", async () => {
      const { user } = renderSizes({ orientation: "vertical" });
      expect(screen.getByRole("group")).toHaveClass("cps-toggle-group--vertical");

      await user.tab();
      await user.keyboard("{ArrowDown}");
      expect(item("M")).toHaveFocus();
      await user.keyboard("{ArrowUp}{ArrowUp}");
      expect(item("XXL")).toHaveFocus();
      await user.keyboard("{ArrowRight}");
      expect(item("XXL")).toHaveFocus();
    });
  });

  it("disables single items, or every item with the group's disabled prop", async () => {
    const onValueChange = vi.fn();
    const { user, rerender } = renderSizes({ onValueChange });
    expect(item("XL")).toBeDisabled();
    await user.click(item("XL"));
    expect(onValueChange).not.toHaveBeenCalled();

    rerender(
      <ToggleGroup label="Size" disabled onValueChange={onValueChange}>
        <ToggleGroup.Item value="s">S</ToggleGroup.Item>
        <ToggleGroup.Item value="m">M</ToggleGroup.Item>
      </ToggleGroup>,
    );
    expect(item("S")).toBeDisabled();
    expect(item("M")).toBeDisabled();
  });

  describe("forms", () => {
    it("submits the pressed value under `name`", async () => {
      const user = userEvent.setup();
      let submitted;
      render(
        <form
          onSubmit={(event) => {
            event.preventDefault();
            submitted = new FormData(event.currentTarget);
          }}
        >
          <ToggleGroup label="Size" name="size" defaultValue="m">
            <ToggleGroup.Item value="s">S</ToggleGroup.Item>
            <ToggleGroup.Item value="m">M</ToggleGroup.Item>
          </ToggleGroup>
          <ToggleGroup
            type="multiple"
            aria-label="Gift options"
            name="gift"
            defaultValue={["wrap"]}
          >
            <ToggleGroup.Item value="wrap">Gift wrap</ToggleGroup.Item>
            <ToggleGroup.Item value="note">Gift note</ToggleGroup.Item>
          </ToggleGroup>
          <button type="submit">Add to cart</button>
        </form>,
      );

      await user.click(item("Gift note"));
      await user.click(item("Add to cart"));
      expect(submitted.get("size")).toBe("m");
      expect(submitted.getAll("gift")).toEqual(["wrap", "note"]);
    });

    it("submits nothing while no item is pressed, or while disabled", () => {
      const { container } = render(
        <form>
          <ToggleGroup aria-label="Size" name="size">
            <ToggleGroup.Item value="s">S</ToggleGroup.Item>
          </ToggleGroup>
          <ToggleGroup aria-label="Colour" name="colour" defaultValue="red" disabled>
            <ToggleGroup.Item value="red">Red</ToggleGroup.Item>
          </ToggleGroup>
        </form>,
      );
      const data = new FormData(container.querySelector("form"));
      expect(data.has("size")).toBe(false);
      expect(data.has("colour")).toBe(false);
    });

    it("restores the default value when an uncontrolled group's form resets", async () => {
      const user = userEvent.setup();
      render(
        <form>
          <ToggleGroup label="Size" name="size" defaultValue="m">
            <ToggleGroup.Item value="s">S</ToggleGroup.Item>
            <ToggleGroup.Item value="m">M</ToggleGroup.Item>
          </ToggleGroup>
          <button type="reset">Reset</button>
        </form>,
      );

      await user.click(item("S"));
      expect(item("S")).toHaveAttribute("aria-pressed", "true");
      await user.click(item("Reset"));
      expect(item("M")).toHaveAttribute("aria-pressed", "true");
      expect(item("S")).toHaveAttribute("aria-pressed", "false");
    });
  });

  it("applies size, variant and fullWidth classes", () => {
    renderSizes({ size: "lg", variant: "ghost", fullWidth: true });
    expect(screen.getByRole("group")).toHaveClass(
      "cps-toggle-group--lg",
      "cps-toggle-group--ghost",
      "cps-toggle-group--full-width",
    );
  });

  it("forwards refs and props, merges className and runs item handlers", async () => {
    const user = userEvent.setup();
    const groupRef = createRef();
    const itemRef = createRef();
    const onClick = vi.fn();
    render(
      <ToggleGroup ref={groupRef} aria-label="View" className="toolbar" data-testid="view">
        <ToggleGroupItem
          ref={itemRef}
          value="grid"
          aria-label="Grid view"
          className="custom"
          onClick={onClick}
        >
          <svg />
        </ToggleGroupItem>
      </ToggleGroup>,
    );

    const group = screen.getByRole("group", { name: "View" });
    expect(groupRef.current).toBe(group);
    expect(group).toHaveClass("cps-toggle-group", "toolbar");
    expect(group).toHaveAttribute("data-testid", "view");
    expect(itemRef.current).toBe(item("Grid view"));
    expect(item("Grid view")).toHaveClass("cps-toggle-group__item", "custom");

    await user.click(item("Grid view"));
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(item("Grid view")).toHaveAttribute("aria-pressed", "true");
  });

  it("lets an item's onClick prevent toggling", async () => {
    const user = userEvent.setup();
    render(
      <ToggleGroup aria-label="View">
        <ToggleGroup.Item value="grid" onClick={(event) => event.preventDefault()}>
          Grid
        </ToggleGroup.Item>
      </ToggleGroup>,
    );
    await user.click(item("Grid"));
    expect(item("Grid")).toHaveAttribute("aria-pressed", "false");
  });

  it("explains misuse outside <ToggleGroup>", () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => render(<ToggleGroup.Item value="orphan">Orphan</ToggleGroup.Item>)).toThrow(
      "<ToggleGroup.Item> must be rendered inside <ToggleGroup>.",
    );
  });
});
