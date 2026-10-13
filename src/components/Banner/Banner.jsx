import { forwardRef } from "react";
import { CloseIcon, statusIcons } from "../../icons/index.jsx";
import { IconButton } from "../../primitives/IconButton.jsx";
import { cx } from "../../utils/cx.js";

// Status tones get the same default icon as Alert; "primary" and "neutral" have none.
const DEFAULT_ICONS = {
  info: statusIcons.info,
  success: statusIcons.success,
  warning: statusIcons.warning,
  danger: statusIcons.error,
};

/**
 * Full-width announcement bar for the top of a page or app, like a sale, a
 * shipping update or a service notice. It renders a `<section>` landmark named
 * by `label`. It is not a live region: it is part of the page when it loads, so
 * screen readers find it without interrupting the user. The `ref` and other props
 * go to the `<section>`.
 *
 * - `variant`: "primary" (default, solid brand color), "info", "success",
 *   "warning", "danger" or "neutral" (subtle tints, like Alert).
 * - `title`: optional bold lead-in before the message.
 * - `children`: the message.
 * - `icon`: decorative icon before the message. The status variants (info,
 *   success, warning, danger) show a default status icon; pass `null` to hide it.
 * - `action`: a link or button after the message, e.g. "Shop now".
 * - `onDismiss`: when set, shows a dismiss (×) button that calls it. Hiding the
 *   banner (and remembering that) is up to you.
 * - `dismissLabel`: accessible name of the dismiss button (default "Dismiss").
 * - `sticky`: sticks to the top of the viewport (or scroll container) while
 *   scrolling (default `false`).
 * - `align`: "center" (default) or "start" — alignment of the content.
 * - `label`: accessible name of the region (default "Announcement").
 */
export const Banner = forwardRef(function Banner(
  {
    variant = "primary",
    title,
    icon,
    action,
    onDismiss,
    dismissLabel = "Dismiss",
    sticky = false,
    align = "center",
    label = "Announcement",
    className,
    children,
    ...rest
  },
  ref,
) {
  const DefaultIcon = DEFAULT_ICONS[variant];
  const iconNode = icon === undefined ? DefaultIcon && <DefaultIcon /> : icon;
  const hasIcon = iconNode != null && iconNode !== false;
  const hasTitle = title != null && title !== false && title !== "";

  return (
    <section
      aria-label={label}
      {...rest}
      ref={ref}
      className={cx(
        "shelf-banner",
        `shelf-banner--${variant}`,
        `shelf-banner--align-${align}`,
        sticky && "shelf-banner--sticky",
        onDismiss && "shelf-banner--dismissible",
        className,
      )}
    >
      <div className="shelf-banner__inner">
        {hasIcon && (
          <span className="shelf-banner__icon" aria-hidden="true">
            {iconNode}
          </span>
        )}
        <div className="shelf-banner__message">
          {hasTitle && <strong className="shelf-banner__title">{title}</strong>}
          {hasTitle && children != null && " "}
          {children}
        </div>
        {action != null && <div className="shelf-banner__action">{action}</div>}
      </div>

      {onDismiss && (
        <IconButton label={dismissLabel} className="shelf-banner__dismiss" onClick={onDismiss}>
          <CloseIcon />
        </IconButton>
      )}
    </section>
  );
});
