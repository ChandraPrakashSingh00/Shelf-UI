import {
  Children,
  cloneElement,
  createContext,
  forwardRef,
  isValidElement,
  useContext,
  useId,
  useMemo,
} from "react";
import { useControllableState } from "../../hooks/useControllableState.js";
import { ChevronDownIcon, PanelLeftIcon } from "../../icons/index.jsx";
import { IconButton } from "../../primitives/IconButton.jsx";
import { composeEventHandlers } from "../../utils/composeEventHandlers.js";
import { cx } from "../../utils/cx.js";
import { Tooltip } from "../Tooltip/Tooltip.jsx";

const SidebarContext = createContext(null);

function useSidebarContext(componentName) {
  const context = useContext(SidebarContext);
  if (!context) throw new Error(`<${componentName}> must be rendered inside <Sidebar>.`);
  return context;
}

// Numbers are pixels; strings are any CSS length ("16rem", "240px", "100%").
const toCssLength = (value) => (typeof value === "number" ? `${value}px` : value);

const isHandlerName = (name) => /^on[A-Z]/.test(name);

const hasContent = (node) => node != null && node !== false && node !== "";

// Tooltip text that only repeats the trigger's accessible name.
const hiddenText = (node) => (hasContent(node) ? <span aria-hidden="true">{node}</span> : null);

/**
 * Props for an `asChild` item's element, like `Slot` but aware of router links
 * whose `className`, `style` or `children` can be functions of their state (e.g.
 * React Router's `NavLink`). The child's own props win; when both define an event
 * handler, both run, the child's first. `renderContent` wraps the child's content.
 */
function mergeChildProps(ownProps, childProps, renderContent) {
  const merged = { ...ownProps, ...childProps };

  for (const [name, ownValue] of Object.entries(ownProps)) {
    const childValue = childProps[name];
    if (isHandlerName(name) && typeof ownValue === "function" && typeof childValue === "function") {
      merged[name] = (...args) => {
        childValue(...args);
        ownValue(...args);
      };
    }
  }

  const { className, style, children } = childProps;
  merged.className =
    typeof className === "function"
      ? (state) => cx(ownProps.className, className(state))
      : cx(ownProps.className, className);
  if (typeof style === "function") {
    merged.style = (state) => ({ ...ownProps.style, ...style(state) });
  } else if (ownProps.style || style) {
    merged.style = { ...ownProps.style, ...style };
  }
  merged.children =
    typeof children === "function"
      ? (state) => renderContent(children(state))
      : renderContent(children);

  return merged;
}

const SidebarRoot = forwardRef(function Sidebar(
  {
    label = "Sidebar",
    collapsed: collapsedProp,
    defaultCollapsed = false,
    onCollapsedChange,
    width,
    collapsedWidth,
    id,
    className,
    style,
    children,
    ...rest
  },
  ref,
) {
  const generatedId = useId();
  const sidebarId = id ?? `shelf-sidebar-${generatedId}`;
  const [collapsed, setCollapsed] = useControllableState({
    value: collapsedProp,
    defaultValue: defaultCollapsed,
    onChange: onCollapsedChange,
  });

  const context = useMemo(
    () => ({ collapsed, setCollapsed, sidebarId }),
    [collapsed, setCollapsed, sidebarId],
  );

  return (
    <SidebarContext.Provider value={context}>
      <nav
        aria-label={label}
        {...rest}
        ref={ref}
        id={sidebarId}
        data-state={collapsed ? "collapsed" : "expanded"}
        className={cx("shelf-sidebar", collapsed && "shelf-sidebar--collapsed", className)}
        style={{
          "--shelf-sidebar-width": toCssLength(width),
          "--shelf-sidebar-collapsed-width": toCssLength(collapsedWidth),
          ...style,
        }}
      >
        {children}
      </nav>
    </SidebarContext.Provider>
  );
});

/** Top area for the brand and the `Sidebar.Toggle`. Renders a `<div>`. */
export const SidebarHeader = forwardRef(function SidebarHeader({ className, ...rest }, ref) {
  return <div {...rest} ref={ref} className={cx("shelf-sidebar__header", className)} />;
});

/** Scrolling middle area that holds the `Sidebar.Section`s. Renders a `<div>`. */
export const SidebarContent = forwardRef(function SidebarContent({ className, ...rest }, ref) {
  return <div {...rest} ref={ref} className={cx("shelf-sidebar__content", className)} />;
});

/** Bottom area for the signed-in user, settings or help. Renders a `<div>`. */
export const SidebarFooter = forwardRef(function SidebarFooter({ className, ...rest }, ref) {
  return <div {...rest} ref={ref} className={cx("shelf-sidebar__footer", className)} />;
});

/**
 * A list of `Sidebar.Item`s and `Sidebar.Group`s, with an optional heading. The
 * `ref` and other props go to the section's `<div>`.
 *
 * - `title`: visible heading; the section becomes a group named by it. It is
 *   visually hidden while the sidebar is collapsed.
 */
