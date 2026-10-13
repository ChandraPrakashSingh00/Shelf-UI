import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef } from "react";
import { describe, expect, it, vi } from "vitest";
import { Tag } from "./Tag.jsx";

describe("Tag", () => {
  it("renders its text in a neutral, medium span by default", () => {
    render(<Tag>Electronics</Tag>);
    const tag = screen.getByText("Electronics").closest(".shelf-tag");
    expect(tag.tagName).toBe("SPAN");
    expect(tag).toHaveClass("shelf-tag", "shelf-tag--neutral", "shelf-tag--md");
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it.each(["neutral", "primary", "success", "warning", "danger"])(
    "applies the %s variant",
    (variant) => {
      render(<Tag variant={variant}>Label</Tag>);
      expect(screen.getByText("Label").parentElement).toHaveClass(`shelf-tag--${variant}`);
    },
  );

  it.each(["sm", "md"])("applies the %s size", (size) => {
    render(<Tag size={size}>Label</Tag>);
    expect(screen.getByText("Label").parentElement).toHaveClass(`shelf-tag--${size}`);
  });

  it("renders a decorative icon before the text", () => {
    render(<Tag icon={<svg data-testid="pin" />}>Mumbai</Tag>);
    const icon = screen.getByTestId("pin").parentElement;
    expect(icon).toHaveAttribute("aria-hidden", "true");
    expect(icon.nextElementSibling).toHaveTextContent("Mumbai");
  });

  it("adds a remove button named after the tag when onRemove is set", async () => {
    const user = userEvent.setup();
    const onRemove = vi.fn();
    render(<Tag onRemove={onRemove}>Red</Tag>);

    const button = screen.getByRole("button", { name: "Remove Red" });
    expect(button).toHaveAttribute("type", "button");
    expect(button.closest(".shelf-tag")).toHaveClass("shelf-tag--removable");

    await user.click(button);
    expect(onRemove).toHaveBeenCalledTimes(1);
    expect(onRemove.mock.calls[0][0]).toHaveProperty("type", "click");
  });

  it("combines a custom removeLabel with the tag's text", () => {
    render(
      <Tag onRemove={() => {}} removeLabel="Clear filter">
        Under ₹999
      </Tag>,
    );
    expect(screen.getByRole("button", { name: "Clear filter Under ₹999" })).toBeInTheDocument();
  });

  it("removes with Enter, Space, Backspace and Delete on the focused button", async () => {
    const user = userEvent.setup();
    const onRemove = vi.fn();
    render(<Tag onRemove={onRemove}>Red</Tag>);

    await user.tab();
    expect(screen.getByRole("button", { name: "Remove Red" })).toHaveFocus();
    await user.keyboard("{Enter}");
    await user.keyboard(" ");
    await user.keyboard("{Backspace}");
    await user.keyboard("{Delete}");
    expect(onRemove).toHaveBeenCalledTimes(4);

    await user.keyboard("{ArrowLeft}a");
    expect(onRemove).toHaveBeenCalledTimes(4);
  });

  it("disables the remove button when disabled", async () => {
    const user = userEvent.setup();
    const onRemove = vi.fn();
    render(
      <Tag onRemove={onRemove} disabled>
        Red
      </Tag>,
    );

    const button = screen.getByRole("button", { name: "Remove Red" });
    expect(button).toBeDisabled();
    expect(button.closest(".shelf-tag")).toHaveClass("shelf-tag--disabled");
    await user.click(button);
    expect(onRemove).not.toHaveBeenCalled();
  });

  it("gives every tag's remove button a unique name", () => {
    render(
      <>
        <Tag onRemove={() => {}}>Red</Tag>
        <Tag onRemove={() => {}}>Blue</Tag>
      </>,
    );
    expect(screen.getByRole("button", { name: "Remove Red" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Remove Blue" })).toBeInTheDocument();
  });

  it("forwards the ref and native attributes, and merges className", () => {
    const ref = createRef();
    render(
      <Tag ref={ref} className="custom" data-testid="tag" title="Category">
        Electronics
      </Tag>,
    );

    const tag = screen.getByTestId("tag");
    expect(ref.current).toBe(tag);
    expect(tag).toHaveClass("shelf-tag", "custom");
    expect(tag).toHaveAttribute("title", "Category");
  });
});
