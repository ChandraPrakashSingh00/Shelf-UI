import { cloneElement, forwardRef, useEffect, useId, useMemo, useRef } from "react";
import { useControllableState } from "../../hooks/useControllableState.js";
import { useOnClickOutside } from "../../hooks/useOnClickOutside.js";
import { CloseIcon } from "../../icons/index.jsx";
import { IconButton } from "../../primitives/IconButton.jsx";
import { composeEventHandlers } from "../../utils/composeEventHandlers.js";
import { cx } from "../../utils/cx.js";
import { getFocusableElements } from "../../utils/focus.js";
import { mergeRefs } from "../../utils/mergeRefs.js";

/**
 * Non-modal dialog that opens from a button, for small interactive content like
 * a share link or quick settings. It renders right after its trigger, so the Tab
 * order runs trigger → popover → rest of the page. On open, focus moves inside;
 * Escape closes it and returns focus to the trigger; a click outside or moving
 * focus out of it closes it and leaves focus where it went.
 *
 * - `trigger` (required): element that toggles the popover, e.g. `<Button>Share</Button>`.
 *   It must forward `id`, `onClick`, `onKeyDown` and ARIA props to a focusable element.
 * - `children`: the popover's content.
 * - `title`: heading at the top; also the dialog's accessible name.
 * - `label`: accessible name when there's no `title`. Defaults to the trigger's text.
 * - `open` / `defaultOpen` / `onOpenChange`: controlled or uncontrolled open state
 *   (`defaultOpen` defaults to `false`).
 * - `side`: where it opens — "bottom" (default), "top", "left" or "right" of the trigger.
 * - `align`: alignment along the trigger's edge — "start" (default), "center" or "end".
 * - `showCloseButton`: adds a close (×) button to the header (default `false`).
 * - `closeLabel`: accessible name of the close button (default "Close").
 * - `initialFocusRef`: ref of the element to focus on open. Defaults to the first
 *   focusable element, or the panel itself.
 * - `className`: class for the content panel. Other props go to the panel too, and
 *   the `ref` points to it (`null` while closed).
 */
export const Popover = forwardRef(function Popover(
  {
    trigger,
    children,
    title,
    label,
    open: openProp,
    defaultOpen = false,
    onOpenChange,
    side = "bottom",
    align = "start",
    showCloseButton = false,
    closeLabel = "Close",
    initialFocusRef,
    className,
    id,
    "aria-label": ariaLabel,
    "aria-labelledby": ariaLabelledBy,
    onKeyDown,
    ...rest
  },
  forwardedRef,
) {
  const [open, setOpen] = useControllableState({
    value: openProp,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  });
  const rootRef = useRef(null);
  const panelRef = useRef(null);
  const ref = useMemo(() => mergeRefs(panelRef, forwardedRef), [forwardedRef]);
  // Whether the last close came from a click or focus outside: focus then stays where it went.
  const closedFromOutsideRef = useRef(false);

  const baseId = useId();
  const triggerId = trigger.props.id ?? `${baseId}-trigger`;
  const panelId = id ?? `${baseId}-popover`;
  const titleId = `${baseId}-title`;

  const name = label ?? ariaLabel;
  const labelledBy =
    ariaLabelledBy ?? (title != null ? titleId : name == null ? triggerId : undefined);

  // Move focus into the panel when it opens. When it closes with focus inside
  // (Escape, the close button, or your own code), focus returns to the trigger.
  useEffect(() => {
    if (!open) return;
    const panel = panelRef.current;
    closedFromOutsideRef.current = false;

    const initialTarget = initialFocusRef?.current;
    if (initialTarget) {
      initialTarget.focus();
    } else if (!panel.contains(document.activeElement)) {
      // Respect an `autoFocus` element that already moved focus inside.
      (getFocusableElements(panel)[0] ?? panel).focus();
    }

    return () => {
      // Only after a real close (the panel has left the DOM, unlike React
      // StrictMode's simulated remount), and not after a click or focus outside.
      if (panel.isConnected || closedFromOutsideRef.current) return;
      // Focus falls back to <body> when the focused element inside is removed.
      const active = document.activeElement;
      if (active === null || active === document.body) {
        document.getElementById(triggerId)?.focus();
      }
    };
  }, [open, initialFocusRef, triggerId]);

  const close = ({ fromOutside }) => {
    closedFromOutsideRef.current = fromOutside;
    setOpen(false);
  };

  useOnClickOutside(rootRef, () => close({ fromOutside: true }), open);

  // Close when focus moves to an element outside (not when the window itself loses focus).
  const handleBlur = (event) => {
    const next = event.relatedTarget;
    if (open && next instanceof Node && !rootRef.current?.contains(next)) {
      close({ fromOutside: true });
    }
  };

  // Skipped when something inside already handled the key (e.g. a Dropdown menu closing itself).
  const handleEscape = (event) => {
    if (event.key !== "Escape" || !open || event.defaultPrevented) return;
    // Keep a surrounding Modal or Popover open.
    event.stopPropagation();
    close({ fromOutside: false });
  };

  const handleTriggerClick = () => {
    if (open) close({ fromOutside: false });
    else setOpen(true);
  };

  const hasHeader = title != null || showCloseButton;

  return (
    <div ref={rootRef} className="cps-popover" onBlur={handleBlur}>
      {cloneElement(trigger, {
        id: triggerId,
        "aria-haspopup": "dialog",
        "aria-expanded": open,
        "aria-controls": open ? panelId : undefined,
        onClick: composeEventHandlers(trigger.props.onClick, handleTriggerClick),
        onKeyDown: composeEventHandlers(trigger.props.onKeyDown, handleEscape),
      })}

      {open && (
        <div
          {...rest}
          ref={ref}
          id={panelId}
          role="dialog"
          aria-labelledby={labelledBy}
          aria-label={labelledBy ? undefined : name}
          tabIndex={-1}
          className={cx(
            "cps-popover__content",
            `cps-popover__content--${side}`,
            `cps-popover__content--${align}`,
            className,
          )}
          onKeyDown={composeEventHandlers(onKeyDown, handleEscape)}
        >
          {hasHeader && (
            <div className="cps-popover__header">
              {title != null && (
                <h2 id={titleId} className="cps-popover__title">
                  {title}
                </h2>
              )}
              {showCloseButton && (
                <IconButton
                  label={closeLabel}
                  className="cps-popover__close"
                  onClick={() => close({ fromOutside: false })}
                >
                  <CloseIcon />
                </IconButton>
              )}
            </div>
          )}
          {children != null && <div className="cps-popover__body">{children}</div>}
        </div>
      )}
    </div>
  );
});
