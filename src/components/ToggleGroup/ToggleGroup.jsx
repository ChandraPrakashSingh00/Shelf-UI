import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import { useControllableState } from "../../hooks/useControllableState.js";
import { composeEventHandlers } from "../../utils/composeEventHandlers.js";
import { cx } from "../../utils/cx.js";
import { mergeRefs } from "../../utils/mergeRefs.js";

const ToggleGroupContext = createContext(null);
const NO_VALUES = [];

function useToggleGroupContext() {
  const context = useContext(ToggleGroupContext);
  if (!context) throw new Error("<ToggleGroup.Item> must be rendered inside <ToggleGroup>.");
  return context;
}

// The enabled items of `root` in DOM order, leaving out those of nested groups.
const getEnabledItems = (root) =>
  root
    ? Array.from(root.querySelectorAll(".shelf-toggle-group__item:not(:disabled)")).filter(
        (item) => item.closest(".shelf-toggle-group") === root,
      )
    : [];

// Single mode keeps one value (or `null`); multiple mode an array of values.
const toSingle = (value) => (Array.isArray(value) ? (value[0] ?? null) : (value ?? null));
const toMultiple = (value) => {
  if (Array.isArray(value)) return value;
  return value == null ? NO_VALUES : [value];
};

const ToggleGroupRoot = forwardRef(function ToggleGroup(
  {
    type = "single",
    value,
    defaultValue,
    onValueChange,
    allowDeselect = false,
    size = "md",
    variant = "outline",
    orientation = "horizontal",
    disabled = false,
    fullWidth = false,
    label,
    name,
    className,
    children,
    onKeyDown,
    "aria-labelledby": ariaLabelledBy,
    ...rest
  },
  forwardedRef,
) {
  const multiple = type === "multiple";
  const labelId = `shelf-toggle-group-${useId()}-label`;
  const rootRef = useRef(null);
  const ref = useMemo(() => mergeRefs(rootRef, forwardedRef), [forwardedRef]);

  const resetValue = defaultValue ?? (multiple ? NO_VALUES : null);
  const [currentValue, setValue] = useControllableState({
    value,
    defaultValue: resetValue,
    onChange: onValueChange,
  });
  const selectedValues = multiple ? toMultiple(currentValue) : NO_VALUES;
  const selectedValue = multiple ? null : toSingle(currentValue);

  // Roving tabindex: only one item is in the page's Tab order — the last one
  // focused, else the first pressed item, else the first item.
  const [tabStop, setTabStop] = useState(() =>
    multiple ? (toMultiple(resetValue)[0] ?? null) : toSingle(resetValue),
  );

  // Keeps the tab stop on an enabled item as items are added, removed or disabled
  // (new `children`), and picks one after the first render.
  useEffect(() => {
    const items = getEnabledItems(rootRef.current);
    if (items.some((item) => item.dataset.value === String(tabStop))) return;
    const pressed = items.find((item) => item.getAttribute("aria-pressed") === "true");
    setTabStop((pressed ?? items[0])?.dataset.value ?? null);
  }, [tabStop, children, disabled, currentValue]);

  // Resetting the form fires no change event: go back to the default value
  // when an uncontrolled group's form resets.
  const isControlled = value !== undefined;
  useEffect(() => {
    const form = rootRef.current?.closest("form");
    if (isControlled || !form) return;
    const handleReset = () => setValue(resetValue);
    form.addEventListener("reset", handleReset);
    return () => form.removeEventListener("reset", handleReset);
  }, [isControlled, resetValue, setValue]);

  const toggle = useCallback(
    (itemValue) => {
      if (multiple) {
        setValue(
          selectedValues.includes(itemValue)
            ? selectedValues.filter((selected) => selected !== itemValue)
            : [...selectedValues, itemValue],
        );
      } else if (selectedValue === itemValue) {
        // Without `allowDeselect`, a size or view choice can't be emptied by a second click.
        if (allowDeselect) setValue(null);
      } else {
        setValue(itemValue);
      }
    },
    [allowDeselect, multiple, selectedValue, selectedValues, setValue],
  );

  const context = useMemo(
    () => ({
      isPressed: (itemValue) =>
        multiple ? selectedValues.includes(itemValue) : selectedValue === itemValue,
      toggle,
      tabStop,
      setTabStop,
      disabled,
    }),
    [disabled, multiple, selectedValue, selectedValues, tabStop, toggle],
  );

  // Arrow keys move focus between the enabled items (wrapping), Home and End to
  // the first and last one. Space and Enter toggle the focused item natively.
  const handleKeyDown = (event) => {
    const items = getEnabledItems(event.currentTarget);
    const index = items.indexOf(event.target);
    if (index === -1) return;

    const horizontal = orientation !== "vertical";
    const rtl = horizontal && getComputedStyle(event.currentTarget).direction === "rtl";
    const nextKey = horizontal ? (rtl ? "ArrowLeft" : "ArrowRight") : "ArrowDown";
    const previousKey = horizontal ? (rtl ? "ArrowRight" : "ArrowLeft") : "ArrowUp";

    let next;
    switch (event.key) {
      case nextKey:
        next = items[(index + 1) % items.length];
        break;
      case previousKey:
        next = items[(index - 1 + items.length) % items.length];
        break;
      case "Home":
        next = items[0];
        break;
      case "End":
        next = items[items.length - 1];
        break;
      default:
        return;
    }
    event.preventDefault();
    next.focus();
  };

  const hiddenValues = multiple ? selectedValues : selectedValue == null ? [] : [selectedValue];

  return (
    <ToggleGroupContext.Provider value={context}>
      <div
        {...rest}
        ref={ref}
        role="group"
        aria-labelledby={ariaLabelledBy ?? (label != null ? labelId : undefined)}
        data-orientation={orientation}
        className={cx(
          "shelf-toggle-group",
          `shelf-toggle-group--${size}`,
          `shelf-toggle-group--${variant}`,
          orientation === "vertical" && "shelf-toggle-group--vertical",
          fullWidth && "shelf-toggle-group--full-width",
          disabled && "shelf-toggle-group--disabled",
          className,
        )}
        onKeyDown={composeEventHandlers(onKeyDown, handleKeyDown)}
      >
        {label != null && (
          <span id={labelId} className="shelf-field__label shelf-toggle-group__label">
            {label}
          </span>
        )}
        <div className="shelf-toggle-group__items">{children}</div>
        {name != null &&
          hiddenValues.map((hiddenValue) => (
            <input
              key={hiddenValue}
              type="hidden"
              name={name}
              value={hiddenValue}
              disabled={disabled}
            />
          ))}
      </div>
    </ToggleGroupContext.Provider>
  );
});

