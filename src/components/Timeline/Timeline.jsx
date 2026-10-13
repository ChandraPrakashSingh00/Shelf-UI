import { createContext, forwardRef, useContext, useMemo } from "react";
import { CheckIcon, CloseIcon } from "../../icons/index.jsx";
import { cx } from "../../utils/cx.js";

const DEFAULT_STATUS_LABELS = {
  complete: "Completed",
  current: "Current",
  upcoming: "Upcoming",
  error: "Failed",
};

const DEFAULT_ICONS = {
  complete: <CheckIcon strokeWidth={3} />,
  error: <CloseIcon strokeWidth={3} />,
};

const TimelineContext = createContext({ statusLabels: DEFAULT_STATUS_LABELS });

/**
 * One event or step of a `Timeline`, rendered as an `<li>` that receives the
 * remaining props and the `ref`.
 *
 * - `title`: what happened, e.g. "Shipped".
 * - `description`: supporting text below the title. `children` go below it.
 * - `time`: when it happened, as display text, e.g. "6 Oct, 10:42 AM".
 * - `dateTime`: machine-readable date for `time` (e.g. "2026-10-06T10:42"); renders
 *   `time` inside a `<time>` element.
 * - `status`: "complete", "current", "upcoming" (default) or "error". Sets the dot's
 *   look and the hidden status text, and the current item gets `aria-current="step"`.
 *   The line after a completed item is colored.
 * - `icon`: content of the dot, replacing the default check (complete) or cross
 *   (error). Pass `null` for a plain dot.
 */
export const TimelineItem = forwardRef(function TimelineItem(
  { title, description, time, dateTime, status = "upcoming", icon, className, children, ...rest },
  ref,
) {
  const { statusLabels } = useContext(TimelineContext);
  const statusLabel = statusLabels[status];
  const glyph = icon === undefined ? DEFAULT_ICONS[status] : icon;

  return (
    <li
      {...rest}
      ref={ref}
      aria-current={status === "current" ? "step" : undefined}
      className={cx("shelf-timeline__item", `shelf-timeline__item--${status}`, className)}
    >
      <span className="shelf-timeline__marker" aria-hidden="true">
        <span className={cx("shelf-timeline__dot", glyph != null && "shelf-timeline__dot--icon")}>
          {glyph}
        </span>
      </span>
      <div className="shelf-timeline__content">
        {/* So the status isn't conveyed by color alone. */}
        {statusLabel ? <span className="shelf-visually-hidden">{`${statusLabel}: `}</span> : null}
        {title != null && <div className="shelf-timeline__title">{title}</div>}
        {time != null &&
          (dateTime ? (
            <time className="shelf-timeline__time" dateTime={dateTime}>
              {time}
            </time>
          ) : (
            <span className="shelf-timeline__time">{time}</span>
          ))}
        {description != null && <div className="shelf-timeline__description">{description}</div>}
        {children != null && <div className="shelf-timeline__body">{children}</div>}
      </div>
    </li>
  );
});

const TimelineRoot = forwardRef(function Timeline(
  { orientation = "vertical", size = "md", statusLabels, className, ...rest },
  ref,
) {
  const context = useMemo(
    () => ({ statusLabels: { ...DEFAULT_STATUS_LABELS, ...statusLabels } }),
    [statusLabels],
  );

  return (
    <TimelineContext.Provider value={context}>
      <ol
        {...rest}
        ref={ref}
        className={cx(
          "shelf-timeline",
          `shelf-timeline--${orientation}`,
          `shelf-timeline--${size}`,
          className,
        )}
      />
    </TimelineContext.Provider>
  );
});

/**
 * Ordered list of events, for order tracking or an activity log. Renders an
 * `<ol>` that receives the remaining props and the `ref`; put
 * `Timeline.Item` elements inside.
 *
 * - `orientation`: "vertical" (default) or "horizontal". A horizontal timeline
 *   stacks vertically when its container is narrower than 36rem.
 * - `size`: "sm" or "md" (default) — dot and text size.
 * - `statusLabels`: hidden status text read before each item,
 *   `{ complete, current, upcoming, error }` (default "Completed", "Current",
 *   "Upcoming", "Failed"). Set a status to `null` to leave its text out, e.g. in
 *   an activity log.
 *
 * @example
 * <Timeline aria-label="Order status">
 *   <Timeline.Item status="complete" title="Order placed" time="6 Oct, 10:42 AM" />
 *   <Timeline.Item status="current" title="Shipped" />
 *   <Timeline.Item title="Delivered" />
 * </Timeline>
 */
export const Timeline = Object.assign(TimelineRoot, { Item: TimelineItem });
