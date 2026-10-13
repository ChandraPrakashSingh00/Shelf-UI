import { Fragment, forwardRef } from "react";
import { cx } from "../../utils/cx.js";

/**
 * Keyboard key or shortcut, styled like a physical key. Renders a `<kbd>`, which
 * receives the remaining props; the `ref` points to it.
 *
 * - `children`: a single key, e.g. "Esc" or "Enter".
 * - `keys`: a key combination instead, e.g. `["Ctrl", "K"]`. Each key renders as a
 *   nested `<kbd>` inside the outer one (the HTML way to mark up a combination),
 *   joined by `separator`.
 * - `separator`: what goes between `keys`, with a space on each side (default
 *   "+"), e.g. "then" for a sequence like G then O. Screen readers read it.
 * - `size`: "sm" or "md" (default).
 */
export const Kbd = forwardRef(function Kbd(
  { keys, separator = "+", size = "md", className, children, ...rest },
  ref,
) {
  const isCombination = Array.isArray(keys);

  return (
    <kbd
      {...rest}
      ref={ref}
      className={cx(
        "shelf-kbd",
        `shelf-kbd--${size}`,
        isCombination ? "shelf-kbd--combination" : "shelf-kbd--key",
        className,
      )}
    >
      {isCombination
        ? keys.map((key, index) => (
            // Keys can repeat (e.g. "G", "G"), so the index is part of the key.
            <Fragment key={`${index}-${key}`}>
              {/* Real spaces around the separator, so screen readers read "Ctrl + K" or "G then O". */}
              {index > 0 && (
                <>
                  {" "}
                  <span className="shelf-kbd__separator">{separator}</span>{" "}
                </>
              )}
              <kbd className="shelf-kbd__key">{key}</kbd>
            </Fragment>
          ))
        : children}
    </kbd>
  );
});
