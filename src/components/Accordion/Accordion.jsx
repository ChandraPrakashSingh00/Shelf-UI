import { createContext, forwardRef, useCallback, useContext, useId, useMemo } from "react";
import { useControllableState } from "../../hooks/useControllableState.js";
import { ChevronDownIcon } from "../../icons/index.jsx";
import { composeEventHandlers } from "../../utils/composeEventHandlers.js";
import { cx } from "../../utils/cx.js";

const AccordionContext = createContext(null);

function useAccordionContext(componentName) {
  const context = useContext(AccordionContext);
  if (!context) throw new Error(`<${componentName}> must be rendered inside <Accordion>.`);
  return context;
}

// The enabled header buttons of `root` in DOM order, leaving out those of
// accordions nested inside its panels.
const getEnabledTriggers = (root) =>
  Array.from(root.querySelectorAll(".cps-accordion__trigger:not(:disabled)")).filter(
    (trigger) => trigger.closest(".cps-accordion") === root,
  );

const AccordionRoot = forwardRef(function Accordion(
  { value, defaultValue = [], onValueChange, multiple = false, className, onKeyDown, ...rest },
  ref,
) {
  const [openValues, setOpenValues] = useControllableState({
    value,
    defaultValue,
    onChange: onValueChange,
  });

  const toggle = useCallback(
    (itemValue) => {
      if (openValues.includes(itemValue)) {
        setOpenValues(openValues.filter((openValue) => openValue !== itemValue));
      } else {
        // Without `multiple`, opening an item closes the others.
        setOpenValues(multiple ? [...openValues, itemValue] : [itemValue]);
      }
    },
    [multiple, openValues, setOpenValues],
  );

  const context = useMemo(() => ({ openValues, toggle }), [openValues, toggle]);

  // ↓ ↑ move focus to the next or previous header (wrapping), Home and End to
  // the first or last one, skipping disabled headers.
  const handleKeyDown = (event) => {
    const triggers = getEnabledTriggers(event.currentTarget);
    const index = triggers.indexOf(event.target);
    if (index === -1) return;

    let next;
    switch (event.key) {
      case "ArrowDown":
        next = triggers[(index + 1) % triggers.length];
        break;
      case "ArrowUp":
        next = triggers[(index - 1 + triggers.length) % triggers.length];
        break;
      case "Home":
        next = triggers[0];
        break;
      case "End":
        next = triggers[triggers.length - 1];
        break;
      default:
        return;
    }
    event.preventDefault();
    next.focus();
  };

  return (
    <AccordionContext.Provider value={context}>
      <div
        {...rest}
        ref={ref}
        className={cx("cps-accordion", className)}
        onKeyDown={composeEventHandlers(onKeyDown, handleKeyDown)}
      />
    </AccordionContext.Provider>
  );
});

/**
 * One section of an `Accordion`: a heading whose button shows or hides the
 * section's panel. The `ref` points to the item's root `<div>`, which receives
 * the remaining props.
 *
 * - `value` (required): identifies the item in the accordion's `value` array.
 * - `title` (required): content of the header button.
 * - `headingLevel`: level of the heading that wraps the button, 2–6 (default 3).
 *   Pick the level that fits the page outline.
 * - `disabled`: the item can't be toggled and the arrow keys skip it (default `false`).
 * - `children`: the panel content. It stays mounted, hidden, while the item is closed.
 */
export const AccordionItem = forwardRef(function AccordionItem(
  { value, title, headingLevel = 3, disabled = false, className, children, ...rest },
  ref,
) {
  const { openValues, toggle } = useAccordionContext("Accordion.Item");
  const id = useId();
  const triggerId = `${id}-trigger`;
  const panelId = `${id}-panel`;
  const open = openValues.includes(value);
  const Heading = `h${Math.min(Math.max(headingLevel, 2), 6)}`;

  return (
    <div {...rest} ref={ref} className={cx("cps-accordion__item", className)}>
      <Heading className="cps-accordion__heading">
        <button
          type="button"
          id={triggerId}
          aria-expanded={open}
          aria-controls={panelId}
          disabled={disabled}
          className="cps-accordion__trigger"
          onClick={() => toggle(value)}
        >
          <span className="cps-accordion__title">{title}</span>
          <ChevronDownIcon className="cps-accordion__icon" />
        </button>
      </Heading>
      <div
        role="region"
        id={panelId}
        aria-labelledby={triggerId}
        hidden={!open}
        className="cps-accordion__panel"
      >
        {children}
      </div>
    </div>
  );
});

/**
 * Vertically stacked sections that expand and collapse, following the WAI-ARIA
 * accordion pattern. The `ref` points to the root `<div>`, which receives the
 * remaining props.
 *
 * - `value`: controlled array of the open items' values.
 * - `defaultValue`: items open at first when uncontrolled (default `[]`).
 * - `onValueChange`: called with the new array of open values.
 * - `multiple`: lets several items be open at once (default `false`: opening an
 *   item closes the others). An open item can always be closed.
 *
 * @example
 * <Accordion defaultValue={["billing"]}>
 *   <Accordion.Item value="billing" title="How does billing work?">…</Accordion.Item>
 *   <Accordion.Item value="refunds" title="Do you offer refunds?">…</Accordion.Item>
 * </Accordion>
 */
export const Accordion = Object.assign(AccordionRoot, { Item: AccordionItem });
