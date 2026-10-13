import { forwardRef, useEffect, useId, useMemo, useRef, useState } from "react";
import { useControllableState } from "../../hooks/useControllableState.js";
import { ArrowDownIcon, ArrowUpIcon, ChevronsUpDownIcon } from "../../icons/index.jsx";
import { cx } from "../../utils/cx.js";
import { formatISODate } from "../../utils/date.js";
import { mergeRefs } from "../../utils/mergeRefs.js";
import { getNextSort, sortRows } from "../../utils/sort.js";
import { Checkbox } from "../Checkbox/Checkbox.jsx";
import { Skeleton } from "../Skeleton/Skeleton.jsx";

const EMPTY = [];
const defaultGetRowId = (row) => row.id;
const toCssLength = (value) => (typeof value === "number" ? `${value}px` : value);

const getCellValue = (column, row) => (column.accessor ? column.accessor(row) : row[column.key]);

// Names a row's checkbox after the value of the row header column, e.g.
// "Select Priya Sharma", so each checkbox says which row it selects.
function getDefaultRowLabel(columns, row) {
  const rowHeader = columns.find((column) => column.rowHeader);
  const value = rowHeader ? getCellValue(rowHeader, row) : null;
  const usable =
    (typeof value === "string" && value.trim() !== "") ||
    (typeof value === "number" && Number.isFinite(value));
  return usable ? `Select ${value}` : "Select row";
}

// What a cell shows without a `render` function. Dates and booleans aren't valid
// React children, so they become text. Dates use the fixed "YYYY-MM-DD" form
// (the local date): locale-dependent text would differ between the server and
// the browser and break hydration.
function renderValue(value) {
  if (value == null) return null;
  if (value instanceof Date) return formatISODate(value) || null;
  return typeof value === "boolean" ? String(value) : value;
}

const getAlign = (column) => column.align ?? (column.numeric ? "end" : "start");

const cellClasses = (column, ...extra) =>
  cx(
    "shelf-table__cell",
    `shelf-table__cell--align-${getAlign(column)}`,
    column.numeric && "shelf-table__cell--numeric",
    column.className,
    ...extra,
  );

const ARIA_SORT = { asc: "ascending", desc: "descending" };

// Whether the container scrolls, so it only becomes a focusable region (for
// keyboard scrolling) when it needs to. `null` until measured, which counts as
// scrollable: that is also the answer without ResizeObserver or on the server.
function useOverflow(containerRef, tableRef) {
  const [overflowing, setOverflowing] = useState(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || typeof ResizeObserver === "undefined") return;
    // The callback runs once on `observe`, then whenever either box resizes.
    const observer = new ResizeObserver(() => {
      setOverflowing(
        container.scrollWidth > container.clientWidth + 1 ||
          container.scrollHeight > container.clientHeight + 1,
      );
    });
    observer.observe(container);
    if (tableRef.current) observer.observe(tableRef.current);
    return () => observer.disconnect();
  }, [containerRef, tableRef]);

  return overflowing !== false;
}

