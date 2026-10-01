import { forwardRef, useEffect, useId, useMemo, useRef, useState } from "react";
import { useFocusTrap } from "../../hooks/useFocusTrap.js";
import { useScrollLock } from "../../hooks/useScrollLock.js";
import { InfoIcon, WarningIcon } from "../../icons/index.jsx";
import { Portal } from "../../primitives/Portal.jsx";
import { composeEventHandlers } from "../../utils/composeEventHandlers.js";
import { cx } from "../../utils/cx.js";
import { mergeRefs } from "../../utils/mergeRefs.js";
import { Button } from "../Button/Button.jsx";

const DEFAULT_ICONS = { danger: WarningIcon, primary: InfoIcon };

const isThenable = (value) =>
  value != null &&
  (typeof value === "object" || typeof value === "function") &&
  typeof value.then === "function";

/**
 * Modal confirmation that interrupts the user for a decision they must make, like
 * deleting a product or cancelling an order. Follows the WAI-ARIA alert dialog
 * pattern: `role="alertdialog"`, named by `title`, described by `description`.
 * Focus moves to the Cancel button (the least destructive action), stays trapped
 * inside, and returns to the trigger when the dialog closes; page scroll is locked.
 * It renders in a portal. Other props go to the dialog panel, and the `ref` points
 * to it while it is open.
 *
 * - `open` (required): whether the dialog is shown.
 * - `onClose` (required): called to close it — Cancel, Escape, the overlay (when
 *   `closeOnOverlayClick`), and after a successful confirm (when `closeOnConfirm`).
 * - `onConfirm`: called by the confirm button. When it returns a promise, the dialog
 *   shows a loading state until it settles: it closes when the promise resolves and
 *   stays open when it rejects. The rejection is not caught, so it still reaches your
 *   error reporting — handle errors inside `onConfirm` to show them to the user.
 * - `title` (required): the question or statement; also the accessible name.
 * - `description`: the consequences; also the accessible description.
 * - `children`: extra content below the description, e.g. a reason field.
 * - `confirmLabel` (default "Confirm") / `cancelLabel` (default "Cancel").
 * - `variant`: "danger" (default) or "primary" — the confirm button's style and
 *   the default icon.
 * - `icon`: replaces the default icon (a warning sign for danger, an info sign for
 *   primary). Pass `null` to hide it.
 * - `loading`: shows a spinner on the confirm button and blocks Cancel, Escape
 *   and the overlay (default `false`). Set automatically while `onConfirm`'s promise
 *   is pending.
 * - `confirmDisabled`: disables the confirm button, e.g. until a confirmation
 *   text matches (default `false`).
 * - `closeOnConfirm`: calls `onClose` after `onConfirm` succeeds (default `true`).
 *   Set it to `false` to close the dialog yourself.
 * - `closeOnOverlayClick`: closes on a click on the backdrop (default `false`).
 * - `closeOnEscape`: closes on Escape (default `true`).
 * - `size`: "sm" (default) or "md" — maximum width.
 * - `initialFocusRef`: ref of the element to focus on open instead of Cancel.
 */
export const AlertDialog = forwardRef(function AlertDialog({ open, ...props }, ref) {
  if (!open) return null;
  return (
    <Portal>
      <AlertDialogPanel {...props} panelRef={ref} />
    </Portal>
  );
});

// Mounted only while open, so its state and effects map directly to open/close.
function AlertDialogPanel({
  panelRef,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "danger",
  icon,
  loading = false,
  confirmDisabled = false,
  closeOnConfirm = true,
  closeOnOverlayClick = false,
  closeOnEscape = true,
  size = "sm",
  initialFocusRef,
  className,
  children,
  onKeyDown,
  ...rest
}) {
  const dialogRef = useRef(null);
  const cancelRef = useRef(null);
  const ref = useMemo(() => mergeRefs(dialogRef, panelRef), [panelRef]);
  const pressStartedOnOverlay = useRef(false);
  const mountedRef = useRef(false);
  const [pending, setPending] = useState(false);
  const titleId = useId();
  const descriptionId = useId();

  const busy = loading || pending;

  useFocusTrap(dialogRef, { initialFocusRef: initialFocusRef ?? cancelRef });
  useScrollLock();

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const handleConfirm = () => {
    if (busy || confirmDisabled) return;
    const result = onConfirm?.();
    if (!isThenable(result)) {
      if (closeOnConfirm) onClose();
      return;
    }

    setPending(true);
    // A rejection passes through `finally` and the `then` below uncaught, so it
    // surfaces like any other unhandled error; the dialog just stays open.
    Promise.resolve(result)
      .finally(() => {
        if (mountedRef.current) setPending(false);
      })
      .then(() => {
        if (closeOnConfirm && mountedRef.current) onClose();
      });
  };

  const handleKeyDown = (event) => {
    if (event.key !== "Escape") return;
    // Escape belongs to the topmost dialog: an outer one stays open even when
    // this one ignores Escape (`closeOnEscape={false}`).
    event.stopPropagation();
    if (closeOnEscape && !busy) onClose();
  };

  // Only close when the press both started and ended on the overlay, so
  // selecting text inside the dialog and releasing outside doesn't close it.
  const handleOverlayMouseDown = (event) => {
    pressStartedOnOverlay.current = event.target === event.currentTarget;
  };
  const handleOverlayClick = (event) => {
    if (
      closeOnOverlayClick &&
      !busy &&
      pressStartedOnOverlay.current &&
      event.target === event.currentTarget
    ) {
      onClose();
    }
  };

  const DefaultIcon = DEFAULT_ICONS[variant];
  const iconNode = icon === undefined ? DefaultIcon && <DefaultIcon /> : icon;
  const hasIcon = iconNode != null && iconNode !== false;

  return (
    <div
      className="cps-modal-overlay cps-alert-dialog-overlay"
      onMouseDown={handleOverlayMouseDown}
      onClick={handleOverlayClick}
    >
      <div
        {...rest}
        ref={ref}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description != null ? descriptionId : undefined}
        aria-busy={busy || undefined}
        tabIndex={-1}
        className={cx(
          "cps-modal",
          `cps-modal--${size}`,
          "cps-alert-dialog",
          `cps-alert-dialog--${variant}`,
          className,
        )}
        onKeyDown={composeEventHandlers(onKeyDown, handleKeyDown)}
      >
        <div className="cps-alert-dialog__body">
          {hasIcon && (
            <span className="cps-alert-dialog__icon" aria-hidden="true">
              {iconNode}
            </span>
          )}
          <div className="cps-alert-dialog__content">
            <h2 id={titleId} className="cps-alert-dialog__title">
              {title}
            </h2>
            {description != null && (
              <p id={descriptionId} className="cps-alert-dialog__description">
                {description}
              </p>
            )}
            {children != null && <div className="cps-alert-dialog__extra">{children}</div>}
          </div>
        </div>
        <div className="cps-alert-dialog__footer">
          {/* `aria-disabled` rather than `disabled` while busy, so Cancel keeps focus. */}
          <Button
            ref={cancelRef}
            variant="secondary"
            aria-disabled={busy || undefined}
            className="cps-alert-dialog__cancel"
            onClick={busy ? undefined : onClose}
          >
            {cancelLabel}
          </Button>
          <Button
            variant={variant === "primary" ? "primary" : "danger"}
            loading={busy}
            disabled={confirmDisabled}
            onClick={handleConfirm}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
