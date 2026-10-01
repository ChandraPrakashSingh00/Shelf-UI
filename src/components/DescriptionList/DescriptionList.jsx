import { forwardRef } from "react";
import { cx } from "../../utils/cx.js";

const toCssLength = (value) => (typeof value === "number" ? `${value}px` : value);

/**
 * One term and its description, rendered as a `<div>` wrapping a `<dt>` and a
 * `<dd>`. The `<div>` receives the remaining props and the `ref`.
 *
 * - `term` (required): the label, e.g. "Shipping".
 * - `children`: the description, e.g. "Free".
 * - `fullWidth`: spans every column of a multi-column list, e.g. for an address
 *   (default `false`).
 */
export const DescriptionListItem = forwardRef(function DescriptionListItem(
  { term, fullWidth = false, className, children, ...rest },
  ref,
) {
  return (
    <div
      {...rest}
      ref={ref}
      className={cx(
        "cps-description-list__item",
        fullWidth && "cps-description-list__item--full",
        className,
      )}
    >
      <dt className="cps-description-list__term">{term}</dt>
      <dd className="cps-description-list__description">{children}</dd>
    </div>
  );
});

const DescriptionListRoot = forwardRef(function DescriptionList(
  {
    items,
    layout = "horizontal",
    columns = 1,
    divided = false,
    size = "md",
    align = "start",
    termWidth,
    className,
    style,
    children,
    ...rest
  },
  ref,
) {
  const columnCount = [1, 2, 3].includes(Number(columns)) ? Number(columns) : 1;

  return (
    <dl
      {...rest}
      ref={ref}
      className={cx(
        "cps-description-list",
        `cps-description-list--${layout}`,
        `cps-description-list--columns-${columnCount}`,
        `cps-description-list--${size}`,
        divided && "cps-description-list--divided",
        align === "end" && "cps-description-list--align-end",
        className,
      )}
      style={
        termWidth != null
          ? { "--cps-description-list-term-width": toCssLength(termWidth), ...style }
          : style
      }
    >
      {items?.map((item, index) => (
        <DescriptionListItem key={item.key ?? index} term={item.term} fullWidth={item.fullWidth}>
          {item.description}
        </DescriptionListItem>
      ))}
      {children}
    </dl>
  );
});

/**
 * Term–description pairs, like an order summary, product specifications or
 * customer details. Renders a `<dl>` (with a `<div>` around each `<dt>` and `<dd>`)
 * that receives the remaining props and the `ref`. Pass the pairs as `items`, or
 * as `DescriptionList.Item` children.
 *
 * - `items`: array of `{ term, description, key?, fullWidth? }`.
 * - `layout`: "horizontal" (default: term beside its description; stacks when the
 *   list is narrower than 16rem) or "vertical" (term above its description).
 * - `columns`: 1 (default), 2 or 3 columns of pairs. They drop to two columns below
 *   52rem and to one below 36rem.
 * - `divided`: lines between the rows (default `false`).
 * - `size`: "sm" or "md" (default) — text size and row spacing.
 * - `align`: "start" (default) or "end" — alignment of the descriptions in the
 *   horizontal layout, e.g. "end" for the amounts of an order summary.
 * - `termWidth`: width of the term column in the horizontal layout, as a CSS length
 *   (numbers are pixels). Defaults to a third of the row.
 */
export const DescriptionList = Object.assign(DescriptionListRoot, { Item: DescriptionListItem });
