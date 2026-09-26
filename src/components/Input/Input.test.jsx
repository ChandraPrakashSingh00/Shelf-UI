import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef } from "react";
import { describe, expect, it, vi } from "vitest";
import { Input } from "./Input.jsx";

describe("Input", () => {
  it("associates the label with the input", () => {
    render(<Input label="Email" placeholder="Enter your email" />);
    const input = screen.getByLabelText("Email");
    expect(input).toHaveAttribute("placeholder", "Enter your email");
    expect(input).not.toHaveAttribute("aria-invalid");
  });

  it("exposes helper text as the accessible description", () => {
    render(<Input label="Username" helperText="Lowercase letters only" />);
    expect(screen.getByLabelText("Username")).toHaveAccessibleDescription("Lowercase letters only");
  });

  it("marks the input invalid and describes it with the error, replacing helper text", () => {
    render(<Input label="Email" helperText="We never share it" error="Invalid email" />);

    const input = screen.getByLabelText("Email");
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAccessibleDescription("Invalid email");
    expect(screen.queryByText("We never share it")).not.toBeInTheDocument();
  });

  it("supports error={true} to mark the field invalid without a message", () => {
    render(<Input label="Code" error />);
    const input = screen.getByLabelText("Code");
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).not.toHaveAccessibleDescription();
  });

  it("keeps a consumer-provided aria-describedby alongside the message", () => {
    render(
      <>
        <span id="external-hint">Shown on the invoice</span>
        <Input label="Company" helperText="Legal name" aria-describedby="external-hint" />
      </>,
    );
    expect(screen.getByLabelText("Company")).toHaveAccessibleDescription(
      "Shown on the invoice Legal name",
    );
  });

  it("marks required inputs natively without adding the asterisk to the name", () => {
    render(<Input label="Full name" required />);
    const input = screen.getByRole("textbox", { name: "Full name" });
    expect(input).toBeRequired();
  });

  it("accepts typing and reports changes", async () => {
    const onChange = vi.fn();
    render(<Input label="Search" onChange={onChange} />);

    const input = screen.getByLabelText("Search");
    await userEvent.type(input, "React");

    expect(input).toHaveValue("React");
    expect(onChange).toHaveBeenCalledTimes(5);
  });

  it("cannot be edited when disabled", async () => {
    render(<Input label="Plan" disabled defaultValue="Pro" />);

    const input = screen.getByLabelText("Plan");
    expect(input).toBeDisabled();
    await userEvent.type(input, "x");
    expect(input).toHaveValue("Pro");
  });

  it("applies the size to the field without leaking a native size attribute", () => {
    const { container } = render(<Input label="Name" size="lg" />);
    expect(container.firstChild).toHaveClass("cps-field--lg");
    expect(screen.getByLabelText("Name")).not.toHaveAttribute("size");
  });

  it("forwards the ref to the input and keeps a custom id", () => {
    const ref = createRef();
    render(<Input ref={ref} id="email-field" label="Email" />);

    const input = screen.getByLabelText("Email");
    expect(ref.current).toBe(input);
    expect(input).toHaveAttribute("id", "email-field");
  });
});
