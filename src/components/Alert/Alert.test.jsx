import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Button } from "../Button/Button.jsx";
import { Alert } from "./Alert.jsx";

describe("Alert", () => {
  it.each([
    ["error", "alert"],
    ["warning", "alert"],
    ["info", "status"],
    ["success", "status"],
  ])("uses role=%s → %s so urgency matches the message", (variant, role) => {
    render(<Alert variant={variant} title="Heads up" />);
    expect(screen.getByRole(role)).toHaveClass(`cps-alert--${variant}`);
  });

  it("renders title, description and a decorative default icon", () => {
    render(<Alert title="Deployment failed" description="Check the build logs." variant="error" />);

    const alert = screen.getByRole("alert");
    expect(alert).toHaveTextContent("Deployment failed");
    expect(alert).toHaveTextContent("Check the build logs.");
    expect(alert.querySelector(".cps-alert__icon")).toHaveAttribute("aria-hidden", "true");
  });

  it("supports a custom icon or no icon", () => {
    const { rerender } = render(<Alert title="Custom" icon={<svg data-testid="custom-icon" />} />);
    expect(screen.getByTestId("custom-icon")).toBeInTheDocument();

    rerender(<Alert title="No icon" icon={null} />);
    expect(screen.getByRole("status").querySelector(".cps-alert__icon")).not.toBeInTheDocument();
  });

  it("only shows a dismiss button when onDismiss is provided", async () => {
    const onDismiss = vi.fn();
    const { rerender } = render(<Alert title="Saved" />);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();

    rerender(<Alert title="Saved" onDismiss={onDismiss} dismissLabel="Close message" />);
    await userEvent.click(screen.getByRole("button", { name: "Close message" }));
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it("renders an action area", async () => {
    const onRetry = vi.fn();
    render(
      <Alert
        variant="warning"
        title="Connection lost"
        action={
          <Button size="sm" onClick={onRetry}>
            Retry
          </Button>
        }
      />,
    );

    await userEvent.click(screen.getByRole("button", { name: "Retry" }));
    expect(onRetry).toHaveBeenCalled();
  });

  it("lets consumers override the role", () => {
    render(<Alert variant="error" role="note" title="Static note" />);
    expect(screen.getByRole("note")).toBeInTheDocument();
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });
});
