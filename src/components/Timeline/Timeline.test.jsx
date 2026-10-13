import { render, screen, within } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it } from "vitest";
import { Timeline, TimelineItem } from "./Timeline.jsx";

function OrderTracking(props) {
  return (
    <Timeline aria-label="Order status" {...props}>
      <Timeline.Item status="complete" title="Order placed" time="6 Oct, 10:42 AM" />
      <Timeline.Item status="complete" title="Packed" />
      <Timeline.Item status="current" title="Shipped" description="Blue Dart AWB 7788123" />
      <Timeline.Item title="Delivered" />
    </Timeline>
  );
}

describe("Timeline", () => {
  it("renders an ordered list of items", () => {
    render(<OrderTracking />);

    const list = screen.getByRole("list", { name: "Order status" });
    expect(list.tagName).toBe("OL");
    const items = within(list).getAllByRole("listitem");
    expect(items).toHaveLength(4);
    expect(items[0]).toHaveTextContent("Order placed");
    expect(items[0]).toHaveTextContent("6 Oct, 10:42 AM");
  });

  it("marks only the current item with aria-current=step", () => {
    render(<OrderTracking />);

    const items = screen.getAllByRole("listitem");
    expect(items.filter((item) => item.hasAttribute("aria-current"))).toEqual([items[2]]);
    expect(items[2]).toHaveAttribute("aria-current", "step");
  });

  it("gives every item hidden status text, so status isn't conveyed by color alone", () => {
    render(
      <Timeline>
        <Timeline.Item status="complete" title="Order placed" />
        <Timeline.Item status="current" title="Out for delivery" />
        <Timeline.Item status="error" title="Delivery attempt failed" />
        <Timeline.Item title="Delivered" />
      </Timeline>,
    );

    const items = screen.getAllByRole("listitem");
    expect(items.map((item) => item.textContent)).toEqual([
      "Completed: Order placed",
      "Current: Out for delivery",
      "Failed: Delivery attempt failed",
      "Upcoming: Delivered",
    ]);
    expect(screen.getByText("Completed:")).toHaveClass("shelf-visually-hidden");
    expect(items[3]).toHaveClass("shelf-timeline__item--upcoming");
    expect(items[2]).toHaveClass("shelf-timeline__item--error");
  });

  it("customizes or removes the status text with statusLabels", () => {
    render(
      <Timeline statusLabels={{ complete: null, current: "अभी" }}>
        <Timeline.Item status="complete" title="Price updated" />
        <Timeline.Item status="current" title="Review pending" />
        <Timeline.Item title="Publish" />
      </Timeline>,
    );

    expect(screen.getAllByRole("listitem").map((item) => item.textContent)).toEqual([
      "Price updated",
      "अभी: Review pending",
      "Upcoming: Publish",
    ]);
  });

  it("renders time inside <time> when dateTime is given", () => {
    render(
      <Timeline>
        <Timeline.Item title="Order placed" time="6 Oct, 10:42 AM" dateTime="2026-10-06T10:42" />
        <Timeline.Item title="Packed" time="6 Oct, 2:15 PM" />
      </Timeline>,
    );

    const time = screen.getByText("6 Oct, 10:42 AM");
    expect(time.tagName).toBe("TIME");
    expect(time).toHaveAttribute("datetime", "2026-10-06T10:42");
    expect(screen.getByText("6 Oct, 2:15 PM").tagName).toBe("SPAN");
  });

  it("renders a description and extra children", () => {
    render(
      <Timeline>
        <Timeline.Item title="Refund issued" description="₹1,299 to UPI">
          <a href="#receipt">View receipt</a>
        </Timeline.Item>
      </Timeline>,
    );

    expect(screen.getByText("₹1,299 to UPI")).toHaveClass("shelf-timeline__description");
    expect(screen.getByRole("link", { name: "View receipt" })).toBeInTheDocument();
  });

  it("shows default icons in decorative dots, replaceable with icon", () => {
    const { container } = render(
      <Timeline>
        <Timeline.Item status="complete" title="Placed" />
        <Timeline.Item status="complete" title="Edited" icon={<svg data-testid="custom" />} />
        <Timeline.Item status="complete" title="Noted" icon={null} />
        <Timeline.Item status="upcoming" title="Delivered" />
      </Timeline>,
    );

    const dots = container.querySelectorAll(".shelf-timeline__dot");
    expect(container.querySelector(".shelf-timeline__marker")).toHaveAttribute(
      "aria-hidden",
      "true",
    );
    expect(dots[0].querySelector("svg")).toBeInTheDocument();
    expect(dots[1]).toContainElement(screen.getByTestId("custom"));
    expect(dots[2]).toBeEmptyDOMElement();
    expect(dots[3]).toBeEmptyDOMElement();
    expect(dots[0]).toHaveClass("shelf-timeline__dot--icon");
    expect(dots[3]).not.toHaveClass("shelf-timeline__dot--icon");
  });

  it("applies orientation and size classes, defaulting to vertical and md", () => {
    const { rerender } = render(<OrderTracking />);
    const list = screen.getByRole("list");
    expect(list).toHaveClass("shelf-timeline", "shelf-timeline--vertical", "shelf-timeline--md");

    rerender(<OrderTracking orientation="horizontal" size="sm" />);
    expect(list).toHaveClass("shelf-timeline--horizontal", "shelf-timeline--sm");
  });

  it("forwards refs, className and other props to the list and its items", () => {
    const listRef = createRef();
    const itemRef = createRef();
    render(
      <Timeline ref={listRef} className="custom" id="tracking">
        <TimelineItem ref={itemRef} className="item" data-step="1" title="Order placed" />
      </Timeline>,
    );

    const list = screen.getByRole("list");
    expect(listRef.current).toBe(list);
    expect(list).toHaveClass("custom");
    expect(list).toHaveAttribute("id", "tracking");
    const item = screen.getByRole("listitem");
    expect(itemRef.current).toBe(item);
    expect(item).toHaveClass("shelf-timeline__item", "item");
    expect(item).toHaveAttribute("data-step", "1");
  });

  it("exposes the item as Timeline.Item", () => {
    expect(Timeline.Item).toBe(TimelineItem);
  });
});
