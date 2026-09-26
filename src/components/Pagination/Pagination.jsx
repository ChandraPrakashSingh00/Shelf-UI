import { forwardRef, useEffect, useMemo, useRef } from "react";
import { useControllableState } from "../../hooks/useControllableState.js";
import { ChevronLeftIcon, ChevronRightIcon } from "../../icons/index.jsx";
import { cx } from "../../utils/cx.js";
import { mergeRefs } from "../../utils/mergeRefs.js";
import { clampPage, getPageCount, getPaginationItems } from "../../utils/pagination.js";

const defaultGetPageLabel = (page) => `Page ${page}`;

/**
 * Moves between the pages of a long list or table: Previous and Next buttons
 * around the page numbers, with an ellipsis for each run of pages left out.
 * The `ref` points to the `<nav>` element, which receives the remaining props.
 *
 * - `totalPages` (required): number of pages, at least 1 (a fraction is rounded up).
 * - `page` / `defaultPage` / `onPageChange`: controlled or uncontrolled current page
 *   (`defaultPage` defaults to 1). The page shown is clamped to 1…`totalPages`.
 * - `siblingCount`: pages shown on each side of the current page (default 1).
 * - `boundaryCount`: pages always shown at the start and at the end (default 1).
 * - `size`: "sm" or "md" (default) — button size.
 * - `label`: accessible name of the `<nav>` landmark (default "Pagination").
 * - `previousLabel` / `nextLabel`: accessible names of the Previous and Next
 *   buttons (default "Previous page" / "Next page").
 * - `getPageLabel`: called with a page number, returns the accessible name of
 *   its button (default "Page 1", "Page 2", …).
 */
export const Pagination = forwardRef(function Pagination(
  {
    totalPages,
    page: pageProp,
    defaultPage = 1,
    onPageChange,
    siblingCount = 1,
    boundaryCount = 1,
    size = "md",
    label = "Pagination",
    previousLabel = "Previous page",
    nextLabel = "Next page",
    getPageLabel = defaultGetPageLabel,
    className,
    ...rest
  },
  forwardedRef,
) {
  const [page, setPage] = useControllableState({
    value: pageProp,
    defaultValue: defaultPage,
    onChange: onPageChange,
  });
  const pageCount = getPageCount(totalPages);
  const currentPage = clampPage(page, pageCount);
  const items = getPaginationItems({
    page: currentPage,
    totalPages: pageCount,
    siblingCount,
    boundaryCount,
  });

  const navRef = useRef(null);
  const ref = useMemo(() => mergeRefs(navRef, forwardedRef), [forwardedRef]);
  const refocusCurrentPage = useRef(false);

  // Reaching the first or last page disables the Previous or Next button that
  // was just used, which drops its focus. Move focus to the current page so
  // keyboard users keep their place, but only if focus was actually lost: it's
  // still on the disabled button, or back on the page body.
  useEffect(() => {
    if (!refocusCurrentPage.current) return;
    refocusCurrentPage.current = false;
    const nav = navRef.current;
    const active = document.activeElement;
    const focusLost = active === document.body || (nav?.contains(active) && active.disabled);
    if (focusLost) nav?.querySelector('[aria-current="page"]')?.focus();
  }, [currentPage]);

  const goToPage = (nextPage) => setPage(clampPage(nextPage, pageCount));

  const step = (delta) => {
    const nextPage = clampPage(currentPage + delta, pageCount);
    refocusCurrentPage.current = nextPage === 1 || nextPage === pageCount;
    goToPage(nextPage);
  };

  return (
    <nav
      aria-label={label}
      {...rest}
      ref={ref}
      className={cx("cps-pagination", `cps-pagination--${size}`, className)}
    >
      <ul className="cps-pagination__list">
        <li className="cps-pagination__item">
          <button
            type="button"
            aria-label={previousLabel}
            disabled={currentPage <= 1}
            className="cps-pagination__button"
            onClick={() => step(-1)}
          >
            <ChevronLeftIcon className="cps-pagination__icon" />
          </button>
        </li>
        {items.map((item, index) =>
          item === "ellipsis" ? (
            <li key={`ellipsis-${index}`} className="cps-pagination__ellipsis" aria-hidden="true">
              …
            </li>
          ) : (
            <li key={item} className="cps-pagination__item">
              <button
                type="button"
                aria-label={getPageLabel(item)}
                aria-current={item === currentPage ? "page" : undefined}
                className="cps-pagination__button"
                onClick={() => goToPage(item)}
              >
                {item}
              </button>
            </li>
          ),
        )}
        <li className="cps-pagination__item">
          <button
            type="button"
            aria-label={nextLabel}
            disabled={currentPage >= pageCount}
            className="cps-pagination__button"
            onClick={() => step(1)}
          >
            <ChevronRightIcon className="cps-pagination__icon" />
          </button>
        </li>
      </ul>
    </nav>
  );
});
