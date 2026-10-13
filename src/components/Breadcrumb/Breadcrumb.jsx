import { Children, Fragment, forwardRef, isValidElement } from "react";
import { ChevronRightIcon } from "../../icons/index.jsx";
import { Slot } from "../../primitives/Slot.jsx";
import { cx } from "../../utils/cx.js";

const BreadcrumbRoot = forwardRef(function Breadcrumb(
  { label = "Breadcrumb", separator = <ChevronRightIcon />, className, children, ...rest },
  ref,
) {
  // Text, `null` and other non-element children are left out.
  const items = Children.toArray(children).filter(isValidElement);

  return (
    <nav aria-label={label} {...rest} ref={ref} className={cx("shelf-breadcrumb", className)}>
      <ol className="shelf-breadcrumb__list">
        {items.map((item, index) => (
          <Fragment key={item.key}>
            {index > 0 && (
              <li className="shelf-breadcrumb__separator" aria-hidden="true">
                {separator}
              </li>
            )}
            {item}
          </Fragment>
        ))}
      </ol>
    </nav>
  );
});

/**
 * One level of the trail, rendered as an `<li>` with a link inside. The `ref`
 * and the remaining props go to the link (or to the current page's `<span>`).
 *
 * - `href`: link target.
 * - `current`: marks the current page, rendered as `<span aria-current="page">`
 *   instead of a link (default `false`). With `asChild`, the child element gets
 *   `aria-current="page"` instead.
 * - `asChild`: renders the child element (e.g. a router `<Link>`) instead of an
 *   `<a>` (default `false`); props are merged onto the child, so put the link
 *   target and any `ref` on the child itself.
 */
export const BreadcrumbItem = forwardRef(function BreadcrumbItem(
  { href, current = false, asChild = false, className, ...rest },
  ref,
) {
  const itemProps = {
    "aria-current": current ? "page" : undefined,
    ...rest,
    className: cx(current ? "shelf-breadcrumb__current" : "shelf-breadcrumb__link", className),
  };

  let content;
  if (asChild) content = <Slot {...itemProps} />;
  else if (current) content = <span {...itemProps} ref={ref} />;
  else content = <a {...itemProps} ref={ref} href={href} />;

  return <li className="shelf-breadcrumb__item">{content}</li>;
});

/**
 * Shows where the current page sits in the site's hierarchy, following the
 * WAI-ARIA breadcrumb pattern: a `<nav>` landmark around an ordered list of
 * links. The `ref` points to the `<nav>`, which receives the remaining props.
 *
 * - `label`: accessible name of the `<nav>` landmark (default "Breadcrumb").
 * - `separator`: content shown between items (default a chevron icon). It's
 *   decorative and hidden from screen readers.
 * - `children`: `Breadcrumb.Item` elements, from the top level down to the current page.
 *
 * @example
 * <Breadcrumb>
 *   <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
 *   <Breadcrumb.Item href="/projects">Projects</Breadcrumb.Item>
 *   <Breadcrumb.Item current>storefront-web</Breadcrumb.Item>
 * </Breadcrumb>
 */
export const Breadcrumb = Object.assign(BreadcrumbRoot, { Item: BreadcrumbItem });
