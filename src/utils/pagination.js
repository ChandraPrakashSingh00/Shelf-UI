const range = (start, end) =>
  Array.from({ length: Math.max(0, end - start + 1) }, (_, index) => start + index);

// Rounds down to a whole number of at least `min`; anything that isn't a finite number becomes `min`.
const toWholeNumber = (value, min) => {
  const number = Math.floor(value);
  return Number.isFinite(number) ? Math.max(number, min) : min;
};

/**
 * The number of pages as a whole number of at least 1. A fractional count is
 * rounded up, so `getPageCount(total / pageSize)` keeps the last, partial page.
 */
export function getPageCount(totalPages) {
  const count = Math.ceil(totalPages);
  return Number.isFinite(count) ? Math.max(count, 1) : 1;
}

/** Clamps `page` to a whole page number between 1 and the page count. */
export function clampPage(page, totalPages) {
  return Math.min(toWholeNumber(page, 1), getPageCount(totalPages));
}

/**
 * Lists the items of a pagination bar, in order: page numbers and `"ellipsis"`
 * markers for the pages left out. For page 5 of 20 with the defaults:
 * `[1, "ellipsis", 4, 5, 6, "ellipsis", 20]`.
 *
 * - `page`: the current page (default 1), clamped to the page count.
 * - `totalPages`: the number of pages (at least 1).
 * - `siblingCount`: pages shown on each side of the current page (default 1).
 * - `boundaryCount`: pages always shown at the start and at the end (default 1).
 *
 * Once there are more pages than fit, the list always has the same length
 * (`2 × boundaryCount + 2 × siblingCount + 3`), so the number of buttons
 * doesn't change as the current page moves. An ellipsis never stands for a
 * single page: that page is shown instead.
 */
export function getPaginationItems({ page = 1, totalPages, siblingCount = 1, boundaryCount = 1 }) {
  const count = getPageCount(totalPages);
  const current = clampPage(page, count);
  const siblings = toWholeNumber(siblingCount, 0);
  const boundaries = toWholeNumber(boundaryCount, 0);

  const startPages = range(1, Math.min(boundaries, count));
  const endPages = range(Math.max(count - boundaries + 1, boundaries + 1), count);

  // Near either end, the window of sibling pages shifts instead of shrinking.
  const siblingsStart = Math.max(
    Math.min(current - siblings, count - boundaries - siblings * 2 - 1),
    boundaries + 2,
  );
  const siblingsEnd = Math.min(
    Math.max(current + siblings, boundaries + siblings * 2 + 2),
    endPages.length > 0 ? endPages[0] - 2 : count - 1,
  );

  // Each gap becomes an ellipsis, unless it hides a single page: then that page is shown.
  let startGap = [];
  if (siblingsStart > boundaries + 2) startGap = ["ellipsis"];
  else if (boundaries + 1 < count - boundaries) startGap = [boundaries + 1];

  let endGap = [];
  if (siblingsEnd < count - boundaries - 1) endGap = ["ellipsis"];
  else if (count - boundaries > boundaries) endGap = [count - boundaries];

  return [...startPages, ...startGap, ...range(siblingsStart, siblingsEnd), ...endGap, ...endPages];
}
