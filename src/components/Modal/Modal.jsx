import { useId, useRef } from "react";
import { useFocusTrap } from "../../hooks/useFocusTrap.js";
import { useScrollLock } from "../../hooks/useScrollLock.js";
import { CloseIcon } from "../../icons/index.jsx";
import { IconButton } from "../../primitives/IconButton.jsx";
import { Portal } from "../../primitives/Portal.jsx";
import { composeEventHandlers } from "../../utils/composeEventHandlers.js";
import { cx } from "../../utils/cx.js";

/**
 * Accessible dialog rendered in a portal. Traps focus while open, closes on
 * Escape / overlay click, locks page scroll and restores focus on close.
 *
 * - `open` (required): whether the modal is shown.
 * - `onClose` (required): called on Escape, overlay click or the close button.
 * - `title`: dialog heading; also its accessible name. Without it, pass `aria-label`.
 * - `description`: supporting text; exposed as the dialog's accessible description.
 * - `footer`: actions area, typically buttons.
 * - `size`: maximum width — "sm", "md" (default) or "lg".
 * - `closeOnOverlayClick` / `closeOnEscape`: both default to `true`.
 * - `hideCloseButton`: hides the "×" button in the header (default `false`).
 * - `closeLabel`: accessible name of the close button (default "Close").
 * - `initialFocusRef`: ref of the element to focus when the modal opens.
 *   Defaults to the first focusable element.
 */
export function Modal({ open, ...props }) {
  if (!open) return null;
  return (
    <Portal>
      <ModalDialog {...props} />
    </Portal>
  );
}

// Mounted only while open, so its effects map directly to open/close.
function ModalDialog({
  onClose,
  title,
  description,
  footer,
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
  // selecting text inside the dialog and releasing outside doesn't close it.
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
      className="shelf-modal-overlay"
      onMouseDown={handleOverlayMouseDown}
      onClick={handleOverlayClick}
    >
      <div
        {...rest}
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title != null ? titleId : undefined}
        aria-describedby={description != null ? descriptionId : undefined}
        tabIndex={-1}
        className={cx("shelf-modal", `shelf-modal--${size}`, className)}
        onKeyDown={composeEventHandlers(onKeyDown, handleKeyDown)}
      >
        {hasHeader && (
          <div className="shelf-modal__header">
            <div className="shelf-modal__heading">
              {title != null && (
                <h2 id={titleId} className="shelf-modal__title">
                  {title}
                </h2>
              )}
              {description != null && (
                <p id={descriptionId} className="shelf-modal__description">
                  {description}
                </p>
              )}
            </div>
            {!hideCloseButton && (
              <IconButton label={closeLabel} className="shelf-modal__close" onClick={onClose}>
                <CloseIcon />
              </IconButton>
            )}
          </div>
        )}
        {children != null && <div className="shelf-modal__body">{children}</div>}
        {footer != null && <div className="shelf-modal__footer">{footer}</div>}
      </div>
    </div>
  );
}