export const SidebarSection = forwardRef(function SidebarSection(
  { title, className, children, ...rest },
  ref,
) {
  useSidebarContext("Sidebar.Section");
  const titleId = useId();
  const hasTitle = hasContent(title);

  return (
    <div
      role={hasTitle ? "group" : undefined}
      aria-labelledby={hasTitle ? titleId : undefined}
      {...rest}
      ref={ref}
      className={cx("shelf-sidebar__section", className)}
    >
      {hasTitle && (
        <div id={titleId} className="shelf-sidebar__section-title">
          {title}
        </div>
      )}
      <ul className="shelf-sidebar__list">{children}</ul>
    </div>
  );
});

/**
 * One navigation link or action; render it inside a `Sidebar.Section` or a
 * `Sidebar.Group` (it renders an `<li>`). It is an `<a>` with `href`, the child
 * element with `asChild`, and a `<button>` otherwise. The `ref` and other props
 * go to that element. While the sidebar is collapsed, the label is visually
 * hidden (it stays the accessible name) and shows in a tooltip on hover and
 * keyboard focus.
 *
 * - `children`: the label. With `asChild`, the child element's content.
 * - `icon`: decorative icon before the label. Give top-level items an icon, since
 *   it's all that shows while the sidebar is collapsed.
 * - `href`: link target; without it (and without `asChild`), the item is a button.
 * - `active`: marks the current page (`aria-current="page"`, default `false`).
 *   React Router's `NavLink` sets this itself.
 * - `badge`: extra content after the label, like an order count. Strings and
 *   numbers show as a count pill.
 * - `disabled`: can't be used (default `false`): a button is disabled; a link
 *   loses its `href` and gets `aria-disabled`.
 * - `asChild`: renders the single child element (e.g. a router `NavLink`) with the
 *   item's props, styling, icon and badge. Put any `ref` on the child.
 * - `tooltip`: content of the collapsed-state tooltip (default: the label).
 */
export const SidebarItem = forwardRef(function SidebarItem(
  {
    icon,
    href,
    active = false,
    badge,
    disabled = false,
    asChild = false,
    tooltip,
    className,
    children,
    onClick,
    ...rest
  },
  ref,
) {
  const { collapsed } = useSidebarContext("Sidebar.Item");
  const child = asChild ? Children.only(children) : null;
  const label = asChild && isValidElement(child) ? child.props.children : children;
  const isCount = typeof badge === "string" || typeof badge === "number";

  const renderContent = (labelContent) => (
    <>
      {hasContent(icon) && (
        <span className="shelf-sidebar__icon" aria-hidden="true">
          {icon}
        </span>
      )}
      <span className="shelf-sidebar__label">{labelContent}</span>
      {hasContent(badge) && (
        <>
          {/* Keeps the label and the badge apart in the accessible name. */}{" "}
          <span className={cx("shelf-sidebar__badge", isCount && "shelf-sidebar__badge--count")}>
            {badge}
          </span>
        </>
      )}
    </>
  );

  // A disabled item does nothing, even when its element is a router link.
  const handleClick = (event) => {
    if (disabled) {
      event.preventDefault();
      return;
    }
    onClick?.(event);
  };

  const ownProps = {
    ...rest,
    "aria-current": active ? "page" : undefined,
    className: cx("shelf-sidebar__item", className),
    onClick: handleClick,
  };

  let element;
  if (asChild) {
    if (!isValidElement(child)) return null;
    element = cloneElement(
      child,
      mergeChildProps(
        { ...ownProps, "aria-disabled": disabled || undefined },
        child.props,
        renderContent,
      ),
    );
  } else if (href != null) {
    element = (
      <a
        {...ownProps}
        href={disabled ? undefined : href}
        role={disabled ? "link" : undefined}
        aria-disabled={disabled || undefined}
      >
        {renderContent(children)}
      </a>
    );
  } else {
    element = (
      <button {...ownProps} type="button" disabled={disabled}>
        {renderContent(children)}
      </button>
    );
  }

  // The default tooltip repeats the accessible name, so it's hidden from screen
  // readers instead of being read a second time as the description.
  const tooltipContent =
    tooltip !== undefined ? tooltip : typeof label === "function" ? null : hiddenText(label);

  return (
    <li className="shelf-sidebar__list-item">
      {/* Always wrapped, so collapsing never remounts the element (and drops focus). */}
      <Tooltip
        ref={ref}
        content={typeof tooltipContent === "function" ? null : tooltipContent}
        side="right"
        disabled={!collapsed}
      >
        {element}
      </Tooltip>
    </li>
  );
});

