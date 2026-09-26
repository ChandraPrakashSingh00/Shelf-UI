import { render, screen } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it } from "vitest";
import { Progress } from "./Progress.jsx";

const bar = (progressbar) => progressbar.querySelector(".cps-progress__bar");

describe("Progress", () => {
  it("renders a progress bar named by its visible label", () => {
    render(<Progress label="Deploying codecps-web" value={45} />);

    const progressbar = screen.getByRole("progressbar", { name: "Deploying codecps-web" });
    const label = screen.getByText("Deploying codecps-web");
    expect(progressbar).toHaveAttribute("aria-labelledby", label.id);
    expect(progressbar).toHaveAttribute("aria-valuemin", "0");
    expect(progressbar).toHaveAttribute("aria-valuemax", "100");
    expect(progressbar).toHaveAttribute("aria-valuenow", "45");
    expect(progressbar).not.toHaveAttribute("aria-valuetext");
    expect(bar(progressbar).style.width).toBe("45%");
  });

  it("fills relative to max", () => {
    render(<Progress aria-label="Files uploaded" value={3} max={12} showValue />);

    const progressbar = screen.getByRole("progressbar", { name: "Files uploaded" });
    expect(progressbar).toHaveAttribute("aria-valuemax", "12");
    expect(progressbar).toHaveAttribute("aria-valuenow", "3");
    expect(bar(progressbar).style.width).toBe("25%");
    expect(screen.getByText("25%")).toBeInTheDocument();
  });

  it("clamps the value between 0 and max", () => {
    const { rerender } = render(<Progress aria-label="Build" value={140} />);
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "100");
    expect(bar(screen.getByRole("progressbar")).style.width).toBe("100%");

    rerender(<Progress aria-label="Build" value={-20} />);
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "0");
    expect(bar(screen.getByRole("progressbar")).style.width).toBe("0%");
  });

  it("shows the rounded percentage only with showValue, hidden from screen readers", () => {
    const { rerender } = render(<Progress label="Migrating database" value={62.4} />);
    expect(screen.queryByText("62%")).not.toBeInTheDocument();

    rerender(<Progress label="Migrating database" value={62.4} showValue />);
    const value = screen.getByText("62%");
    expect(value).toHaveAttribute("aria-hidden", "true");
    // The value text doesn't become part of the bar's name.
    expect(screen.getByRole("progressbar")).toHaveAccessibleName("Migrating database");
  });

  it("formats the value text and exposes it as aria-valuetext", () => {
    render(
      <Progress
        label="Uploading project-assets.zip"
        value={12}
        max={24}
        showValue
        formatValue={(value, max) => `${value} MB of ${max} MB`}
      />,
    );

    expect(screen.getByText("12 MB of 24 MB")).toBeInTheDocument();
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuetext", "12 MB of 24 MB");
  });

  it("is indeterminate without a value", () => {
    const { container } = render(
      <Progress label="Preparing your workspace" showValue formatValue={() => "Almost"} />,
    );

    const progressbar = screen.getByRole("progressbar", { name: "Preparing your workspace" });
    expect(progressbar).not.toHaveAttribute("aria-valuenow");
    expect(progressbar).not.toHaveAttribute("aria-valuetext");
    expect(bar(progressbar)).not.toHaveAttribute("style");
    expect(container.firstElementChild).toHaveClass("cps-progress--indeterminate");
    expect(container.querySelector(".cps-progress__value")).toBeNull();
  });

  it("puts aria-label, aria-labelledby and aria-describedby on the progress bar", () => {
    const { container } = render(
      <>
        <h2 id="backup-title">Nightly backup</h2>
        <p id="backup-help">Runs every day at 02:00 IST.</p>
        <Progress
          value={30}
          aria-labelledby="backup-title"
          aria-describedby="backup-help"
          label="Visible label"
        />
        <Progress value={30} aria-label="Sync" />
      </>,
    );

    const [labelledBy, labelled] = screen.getAllByRole("progressbar");
    expect(labelledBy).toHaveAccessibleName("Nightly backup");
    expect(labelledBy).toHaveAccessibleDescription("Runs every day at 02:00 IST.");
    expect(labelled).toHaveAccessibleName("Sync");
    for (const root of container.querySelectorAll(".cps-progress")) {
      expect(root).not.toHaveAttribute("aria-label");
      expect(root).not.toHaveAttribute("aria-labelledby");
      expect(root).not.toHaveAttribute("aria-describedby");
    }
  });

  it("defaults to the primary variant and medium size", () => {
    const { container } = render(<Progress aria-label="Build" value={10} />);
    expect(container.firstElementChild).toHaveClass(
      "cps-progress",
      "cps-progress--primary",
      "cps-progress--md",
    );
  });

  it.each(["primary", "success", "warning", "danger"])("applies the %s variant", (variant) => {
    const { container } = render(<Progress aria-label="Build" value={10} variant={variant} />);
    expect(container.firstElementChild).toHaveClass(`cps-progress--${variant}`);
  });

  it.each(["sm", "md", "lg"])("applies the %s size", (size) => {
    const { container } = render(<Progress aria-label="Build" value={10} size={size} />);
    expect(container.firstElementChild).toHaveClass(`cps-progress--${size}`);
  });

  it("forwards the ref and native attributes to the root, and merges className", () => {
    const ref = createRef();
    const { container } = render(
      <Progress ref={ref} aria-label="Build" value={10} className="custom" id="build-progress" />,
    );

    const root = container.firstElementChild;
    expect(ref.current).toBe(root);
    expect(root).toHaveClass("cps-progress", "custom");
    expect(root).toHaveAttribute("id", "build-progress");
    expect(root).not.toHaveAttribute("role");
  });
});
