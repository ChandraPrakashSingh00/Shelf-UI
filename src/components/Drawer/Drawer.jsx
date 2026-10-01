import { forwardRef, useId, useMemo, useRef } from "react";
import { useFocusTrap } from "../../hooks/useFocusTrap.js";
import { useScrollLock } from "../../hooks/useScrollLock.js";
import { CloseIcon } from "../../icons/index.jsx";
import { IconButton } from "../../primitives/IconButton.jsx";
import { Portal } from "../../primitives/Portal.jsx";
import { composeEventHandlers } from "../../utils/composeEventHandlers.js";
import { cx } from "../../utils/cx.js";
import { mergeRefs } from "../../utils/mergeRefs.js";

/**
 * Panel that slides in from an edge of the screen, rendered in a portal. It is
 * a modal dialog, like `Modal`: it traps focus while open, closes on Escape /
 * overlay click, locks page scroll and restores focus on close. Other props go
 * to the panel, and the `ref` points to it while it is open.
 *
 * - `open` (required): whether the drawer is shown.
 * - `onClose` (required): called on Escape, overlay click or the close button.
 * - `title`: drawer heading; also its accessible name. Without it, pass `aria-label`.
 * - `description`: supporting text; exposed as the drawer's accessible description.
 * - `footer`: actions area below the scrolling body, typically buttons.
 * - `side`: edge the drawer slides in from — "right" (default), "left" or "bottom".
 * - `size`: "sm", "md" (default) or "lg" — the width of a left or right drawer
 *   (20rem, 26rem or 36rem, never wider than the screen), or the maximum height
 *   of a bottom drawer (40%, 60% or 85% of the screen).
 * - `closeOnOverlayClick` / `closeOnEscape`: both default to `true`.
 * - `hideCloseButton`: hides the "×" button in the header (default `false`).
 * - `closeLabel`: accessible name of the close button (default "Close").
 * - `initialFocusRef`: ref of the element to focus when the drawer opens.
 *   Defaults to the first focusable element.
 */
export const Drawer = forwardRef(function Drawer({ open, ...props }, ref) {
  if (!open) return null;
  return (
    <Portal>
      <DrawerPanel {...props} panelRef={ref} />
    </Portal>
  );
});

// Mounted only while open, so its effects map directly to open/close.
function DrawerPanel({
  panelRef,
  onClose,
  title,
  description,
  footer,
  side = "right",
  size = "md",
  closeOnOverlayClick = true,
  closeOnEscape = true,
  hideCloseButton = false,
  closeLabel = "Close",
  initialFocusRef,
  className,
  children,
  onKeyDown,
  ...rest
}) {
  const dialogRef = useRef(null);
  const ref = useMemo(() => mergeRefs(dialogRef, panelRef), [panelRef]);
  const pressStartedOnOverlay = useRef(false);
  const titleId = useId();
  const descriptionId = useId();

  useFocusTrap(dialogRef, { initialFocusRef });
  useScrollLock();

  const handleKeyDown = (event) => {
    if (event.key !== "Escape") return;
    // Escape belongs to the topmost dialog: an outer one stays open even when
    // this one ignores Escape (`closeOnEscape={false}`).
    event.stopPropagation();
    if (closeOnEscape) onClose();
  };

  // Only close when the press both started and ended on the overlay, so
  // selecting text inside the drawer and releasing outside doesn't close it.
  const handleOverlayMouseDown = (event) => {
    pressStartedOnOverlay.current = event.target === event.currentTarget;
  };
  const handleOverlayClick = (event) => {
    if (
      closeOnOverlayClick &&
      pressStartedOnOverlay.current &&
      event.target === event.currentTarget
    ) {
      onClose();
    }
  };

  const hasHeader = title != null || description != null || !hideCloseButton;

  return (
    <div
      className="cps-drawer-overlay"
      onMouseDown={handleOverlayMouseDown}
      onClick={handleOverlayClick}
    >
      <div
        {...rest}
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title != null ? titleId : undefined}
        aria-describedby={description != null ? descriptionId : undefined}
        tabIndex={-1}
        className={cx("cps-drawer", `cps-drawer--${side}`, `cps-drawer--${size}`, className)}
        onKeyDown={composeEventHandlers(onKeyDown, handleKeyDown)}
      >
        {hasHeader && (
          <div className="cps-drawer__header">
            <div className="cps-drawer__heading">
              {title != null && (
                <h2 id={titleId} className="cps-drawer__title">
                  {title}
                </h2>
              )}
              {description != null && (
                <p id={descriptionId} className="cps-drawer__description">
                  {description}
                </p>
              )}
            </div>
            {!hideCloseButton && (
              <IconButton label={closeLabel} className="cps-drawer__close" onClick={onClose}>
                <CloseIcon />
              </IconButton>
            )}
          </div>
        )}
        {children != null && <div className="cps-drawer__body">{children}</div>}
        {footer != null && <div className="cps-drawer__footer">{footer}</div>}
      </div>
    </div>
  );
}