/**
 * An expandable group of nested `Sidebar.Item`s, like "Products" → "All products",
 * "Add product". Render it inside a `Sidebar.Section`. Its button follows the
 * disclosure pattern (`aria-expanded`, `aria-controls`). While the sidebar is
 * collapsed, only the group's icon shows (with its label in a tooltip), and
 * pressing it expands the sidebar with the group open. The `ref` and other props
 * go to the group's `<li>`.
 *
 * - `label` (required): text of the group's button.
 * - `icon`: decorative icon before the label.
 * - `open` / `defaultOpen` / `onOpenChange`: controlled or uncontrolled open state
 *   (`defaultOpen` defaults to `false`).
 * - `disabled`: the group can't be opened (default `false`).
 */
export const SidebarGroup = forwardRef(function SidebarGroup(
  {
    label,
    icon,
    open: openProp,
    defaultOpen = false,
    onOpenChange,
    disabled = false,
    className,
    children,
    ...rest
  },
  ref,
) {
  const { collapsed, setCollapsed } = useSidebarContext("Sidebar.Group");
  const [open, setOpen] = useControllableState({
    value: openProp,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  });
  const listId = `shelf-sidebar-group-${useId()}`;
  const expanded = open && !collapsed;

  const handleClick = () => {
    if (collapsed) {
      // The rail has no room for nested items: show them in the full sidebar.
      setCollapsed(false);
      setOpen(true);
      return;
    }
    setOpen(!open);
  };

  return (
    <li {...rest} ref={ref} className={cx("shelf-sidebar__group", className)}>
      <Tooltip content={hiddenText(label)} side="right" disabled={!collapsed}>
        <button
          type="button"
          className="shelf-sidebar__item shelf-sidebar__group-trigger"
          aria-expanded={expanded}
          aria-controls={listId}
          disabled={disabled}
          onClick={handleClick}
        >
          {hasContent(icon) && (
            <span className="shelf-sidebar__icon" aria-hidden="true">
              {icon}
            </span>
          )}
          <span className="shelf-sidebar__label">{label}</span>
          <ChevronDownIcon className="shelf-sidebar__chevron" />
        </button>
      </Tooltip>
      <ul id={listId} className="shelf-sidebar__sublist" hidden={!expanded}>
        {children}
      </ul>
    </li>
  );
});

/**
 * Button that collapses the sidebar to an icon rail and expands it again. Render
 * it inside the `Sidebar` (usually in `Sidebar.Header`). It exposes
 * `aria-expanded` and `aria-controls`; other props and the `ref` go to the `<button>`.
 *
 * - `collapseLabel`: accessible name while expanded (default "Collapse sidebar").
 * - `expandLabel`: accessible name while collapsed (default "Expand sidebar").
 * - `children`: replaces the default panel icon.
 */
export const SidebarToggle = forwardRef(function SidebarToggle(
  {
    collapseLabel = "Collapse sidebar",
    expandLabel = "Expand sidebar",
    className,
    children,
    onClick,
    ...rest
  },
  ref,
) {
  const { collapsed, setCollapsed, sidebarId } = useSidebarContext("Sidebar.Toggle");

  return (
    <IconButton
      {...rest}
      ref={ref}
      label={collapsed ? expandLabel : collapseLabel}
      aria-expanded={!collapsed}
      aria-controls={sidebarId}
      className={cx("shelf-sidebar__toggle", className)}
      onClick={composeEventHandlers(onClick, () => setCollapsed(!collapsed))}
    >
      {children ?? <PanelLeftIcon />}
    </IconButton>
  );
});

/**
 * Collapsible side navigation for dashboards and admin panels. Renders a `<nav>`
 * landmark that fills the height of its container, with a scrolling middle.
 * Collapsed, it becomes an icon rail. The `ref` and other props go to the `<nav>`,
 * which has `data-state="expanded"` or `"collapsed"` for your own styles.
 *
 * - `label`: accessible name of the `<nav>` (default "Sidebar").
 * - `collapsed` / `defaultCollapsed` / `onCollapsedChange`: controlled or
 *   uncontrolled collapsed state (`defaultCollapsed` defaults to `false`).
 * - `width`: width while expanded (default "16rem"); a CSS length or a number of pixels.
 * - `collapsedWidth`: width of the icon rail (default "4rem").
 *
 * @example
 * <Sidebar label="Admin">
 *   <Sidebar.Header>
 *     ShopKart <Sidebar.Toggle />
 *   </Sidebar.Header>
 *   <Sidebar.Content>
 *     <Sidebar.Section title="Store">
 *       <Sidebar.Item href="/orders" icon={<OrdersIcon />} badge={12} active>
 *         Orders
 *       </Sidebar.Item>
 *       <Sidebar.Group label="Products" icon={<BoxIcon />}>
 *         <Sidebar.Item href="/products">All products</Sidebar.Item>
 *       </Sidebar.Group>
 *     </Sidebar.Section>
 *   </Sidebar.Content>
 * </Sidebar>
 */
export const Sidebar = Object.assign(SidebarRoot, {
  Header: SidebarHeader,
  Content: SidebarContent,
  Section: SidebarSection,
  Item: SidebarItem,
  Group: SidebarGroup,
  Footer: SidebarFooter,
  Toggle: SidebarToggle,
});
