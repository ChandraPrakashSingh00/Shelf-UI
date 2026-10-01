import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef, useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { Rating } from "./Rating.jsx";

const star = (name) => screen.getByRole("radio", { name });
const activeStars = (container) => container.querySelectorAll(".cps-rating__item--active").length;

describe("Rating", () => {
  it("renders a labelled radio group with one radio per star", () => {
    render(<Rating label="Rate this product" />);

    const group = screen.getByRole("radiogroup", { name: "Rate this product" });
    const radios = screen.getAllByRole("radio");
    expect(group.tagName).toBe("FIELDSET");
    expect(radios).toHaveLength(5);
    expect(radios.map((radio) => radio.getAttribute("value"))).toEqual(["1", "2", "3", "4", "5"]);
    expect(star("1 star")).not.toBeChecked();
    expect(star("5 stars")).toBeInTheDocument();
    // Every radio shares one name, so the browser groups them.
    expect(new Set(radios.map((radio) => radio.name)).size).toBe(1);
  });

  it("selects a rating on click and fills the stars up to it", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    const { container } = render(
      <Rating label="Rate this product" onValueChange={onValueChange} />,
    );

    await user.click(star("4 stars"));
    expect(onValueChange).toHaveBeenCalledWith(4);
    expect(star("4 stars")).toBeChecked();
    await user.unhover(star("4 stars"));
    expect(activeStars(container)).toBe(4);
  });

  it("previews the rating on hover", async () => {
    const user = userEvent.setup();
    const { container } = render(<Rating label="Rate this product" defaultValue={2} />);
    expect(activeStars(container)).toBe(2);

    await user.hover(star("5 stars"));
    expect(activeStars(container)).toBe(5);

    await user.unhover(star("5 stars"));
    fireEvent.mouseLeave(container.querySelector(".cps-rating"));
    expect(activeStars(container)).toBe(2);
  });

  it("previews only for a mouse, so a tap doesn't leave stars stuck filled", () => {
    const { container } = render(<Rating label="Rate this product" defaultValue={2} />);
    const items = container.querySelectorAll(".cps-rating__item");

    fireEvent.pointerOver(items[4], { pointerType: "touch" });
    expect(activeStars(container)).toBe(2);

    fireEvent.pointerOver(items[4], { pointerType: "mouse" });
    expect(activeStars(container)).toBe(5);
  });

  it("empties the stars right away when the selected star is clicked again", async () => {
    const user = userEvent.setup();
    const { container } = render(<Rating label="Rate this product" defaultValue={3} />);

    // The pointer stays over the star it just cleared.
    await user.click(star("3 stars"));
    expect(screen.getAllByRole("radio").some((radio) => radio.checked)).toBe(false);
    expect(activeStars(container)).toBe(0);

    await user.hover(star("4 stars"));
    expect(activeStars(container)).toBe(4);
    await user.click(star("4 stars"));
    await user.keyboard("{Backspace}");
    expect(activeStars(container)).toBe(0);
  });

  it("moves the selection with the arrow keys, like any radio group", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Rating label="Rate this product" defaultValue={3} onValueChange={onValueChange} />);

    await user.tab();
    expect(star("3 stars")).toHaveFocus();
    await user.keyboard("{ArrowRight}");
    expect(star("4 stars")).toBeChecked();
    expect(onValueChange).toHaveBeenLastCalledWith(4);

    await user.keyboard("{ArrowLeft}{ArrowLeft}");
    expect(star("2 stars")).toBeChecked();
    expect(onValueChange).toHaveBeenLastCalledWith(2);
  });

  it("clears the rating by clicking the selected star again, or with Backspace / Delete", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    const { container } = render(
      <Rating label="Rate this product" defaultValue={3} onValueChange={onValueChange} />,
    );

    await user.click(star("3 stars"));
    expect(onValueChange).toHaveBeenLastCalledWith(0);
    expect(screen.getAllByRole("radio").some((radio) => radio.checked)).toBe(false);
    await user.unhover(star("3 stars"));
    fireEvent.mouseLeave(container.querySelector(".cps-rating"));
    expect(activeStars(container)).toBe(0);

    await user.click(star("2 stars"));
    await user.keyboard("{Backspace}");
    expect(onValueChange).toHaveBeenLastCalledWith(0);

    await user.click(star("5 stars"));
    await user.keyboard("{Delete}");
    expect(onValueChange).toHaveBeenLastCalledWith(0);
  });

  it("does not clear on Space, or at all with clearable={false}", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    const { rerender } = render(
      <Rating label="Rate this product" defaultValue={3} onValueChange={onValueChange} />,
    );

    star("3 stars").focus();
    await user.keyboard(" ");
    expect(star("3 stars")).toBeChecked();

    rerender(
      <Rating
        label="Rate this product"
        defaultValue={3}
        clearable={false}
        onValueChange={onValueChange}
      />,
    );
    await user.click(star("3 stars"));
    await user.keyboard("{Backspace}");
    expect(star("3 stars")).toBeChecked();
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it("supports controlled usage", async () => {
    const user = userEvent.setup();
    function Review() {
      const [rating, setRating] = useState(0);
      return (
        <>
          <Rating label="Delivery experience" value={rating} onValueChange={setRating} />
          <output>{rating}</output>
        </>
      );
    }
    render(<Review />);

    await user.click(star("5 stars"));
    expect(screen.getByRole("status")).toHaveTextContent("5");

    const onValueChange = vi.fn();
    const { container } = render(
      <Rating aria-label="Fixed" value={2} onValueChange={onValueChange} />,
    );
    const radios = container.querySelectorAll("input");
    await user.click(radios[3]);
    expect(onValueChange).toHaveBeenCalledWith(4);
    expect(radios[1]).toBeChecked();
    expect(radios[3]).not.toBeChecked();
  });

  it("uses custom star labels and max", () => {
    const labels = ["Poor", "Fair", "Good", "Very good", "Excellent", "Outstanding"];
    render(<Rating label="Seller rating" max={6} getLabel={(value) => labels[value - 1]} />);
    expect(screen.getAllByRole("radio")).toHaveLength(6);
    expect(star("Excellent")).toHaveAttribute("value", "5");
  });

  it("describes the group with helper text, or the error instead", () => {
    const { rerender } = render(
      <Rating label="Rate this product" helperText="Your rating is public" />,
    );
    const group = screen.getByRole("radiogroup");
    expect(group).toHaveAccessibleDescription("Your rating is public");

    rerender(
      <Rating
        label="Rate this product"
        helperText="Your rating is public"
        error="Please choose a rating"
      />,
    );
    expect(group).toHaveAttribute("aria-invalid", "true");
    expect(group).toHaveAccessibleDescription("Please choose a rating");
    expect(group).toHaveClass("cps-rating-field--invalid");
  });

  it("disables every star and ignores hover", async () => {
    const user = userEvent.setup();
    const { container } = render(<Rating label="Rate this product" defaultValue={2} disabled />);

    for (const radio of screen.getAllByRole("radio")) expect(radio).toBeDisabled();
    expect(screen.getByRole("radiogroup")).toHaveClass("cps-rating-field--disabled");
    await user.hover(container.querySelectorAll(".cps-rating__item")[4]);
    expect(activeStars(container)).toBe(2);
  });

  it("takes part in forms: name, required and reset", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    const { container } = render(
      <form>
        <Rating
          label="Rate this product"
          name="rating"
          required
          defaultValue={4}
          onValueChange={onValueChange}
        />
        <button type="reset">Reset</button>
      </form>,
    );
    const form = container.querySelector("form");

    expect(screen.getByRole("radiogroup")).toHaveAttribute("aria-required", "true");
    for (const radio of screen.getAllByRole("radio")) expect(radio).toBeRequired();
    expect(new FormData(form).get("rating")).toBe("4");

    await user.click(star("2 stars"));
    expect(new FormData(form).get("rating")).toBe("2");

    await user.click(screen.getByRole("button", { name: "Reset" }));
    expect(star("4 stars")).toBeChecked();
    expect(new FormData(form).get("rating")).toBe("4");
    expect(onValueChange).toHaveBeenLastCalledWith(4);
  });

  it("resets with a form it's linked to through the form prop", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <>
        <form id="review-form">
          <button type="reset">Reset</button>
        </form>
        <Rating label="Rate this product" name="rating" form="review-form" />
      </>,
    );
    const form = container.querySelector("form");

    await user.click(star("3 stars"));
    await user.unhover(star("3 stars"));
    fireEvent.mouseLeave(container.querySelector(".cps-rating"));
    expect(new FormData(form).get("rating")).toBe("3");

    await user.click(screen.getByRole("button", { name: "Reset" }));
    expect(screen.getAllByRole("radio").some((radio) => radio.checked)).toBe(false);
    expect(activeStars(container)).toBe(0);
    expect(new FormData(form).has("rating")).toBe(false);
  });

  it("submits nothing without a rating", () => {
    const { container } = render(
      <form>
        <Rating label="Rate this product" name="rating" />
      </form>,
    );
    expect(new FormData(container.querySelector("form")).has("rating")).toBe(false);
  });

  it("applies sizes", () => {
    const { container } = render(<Rating label="Rate this product" size="lg" />);
    expect(container.querySelector(".cps-rating")).toHaveClass("cps-rating--lg");
  });

  it("forwards the ref and other props to the fieldset", () => {
    const ref = createRef();
    render(
      <Rating
        ref={ref}
        label="Rate this product"
        className="custom"
        style={{ marginTop: 8 }}
        data-testid="product-rating"
      />,
    );
    const group = screen.getByRole("radiogroup");
    expect(ref.current).toBe(group);
    expect(group).toHaveAttribute("data-testid", "product-rating");
    expect(group).toHaveClass("cps-rating-field", "custom");
    expect(group).toHaveStyle({ marginTop: "8px" });
  });

  describe("read-only", () => {
    it("displays a fractional rating as an image with a text alternative", () => {
      const { container } = render(<Rating readOnly value={4.3} />);

      const image = screen.getByRole("img", { name: "Rated 4.3 out of 5" });
      expect(image).toHaveClass("cps-rating", "cps-rating--readonly", "cps-rating--md");
      expect(screen.queryByRole("radio")).not.toBeInTheDocument();

      const fills = container.querySelectorAll(".cps-rating__fill");
      expect(fills).toHaveLength(5);
      expect(fills[3]).not.toHaveAttribute("style");
      expect(fills[4]).toHaveStyle({ width: "30%" });
    });

    it("leaves the stars after the value empty", () => {
      const { container } = render(<Rating readOnly value={2} />);
      expect(container.querySelectorAll(".cps-rating__fill")).toHaveLength(2);
      expect(screen.getByRole("img")).toHaveAccessibleName("Rated 2 out of 5");
    });

    it("shows the value and the count, which join the accessible name", () => {
      render(<Rating readOnly value={4.25} showValue count={128400} size="sm" />);

      const image = screen.getByRole("img", {
        name: "Rated 4.3 out of 5, 1,28,400 ratings",
      });
      expect(image).toHaveTextContent("4.3");
      expect(image).toHaveTextContent("(1,28,400)");
      expect(image).toHaveClass("cps-rating--sm");
    });

    it("uses the singular for one rating and a custom count format", () => {
      render(<Rating readOnly value={5} count={1} formatCount={(count) => `${count}`} />);
      expect(screen.getByRole("img")).toHaveAccessibleName("Rated 5 out of 5, 1 rating");
    });

    it("clamps the value to 0–max and accepts a custom label", () => {
      const { container, rerender } = render(<Rating readOnly value={7} />);
      expect(screen.getByRole("img")).toHaveAccessibleName("Rated 5 out of 5");
      expect(container.querySelectorAll(".cps-rating__fill")).toHaveLength(5);

      rerender(
        <Rating readOnly value={3.8} aria-label="Average rating: 3.8 of 5 from 214 buyers" />,
      );
      expect(screen.getByRole("img")).toHaveAccessibleName(
        "Average rating: 3.8 of 5 from 214 buyers",
      );
    });

    it("forwards the ref, className and style to the root", () => {
      const ref = createRef();
      render(<Rating ref={ref} readOnly value={4} className="custom" style={{ margin: 4 }} />);
      const image = screen.getByRole("img");
      expect(ref.current).toBe(image);
      expect(image).toHaveClass("custom");
      expect(image).toHaveStyle({ margin: "4px" });
    });
  });
});