/**
 * Data table for admin screens like orders, products and users, with sortable
 * columns and row selection. It renders a native `<table>` inside a container
 * that scrolls sideways on small screens. Other props (e.g. `aria-label`) and the
 * `ref` go to the `<table>`; `className` and `style` go to the container.
 *
 * - `columns` (required): array of column definitions:
 *   - `key` (required): unique id of the column; also the default field to read.
 *   - `header`: content of the column header.
 *   - `accessor(row)`: the cell's value, used for sorting and default rendering
 *     (default `row[key]`).
 *   - `render(row)`: custom cell content, e.g. a `<Badge>` or formatted price.
 *     Without it, Dates show as "YYYY-MM-DD" (the same on the server and in the
 *     browser); use `render` for localized dates.
 *   - `sortable`: makes the header a sort button.
 *   - `sortFn(rowA, rowB)`: custom ascending comparator for this column. By default
 *     numbers (and numeric text like "1.25") compare numerically, other strings with
 *     numeric collation, Dates by time, and missing values go last.
 *   - `align`: "start", "center" or "end" (default "start", "end" for `numeric`).
 *   - `numeric`: tabular figures and end alignment, for amounts and counts.
 *   - `rowHeader`: renders this column's cells as row headers (`<th scope="row">`),
 *     e.g. the order id.
 *   - `width`: CSS width of the column (numbers are pixels).
 *   - `footer`: content of this column's footer cell (adds a `<tfoot>` row).
 *   - `className`: class for the column's header, body and footer cells.
 * - `data`: array of rows (default `[]`).
 * - `getRowId(row)`: stable id of a row, for keys and selection (default `row.id`).
 * - `caption`: title of the table; also names the scrolling region.
 *   `captionHidden` keeps it for screen readers only (default `false`).
 *   Without a caption, pass `aria-label`.
 * - `sort` / `defaultSort` / `onSortChange`: controlled or uncontrolled sort state,
 *   `{ key, direction: "asc" | "desc" }` or `null` (default `null`). Clicking a
 *   sortable header cycles ascending → descending → unsorted.
 * - `manualSort`: shows `data` in the given order, for sorting on the server
 *   (default `false`). The headers still update the sort state.
 * - `selectable`: adds a checkbox column with a "select all" checkbox (default `false`).
 * - `selectedIds` / `defaultSelectedIds` / `onSelectionChange`: controlled or
 *   uncontrolled array of selected row ids (default `[]`). "Select all" only adds or
 *   removes the rows in `data`, so ids from other pages are kept.
 * - `isRowSelectable(row)`: return `false` to disable a row's checkbox.
 * - `getRowLabel(row)`: accessible name of a row's checkbox, e.g.
 *   `(order) => "Select order " + order.id`. By default it's "Select " followed by
 *   the value of the `rowHeader` column when that is text or a number (e.g.
 *   "Select Priya Sharma"), else "Select row".
 * - `selectAllLabel`: accessible name of the header checkbox (default "Select all rows").
 * - `emptyState`: content shown in a full-width row when `data` is empty (default "No data").
 * - `loading`: marks the table busy (default `false`). Shows `loadingRows` skeleton
 *   rows (default 5) while there's no data, or dims the current rows, and announces
 *   `loadingLabel` (default "Loading…") to screen readers.
 * - `size`: "sm" or "md" (default) — row density.
 * - `striped`: shades every other row (default `false`).
 * - `hoverable`: highlights the row under the pointer (default `true`).
 * - `bordered`: draws a rounded border around the table (default `true`).
 * - `stickyHeader`: keeps the header visible while the table scrolls vertically
 *   (default `false`). Use it with `maxHeight`.
 * - `maxHeight`: CSS max height of the container, which then scrolls vertically.
 */
