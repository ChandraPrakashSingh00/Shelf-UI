import { act, fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef, useState } from "react";
import { hydrateRoot } from "react-dom/client";
import { renderToString } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Modal } from "../Modal/Modal.jsx";
import { DatePicker } from "./DatePicker.jsx";

// Local dates at midnight; months are 1-based here for readability.
const day = (year, month, date) => new Date(year, month - 1, date);

// Day buttons are named by their full date. (Faster than getByRole across 42 days.)
const dayButton = (name) => screen.getByLabelText(name, { selector: "button" });

function renderPicker(props = {}) {
  const user = userEvent.setup();
  const result = render(
    <>
      <DatePicker locale="en-IN" label="Delivery date" {...props} />
      <button type="button">Outside</button>
      <p>Plain text</p>
    </>,
  );
  const field = () => screen.getByRole("button", { name: /^Delivery date/ });
  return { user, field, ...result };
}

describe("DatePicker", () => {
  beforeEach(() => {
    // Only Date is faked, so user-event's timers keep working.
    vi.useFakeTimers({ toFake: ["Date"] });
    // Tuesday 6 October 2026, 10:30 in the morning.
    vi.setSystemTime(new Date(2026, 9, 6, 10, 30));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders a closed field button named by its label and placeholder", () => {
    const { field } = renderPicker();

    expect(field()).toHaveAccessibleName("Delivery date Select date");
    expect(field()).toHaveAttribute("aria-haspopup", "dialog");
    expect(field()).toHaveAttribute("aria-expanded", "false");
    expect(field()).not.toHaveAttribute("aria-controls");
    expect(screen.getByLabelText("Delivery date")).toBe(field());
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Clear date" })).not.toBeInTheDocument();
  });

  it("opens a non-modal dialog on click and focuses today", async () => {
    const { user, field } = renderPicker();
    await user.click(field());

    const dialog = screen.getByRole("dialog", { name: "Delivery date" });
    expect(dialog).not.toHaveAttribute("aria-modal");
    expect(field()).toHaveAttribute("aria-expanded", "true");
    expect(field()).toHaveAttribute("aria-controls", dialog.id);
    expect(within(dialog).getByRole("grid", { name: "October 2026" })).toBeInTheDocument();
    expect(dayButton("Tuesday, 6 October 2026")).toHaveFocus();
  });

  it("closes when a day is picked, shows it and returns focus to the field", async () => {
    const onValueChange = vi.fn();
    const { user, field } = renderPicker({ onValueChange });
    await user.click(field());
    await user.click(dayButton("Monday, 12 October 2026"));

    expect(onValueChange).toHaveBeenCalledWith(day(2026, 10, 12));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(field()).toHaveAccessibleName("Delivery date 12 Oct 2026");
    expect(field()).toHaveFocus();
  });

  it("works from the keyboard: Enter opens, the arrow keys move and Enter picks", async () => {
    const onValueChange = vi.fn();
    const { user, field } = renderPicker({ onValueChange });

    await user.tab();
    expect(field()).toHaveFocus();
    await user.keyboard("{Enter}");
    expect(dayButton("Tuesday, 6 October 2026")).toHaveFocus();
    await user.keyboard("{ArrowDown}{ArrowRight}{Enter}");

    expect(onValueChange).toHaveBeenCalledWith(day(2026, 10, 14));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(field()).toHaveFocus();
  });

  it("opens on the selected day's month with that day focused", async () => {
    const { user, field } = renderPicker({ defaultValue: day(2026, 12, 25) });
    expect(field()).toHaveAccessibleName("Delivery date 25 Dec 2026");

    await user.click(field());
    expect(screen.getByRole("grid")).toHaveAccessibleName("December 2026");
    expect(dayButton("Friday, 25 December 2026")).toHaveFocus();
    expect(dayButton("Friday, 25 December 2026").closest("td")).toHaveAttribute(
      "aria-selected",
      "true",
    );
  });

  it("closes on Escape, returns focus to the field and keeps the key from outer handlers", async () => {
    const onOuterKeyDown = vi.fn();
    const user = userEvent.setup();
    render(
      <div onKeyDown={onOuterKeyDown}>
        <DatePicker locale="en-IN" label="Delivery date" />
      </div>,
    );
    const field = screen.getByRole("button", { name: /^Delivery date/ });

    await user.click(field);
    await user.keyboard("{ArrowRight}{Escape}");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(field).toHaveFocus();
    expect(onOuterKeyDown).toHaveBeenCalledTimes(1); // Only the arrow key.
  });

  it("closes on a click outside without moving focus, and when focus leaves", async () => {
    const { user, field } = renderPicker();

    await user.click(field());
    await user.click(screen.getByText("Plain text"));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(field()).not.toHaveFocus();

    await user.click(field());
    await user.click(screen.getByRole("button", { name: "Outside" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Outside" })).toHaveFocus();

    await user.click(field());
    await user.tab();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Outside" })).toHaveFocus();
  });

  it("toggles from the field button and keeps its own click handler", async () => {
    const onClick = vi.fn();
    const { user, field } = renderPicker({ onClick });

    await user.click(field());
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    await user.click(field());
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(onClick).toHaveBeenCalledTimes(2);
  });

  it("stays open after a pick with closeOnSelect={false}", async () => {
    const { user, field } = renderPicker({ closeOnSelect: false });
    await user.click(field());
    await user.click(dayButton("Thursday, 8 October 2026"));

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(field()).toHaveAccessibleName("Delivery date 8 Oct 2026");
  });

  it("clears the value with the clear button and keeps focus in the field", async () => {
    const onValueChange = vi.fn();
    const { user, field } = renderPicker({ defaultValue: day(2026, 10, 9), onValueChange });

    await user.click(screen.getByRole("button", { name: "Clear date" }));
    expect(onValueChange).toHaveBeenCalledWith(null);
    expect(field()).toHaveAccessibleName("Delivery date Select date");
    expect(field()).toHaveFocus();
    expect(screen.queryByRole("button", { name: "Clear date" })).not.toBeInTheDocument();
  });

  it("can hide the clear button and rename it", () => {
    const { unmount } = renderPicker({ defaultValue: day(2026, 10, 9), clearable: false });
    expect(screen.queryByRole("button", { name: "Clear date" })).not.toBeInTheDocument();
    unmount();

    renderPicker({ defaultValue: day(2026, 10, 9), clearLabel: "Remove delivery date" });
    expect(screen.getByRole("button", { name: "Remove delivery date" })).toBeInTheDocument();
  });

  it("supports a controlled value", async () => {
    const onValueChange = vi.fn();
    const { user, field, rerender } = renderPicker({
      value: day(2026, 10, 8),
      onValueChange,
    });

    await user.click(field());
    await user.click(dayButton("Saturday, 10 October 2026"));
    expect(onValueChange).toHaveBeenLastCalledWith(day(2026, 10, 10));
    expect(field()).toHaveAccessibleName("Delivery date 8 Oct 2026");

    rerender(
      <DatePicker
        locale="en-IN"
        label="Delivery date"
        value={day(2026, 10, 10)}
        onValueChange={onValueChange}
      />,
    );
    expect(field()).toHaveAccessibleName("Delivery date 10 Oct 2026");
  });

  it("supports a controlled open state", async () => {
    const onOpenChange = vi.fn();
    const { user, field, rerender } = renderPicker({ open: false, onOpenChange });

    await user.click(field());
    expect(onOpenChange).toHaveBeenLastCalledWith(true);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    rerender(<DatePicker locale="en-IN" label="Delivery date" open onOpenChange={onOpenChange} />);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(dayButton("Tuesday, 6 October 2026")).toHaveFocus();

    await user.keyboard("{Escape}");
    expect(onOpenChange).toHaveBeenLastCalledWith(false);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("can start open", () => {
    renderPicker({ defaultOpen: true, defaultValue: day(2026, 11, 2) });
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(dayButton("Monday, 2 November 2026")).toHaveFocus();
  });

  it("passes min, max, isDateDisabled and weekStartsOn to the calendar", async () => {
    const onValueChange = vi.fn();
    const { user, field } = renderPicker({
      min: day(2026, 10, 7),
      max: day(2026, 10, 20),
      isDateDisabled: (date) => date.getDay() === 0,
      weekStartsOn: 1,
      onValueChange,
    });
    await user.click(field());

    expect(screen.getAllByRole("columnheader")[0]).toHaveAccessibleName("Monday");
    expect(dayButton("Tuesday, 6 October 2026")).toHaveAttribute("aria-disabled", "true");
    expect(dayButton("Sunday, 11 October 2026")).toHaveAttribute("aria-disabled", "true");
    expect(dayButton("Wednesday, 21 October 2026")).toHaveAttribute("aria-disabled", "true");
    // Today is before `min`, so focus starts on the first day that can be picked.
    expect(dayButton("Wednesday, 7 October 2026")).toHaveFocus();

    await user.click(dayButton("Sunday, 11 October 2026"));
    expect(onValueChange).not.toHaveBeenCalled();
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  describe("range mode", () => {
    it("commits the range after the end day and shows it compactly", async () => {
      const onValueChange = vi.fn();
      const user = userEvent.setup();
      render(
        <DatePicker
          locale="en-IN"
          mode="range"
          label="Report period"
          onValueChange={onValueChange}
        />,
      );
      const field = screen.getByRole("button", { name: /^Report period/ });
      expect(field).toHaveAccessibleName("Report period Select date range");

      await user.click(field);
      await user.click(dayButton("Monday, 12 October 2026"));
      // Half a range is a draft: nothing is reported and the popup stays open.
      expect(onValueChange).not.toHaveBeenCalled();
      expect(screen.getByRole("dialog")).toBeInTheDocument();
      expect(field).toHaveAccessibleName("Report period Select date range");

      await user.click(dayButton("Friday, 16 October 2026"));
      expect(onValueChange).toHaveBeenCalledWith({
        start: day(2026, 10, 12),
        end: day(2026, 10, 16),
      });
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
      expect(field).toHaveAccessibleName("Report period 12–16 Oct 2026");
      expect(field).toHaveFocus();
    });

    it("drops a half-picked range when the popup closes", async () => {
      const onValueChange = vi.fn();
      const user = userEvent.setup();
      render(
        <DatePicker
          locale="en-IN"
          mode="range"
          label="Report period"
          defaultValue={{ start: day(2026, 10, 1), end: day(2026, 10, 5) }}
          onValueChange={onValueChange}
        />,
      );
      const field = screen.getByRole("button", { name: /^Report period/ });

      await user.click(field);
      await user.click(dayButton("Monday, 19 October 2026"));
      expect(dayButton("Thursday, 1 October 2026").closest("td")).not.toHaveAttribute(
        "aria-selected",
      );
      await user.keyboard("{Escape}");

      expect(onValueChange).not.toHaveBeenCalled();
      expect(field).toHaveAccessibleName("Report period 1–5 Oct 2026");
      await user.click(field);
      expect(dayButton("Thursday, 1 October 2026").closest("td")).toHaveAttribute(
        "aria-selected",
        "true",
      );
      expect(dayButton("Monday, 19 October 2026").closest("td")).not.toHaveAttribute(
        "aria-selected",
      );
    });

    it("applies presets, shows the matching one as current, and closes", async () => {
      const onValueChange = vi.fn();
      const lastWeek = { start: day(2026, 9, 30), end: day(2026, 10, 6) };
      const user = userEvent.setup();
      render(
        <DatePicker
          locale="en-IN"
          mode="range"
          label="Report period"
          presets={[
            { label: "Today", value: { start: day(2026, 10, 6), end: day(2026, 10, 6) } },
            { label: "Last 7 days", value: lastWeek },
          ]}
          onValueChange={onValueChange}
        />,
      );
      const field = screen.getByRole("button", { name: /^Report period/ });

      await user.click(field);
      const presets = screen.getByRole("group", { name: "Presets" });
      await user.click(within(presets).getByRole("button", { name: "Last 7 days" }));
      expect(onValueChange).toHaveBeenCalledWith(lastWeek);
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
      // Intl puts thin spaces around the dash between months.
      expect(field).toHaveAccessibleName(/^Report period 30 Sept\s–\s6 Oct 2026$/);

      await user.click(field);
      expect(screen.getByRole("button", { name: "Last 7 days" })).toHaveAttribute(
        "aria-current",
        "true",
      );
      expect(screen.getByRole("button", { name: "Today" })).not.toHaveAttribute("aria-current");
      expect(screen.getByRole("grid")).toHaveAccessibleName("September 2026");
    });

    it("uses formatDate for both ends", () => {
      render(
        <DatePicker
          mode="range"
          label="Sale period"
          defaultValue={{ start: day(2026, 10, 16), end: day(2026, 10, 25) }}
          formatDate={(date) => `${date.getDate()}/${date.getMonth() + 1}`}
        />,
      );
      expect(screen.getByRole("button", { name: /^Sale period/ })).toHaveAccessibleName(
        "Sale period 16/10 – 25/10",
      );
    });
  });

  it("formats the value with formatDate or the locale", () => {
    const { unmount } = renderPicker({
      defaultValue: day(2026, 10, 6),
      formatDate: (date) => date.toLocaleDateString("en-IN", { weekday: "long", day: "numeric" }),
    });
    expect(screen.getByText("Tuesday 6")).toBeInTheDocument();
    unmount();

    render(<DatePicker locale="hi-IN" label="तारीख" defaultValue={day(2026, 10, 6)} />);
    expect(screen.getByText("6 अक्टू॰ 2026")).toBeInTheDocument();
  });

  it("shows helper text and errors as the field's description", () => {
    const { rerender, field } = renderPicker({ helperText: "We deliver Monday to Saturday." });
    expect(field()).toHaveAccessibleDescription("We deliver Monday to Saturday.");
    expect(field()).not.toHaveAttribute("aria-invalid");

    rerender(
      <DatePicker
        locale="en-IN"
        label="Delivery date"
        helperText="We deliver Monday to Saturday."
        error="Choose a delivery date."
      />,
    );
    expect(field()).toHaveAccessibleDescription("Choose a delivery date.");
    expect(field()).toHaveAttribute("aria-invalid", "true");
    expect(field().closest(".cps-field")).toHaveClass("cps-field--invalid");
  });

  it("disables the field, its clear button and its form value", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <form aria-label="Order">
        <DatePicker
          locale="en-IN"
          label="Delivery date"
          name="deliveryDate"
          defaultValue={day(2026, 10, 9)}
          disabled
        />
      </form>,
    );
    const field = screen.getByRole("button", { name: /^Delivery date/ });
    expect(field).toBeDisabled();
    expect(screen.queryByRole("button", { name: "Clear date" })).not.toBeInTheDocument();
    expect(container.querySelector(".cps-field")).toHaveClass("cps-field--disabled");
    expect(new FormData(screen.getByRole("form")).get("deliveryDate")).toBeNull();

    await user.click(field);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("submits the value as a local ISO date and resets with its form", async () => {
    const user = userEvent.setup();
    render(
      <form aria-label="Order">
        <DatePicker
          locale="en-IN"
          label="Delivery date"
          name="deliveryDate"
          defaultValue={day(2026, 10, 9)}
        />
        <button type="reset">Reset</button>
      </form>,
    );
    const form = screen.getByRole("form");
    const field = screen.getByRole("button", { name: /^Delivery date/ });
    expect(new FormData(form).get("deliveryDate")).toBe("2026-10-09");

    await user.click(field);
    await user.click(dayButton("Tuesday, 20 October 2026"));
    expect(new FormData(form).get("deliveryDate")).toBe("2026-10-20");

    await user.click(screen.getByRole("button", { name: "Reset" }));
    expect(new FormData(form).get("deliveryDate")).toBe("2026-10-09");
    expect(field).toHaveAccessibleName("Delivery date 9 Oct 2026");
  });

  it("submits a range as nameStart and nameEnd", async () => {
    const user = userEvent.setup();
    render(
      <form aria-label="Report">
        <DatePicker locale="en-IN" mode="range" label="Report period" name="report" />
      </form>,
    );
    const form = screen.getByRole("form");
    expect(Object.fromEntries(new FormData(form))).toEqual({ reportStart: "", reportEnd: "" });

    await user.click(screen.getByRole("button", { name: /^Report period/ }));
    await user.click(dayButton("Thursday, 1 October 2026"));
    await user.click(dayButton("Wednesday, 7 October 2026"));
    expect(Object.fromEntries(new FormData(form))).toEqual({
      reportStart: "2026-10-01",
      reportEnd: "2026-10-07",
    });
  });

  it("blocks submitting an empty required field and points the browser at the button", async () => {
    const user = userEvent.setup();
    render(
      <form aria-label="Order">
        <DatePicker locale="en-IN" label="Delivery date" name="deliveryDate" required />
      </form>,
    );
    const form = screen.getByRole("form");
    const field = screen.getByRole("button", { name: /^Delivery date/ });
    expect(screen.getByText("*")).toHaveAttribute("aria-hidden", "true");
    expect(form.checkValidity()).toBe(false);

    // The browser focuses the first invalid control: focus moves on to the button.
    fireEvent.focus(form.querySelector("input[required]"));
    expect(field).toHaveFocus();

    await user.click(field);
    await user.click(dayButton("Thursday, 8 October 2026"));
    expect(form.checkValidity()).toBe(true);
  });

  it("closes only itself on Escape inside a Modal", async () => {
    const user = userEvent.setup();
    render(
      <Modal open onClose={vi.fn()} title="Schedule delivery">
        <DatePicker locale="en-IN" label="Delivery date" />
      </Modal>,
    );
    const field = screen.getByRole("button", { name: /^Delivery date/ });
    await user.click(field);
    await user.keyboard("{Escape}");

    expect(screen.queryByRole("dialog", { name: "Delivery date" })).not.toBeInTheDocument();
    expect(screen.getByRole("dialog", { name: "Schedule delivery" })).toBeInTheDocument();
    expect(field).toHaveFocus();
  });

  it("is named by aria-label and its value without a visible label", async () => {
    const user = userEvent.setup();
    render(<DatePicker locale="en-IN" aria-label="Pickup date" defaultValue={day(2026, 10, 9)} />);

    const field = screen.getByRole("button", { name: "Pickup date 9 Oct 2026" });
    await user.click(field);
    expect(screen.getByRole("dialog", { name: "Pickup date" })).toBeInTheDocument();
  });

  it("forwards the ref, id and native attributes to the button, className and style to the wrapper", () => {
    const ref = createRef();
    const { container } = render(
      <DatePicker
        ref={ref}
        id="delivery"
        label="Delivery date"
        size="lg"
        align="end"
        className="checkout-date"
        style={{ maxWidth: 320 }}
        data-testid="delivery-field"
      />,
    );
    const field = screen.getByRole("button", { name: /^Delivery date/ });
    expect(ref.current).toBe(field);
    expect(field).toHaveAttribute("id", "delivery");
    expect(field).toHaveAttribute("data-testid", "delivery-field");
    expect(container.firstChild).toHaveClass(
      "cps-field",
      "cps-field--lg",
      "cps-date-picker",
      "checkout-date",
    );
    expect(container.firstChild).toHaveStyle({ maxWidth: "320px" });
  });

  it("aligns the popup with the end of the field", async () => {
    const { user, field } = renderPicker({ align: "end" });
    await user.click(field());
    expect(screen.getByRole("dialog")).toHaveClass("cps-date-picker__popup--end");
  });

  it("renders on the server without touching the browser", () => {
    vi.useRealTimers();
    const html = renderToString(
      <DatePicker
        locale="en-IN"
        label="Delivery date"
        name="deliveryDate"
        defaultValue={day(2026, 10, 6)}
      />,
    );
    expect(html).toContain("6 Oct 2026");
    expect(html).toContain('value="2026-10-06"');
    expect(html).toContain('aria-expanded="false"');
  });

  it("shows the value in en-US on the server without a locale, then in the user's locale once hydrated", async () => {
    vi.useRealTimers();
    // A server and browser whose own locale is German.
    const RealDateTimeFormat = Intl.DateTimeFormat;
    vi.spyOn(Intl, "DateTimeFormat").mockImplementation(function DateTimeFormat(locale, options) {
      return new RealDateTimeFormat(locale ?? "de-DE", options);
    });
    // Fresh date helpers, whose formatter cache hasn't seen the real default locale.
    vi.resetModules();
    const { DatePicker: FreshDatePicker } = await import("./DatePicker.jsx");

    const element = <FreshDatePicker label="Delivery date" defaultValue={day(2026, 10, 6)} />;
    const html = renderToString(element);
    expect(html).toContain("Oct 6, 2026");
    expect(html).not.toContain("Okt");

    const container = document.createElement("div");
    container.innerHTML = html;
    document.body.append(container);
    const onRecoverableError = vi.fn();
    let root;
    await act(async () => {
      root = hydrateRoot(container, element, { onRecoverableError });
    });
    expect(onRecoverableError).not.toHaveBeenCalled();
    expect(container).toHaveTextContent("6. Okt. 2026");
    act(() => root.unmount());
    container.remove();
  });

  it("works as a controlled field in a parent component", async () => {
    function Checkout() {
      const [date, setDate] = useState(null);
      return (
        <>
          <DatePicker locale="en-IN" label="Delivery date" value={date} onValueChange={setDate} />
          <p>{date ? `Arrives ${date.toDateString()}` : "No date"}</p>
        </>
      );
    }
    const user = userEvent.setup();
    render(<Checkout />);

    await user.click(screen.getByRole("button", { name: /^Delivery date/ }));
    await user.click(dayButton("Thursday, 8 October 2026"));
    expect(screen.getByText("Arrives Thu Oct 08 2026")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Clear date" }));
    expect(screen.getByText("No date")).toBeInTheDocument();
  });
});
