import { forwardRef } from "react";
import { ArrowDownIcon, ArrowUpIcon, MinusIcon } from "../../icons/index.jsx";
import { cx } from "../../utils/cx.js";
import { Skeleton } from "../Skeleton/Skeleton.jsx";

const defaultFormatChange = (change) => `${Math.abs(change)}%`;

const DEFAULT_TREND_LABELS = {
  increase: "Increased by",
  decrease: "Decreased by",
  none: "No change,",
};

const TREND_ICONS = { increase: ArrowUpIcon, decrease: ArrowDownIcon, none: MinusIcon };

/**
 * Key figure for dashboards, like revenue, orders or refunds, with an optional
 * trend. The label and figures form a description list (`<dt>` label, `<dd>`
 * value and change) inside a root `<div>`, which receives the remaining props
 * and the `ref`.
 *
 * - `label` (required): what the figure measures, e.g. "Revenue".
 * - `value`: the figure, already formatted, e.g. "₹4,52,300".
 * - `change`: change as a number, e.g. `12.5` or `-3.2`. Positive values show an up
 *   arrow, negative values a down arrow, and zero is neutral.
 * - `formatChange(change)`: text for the change (default: the absolute value with
 *   a "%" sign, e.g. "12.5%"). The arrow and hidden text already give the direction.
 * - `changeLabel`: context after the change, e.g. "vs last week".
 * - `higherIsBetter`: an increase is good news and shows in green (default `true`).
 *   Set it to `false` for refunds or cancellations, so a decrease is green.
 * - `trendLabels`: screen reader text before the change,
 *   `{ increase, decrease, none }` (default "Increased by", "Decreased by", "No change,").
 * - `icon`: decorative icon in the corner.
 * - `description`: supporting text below the figures.
 * - `loading`: shows placeholders instead of the value and change, marks the stat
 *   `aria-busy` and gives screen readers `loadingLabel` (default "Loading…").
 * - `variant`: "card" (default, bordered surface) or "plain".
 * - `size`: "sm" or "md" (default).
 */
export const Stat = forwardRef(function Stat(
  {
    label,
    value,
    change,
    formatChange = defaultFormatChange,
    changeLabel,
    higherIsBetter = true,
    trendLabels,
    icon,
    description,
    loading = false,
    loadingLabel = "Loading…",
    variant = "card",
    size = "md",
    className,
    ...rest
  },
  ref,
) {
  const hasChange = typeof change === "number" && Number.isFinite(change);
  const trend = !hasChange ? null : change > 0 ? "increase" : change < 0 ? "decrease" : "none";
  const tone = !trend
    ? null
    : trend === "none"
      ? "neutral"
      : (trend === "increase") === higherIsBetter
        ? "positive"
        : "negative";
  const TrendIcon = trend ? TREND_ICONS[trend] : null;
  const labels = { ...DEFAULT_TREND_LABELS, ...trendLabels };

  return (
    <div
      {...rest}
      ref={ref}
      aria-busy={loading || undefined}
      className={cx(
        "shelf-stat",
        `shelf-stat--${variant}`,
        `shelf-stat--${size}`,
        icon != null && "shelf-stat--with-icon",
        className,
      )}
    >
      <dl className="shelf-stat__list">
        <dt className="shelf-stat__label">{label}</dt>
        <dd className="shelf-stat__value">
          {loading ? (
            <>
              <Skeleton className="shelf-stat__skeleton" width="60%" />
              <span className="shelf-visually-hidden">{loadingLabel}</span>
            </>
          ) : (
            value
          )}
        </dd>
        {loading ? (
          <dd className="shelf-stat__change" aria-hidden="true">
            <Skeleton width="40%" />
          </dd>
        ) : (
          (hasChange || changeLabel != null) && (
            <dd className={cx("shelf-stat__change", tone && `shelf-stat__change--${tone}`)}>
              {hasChange && (
                <span className="shelf-stat__trend">
                  <TrendIcon className="shelf-stat__trend-icon" />
                  <span className="shelf-visually-hidden">{`${labels[trend]} `}</span>
                  {formatChange(change)}
                </span>
              )}
              {changeLabel != null && (
                <span className="shelf-stat__change-label">
                  {hasChange && " "}
                  {changeLabel}
                </span>
              )}
            </dd>
          )
        )}
        {description != null && <dd className="shelf-stat__description">{description}</dd>}
      </dl>
      {icon != null && (
        <span className="shelf-stat__icon" aria-hidden="true">
          {icon}
        </span>
      )}
    </div>
  );
});
