import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef } from "react";
import { describe, expect, it, vi } from "vitest";
import { Stepper } from "./Stepper.jsx";

const checkout = [
  { id: "address", title: "Address", description: "Deliver to Mumbai" },
  { id: "payment", title: "Payment" },
  { id: "review", title: "Review" },
];

const getSteps = () => within(screen.getByRole("list")).getAllByRole("listitem");

describe("Stepper", () => {
  it("renders an ordered list named “Progress” with one item per step", () => {
    render(<Stepper steps={checkout} activeStep={1} />);

    const list = screen.getByRole("list", { name: "Progress" });
    expect(list.tagName).toBe("OL");
    expect(getSteps()).toHaveLength(3);
  });

  it("uses `label` as the list's accessible name", () => {
    render(<Stepper steps={checkout} activeStep={0} label="Checkout progress" />);
    expect(screen.getByRole("list", { name: "Checkout progress" })).toBeInTheDocument();
  });

  it("marks the current step with aria-current and the others with their status class", () => {
    render(<Stepper steps={checkout} activeStep={1} />);
    const [address, payment, review] = getSteps();

    expect(payment).toHaveAttribute("aria-current", "step");
    expect(address).not.toHaveAttribute("aria-current");
    expect(review).not.toHaveAttribute("aria-current");

    expect(address).toHaveClass("cps-stepper__step--complete");
    expect(payment).toHaveClass("cps-stepper__step--current");
    expect(review).toHaveClass("cps-stepper__step--upcoming");
  });

  it("includes each step's status as text, so it doesn't rely on color", () => {
    render(<Stepper steps={checkout} activeStep={1} />);
    const [address, payment, review] = getSteps();

    expect(address).toHaveTextContent("Address, Deliver to Mumbai, Completed");
    expect(payment).toHaveTextContent("Payment, Current");
    expect(review).toHaveTextContent("Review, Not started");
  });

  it("shows numbers for current and upcoming steps and a check for completed ones", () => {
    render(<Stepper steps={checkout} activeStep={1} />);
    const indicators = getSteps().map((step) => step.querySelector(".cps-stepper__indicator"));

    expect(indicators[0]?.querySelector("svg")).not.toBeNull();
    expect(indicators[1]).toHaveTextContent("2");
    expect(indicators[2]).toHaveTextContent("3");
    for (const indicator of indicators) expect(indicator).toHaveAttribute("aria-hidden", "true");
  });

  it("marks a step as failed with status: 'error', keeping it current", () => {
    const steps = [checkout[0], { ...checkout[1], status: "error" }, checkout[2]];
    render(<Stepper steps={steps} activeStep={1} />);
    const payment = getSteps()[1];

    expect(payment).toHaveClass("cps-stepper__step--error", "cps-stepper__step--current");
    expect(payment).toHaveAttribute("aria-current", "step");
    expect(payment).toHaveTextContent("Payment, Error");
    expect(payment.querySelector(".cps-stepper__indicator svg")).not.toBeNull();
  });

  it("colors the connectors after completed steps", () => {
    const { container } = render(<Stepper steps={checkout} activeStep={1} />);
    const connectors = container.querySelectorAll(".cps-stepper__connector");

    // No connector after the last step.
    expect(connectors).toHaveLength(2);
    expect(connectors[0]).toHaveClass("cps-stepper__connector--complete");
    expect(connectors[1]).not.toHaveClass("cps-stepper__connector--complete");
    expect(connectors[0]).toHaveAttribute("aria-hidden", "true");
  });

  it("marks every step complete when activeStep is past the last step", () => {
    render(<Stepper steps={checkout} activeStep={3} />);
    for (const step of getSteps()) {
      expect(step).toHaveClass("cps-stepper__step--complete");
      expect(step).not.toHaveAttribute("aria-current");
    }
  });

  it("shows an optional hint, with a configurable label", () => {
    const steps = [{ title: "Business details" }, { title: "Brand logo", optional: true }];
    const { rerender } = render(<Stepper steps={steps} activeStep={0} />);
    expect(getSteps()[1]).toHaveTextContent("Brand logo, Optional, Not started");

    rerender(<Stepper steps={steps} activeStep={0} optionalLabel="Skippable" />);
    expect(getSteps()[1]).toHaveTextContent("Brand logo, Skippable");
  });

  it("uses custom status labels, merged with the defaults", () => {
    render(
      <Stepper
        steps={checkout}
        activeStep={1}
        statusLabels={{ complete: "पूर्ण", current: "वर्तमान" }}
      />,
    );
    const [address, payment, review] = getSteps();
    expect(address).toHaveTextContent("पूर्ण");
    expect(payment).toHaveTextContent("वर्तमान");
    expect(review).toHaveTextContent("Not started");
  });

  it("has no buttons without onStepClick", () => {
    render(<Stepper steps={checkout} activeStep={2} />);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("turns only completed steps into buttons when onStepClick is set", async () => {
    const user = userEvent.setup();
    const onStepClick = vi.fn();
    render(<Stepper steps={checkout} activeStep={2} onStepClick={onStepClick} />);

    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(2);
    expect(buttons[0]).toHaveAccessibleName("Address, Deliver to Mumbai, Completed");
    expect(buttons[0]).toHaveAttribute("type", "button");

    await user.click(screen.getByRole("button", { name: /^Payment/ }));
    expect(onStepClick).toHaveBeenCalledWith(1);
  });

  it("activates completed steps from the keyboard", async () => {
    const user = userEvent.setup();
    const onStepClick = vi.fn();
    render(<Stepper steps={checkout} activeStep={2} onStepClick={onStepClick} />);

    await user.tab();
    expect(screen.getByRole("button", { name: /^Address/ })).toHaveFocus();
    await user.keyboard("{Enter}");
    expect(onStepClick).toHaveBeenLastCalledWith(0);

    await user.tab();
    await user.keyboard(" ");
    expect(onStepClick).toHaveBeenLastCalledWith(1);

    // The current step isn't a button, so focus leaves the stepper.
    await user.tab();
    expect(document.body).toHaveFocus();
  });

  it("applies orientation and size classes", () => {
    const { rerender } = render(<Stepper steps={checkout} activeStep={0} />);
    const list = screen.getByRole("list");
    expect(list).toHaveClass("cps-stepper", "cps-stepper--horizontal", "cps-stepper--md");

    rerender(<Stepper steps={checkout} activeStep={0} orientation="vertical" size="sm" />);
    expect(list).toHaveClass("cps-stepper--vertical", "cps-stepper--sm");
  });

  it("uses step ids as keys without warnings, and falls back to the index", () => {
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});
    render(<Stepper steps={[{ title: "One" }, { title: "Two" }]} activeStep={0} />);
    expect(consoleError).not.toHaveBeenCalled();
  });

  it("forwards the ref, className and other props to the list", () => {
    const ref = createRef();
    render(
      <Stepper
        ref={ref}
        steps={checkout}
        activeStep={0}
        className="checkout-steps"
        data-testid="stepper"
      />,
    );
    const list = screen.getByRole("list");
    expect(ref.current).toBe(list);
    expect(list).toHaveClass("cps-stepper", "checkout-steps");
    expect(list).toHaveAttribute("data-testid", "stepper");
  });
});
