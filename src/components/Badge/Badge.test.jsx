import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Badge } from "./Badge.jsx";

describe("Badge", () => {
  it("renders its content with the neutral variant by default", () => {
    render(<Badge>Draft</Badge>);
    expect(screen.getByText("Draft")).toHaveClass("cps-badge", "cps-badge--neutral", "cps-badge--md");
  });

  it.each(["primary", "success", "warning", "danger", "neutral"])(
    "applies the %s variant",
    (variant) => {
      render(<Badge variant={variant}>Status</Badge>);
      expect(screen.getByText("Status")).toHaveClass(`cps-badge--${variant}`);
    },
  );

  it("passes through native attributes such as an accessible label", () => {
    render(
      <Badge size="sm" aria-label="3 unread notifications">
        3
      </Badge>,
    );
    const badge = screen.getByLabelText("3 unread notifications");
    expect(badge).toHaveClass("cps-badge--sm");
  });
});
