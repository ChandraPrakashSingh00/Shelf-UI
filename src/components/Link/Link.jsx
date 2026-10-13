import { Children, cloneElement, forwardRef, isValidElement } from "react";
import { ExternalLinkIcon } from "../../icons/index.jsx";
import { Slot } from "../../primitives/Slot.jsx";
import { cx } from "../../utils/cx.js";

// Adds `noopener noreferrer` to the consumer's `rel` values, without duplicates.
function externalRel(...rels) {
  const tokens = rels.flatMap((rel) => (typeof rel === "string" ? rel.split(/\s+/) : []));
  return Array.from(new Set([...tokens.filter(Boolean), "noopener", "noreferrer"])).join(" ");
}

/**
 * Styled text link. Renders an `<a>` that accepts every native attribute; the
 * `ref` points to it.
 *
 * - `href`: link target.
 * - `variant`: "primary" (default, brand color), "muted" (secondary text color,
 *   darkens on hover) or "inherit" (the surrounding text color).
 * - `underline`: "hover" (default), "always" or "none". Inside a paragraph, use
 *   "always" so the link doesn't rely on color alone.
 * - `external`: opens the link in a new tab (`target="_blank"`, plus
 *   `rel="noopener noreferrer"` merged with your `rel` — and with the child's `rel`
 *   when `asChild` is set), adds an icon and tells screen reader users that it
 *   opens a new tab (default `false`).
 * - `externalLabel`: visually hidden text added to external links — default
 *   "(opens in a new tab)"; pass `""` to leave it out.
 * - `showExternalIcon`: shows the icon on external links (default `true`).
 * - `asChild`: renders the single child element (e.g. a router `<Link>`) with link
 *   styling instead of an `<a>`; props are merged onto the child, so put the link
 *   target and any `ref` on the child itself. With `external`, the icon and hidden
 *   text are added after the child's content.
 */
export const Link = forwardRef(function Link(
  {
    href,
    variant = "primary",
    underline = "hover",
    external = false,
    externalLabel = "(opens in a new tab)",
    showExternalIcon = true,
    asChild = false,
    target,
    rel,
    className,
    children,
    ...rest
  },
  ref,
) {
  const classes = cx(
    "shelf-link",
    `shelf-link--${variant}`,
    `shelf-link--underline-${underline}`,
    external && "shelf-link--external",
    className,
  );

  const linkProps = {
    ...rest,
    target: external ? (target ?? "_blank") : target,
    rel: external ? externalRel(rel) : rel,
    className: classes,
  };

  // The space is a text node of the link itself, so it survives in the accessible
  // name ("GST portal (opens in a new tab)"). Before the icon it doesn't break,
  // which keeps the icon on the same line as the last word.
  const externalContent =
    external && (showExternalIcon || externalLabel) ? (
      <>
        {showExternalIcon ? " " : " "}
        {showExternalIcon && <ExternalLinkIcon className="shelf-link__icon" />}
        {externalLabel ? <span className="shelf-visually-hidden">{externalLabel}</span> : null}
      </>
    ) : null;

  if (asChild) {
    const child = Children.only(children);
    if (!external || !isValidElement(child)) return <Slot {...linkProps}>{child}</Slot>;

    // The child's props win when merged, so its own `rel` is merged here: it can
    // add to `noopener noreferrer` but never drop them.
    const childProps = { rel: externalRel(rel, child.props.rel) };
    return (
      <Slot {...linkProps}>
        {externalContent
          ? cloneElement(child, childProps, child.props.children, externalContent)
          : cloneElement(child, childProps)}
      </Slot>
    );
  }

  return (
    <a {...linkProps} ref={ref} href={href}>
      {children}
      {externalContent}
    </a>
  );
});
