import { Children, cloneElement, forwardRef, useEffect, useId, useMemo, useRef } from "react";
import { useControllableState } from "../../hooks/useControllableState.js";
import { useFloatingPosition } from "../../hooks/useFloatingPosition.js";
import { Portal } from "../../primitives/Portal.jsx";
import { composeEventHandlers } from "../../utils/composeEventHandlers.js";
import { cx } from "../../utils/cx.js";
import { getElementRef } from "../../utils/getElementRef.js";
import { mergeRefs } from "../../utils/mergeRefs.js";

// Grace period after the pointer leaves, so it can move from the trigger onto the tooltip.
const CLOSE_DELAY = 100;

const isHandlerName = (name) => /^on[A-Z]/.test(name);

// Props given to the Tooltip itself (e.g. the `id`, ARIA attributes and handlers
// a Dropdown or Popover adds to its trigger) pass through to the child. The
// child's own props win; when both define an event handler, both run, the child's first.
function mergeTriggerProps(passedProps, childProps) {
  const merged = { ...passedProps, ...childProps };
  for (const [name, passedValue] of Object.entries(passedProps)) {
    const childValue = childProps[name];
    if (
      isHandlerName(name) &&
      typeof passedValue === "function" &&
      typeof childValue === "function"
    ) {
      merged[name] = (event) => {
        childValue(event);
        passedValue(event);
      };
    }
  }
  return merged;
}

/**
 * Short hint shown next to an element on hover and keyboard focus, following the
 * WAI-ARIA tooltip pattern and WCAG 1.4.13: it stays open while its trigger is
 * hovered or focused or the pointer is over the tooltip itself, and Escape hides
 * it without moving the pointer or focus. While visible, the trigger is described
 * by it (`aria-describedby`). A tooltip supplements a label; it never replaces one.
 *
 * - `content` (required): the tooltip's content. Keep it short and non-interactive.
 * - `children` (required): the trigger — a single element that accepts a ref and
 *   event props: a DOM element or a component that forwards them, like `Button`.
 * - `side`: preferred side — "top" (default), "right", "bottom" or "left". It
 *   flips to the opposite side when there isn't room.
 * - `delay`: milliseconds before it opens on hover (default 300). Keyboard focus
 *   opens it immediately; touch never does.
 * - `open` / `defaultOpen` / `onOpenChange`: controlled or uncontrolled open state
 *   (`defaultOpen` defaults to `false`).
 * - `disabled`: never shows the tooltip (default `false`). Nothing shows while
 *   `content` is empty either.
 * - `className`: class for the tooltip bubble.
 *
 * Every other prop, and the `ref`, go to the trigger, so a Tooltip can itself be
 * the `trigger` of a Dropdown or Popover.
 */
export const Tooltip = forwardRef(function Tooltip(
  {
    content,
    children,
    side = "top",
    delay = 300,
    open: openProp,
    defaultOpen = false,
    onOpenChange,
    disabled = false,
    className,
    ...passedProps
  },
  forwardedRef,
) {
  const [open, setOpen] = useControllableState({
    value: openProp,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  });
  const hasContent = content != null && content !== false && content !== "";
  const isOpen = open && !disabled && hasContent;

  const generatedId = useId();
  const tooltipId = `cps-tooltip-${generatedId}`;

  const triggerRef = useRef(null);
  const tooltipRef = useRef(null);
  const timerRef = useRef(undefined);
  // Whether the pointer is over the trigger or the tooltip, and whether the
  // trigger has keyboard focus: the tooltip stays open while either is true.
  const hoveringRef = useRef(false);
  const focusedRef = useRef(false);

  const child = Children.only(children);
  const childRef = getElementRef(child);
  const ref = useMemo(
    () => mergeRefs(triggerRef, childRef, forwardedRef),
    [childRef, forwardedRef],
  );

  const placement = useFloatingPosition(triggerRef, tooltipRef, { open: isOpen, side });

  const clearTimer = () => window.clearTimeout(timerRef.current);

  useEffect(() => () => window.clearTimeout(timerRef.current), []);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (event) => {
      if (event.key !== "Escape") return;
      // Dismiss only the tooltip: a surrounding Modal or Popover stays open until the next Escape.
      event.stopPropagation();
      window.clearTimeout(timerRef.current);
      setOpen(false);
    };
    // Capture phase, so the tooltip handles Escape before anything else on the page.
    document.addEventListener("keydown", handleKeyDown, true);
    return () => document.removeEventListener("keydown", handleKeyDown, true);
  }, [isOpen, setOpen]);

  const scheduleClose = () => {
    clearTimer();
    if (focusedRef.current) return;
    timerRef.current = window.setTimeout(() => setOpen(false), CLOSE_DELAY);
  };

  const handleTriggerPointerEnter = (event) => {
    // Touch has no hover, so a tap never opens the tooltip.
    if (event.pointerType === "touch" || disabled) return;
    hoveringRef.current = true;
    clearTimer();
    if (open) return;
    if (delay > 0) timerRef.current = window.setTimeout(() => setOpen(true), delay);
    else setOpen(true);
  };

  const handleTriggerPointerLeave = (event) => {
    if (event.pointerType === "touch") return;
    hoveringRef.current = false;
    scheduleClose();
  };

  const handleFocus = (event) => {
    // Only keyboard focus opens it: focus from a click or a tap doesn't match `:focus-visible`.
    if (disabled || !event.currentTarget.matches(":focus-visible")) return;
    focusedRef.current = true;
    clearTimer();
    setOpen(true);
  };

  const handleBlur = () => {
    focusedRef.current = false;
    if (hoveringRef.current) return;
    clearTimer();
    setOpen(false);
  };

  const handleTooltipPointerEnter = () => {
    hoveringRef.current = true;
    clearTimer();
  };

  const handleTooltipPointerLeave = () => {
    hoveringRef.current = false;
    scheduleClose();
  };

  const triggerProps = mergeTriggerProps(passedProps, child.props);
  const describedBy = [triggerProps["aria-describedby"], isOpen ? tooltipId : null]
    .filter(Boolean)
    .join(" ");

  return (
    <>
      {cloneElement(child, {
        ...triggerProps,
        ref,
        "aria-describedby": describedBy || undefined,
        onPointerEnter: composeEventHandlers(
          triggerProps.onPointerEnter,
          handleTriggerPointerEnter,
        ),
        onPointerLeave: composeEventHandlers(
          triggerProps.onPointerLeave,
          handleTriggerPointerLeave,
        ),
        onFocus: composeEventHandlers(triggerProps.onFocus, handleFocus),
        onBlur: composeEventHandlers(triggerProps.onBlur, handleBlur),
      })}

      {isOpen && (
        <Portal>
          <div
            ref={tooltipRef}
            id={tooltipId}
            role="tooltip"
            className={cx("cps-tooltip", className)}
            style={placement.style}
            data-side={placement.side}
            onPointerEnter={handleTooltipPointerEnter}
            onPointerLeave={handleTooltipPointerLeave}
          >
            {content}
          </div>
        </Portal>
      )}
    </>
  );
});
