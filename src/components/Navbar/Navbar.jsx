import { createContext, forwardRef, useContext, useId, useMemo, useRef } from "react";
import { useControllableState } from "../../hooks/useControllableState.js";
import { useOnClickOutside } from "../../hooks/useOnClickOutside.js";
import { CloseIcon, MenuIcon } from "../../icons/index.jsx";
import { IconButton } from "../../primitives/IconButton.jsx";
import { Slot } from "../../primitives/Slot.jsx";
import { composeEventHandlers } from "../../utils/composeEventHandlers.js";
import { cx } from "../../utils/cx.js";
import { mergeRefs } from "../../utils/mergeRefs.js";

const NavbarContext = createContext(null);

function useNavbarContext(componentName) {
  const context = useContext(NavbarContext);
  if (!context) throw new Error(`<${componentName}> must be rendered inside <Navbar>.`);
  return context;
}

const NavbarRoot = forwardRef(function Navbar(
  {
    sticky = false,
    label = "Main",
    menuOpen: menuOpenProp,
    defaultMenuOpen = false,
    onMenuOpenChange,
    className,
    children,
    ...rest
  },
  forwardedRef,
) {
  const menuId = useId();
  const [menuOpen, setMenuOpen] = useControllableState({
    value: menuOpenProp,
    defaultValue: defaultMenuOpen,
    onChange: onMenuOpenChange,
  });

  const headerRef = useRef(null);
  const ref = useMemo(() => mergeRefs(headerRef, forwardedRef), [forwardedRef]);
  // Tapping the page outside the open mobile menu closes it.
  useOnClickOutside(headerRef, () => setMenuOpen(false), menuOpen);

  const context = useMemo(
    () => ({ menuId, menuOpen, setMenuOpen }),
    [menuId, menuOpen, setMenuOpen],
  );

  return (
    <NavbarContext.Provider value={context}>
      <header
        {...rest}
        ref={ref}
        className={cx("cps-navbar", sticky && "cps-navbar--sticky", className)}
      >
        <nav className="cps-navbar__inner" aria-label={label}>
          {children}
        </nav>
      </header>
    </NavbarContext.Provider>
  );
});

/**
 * The site name or logo link. With `asChild`, renders the child element (e.g. a
 * router `<Link>`) instead of an `<a>`; props are merged onto the child, so put
 * any `ref` on the child itself.
 */
export const NavbarBrand = forwardRef(function NavbarBrand(
  { asChild = false, className, ...rest },
  ref,
) {
  const brandProps = { ...rest, className: cx("cps-navbar__brand", className) };
  return asChild ? <Slot {...brandProps} /> : <a {...brandProps} ref={ref} />;
});

/**
 * Holds the links and actions. Inline when the navbar is at least 768px wide;
 * narrower than that it collapses behind a toggle button. `toggleLabel` is the
 * toggle's accessible name (default "Toggle navigation").
 */
export const NavbarMenu = forwardRef(function NavbarMenu(
  { toggleLabel = "Toggle navigation", className, onKeyDown, ...rest },
  ref,
) {
  const { menuId, menuOpen, setMenuOpen } = useNavbarContext("Navbar.Menu");
  const toggleRef = useRef(null);

  // Escape closes the open menu from the toggle or from anywhere inside it.
  const handleKeyDown = (event) => {
    if (event.key === "Escape" && menuOpen) {
      setMenuOpen(false);
      toggleRef.current?.focus();
    }
  };

  return (
    <>
      <IconButton
        ref={toggleRef}
        label={toggleLabel}
        aria-expanded={menuOpen}
        aria-controls={menuId}
        className="cps-navbar__toggle"
        onClick={() => setMenuOpen(!menuOpen)}
        onKeyDown={handleKeyDown}
      >
        {menuOpen ? <CloseIcon /> : <MenuIcon />}
      </IconButton>
      <div
        {...rest}
        ref={ref}
        id={menuId}
        data-state={menuOpen ? "open" : "closed"}
        className={cx("cps-navbar__menu", className)}
        onKeyDown={composeEventHandlers(onKeyDown, handleKeyDown)}
      />
    </>
  );
});

export const NavbarLinks = forwardRef(function NavbarLinks({ className, ...rest }, ref) {
  return <ul {...rest} ref={ref} className={cx("cps-navbar__links", className)} />;
});

/**
 * A list item link; render inside `Navbar.Links`. Closes the mobile menu on click.
 *
 * - `active`: marks the link as the current page (`aria-current="page"`).
 * - `asChild`: renders the child element (e.g. a router `<Link>`) instead of an
 *   `<a>`; props are merged onto the child, so put any `ref` on the child itself.
 */
export const NavbarLink = forwardRef(function NavbarLink(
  { active = false, asChild = false, className, onClick, ...rest },
  ref,
) {
  const { setMenuOpen } = useNavbarContext("Navbar.Link");
  const linkProps = {
    ...rest,
    "aria-current": active ? "page" : undefined,
    className: cx("cps-navbar__link", className),
    onClick: composeEventHandlers(onClick, () => setMenuOpen(false)),
  };

  return (
    <li className="cps-navbar__item">
      {asChild ? <Slot {...linkProps} /> : <a {...linkProps} ref={ref} />}
    </li>
  );
});

export const NavbarActions = forwardRef(function NavbarActions({ className, ...rest }, ref) {
  return <div {...rest} ref={ref} className={cx("cps-navbar__actions", className)} />;
});

/**
 * Responsive site header for product and documentation sites.
 *
 * - `sticky`: sticks to the top of the viewport while scrolling (default `false`).
 * - `label`: accessible name of the `<nav>` landmark (default "Main").
 * - `menuOpen` / `defaultMenuOpen` / `onMenuOpenChange`: controlled or uncontrolled
 *   state of the mobile menu (`defaultMenuOpen` defaults to `false`).
 *
 * @example
 * <Navbar sticky>
 *   <Navbar.Brand href="/">CodeCPS UI</Navbar.Brand>
 *   <Navbar.Menu>
 *     <Navbar.Links>
 *       <Navbar.Link href="/" active>Home</Navbar.Link>
 *       <Navbar.Link href="/docs">Documentation</Navbar.Link>
 *     </Navbar.Links>
 *     <Navbar.Actions>
 *       <Button>Get Started</Button>
 *     </Navbar.Actions>
 *   </Navbar.Menu>
 * </Navbar>
 */
export const Navbar = Object.assign(NavbarRoot, {
  Brand: NavbarBrand,
  Menu: NavbarMenu,
  Links: NavbarLinks,
  Link: NavbarLink,
  Actions: NavbarActions,
});
