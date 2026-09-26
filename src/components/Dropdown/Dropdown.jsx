import { cloneElement, useEffect, useId, useRef } from "react";
import { useControllableState } from "../../hooks/useControllableState.js";
import { useOnClickOutside } from "../../hooks/useOnClickOutside.js";
import { composeEventHandlers } from "../../utils/composeEventHandlers.js";
import { cx } from "../../utils/cx.js";

/**
 * Menu button following the WAI-ARIA menu pattern: Enter / Space / ↓ open
 * the menu, ↑ ↓ Home End move between items, Escape closes and returns focus.
 *
 * - `trigger` (required): element that opens the menu, e.g. `<Button>Options</Button>`.
 *   It must forward `id`, `onClick`, `onKeyDown` and ARIA props to a focusable element.
 * - `items` (required): array of menu items, each an object with:
 *   - `id` (required): unique key, passed to `onSelect`;
 *   - `label` (required): the item's content;
 *   - `icon`: decorative icon before the label;
 *   - `disabled`: skipped by keyboard navigation and can't be selected;
 *   - `danger`: styles the item as destructive (e.g. "Delete project");
 *   - `onSelect`: called when this item is selected.
 * - `onSelect`: called with the `id` of the selected item.
 * - `label`: accessible name for the menu. Defaults to the trigger's text.
 * - `align`: horizontal alignment of the menu relative to the trigger —
 *   "start" (default) or "end".
 * - `open` / `defaultOpen` / `onOpenChange`: controlled or uncontrolled open state
 *   (`defaultOpen` defaults to `false`).
 */
export function Dropdown({
  trigger,
  items,
  onSelect,
  label,
  align = "start",
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  className,
}) {
  const [open, setOpen] = useControllableState({
    value: openProp,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  });
  const rootRef = useRef(null);
  const menuRef = useRef(null);
  const pendingFocus = useRef(null);

  const baseId = useId();
  const triggerId = trigger.props.id ?? `${baseId}-trigger`;
  const menuId = `${baseId}-menu`;

  const getEnabledItems = () =>
    Array.from(menuRef.current?.querySelectorAll('[role="menuitem"]:not(:disabled)') ?? []);

  const openMenu = (focus) => {
    pendingFocus.current = focus;
    setOpen(true);
  };

  const closeMenu = ({ restoreFocus }) => {
    setOpen(false);
    if (restoreFocus) document.getElementById(triggerId)?.focus();
  };

  // Move focus into the menu once it has rendered.
  useEffect(() => {
    if (!open || !pendingFocus.current) return;
    const enabledItems = getEnabledItems();
    const target =
      pendingFocus.current === "last" ? enabledItems[enabledItems.length - 1] : enabledItems[0];
    pendingFocus.current = null;
    target?.focus();
  }, [open]);

  useOnClickOutside(rootRef, () => closeMenu({ restoreFocus: false }), open);

  const handleTriggerClick = () => {
    if (open) closeMenu({ restoreFocus: false });
    else openMenu("first");
  };

  const handleTriggerKeyDown = (event) => {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      openMenu(event.key === "ArrowDown" ? "first" : "last");
    }
  };

  const handleMenuKeyDown = (event) => {
    const enabledItems = getEnabledItems();
    const count = enabledItems.length;
    const index = enabledItems.findIndex((item) => item === document.activeElement);

    let next;
    switch (event.key) {
      case "ArrowDown":
        next = enabledItems[(index + 1) % count];
        break;
      case "ArrowUp":
        next = enabledItems[index <= 0 ? count - 1 : index - 1];
        break;
      case "Home":
        next = enabledItems[0];
        break;
      case "End":
        next = enabledItems[count - 1];
        break;
      case "Escape":
      case "Tab":
        event.preventDefault();
        closeMenu({ restoreFocus: true });
        return;
      default:
        return;
    }
    event.preventDefault();
    next?.focus();
  };

  const selectItem = (item) => {
    item.onSelect?.();
    onSelect?.(item.id);
    closeMenu({ restoreFocus: true });
  };

  return (
    <div ref={rootRef} className={cx("cps-dropdown", className)}>
      {cloneElement(trigger, {
        id: triggerId,
        "aria-haspopup": "menu",
        "aria-expanded": open,
        "aria-controls": open ? menuId : undefined,
        // composeEventHandlers only calls these handlers when the event fires,
        // never during render, so the refs they touch are not read while rendering.
        /* eslint-disable react-hooks/refs */
        onClick: composeEventHandlers(trigger.props.onClick, handleTriggerClick),
        onKeyDown: composeEventHandlers(trigger.props.onKeyDown, handleTriggerKeyDown),
        /* eslint-enable react-hooks/refs */
      })}

      {open && (
        <div
          ref={menuRef}
          id={menuId}
          role="menu"
          aria-label={label}
          aria-labelledby={label ? undefined : triggerId}
          className={cx("cps-dropdown__menu", `cps-dropdown__menu--${align}`)}
          onKeyDown={handleMenuKeyDown}
        >
          {items.map((item) => (
            <button
              key={item.id}
              type="button"
              role="menuitem"
              tabIndex={-1}
              disabled={item.disabled}
              className={cx("cps-dropdown__item", item.danger && "cps-dropdown__item--danger")}
              onClick={() => selectItem(item)}
            >
              {item.icon && (
                <span className="cps-dropdown__icon" aria-hidden="true">
                  {item.icon}
                </span>
              )}
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
