import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef } from "react";
import { describe, expect, it, vi } from "vitest";
import { Link } from "./Link.jsx";

describe("Link", () => {
  it("renders an anchor with primary styling and a hover underline by default", () => {
    render(<Link href="/orders">View orders</Link>);

    const link = screen.getByRole("link", { name: "View orders" });
    expect(link.tagName).toBe("A");
    expect(link).toHaveAttribute("href", "/orders");
    expect(link).toHaveClass("shelf-link", "shelf-link--primary", "shelf-link--underline-hover");
    expect(link).not.toHaveAttribute("target");
    expect(link).not.toHaveAttribute("rel");
    expect(link.querySelector("svg")).not.toBeInTheDocument();
  });

  it.each(["primary", "muted", "inherit"])("applies the %s variant", (variant) => {
    render(
      <Link href="#" variant={variant}>
        Label
      </Link>,
    );
    expect(screen.getByRole("link")).toHaveClass(`shelf-link--${variant}`);
  });

  it.each(["hover", "always", "none"])("applies the %s underline", (underline) => {
    render(
      <Link href="#" underline={underline}>
        Label
      </Link>,
    );
    expect(screen.getByRole("link")).toHaveClass(`shelf-link--underline-${underline}`);
  });

  it("opens external links in a new tab safely and says so", () => {
    render(
      <Link href="https://www.gst.gov.in" external>
        GST portal
      </Link>,
    );

    const link = screen.getByRole("link", { name: /^GST portal\s\(opens in a new tab\)$/ });
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
    expect(link).toHaveClass("shelf-link--external");

    const icon = link.querySelector("svg");
    expect(icon).toHaveClass("shelf-link__icon");
    expect(icon).toHaveAttribute("aria-hidden", "true");
    expect(screen.getByText("(opens in a new tab)")).toHaveClass("shelf-visually-hidden");
  });

  it("merges rel and keeps a custom target on external links", () => {
    render(
      <Link href="https://example.com" external rel="nofollow noopener" target="partner">
        Partner store
      </Link>,
    );
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("rel", "nofollow noopener noreferrer");
    expect(link).toHaveAttribute("target", "partner");
  });

  it("customizes or leaves out the external label and icon", () => {
    const { rerender } = render(
      <Link href="https://example.com" external externalLabel="(new window)">
        Track shipment
      </Link>,
    );
    expect(
      screen.getByRole("link", { name: /^Track shipment\s\(new window\)$/ }),
    ).toBeInTheDocument();

    rerender(
      <Link href="https://example.com" external externalLabel="" showExternalIcon={false}>
        Track shipment
      </Link>,
    );
    const link = screen.getByRole("link", { name: "Track shipment" });
    expect(link.querySelector("svg")).not.toBeInTheDocument();
    expect(link).toHaveAttribute("target", "_blank");
  });

  it("passes target and rel through unchanged on internal links", () => {
    render(
      <Link href="/invoice.pdf" target="_self" rel="alternate">
        Invoice
      </Link>,
    );
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("target", "_self");
    expect(link).toHaveAttribute("rel", "alternate");
  });

  it("is keyboard focusable and calls onClick", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn((event) => event.preventDefault());
    render(
      <Link href="/orders" onClick={onClick}>
        Orders
      </Link>,
    );

    await user.tab();
    expect(screen.getByRole("link")).toHaveFocus();
    await user.keyboard("{Enter}");
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("renders its child with link styling when asChild is set", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    const onChildClick = vi.fn((event) => event.preventDefault());
    render(
      <Link asChild variant="muted" onClick={onClick}>
        <a href="/returns" className="router-link" onClick={onChildClick}>
          Returns policy
        </a>
      </Link>,
    );

    const link = screen.getByRole("link", { name: "Returns policy" });
    expect(link).toHaveAttribute("href", "/returns");
    expect(link).toHaveClass("shelf-link", "shelf-link--muted", "router-link");

    await user.click(link);
    expect(onChildClick).toHaveBeenCalledTimes(1);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("adds the external icon and text inside an asChild element", () => {
    render(
      <Link asChild external>
        <a href="https://www.indiapost.gov.in">India Post</a>
      </Link>,
    );

    const link = screen.getByRole("link", { name: /^India Post\s\(opens in a new tab\)$/ });
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
    expect(link.querySelector(".shelf-link__icon")).toBeInTheDocument();
  });

  it("merges an asChild element's own rel with noopener noreferrer", () => {
    render(
      <Link asChild external rel="external">
        <a href="https://www.indiapost.gov.in" rel="nofollow noopener">
          India Post
        </a>
      </Link>,
    );

    const link = screen.getByRole("link", { name: /^India Post/ });
    expect(link).toHaveAttribute("rel", "external nofollow noopener noreferrer");
    expect(link).toHaveAttribute("target", "_blank");
  });

  it("forwards the ref and native attributes, and merges className", () => {
    const ref = createRef();
    render(
      <Link ref={ref} href="/help" className="custom" data-testid="help" hrefLang="hi">
        Help centre
      </Link>,
    );

    const link = screen.getByRole("link", { name: "Help centre" });
    expect(ref.current).toBe(link);
    expect(link).toHaveClass("shelf-link", "custom");
    expect(link).toHaveAttribute("data-testid", "help");
    expect(link).toHaveAttribute("hreflang", "hi");
  });
});
