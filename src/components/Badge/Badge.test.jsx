import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Badge } from "./Badge.jsx";

describe("Badge", () => {
  it("renders its content with the neutral variant by default", () => {
    render(<Badge>Draft</Badge>);
    expect(screen.getByText("Draft")).toHaveClass(
      "shelf-badge",
      "shelf-badge--neutral",
      "shelf-badge--md",
    );
  });

  it.each(["primary", "success", "warning", "danger", "neutral"])(
    "applies the %s variant",
    (variant) => {
      render(<Badge variant={variant}>Status</Badge>);
      expect(screen.getByText("Status")).toHaveClass(`shelf-badge--${variant}`);
    },
  );

  it("passes through native attributes such as an accessible label", () => {
    render(
      <Badge size="sm" aria-label="3 unread notifications">
        3
      </Badge>,
    );
    const badge = screen.getByLabelText("3 unread notifications");
    expect(badge).toHaveClass("shelf-badge--sm");
  });
});
