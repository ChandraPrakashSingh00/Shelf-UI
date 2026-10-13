import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef } from "react";
import { describe, expect, it, vi } from "vitest";
import { Pagination } from "./Pagination.jsx";

const pageButton = (page) => screen.getByRole("button", { name: `Page ${page}` });
const previousButton = () => screen.getByRole("button", { name: "Previous page" });
const nextButton = () => screen.getByRole("button", { name: "Next page" });
const currentPage = () => screen.getByRole("button", { current: "page" });

// The text of every list item in order: "" for Previous / Next, "…" for an ellipsis.
const itemTexts = () =>
  Array.from(screen.getByRole("navigation").querySelectorAll("li"), (item) => item.textContent);

describe("Pagination", () => {
  it("renders a labelled navigation landmark with a list of page buttons", () => {
    render(<Pagination totalPages={20} defaultPage={5} />);

    const nav = screen.getByRole("navigation", { name: "Pagination" });
    expect(nav).toHaveClass("shelf-pagination", "shelf-pagination--md");
    expect(within(nav).getByRole("list")).toBeInTheDocument();
    expect(itemTexts()).toEqual(["", "1", "…", "4", "5", "6", "…", "20", ""]);

    expect(pageButton(5)).toHaveTextContent("5");
    expect(pageButton(5)).toHaveAttribute("type", "button");
    expect(currentPage()).toBe(pageButton(5));
    expect(pageButton(4)).not.toHaveAttribute("aria-current");
  });

  it("hides the ellipses and icons from assistive technology", () => {
    render(<Pagination totalPages={20} defaultPage={10} />);

    const ellipses = screen.getAllByText("…");
    expect(ellipses).toHaveLength(2);
    for (const ellipsis of ellipses) {
      expect(ellipsis).toHaveAttribute("aria-hidden", "true");
      expect(ellipsis.querySelector("button, a, [tabindex]")).toBeNull();
    }
    // Previous, 1, 9, 10, 11, 20 and Next; the ellipses aren't list items for screen readers.
    expect(screen.getAllByRole("listitem")).toHaveLength(7);
    expect(previousButton().querySelector("svg")).toHaveAttribute("aria-hidden", "true");
    expect(nextButton().querySelector("svg")).toHaveAttribute("aria-hidden", "true");
  });

  it("disables Previous on the first page and Next on the last page", () => {
    const { rerender } = render(<Pagination totalPages={5} page={1} />);
    expect(previousButton()).toBeDisabled();
    expect(nextButton()).toBeEnabled();

    rerender(<Pagination totalPages={5} page={3} />);
    expect(previousButton()).toBeEnabled();
    expect(nextButton()).toBeEnabled();

    rerender(<Pagination totalPages={5} page={5} />);
    expect(previousButton()).toBeEnabled();
    expect(nextButton()).toBeDisabled();
  });

  it("changes page from the page buttons, Previous and Next when uncontrolled", async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();
    render(<Pagination totalPages={20} onPageChange={onPageChange} />);
    expect(currentPage()).toBe(pageButton(1));

    await user.click(pageButton(5));
    expect(currentPage()).toBe(pageButton(5));
    expect(onPageChange).toHaveBeenLastCalledWith(5);

    await user.click(nextButton());
    expect(currentPage()).toBe(pageButton(6));
    expect(onPageChange).toHaveBeenLastCalledWith(6);

    await user.click(previousButton());
    await user.click(previousButton());
    expect(currentPage()).toBe(pageButton(4));
    expect(onPageChange).toHaveBeenCalledTimes(4);
  });

  it("does not report a change when the current page is clicked", async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();
    render(<Pagination totalPages={10} defaultPage={3} onPageChange={onPageChange} />);

    await user.click(pageButton(3));
    expect(onPageChange).not.toHaveBeenCalled();
  });

  it("supports controlled usage", async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();
    const { rerender } = render(
      <Pagination totalPages={10} page={3} onPageChange={onPageChange} />,
    );

    await user.click(nextButton());
    expect(onPageChange).toHaveBeenCalledWith(4);
    // The parent did not update `page`, so the current page stays put.
    expect(currentPage()).toBe(pageButton(3));

    rerender(<Pagination totalPages={10} page={4} onPageChange={onPageChange} />);
    expect(currentPage()).toBe(pageButton(4));
  });

  it("clamps a page outside 1…totalPages", async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();
    const { rerender } = render(
      <Pagination totalPages={10} page={50} onPageChange={onPageChange} />,
    );
    expect(currentPage()).toBe(pageButton(10));
    expect(nextButton()).toBeDisabled();

    await user.click(previousButton());
    expect(onPageChange).toHaveBeenCalledWith(9);

    rerender(<Pagination totalPages={10} page={0} />);
    expect(currentPage()).toBe(pageButton(1));
  });

  it("renders a single page with both arrows disabled", () => {
    const { rerender } = render(<Pagination totalPages={1} />);
    expect(itemTexts()).toEqual(["", "1", ""]);
    expect(currentPage()).toBe(pageButton(1));
    expect(previousButton()).toBeDisabled();
    expect(nextButton()).toBeDisabled();

    rerender(<Pagination totalPages={0} />);
    expect(itemTexts()).toEqual(["", "1", ""]);
  });

  it("shows siblingCount and boundaryCount pages around the current page and at the ends", () => {
    const { rerender } = render(
      <Pagination totalPages={50} defaultPage={25} siblingCount={2} boundaryCount={2} />,
    );
    expect(itemTexts()).toEqual([
      "",
      "1",
      "2",
      "…",
      "23",
      "24",
      "25",
      "26",
      "27",
      "…",
      "49",
      "50",
      "",
    ]);

    rerender(<Pagination totalPages={50} defaultPage={25} siblingCount={0} />);
    expect(itemTexts()).toEqual(["", "1", "…", "25", "…", "50", ""]);
  });

  it.each(["sm", "md"])("applies the %s size", (size) => {
    render(<Pagination totalPages={3} size={size} />);
    expect(screen.getByRole("navigation")).toHaveClass(`shelf-pagination--${size}`);
  });

  it("accepts custom accessible names", () => {
    render(
      <Pagination
        totalPages={4}
        defaultPage={2}
        label="Search results pages"
        previousLabel="Previous results"
        nextLabel="More results"
        getPageLabel={(page) => `Results page ${page}`}
      />,
    );

    expect(screen.getByRole("navigation", { name: "Search results pages" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Previous results" })).toBeEnabled();
    expect(screen.getByRole("button", { name: "More results" })).toBeEnabled();
    expect(screen.getByRole("button", { name: "Results page 2" })).toHaveAttribute(
      "aria-current",
      "page",
    );
  });

  it("works with the keyboard and keeps focus when an arrow button becomes disabled", async () => {
    const user = userEvent.setup();
    render(<Pagination totalPages={3} defaultPage={2} />);

    // Tab order: Previous, Page 1, Page 2, Page 3, Next.
    await user.tab();
    expect(previousButton()).toHaveFocus();
    await user.tab();
    await user.tab();
    await user.tab();
    await user.tab();
    expect(nextButton()).toHaveFocus();

    // Reaching the last page disables Next, so focus moves to the current page.
    await user.keyboard("{Enter}");
    expect(nextButton()).toBeDisabled();
    expect(pageButton(3)).toHaveFocus();

    previousButton().focus();
    await user.keyboard("{Enter}");
    expect(currentPage()).toBe(pageButton(2));
    expect(previousButton()).toHaveFocus();

    await user.keyboard(" ");
    expect(previousButton()).toBeDisabled();
    expect(pageButton(1)).toHaveFocus();
  });

  it("does not take focus back when it has moved on by the time the page changes", async () => {
    const user = userEvent.setup();
    const renderAtPage = (page) => (
      <>
        <input aria-label="Search projects" />
        <Pagination totalPages={3} page={page} />
      </>
    );
    const { rerender } = render(renderAtPage(2));

    // The parent applies the change later, while the user is typing elsewhere…
    nextButton().focus();
    await user.keyboard("{Enter}");
    screen.getByRole("textbox").focus();
    rerender(renderAtPage(3));
    expect(screen.getByRole("textbox")).toHaveFocus();

    // …or after the user has moved to another page button.
    rerender(renderAtPage(2));
    previousButton().focus();
    await user.keyboard("{Enter}");
    pageButton(3).focus();
    rerender(renderAtPage(1));
    expect(pageButton(3)).toHaveFocus();
  });

  it("forwards the ref, merges className and passes other props to the nav", () => {
    const ref = createRef();
    render(
      <Pagination
        ref={ref}
        totalPages={3}
        className="custom"
        data-testid="invoices-pages"
        aria-label="Invoices pages"
      />,
    );

    const nav = screen.getByRole("navigation", { name: "Invoices pages" });
    expect(ref.current).toBe(nav);
    expect(nav).toHaveClass("shelf-pagination", "custom");
    expect(nav).toHaveAttribute("data-testid", "invoices-pages");
  });
});
