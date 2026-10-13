import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef } from "react";
import { describe, expect, it, vi } from "vitest";
import { Banner } from "./Banner.jsx";

describe("Banner", () => {
  it("renders a region landmark named “Announcement” by default", () => {
    render(<Banner>Free delivery on orders above ₹499</Banner>);

    const region = screen.getByRole("region", { name: "Announcement" });
    expect(region.tagName).toBe("SECTION");
    expect(region).toHaveTextContent("Free delivery on orders above ₹499");
  });

  it("is not a live region, because it is part of the page when it loads", () => {
    render(<Banner variant="danger">UPI payments are delayed</Banner>);

    const region = screen.getByRole("region");
    expect(region).not.toHaveAttribute("aria-live");
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });

  it("uses `label` as the region's accessible name", () => {
    render(<Banner label="Diwali sale">Flat 50% off</Banner>);
    expect(screen.getByRole("region", { name: "Diwali sale" })).toBeInTheDocument();
  });

  it("renders the title in bold before the message, separated by a space", () => {
    render(<Banner title="Diwali Sale:">Flat 50% off on electronics</Banner>);

    const title = screen.getByText("Diwali Sale:");
    expect(title.tagName).toBe("STRONG");
    expect(screen.getByRole("region")).toHaveTextContent(
      "Diwali Sale: Flat 50% off on electronics",
    );
  });

  it("applies the primary variant and centered alignment by default", () => {
    render(<Banner>Message</Banner>);
    const region = screen.getByRole("region");
    expect(region).toHaveClass(
      "shelf-banner",
      "shelf-banner--primary",
      "shelf-banner--align-center",
    );
    expect(region).not.toHaveClass("shelf-banner--sticky");
  });

  it.each(["info", "success", "warning", "danger", "neutral"])(
    "applies the %s variant class",
    (variant) => {
      render(<Banner variant={variant}>Message</Banner>);
      expect(screen.getByRole("region")).toHaveClass(`shelf-banner--${variant}`);
    },
  );

  it("supports start alignment and sticky positioning", () => {
    render(
      <Banner align="start" sticky>
        Message
      </Banner>,
    );
    expect(screen.getByRole("region")).toHaveClass(
      "shelf-banner--align-start",
      "shelf-banner--sticky",
    );
  });

  it("shows a decorative default icon for status variants only", () => {
    const { container, rerender } = render(<Banner variant="warning">COD unavailable</Banner>);
    const icon = container.querySelector(".shelf-banner__icon");
    expect(icon).toHaveAttribute("aria-hidden", "true");
    expect(icon?.querySelector("svg")).not.toBeNull();

    rerender(<Banner variant="primary">Sale</Banner>);
    expect(container.querySelector(".shelf-banner__icon")).toBeNull();

    rerender(<Banner variant="neutral">Note</Banner>);
    expect(container.querySelector(".shelf-banner__icon")).toBeNull();
  });

  it("renders a custom icon, and hides the default one with icon={null}", () => {
    const { container, rerender } = render(
      <Banner icon={<span data-testid="gift">🎁</span>}>Gift wrap is free</Banner>,
    );
    expect(screen.getByTestId("gift")).toBeInTheDocument();

    rerender(
      <Banner variant="info" icon={null}>
        No icon
      </Banner>,
    );
    expect(container.querySelector(".shelf-banner__icon")).toBeNull();
  });

  it("renders the action after the message", () => {
    render(<Banner action={<a href="/sale">Shop now</a>}>Flat 50% off</Banner>);
    const link = screen.getByRole("link", { name: "Shop now" });
    expect(link.closest(".shelf-banner__action")).not.toBeNull();
  });

  it("has no dismiss button without onDismiss", () => {
    render(<Banner>Message</Banner>);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
    expect(screen.getByRole("region")).not.toHaveClass("shelf-banner--dismissible");
  });

  it("calls onDismiss from the dismiss button, with a configurable label", async () => {
    const user = userEvent.setup();
    const onDismiss = vi.fn();
    const { rerender } = render(<Banner onDismiss={onDismiss}>Message</Banner>);

    expect(screen.getByRole("region")).toHaveClass("shelf-banner--dismissible");
    await user.click(screen.getByRole("button", { name: "Dismiss" }));
    expect(onDismiss).toHaveBeenCalledTimes(1);

    rerender(
      <Banner onDismiss={onDismiss} dismissLabel="Hide sale banner">
        Message
      </Banner>,
    );
    expect(screen.getByRole("button", { name: "Hide sale banner" })).toBeInTheDocument();
  });

  it("dismisses from the keyboard", async () => {
    const user = userEvent.setup();
    const onDismiss = vi.fn();
    render(<Banner onDismiss={onDismiss}>Message</Banner>);

    await user.tab();
    expect(screen.getByRole("button", { name: "Dismiss" })).toHaveFocus();
    await user.keyboard("{Enter}");
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it("forwards the ref, className and other props to the section", () => {
    const ref = createRef();
    render(
      <Banner ref={ref} className="promo" id="promo-banner" data-campaign="diwali">
        Message
      </Banner>,
    );
    const region = screen.getByRole("region");
    expect(ref.current).toBe(region);
    expect(region).toHaveClass("shelf-banner", "promo");
    expect(region).toHaveAttribute("id", "promo-banner");
    expect(region).toHaveAttribute("data-campaign", "diwali");
  });

  it("lets aria-labelledby name the region instead", () => {
    render(
      <>
        <h2 id="sale-heading">Festive offers</h2>
        <Banner aria-labelledby="sale-heading">Flat 50% off</Banner>
      </>,
    );
    expect(screen.getByRole("region", { name: "Festive offers" })).toBeInTheDocument();
  });
});
