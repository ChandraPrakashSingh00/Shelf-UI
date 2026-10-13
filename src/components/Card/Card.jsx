import { forwardRef } from "react";
import { cx } from "../../utils/cx.js";

export const CardHeader = forwardRef(function CardHeader({ className, ...rest }, ref) {
  return <div {...rest} ref={ref} className={cx("shelf-card__header", className)} />;
});

/**
 * Card heading. `as` picks the heading element ("h1"–"h6", default "h3") so the
 * card fits the page's heading outline.
 */
export const CardTitle = forwardRef(function CardTitle(
  { as: Heading = "h3", className, ...rest },
  ref,
) {
  return <Heading {...rest} ref={ref} className={cx("shelf-card__title", className)} />;
});

export const CardDescription = forwardRef(function CardDescription({ className, ...rest }, ref) {
  return <p {...rest} ref={ref} className={cx("shelf-card__description", className)} />;
});

export const CardContent = forwardRef(function CardContent({ className, ...rest }, ref) {
  return <div {...rest} ref={ref} className={cx("shelf-card__content", className)} />;
});

export const CardFooter = forwardRef(function CardFooter({ className, ...rest }, ref) {
  return <div {...rest} ref={ref} className={cx("shelf-card__footer", className)} />;
});

const CardRoot = forwardRef(function Card(
  { variant = "outlined", title, description, footer, className, children, ...rest },
  ref,
) {
  const hasHeader = title != null || description != null;
  const usesShorthand = hasHeader || footer != null;

  return (
    <div {...rest} ref={ref} className={cx("shelf-card", `shelf-card--${variant}`, className)}>
      {hasHeader && (
        <CardHeader>
          {title != null && <CardTitle>{title}</CardTitle>}
          {description != null && <CardDescription>{description}</CardDescription>}
        </CardHeader>
      )}
      {usesShorthand && children != null ? <CardContent>{children}</CardContent> : children}
      {footer != null && <CardFooter>{footer}</CardFooter>}
    </div>
  );
});

/**
 * Surface for grouping related content. Use the compound parts
 * (`Card.Header`, `Card.Title`, `Card.Description`, `Card.Content`,
 * `Card.Footer`) or the `title` / `description` / `footer` shorthand props.
 *
 * - `variant`: "outlined" (default), "elevated" or "filled".
 * - `title`: shorthand for `<Card.Header><Card.Title>`.
 * - `description`: shorthand for `<Card.Description>` inside the header.
 * - `footer`: shorthand for `<Card.Footer>`.
 */
export const Card = Object.assign(CardRoot, {
  Header: CardHeader,
  Title: CardTitle,
  Description: CardDescription,
  Content: CardContent,
  Footer: CardFooter,
});
