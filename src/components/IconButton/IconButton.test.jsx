import { act, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { IconButton } from "./IconButton.jsx";

const Heart = () => <svg data-testid="icon" />;

describe("IconButton", () => {
  it("renders a button named by its label, with a decorative icon", () => {
    render(
      <IconButton label="Add to wishlist">
        <Heart />
      </IconButton>,
    );

    const button = screen.getByRole("button", { name: "Add to wishlist" });
    expect(button).toHaveAttribute("aria-label", "Add to wishlist");
    expect(button).toHaveAttribute("type", "button");
    expect(screen.getByTestId("icon").parentElement).toHaveAttribute("aria-hidden", "true");
  });

  it("builds on the Button classes: ghost, medium and square by default", () => {
    render(
      <IconButton label="Share">
        <Heart />
      </IconButton>,
    );
    const button = screen.getByRole("button");
    expect(button).toHaveClass(
      "cps-button",
      "cps-button--ghost",
      "cps-button--md",
      "cps-button--icon-only",
    );
    expect(button).not.toHaveClass("cps-button--circle");
    // The internal close-button primitive's class is not reused.
    expect(button).not.toHaveClass("cps-icon-button");
  });

  it.each(["primary", "secondary", "outline", "ghost", "danger"])(
    "applies the %s variant",
    (variant) => {
      render(
        <IconButton label="Share" variant={variant}>
          <Heart />
        </IconButton>,
      );
      expect(screen.getByRole("button")).toHaveClass(`cps-button--${variant}`);
    },
  );

  it.each(["sm", "md", "lg"])("applies the %s size", (size) => {
    render(
      <IconButton label="Share" size={size}>
        <Heart />
      </IconButton>,
    );
    expect(screen.getByRole("button")).toHaveClass(`cps-button--${size}`);
  });

  it('is round with shape="circle"', () => {
    render(
      <IconButton label="Share" shape="circle">
        <Heart />
      </IconButton>,
    );
    expect(screen.getByRole("button")).toHaveClass("cps-button--circle");
  });

  it("calls onClick from the mouse and the keyboard, and does not submit forms", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    const onSubmit = vi.fn((event) => event.preventDefault());
    render(
      <form onSubmit={onSubmit}>
        <IconButton label="Refresh orders" onClick={onClick}>
          <Heart />
        </IconButton>
      </form>,
    );

    await user.tab();
    expect(screen.getByRole("button")).toHaveFocus();
    await user.keyboard("{Enter}");
    await user.keyboard(" ");
    await user.click(screen.getByRole("button"));

    expect(onClick).toHaveBeenCalledTimes(3);
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("is not a toggle unless `pressed` is set", () => {
    render(
      <IconButton label="Share">
        <Heart />
      </IconButton>,
    );
    expect(screen.getByRole("button")).not.toHaveAttribute("aria-pressed");
  });

  it("exposes the pressed state of a toggle with aria-pressed", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    const { rerender } = render(
      <IconButton label="Add to wishlist" pressed={false} onClick={onClick}>
        <Heart />
      </IconButton>,
    );

    const button = screen.getByRole("button", { name: "Add to wishlist", pressed: false });
    await user.click(button);
    expect(onClick).toHaveBeenCalledTimes(1);

    rerender(
      <IconButton label="Add to wishlist" pressed onClick={onClick}>
        <Heart />
      </IconButton>,
    );
    expect(screen.getByRole("button", { name: "Add to wishlist", pressed: true })).toBe(button);
  });

  it("does not respond to interaction when disabled", async () => {
    const onClick = vi.fn();
    render(
      <IconButton label="Delete product" disabled onClick={onClick}>
        <Heart />
      </IconButton>,
    );

    const button = screen.getByRole("button", { name: "Delete product" });
    expect(button).toBeDisabled();
    await userEvent.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  it("shows a spinner, stays focusable and blocks clicks and submission while loading", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    const onSubmit = vi.fn((event) => event.preventDefault());
    render(
      <form onSubmit={onSubmit}>
        <IconButton label="Refresh orders" type="submit" loading onClick={onClick}>
          <Heart />
        </IconButton>
      </form>,
    );

    const button = screen.getByRole("button", { name: "Refresh orders" });
    expect(button).toHaveAttribute("aria-busy", "true");
    expect(button).toHaveAttribute("aria-disabled", "true");
    expect(button).not.toBeDisabled();
    expect(button).toHaveClass("cps-button--loading");
    expect(button.querySelector(".cps-spinner")).toBeInTheDocument();
    expect(screen.queryByTestId("icon")).not.toBeInTheDocument();

    await user.tab();
    expect(button).toHaveFocus();
    await user.keyboard("{Enter}");
    await user.click(button);
    expect(onClick).not.toHaveBeenCalled();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("renders its child with icon button styling when asChild is set", async () => {
    const onClick = vi.fn();
    const onLinkClick = vi.fn((event) => event.preventDefault());
    render(
      <IconButton asChild label="View cart" variant="outline" size="lg" onClick={onClick}>
        <a href="/cart" className="custom-link" onClick={onLinkClick}>
          <Heart />
        </a>
      </IconButton>,
    );

    const link = screen.getByRole("link", { name: "View cart" });
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/cart");
    expect(link).not.toHaveAttribute("type");
    expect(link).toHaveClass(
      "cps-button",
      "cps-button--outline",
      "cps-button--lg",
      "cps-button--icon-only",
      "custom-link",
    );

    await userEvent.click(link);
    expect(onLinkClick).toHaveBeenCalledTimes(1);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("forwards the ref and native attributes, and merges className", () => {
    const ref = createRef();
    render(
      <IconButton ref={ref} label="Share" className="custom" data-testid="share" title="Share">
        <Heart />
      </IconButton>,
    );

    const button = screen.getByRole("button", { name: "Share" });
    expect(ref.current).toBe(button);
    expect(button).toHaveClass("cps-button", "custom");
    expect(button).toHaveAttribute("data-testid", "share");
    expect(button).toHaveAttribute("title", "Share");
  });

  it("accepts aria-label and aria-pressed in place of label and pressed", () => {
    render(
      <IconButton aria-label="Bold" aria-pressed="true">
        <Heart />
      </IconButton>,
    );
    expect(screen.getByRole("button", { name: "Bold", pressed: true })).toBeInTheDocument();
  });

  it("keeps a consumer's aria-disabled, like Button", () => {
    render(
      <IconButton label="Delete" aria-disabled="true">
        <Heart />
      </IconButton>,
    );
    const button = screen.getByRole("button", { name: "Delete" });
    expect(button).toHaveAttribute("aria-disabled", "true");
    // Still focusable, unlike `disabled`.
    expect(button).not.toBeDisabled();
  });

  describe("with a tooltip", () => {
    // jsdom has no reliable `:focus-visible`: treat the focused element as focus-visible.
    beforeEach(() => {
      const matches = Element.prototype.matches;
      vi.spyOn(Element.prototype, "matches").mockImplementation(function (selector) {
        if (selector === ":focus-visible") return this === document.activeElement;
        return matches.call(this, selector);
      });
    });

    it("shows the label on keyboard focus without announcing it twice", async () => {
      const user = userEvent.setup();
      render(
        <IconButton label="Print invoice" tooltip>
          <Heart />
        </IconButton>,
      );

      expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
      await user.tab();

      const button = screen.getByRole("button", { name: "Print invoice" });
      const tooltip = screen.getByRole("tooltip");
      expect(tooltip).toHaveTextContent("Print invoice");
      expect(button).toHaveAttribute("aria-describedby", tooltip.id);
      // The tooltip text repeats the name, so it adds no accessible description.
      expect(button).toHaveAccessibleDescription("");

      await user.keyboard("{Escape}");
      expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
    });

    it("keeps the forwarded ref on the button", () => {
      const ref = createRef();
      render(
        <IconButton ref={ref} label="Print invoice" tooltip>
          <Heart />
        </IconButton>,
      );
      expect(ref.current).toBe(screen.getByRole("button", { name: "Print invoice" }));
    });

    it("works together with asChild", async () => {
      const user = userEvent.setup();
      render(
        <IconButton asChild label="View cart" tooltip tooltipSide="bottom">
          <a href="/cart">
            <Heart />
          </a>
        </IconButton>,
      );

      await user.tab();
      const link = screen.getByRole("link", { name: "View cart" });
      expect(link).toHaveFocus();
      expect(screen.getByRole("tooltip")).toHaveTextContent("View cart");
    });

    describe("on hover", () => {
      beforeEach(() => {
        vi.useFakeTimers();
      });
      afterEach(() => {
        vi.useRealTimers();
      });

      it("opens after the tooltip delay", () => {
        render(
          <IconButton label="Share product" tooltip>
            <Heart />
          </IconButton>,
        );

        fireEvent.pointerOver(screen.getByRole("button", { name: "Share product" }));
        expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
        act(() => vi.advanceTimersByTime(300));
        expect(screen.getByRole("tooltip")).toHaveTextContent("Share product");
      });
    });
  });
});
