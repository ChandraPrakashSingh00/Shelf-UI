import { render, screen, within } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it } from "vitest";
import { DescriptionList, DescriptionListItem } from "./DescriptionList.jsx";

const summary = [
  { term: "Subtotal", description: "₹2,598" },
  { term: "Shipping", description: "Free" },
  { term: "GST (18%)", description: "₹468" },
];

// The [term, description] text pairs of a list, in order.
const pairs = (list) =>
  within(list)
    .getAllByRole("term")
    .map((term) => [term.textContent, term.nextElementSibling.textContent]);

describe("DescriptionList", () => {
  it("renders items as <div> groups of a <dt> and a <dd> inside a <dl>", () => {
    const { container } = render(<DescriptionList items={summary} />);

    const list = container.firstChild;
    expect(list.tagName).toBe("DL");
    expect(pairs(list)).toEqual([
      ["Subtotal", "₹2,598"],
      ["Shipping", "Free"],
      ["GST (18%)", "₹468"],
    ]);
    for (const group of list.children) {
      expect(group.tagName).toBe("DIV");
      expect([...group.children].map((child) => child.tagName)).toEqual(["DT", "DD"]);
    }
    expect(screen.getAllByRole("definition")).toHaveLength(3);
  });

  it("accepts DescriptionList.Item children, after any items", () => {
    const { container } = render(
      <DescriptionList items={summary.slice(0, 1)}>
        <DescriptionList.Item term="Total">
          <strong>₹3,066</strong>
        </DescriptionList.Item>
      </DescriptionList>,
    );

    expect(pairs(container.firstChild)).toEqual([
      ["Subtotal", "₹2,598"],
      ["Total", "₹3,066"],
    ]);
    expect(screen.getByText("₹3,066").tagName).toBe("STRONG");
  });

  it("uses item keys and fullWidth", () => {
    const { container } = render(
      <DescriptionList
        columns={2}
        items={[
          { key: "name", term: "Name", description: "Aarav Mehta" },
          { key: "address", term: "Address", description: "12, MG Road, Pune", fullWidth: true },
        ]}
      />,
    );
    const [name, address] = container.firstChild.children;
    expect(name).not.toHaveClass("cps-description-list__item--full");
    expect(address).toHaveClass("cps-description-list__item--full");
  });

  it("applies layout, columns, size, divided and align classes with defaults", () => {
    const { container, rerender } = render(<DescriptionList items={summary} />);
    const list = container.firstChild;
    expect(list).toHaveClass(
      "cps-description-list",
      "cps-description-list--horizontal",
      "cps-description-list--columns-1",
      "cps-description-list--md",
    );
    expect(list).not.toHaveClass("cps-description-list--divided");
    expect(list).not.toHaveClass("cps-description-list--align-end");

    rerender(
      <DescriptionList
        items={summary}
        layout="vertical"
        columns={3}
        size="sm"
        divided
        align="end"
      />,
    );
    expect(list).toHaveClass(
      "cps-description-list--vertical",
      "cps-description-list--columns-3",
      "cps-description-list--sm",
      "cps-description-list--divided",
      "cps-description-list--align-end",
    );
  });

  it("falls back to one column for unsupported column counts", () => {
    const { container } = render(<DescriptionList items={summary} columns={7} />);
    expect(container.firstChild).toHaveClass("cps-description-list--columns-1");
  });

  it("sets the term width as a CSS variable, keeping the style prop", () => {
    const { container, rerender } = render(
      <DescriptionList items={summary} termWidth={160} style={{ marginTop: 8 }} />,
    );
    const list = container.firstChild;
    expect(list.style.getPropertyValue("--cps-description-list-term-width")).toBe("160px");
    expect(list).toHaveStyle({ marginTop: "8px" });

    rerender(<DescriptionList items={summary} termWidth="10rem" />);
    expect(list.style.getPropertyValue("--cps-description-list-term-width")).toBe("10rem");
  });

  it("forwards refs, className and other props to the list and its items", () => {
    const listRef = createRef();
    const itemRef = createRef();
    const { container } = render(
      <DescriptionList ref={listRef} className="custom" id="order-summary">
        <DescriptionListItem ref={itemRef} term="Total" className="total" data-row="total">
          ₹3,066
        </DescriptionListItem>
      </DescriptionList>,
    );

    const list = container.firstChild;
    expect(listRef.current).toBe(list);
    expect(list).toHaveClass("custom");
    expect(list).toHaveAttribute("id", "order-summary");
    expect(itemRef.current).toBe(list.firstChild);
    expect(itemRef.current).toHaveClass("cps-description-list__item", "total");
    expect(itemRef.current).toHaveAttribute("data-row", "total");
  });

  it("exposes the item as DescriptionList.Item", () => {
    expect(DescriptionList.Item).toBe(DescriptionListItem);
  });
});