export const Table = forwardRef(function Table(
  {
    columns = EMPTY,
    data = EMPTY,
    getRowId = defaultGetRowId,
    caption,
    captionHidden = false,
    sort,
    defaultSort = null,
    onSortChange,
    manualSort = false,
    selectable = false,
    selectedIds,
    defaultSelectedIds = EMPTY,
    onSelectionChange,
    isRowSelectable,
    getRowLabel = (row) => getDefaultRowLabel(columns, row),
    selectAllLabel = "Select all rows",
    emptyState = "No data",
    loading = false,
    loadingLabel = "Loading…",
    loadingRows = 5,
    size = "md",
    striped = false,
    hoverable = true,
    bordered = true,
    stickyHeader = false,
    maxHeight,
    className,
    style,
    "aria-label": ariaLabel,
    "aria-labelledby": ariaLabelledBy,
    ...rest
  },
  forwardedRef,
) {
  const baseId = useId();
  const captionId = `${baseId}-caption`;
  const containerRef = useRef(null);
  const tableRef = useRef(null);
  const ref = useMemo(() => mergeRefs(tableRef, forwardedRef), [forwardedRef]);
  const scrollable = useOverflow(containerRef, tableRef);

  const [currentSort, setSort] = useControllableState({
    value: sort,
    defaultValue: defaultSort,
    onChange: onSortChange,
  });
  const [selection, setSelection] = useControllableState({
    value: selectedIds,
    defaultValue: defaultSelectedIds,
    onChange: onSelectionChange,
  });

  const sortColumn = currentSort ? columns.find((column) => column.key === currentSort.key) : null;
  const rows = useMemo(() => {
    if (manualSort || !sortColumn) return data;
    const direction = currentSort.direction === "desc" ? "desc" : "asc";
    return sortColumn.sortFn
      ? sortRows(data, { direction, compare: sortColumn.sortFn })
      : sortRows(data, { direction, getValue: (row) => getCellValue(sortColumn, row) });
  }, [data, manualSort, sortColumn, currentSort]);

  const selectedSet = useMemo(() => new Set(selection ?? EMPTY), [selection]);
  const canSelect = (row) => !isRowSelectable || isRowSelectable(row) !== false;
  const selectableIds = selectable ? data.filter(canSelect).map((row) => getRowId(row)) : EMPTY;
  const selectedCount = selectableIds.filter((id) => selectedSet.has(id)).length;
  const allSelected = selectableIds.length > 0 && selectedCount === selectableIds.length;
  const someSelected = selectedCount > 0 && !allSelected;

  const toggleRow = (id, checked) => {
    const current = selection ?? EMPTY;
    if (checked) {
      if (!selectedSet.has(id)) setSelection([...current, id]);
    } else {
      setSelection(current.filter((selectedId) => selectedId !== id));
    }
  };

  // Only the rows in `data` change, so a selection spanning pages survives.
  const toggleAll = (checked) => {
    const current = selection ?? EMPTY;
    if (checked) {
      setSelection([...current, ...selectableIds.filter((id) => !selectedSet.has(id))]);
    } else {
      const visible = new Set(selectableIds);
      setSelection(current.filter((id) => !visible.has(id)));
    }
  };

  const columnCount = columns.length + (selectable ? 1 : 0);
  const checkboxSize = size === "sm" ? "sm" : "md";
  const hasFooter = columns.some((column) => column.footer != null);
  const showSkeleton = loading && data.length === 0;

  // Name the scrolling region after the table, when the table has a name.
  const regionName =
    caption != null
      ? { "aria-labelledby": captionId }
      : ariaLabelledBy != null
        ? { "aria-labelledby": ariaLabelledBy }
        : ariaLabel != null
          ? { "aria-label": ariaLabel }
          : null;

  const renderHeader = (column) => {
    const direction = currentSort?.key === column.key ? currentSort.direction : null;
    const SortIcon =
      direction === "asc" ? ArrowUpIcon : direction === "desc" ? ArrowDownIcon : ChevronsUpDownIcon;

    return (
      <th
        key={column.key}
        scope="col"
        aria-sort={ARIA_SORT[direction]}
        className={cellClasses(column, "shelf-table__header")}
        style={column.width != null ? { width: toCssLength(column.width) } : undefined}
      >
        {column.sortable ? (
          <button
            type="button"
            className="shelf-table__sort"
            onClick={() => setSort(getNextSort(currentSort, column.key))}
          >
            <span className="shelf-table__sort-label">{column.header}</span>
            <SortIcon
              className={cx(
                "shelf-table__sort-icon",
                direction == null && "shelf-table__sort-icon--inactive",
              )}
            />
          </button>
        ) : (
          column.header
        )}
      </th>
    );
  };

  const renderRow = (row, index) => {
    const id = getRowId(row);
    const selected = selectable && selectedSet.has(id);

    return (
      <tr
        key={id ?? index}
        className={cx("shelf-table__row", selected && "shelf-table__row--selected")}
        data-selected={selected || undefined}
      >
        {selectable && (
          <td className="shelf-table__cell shelf-table__cell--select">
            <Checkbox
              size={checkboxSize}
              aria-label={getRowLabel(row)}
              checked={selected}
              disabled={!canSelect(row)}
              onCheckedChange={(checked) => toggleRow(id, checked)}
            />
          </td>
        )}
        {columns.map((column) => {
          const content = column.render
            ? column.render(row)
            : renderValue(getCellValue(column, row));
          return column.rowHeader ? (
            <th key={column.key} scope="row" className={cellClasses(column)}>
              {content}
            </th>
          ) : (
            <td key={column.key} className={cellClasses(column)}>
              {content}
            </td>
          );
        })}
      </tr>
    );
  };

  const skeletonRows = Array.from({ length: Math.max(1, Math.floor(loadingRows) || 1) }, (_, i) => (
    <tr key={i} className="shelf-table__row shelf-table__row--placeholder">
      {selectable && (
        <td className="shelf-table__cell shelf-table__cell--select">
          <Skeleton variant="rectangular" className="shelf-table__checkbox-skeleton" />
        </td>
      )}
      {columns.map((column) => (
        <td key={column.key} className={cellClasses(column)}>
          <Skeleton className="shelf-table__skeleton" />
        </td>
      ))}
    </tr>
  ));

  return (
    <div
      ref={containerRef}
      {...(scrollable ? { tabIndex: 0, ...(regionName && { role: "region", ...regionName }) } : {})}
      className={cx(
        "shelf-table",
        `shelf-table--${size}`,
        striped && "shelf-table--striped",
        hoverable && "shelf-table--hoverable",
        bordered && "shelf-table--bordered",
        stickyHeader && "shelf-table--sticky-header",
        loading && "shelf-table--loading",
        hasFooter && "shelf-table--has-footer",
        className,
      )}
      style={maxHeight != null ? { maxHeight: toCssLength(maxHeight), ...style } : style}
    >
      <table
        {...rest}
        ref={ref}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        aria-busy={loading || undefined}
        className="shelf-table__table"
      >
        {caption != null && (
          <caption
            id={captionId}
            className={cx("shelf-table__caption", captionHidden && "shelf-visually-hidden")}
          >
            {caption}
          </caption>
        )}
        <thead className="shelf-table__head">
          <tr className="shelf-table__row">
            {selectable && (
              <th
                scope="col"
                className="shelf-table__cell shelf-table__header shelf-table__cell--select"
              >
                <Checkbox
                  size={checkboxSize}
                  aria-label={selectAllLabel}
                  checked={allSelected}
                  indeterminate={someSelected}
                  disabled={selectableIds.length === 0}
                  onCheckedChange={toggleAll}
                />
              </th>
            )}
            {columns.map(renderHeader)}
          </tr>
        </thead>
        <tbody className="shelf-table__body">
          {showSkeleton ? (
            skeletonRows
          ) : rows.length === 0 ? (
            <tr className="shelf-table__row shelf-table__row--empty">
              <td colSpan={columnCount} className="shelf-table__cell shelf-table__empty">
                {emptyState}
              </td>
            </tr>
          ) : (
            rows.map(renderRow)
          )}
        </tbody>
        {hasFooter && (
          <tfoot className="shelf-table__foot">
            <tr className="shelf-table__row">
              {selectable && <td className="shelf-table__cell shelf-table__cell--select" />}
              {columns.map((column) => (
                <td key={column.key} className={cellClasses(column)}>
                  {column.footer}
                </td>
              ))}
            </tr>
          </tfoot>
        )}
      </table>
      {/* Present from the start, so the change to "Loading…" is announced. */}
      <div role="status" className="shelf-visually-hidden shelf-table__status">
        {loading ? loadingLabel : null}
      </div>
    </div>
  );
});
