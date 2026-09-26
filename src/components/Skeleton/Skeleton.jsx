import { forwardRef } from "react";
import { cx } from "../../utils/cx.js";

const toCssLength = (value) => (typeof value === "number" ? `${value}px` : value);

/**
 * Placeholder that stands in for content while it loads. Always hidden from
 * screen readers (`aria-hidden`): mark the loading region with `aria-busy` and
 * keep a text status for them. Renders a `<span>` displayed as a block; other
 * props and the `ref` go to it.
 *
 * - `variant`: "text" (default), "circular" or "rectangular".
 * - `width` / `height`: size of the shape. Numbers are pixels, strings any CSS length.
 *   Text fills its container and takes the space of one line of the surrounding
 *   text; its `height` is the thickness of the bar (of each bar, with `lines`).
 *   A circle only needs one of the two.
 * - `lines`: number of text lines (text variant only, default 1). The last one is shorter.
 * - `animated`: shows a subtle shimmer (default `true`). It stays still when the
 *   user prefers reduced motion.
 */
export const Skeleton = forwardRef(function Skeleton(
  { variant = "text", width, height, lines = 1, animated = true, className, style, ...rest },
  ref,
) {
  const isCircle = variant === "circular";
  const cssWidth = toCssLength(isCircle ? (width ?? height) : width);
  const cssHeight = toCssLength(isCircle ? (height ?? width) : height);
  const lineCount = variant === "text" ? Math.floor(lines) : 1;

  if (lineCount > 1) {
    return (
      <span
        {...rest}
        ref={ref}
        aria-hidden="true"
        className={cx(
          "cps-skeleton",
          "cps-skeleton--lines",
          animated && "cps-skeleton--animated",
          className,
        )}
        style={{ width: cssWidth, ...style }}
      >
        {Array.from({ length: lineCount }, (_, index) => (
          <span
            key={index}
            className="cps-skeleton__line"
            style={cssHeight === undefined ? undefined : { height: cssHeight }}
          />
        ))}
      </span>
    );
  }

  return (
    <span
      {...rest}
      ref={ref}
      aria-hidden="true"
      className={cx(
        "cps-skeleton",
        `cps-skeleton--${variant}`,
        animated && "cps-skeleton--animated",
        className,
      )}
      style={{ width: cssWidth, height: cssHeight, ...style }}
    />
  );
});
