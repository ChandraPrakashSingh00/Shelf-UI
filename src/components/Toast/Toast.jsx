import { forwardRef, useEffect, useRef, useState } from "react";
import { composeEventHandlers } from "../../utils/composeEventHandlers.js";
import { cx } from "../../utils/cx.js";
import { Alert } from "../Alert/Alert.jsx";

export const DEFAULT_TOAST_DURATION = 5000;

/**
 * Calls `onDismiss` after `duration` ms of un-paused time. Pausing keeps the
 * remaining time, so hovering near the end doesn't restart the countdown.
 */
function useDismissTimer(duration, paused, onDismiss) {
  const remaining = useRef(duration);
  const onDismissRef = useRef(onDismiss);

  useEffect(() => {
    onDismissRef.current = onDismiss;
  });

  useEffect(() => {
    remaining.current = duration;
  }, [duration]);

  useEffect(() => {
    if (paused || !Number.isFinite(duration) || duration <= 0) return;

    const startedAt = Date.now();
    const timer = setTimeout(() => onDismissRef.current?.(), remaining.current);
    return () => {
      clearTimeout(timer);
      remaining.current -= Date.now() - startedAt;
    };
  }, [paused, duration]);
}

/**
 * Transient notification. Usually created via `useToast()`, but usable standalone.
 * Accepts every `Alert` prop except `description`, plus:
 *
 * - `variant`: tone of the notification — "info" (default), "success", "warning" or "error".
 * - `message`: body text under the title.
 * - `duration`: milliseconds before `onDismiss` is called automatically (default 5000).
 *   The timer pauses while the toast is hovered or focused. `Infinity` disables auto-dismiss.
 */
export const Toast = forwardRef(function Toast(
  {
    variant = "info",
    message,
    duration = DEFAULT_TOAST_DURATION,
    onDismiss,
    className,
    onMouseEnter,
    onMouseLeave,
    onFocus,
    onBlur,
    ...rest
  },
  ref,
) {
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  useDismissTimer(duration, hovered || focused, onDismiss);

  const handleBlur = (event) => {
    // Stay paused while focus moves between controls inside the toast.
    if (!(
      event.relatedTarget instanceof Node && event.currentTarget.contains(event.relatedTarget)
    )) {
      setFocused(false);
    }
  };

  return (
    <Alert
      {...rest}
      ref={ref}
      aria-atomic="true"
      variant={variant}
      description={message}
      onDismiss={onDismiss}
      className={cx("cps-toast", className)}
      onMouseEnter={composeEventHandlers(onMouseEnter, () => setHovered(true))}
      onMouseLeave={composeEventHandlers(onMouseLeave, () => setHovered(false))}
      onFocus={composeEventHandlers(onFocus, () => setFocused(true))}
      onBlur={composeEventHandlers(onBlur, handleBlur)}
    />
  );
});
