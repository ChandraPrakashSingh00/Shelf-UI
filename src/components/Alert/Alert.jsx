import { forwardRef } from "react";
import { CloseIcon, statusIcons } from "../../icons/index.jsx";
import { IconButton } from "../../primitives/IconButton.jsx";
import { cx } from "../../utils/cx.js";

/**
 * Inline feedback message. Errors and warnings use `role="alert"` (announced
 * immediately); info and success use the polite `role="status"`.
 *
 * - `variant`: tone of the message — "info" (default), "success", "warning" or "error".
 * - `title` / `description`: the message text.
 * - `icon`: replaces the default status icon. Pass `null` to hide the icon.
 * - `action`: actions rendered under the text, e.g. a `<Button size="sm">`.
 * - `onDismiss`: when provided, a dismiss button is shown that calls this handler.
 * - `dismissLabel`: accessible name of the dismiss button (default "Dismiss").
 */
export const Alert = forwardRef(function Alert(
  {
    variant = "info",
    title,
    description,
    icon,
    action,
    onDismiss,
    dismissLabel = "Dismiss",
    role,
    className,
    children,
    ...rest
  },
  ref,
) {
  const DefaultIcon = statusIcons[variant];
  const iconNode = icon === undefined ? <DefaultIcon /> : icon;
  const isUrgent = variant === "error" || variant === "warning";

  return (
    <div
      {...rest}
      ref={ref}
      role={role ?? (isUrgent ? "alert" : "status")}
      className={cx("shelf-alert", `shelf-alert--${variant}`, className)}
    >
      {iconNode != null && iconNode !== false && (
        <span className="shelf-alert__icon" aria-hidden="true">
          {iconNode}
        </span>
      )}

      <div className="shelf-alert__body">
        {title != null && <div className="shelf-alert__title">{title}</div>}
        {description != null && <div className="shelf-alert__description">{description}</div>}
        {children}
        {action != null && <div className="shelf-alert__action">{action}</div>}
      </div>

      {onDismiss && (
        <IconButton label={dismissLabel} className="shelf-alert__dismiss" onClick={onDismiss}>
          <CloseIcon />
        </IconButton>
      )}
    </div>
  );
});