/**
 * One option of a `ToggleGroup`: a `<button>` with `aria-pressed`. Accepts every
 * native `<button>` attribute; the `ref` points to the `<button>`.
 *
 * - `value` (required): identifies the item in the group's value.
 * - `disabled`: the item can't be toggled and the arrow keys skip it (default
 *   `false`), e.g. a size that's out of stock.
 * - `children`: text and/or an icon. An icon-only item needs an `aria-label`.
 */
export const ToggleGroupItem = forwardRef(function ToggleGroupItem(
  { value, disabled = false, className, onClick, onFocus, children, ...rest },
  ref,
) {
  const context = useToggleGroupContext();
  const pressed = context.isPressed(value);
  const isDisabled = disabled || context.disabled;
  // Until the group has picked its tab stop (before the first effect runs, e.g.
  // in server-rendered HTML), every enabled item is reachable with Tab.
  const tabIndex = context.tabStop == null || String(context.tabStop) === String(value) ? 0 : -1;

  return (
    <button
      {...rest}
      ref={ref}
      type="button"
      aria-pressed={pressed}
      disabled={isDisabled}
      tabIndex={tabIndex}
      data-value={value}
      data-state={pressed ? "on" : "off"}
      className={cx("shelf-toggle-group__item", className)}
      onFocus={composeEventHandlers(onFocus, () => context.setTabStop(value))}
      onClick={composeEventHandlers(onClick, () => {
        context.setTabStop(value);
        context.toggle(value);
      })}
    >
      {children}
    </button>
  );
});

/**
 * A set of toggle buttons where one (`type="single"`) or several
 * (`type="multiple"`) can be pressed, like a size picker or a grid / list view
 * switch. It renders a `role="group"` of `<button aria-pressed>` items that is a
 * single Tab stop; the arrow keys move between items. The `ref` points to the
 * group's root `<div>`, which receives the remaining props.
 *
 * - `type`: "single" (default) or "multiple".
 * - `value` / `defaultValue` / `onValueChange`: controlled or uncontrolled value —
 *   a string (or `null` when nothing is pressed) in single mode, an array of
 *   strings in multiple mode. Nothing is pressed by default.
 * - `allowDeselect`: single mode only — clicking the pressed item again unpresses
 *   it (default `false`, so a choice like a size can't be emptied).
 * - `label`: visible label above the items; it names the group. Without it, pass
 *   `aria-label`.
 * - `size`: "sm", "md" (default) or "lg".
 * - `variant`: "outline" (default: joined, segmented buttons) or "ghost"
 *   (separate, borderless buttons).
 * - `orientation`: "horizontal" (default: ← → move) or "vertical" (↑ ↓ move).
 * - `disabled`: disables every item (default `false`).
 * - `fullWidth`: stretches the items to fill the container (default `false`).
 * - `name`: form field name. The value is submitted with hidden inputs — one per
 *   pressed item — and resetting the form of an uncontrolled group restores
 *   `defaultValue`.
 *
 * @example
 * <ToggleGroup label="Size" name="size" defaultValue="m">
 *   <ToggleGroup.Item value="s">S</ToggleGroup.Item>
 *   <ToggleGroup.Item value="m">M</ToggleGroup.Item>
 *   <ToggleGroup.Item value="l">L</ToggleGroup.Item>
 * </ToggleGroup>
 */
export const ToggleGroup = Object.assign(ToggleGroupRoot, { Item: ToggleGroupItem });
