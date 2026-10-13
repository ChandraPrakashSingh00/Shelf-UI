import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
} from "react";
import { useControllableState } from "../../hooks/useControllableState.js";
import { composeEventHandlers } from "../../utils/composeEventHandlers.js";
import { cx } from "../../utils/cx.js";
import { mergeRefs } from "../../utils/mergeRefs.js";

const TabsContext = createContext(null);

function useTabsContext(componentName) {
  const context = useContext(TabsContext);
  if (!context) throw new Error(`<${componentName}> must be rendered inside <Tabs>.`);
  return context;
}

// Values may contain spaces, which are not allowed in ID references.
const toIdSegment = (value) => value.replace(/\s+/g, "-");
const getTabId = (baseId, value) => `${baseId}-tab-${toIdSegment(value)}`;
const getPanelId = (baseId, value) => `${baseId}-panel-${toIdSegment(value)}`;

const getEnabledTabs = (list) =>
  Array.from(list?.querySelectorAll('[role="tab"]:not(:disabled)') ?? []);

const TabsRoot = forwardRef(function Tabs(
  { value, defaultValue, onValueChange, className, ...rest },
  ref,
) {
  const baseId = useId();
  const handleChange = useCallback(
    (next) => {
      if (next !== undefined) onValueChange?.(next);
    },
    [onValueChange],
  );
  const [selectedValue, setSelectedValue] = useControllableState({
    value,
    defaultValue,
    onChange: handleChange,
  });

  const context = useMemo(
    () => ({ baseId, selectedValue, select: setSelectedValue }),
    [baseId, selectedValue, setSelectedValue],
  );

  return (
    <TabsContext.Provider value={context}>
      <div {...rest} ref={ref} className={cx("shelf-tabs", className)} />
    </TabsContext.Provider>
  );
});

/** Container for the tab buttons. Give it an `aria-label` describing the set. */
export const TabList = forwardRef(function TabList(
  { className, onKeyDown, ...rest },
  forwardedRef,
) {
  const { selectedValue, select } = useTabsContext("Tabs.List");
  const listRef = useRef(null);
  const ref = useMemo(() => mergeRefs(listRef, forwardedRef), [forwardedRef]);

  // With no value provided, select the first enabled tab so one is always reachable.
  useEffect(() => {
    if (selectedValue !== undefined) return;
    const firstValue = getEnabledTabs(listRef.current)[0]?.dataset.value;
    if (firstValue !== undefined) select(firstValue);
  }, [selectedValue, select]);

  // Arrow keys move focus and select (automatic activation), skipping disabled tabs.
  const handleKeyDown = (event) => {
    const tabs = getEnabledTabs(event.currentTarget);
    const index = tabs.findIndex((tab) => tab === document.activeElement);
    if (index === -1) return;

    let next;
    switch (event.key) {
      case "ArrowRight":
        next = tabs[(index + 1) % tabs.length];
        break;
      case "ArrowLeft":
        next = tabs[(index - 1 + tabs.length) % tabs.length];
        break;
      case "Home":
        next = tabs[0];
        break;
      case "End":
        next = tabs[tabs.length - 1];
        break;
      default:
        return;
    }
    event.preventDefault();
    next?.focus();
    const nextValue = next?.dataset.value;
    if (nextValue !== undefined) select(nextValue);
  };

  return (
    <div
      {...rest}
      ref={ref}
      role="tablist"
      className={cx("shelf-tabs__list", className)}
      onKeyDown={composeEventHandlers(onKeyDown, handleKeyDown)}
    />
  );
});

/** A tab button. `value` (required) links it to the `Tabs.Panel` with the same value. */
export const Tab = forwardRef(function Tab({ value, className, onClick, ...rest }, ref) {
  const { baseId, selectedValue, select } = useTabsContext("Tabs.Tab");
  const isSelected = selectedValue === value;

  return (
    <button
      {...rest}
      ref={ref}
      type="button"
      role="tab"
      id={getTabId(baseId, value)}
      aria-selected={isSelected}
      aria-controls={getPanelId(baseId, value)}
      // Roving tabindex: only the selected tab is in the page's Tab order.
      tabIndex={isSelected ? 0 : -1}
      data-value={value}
      className={cx("shelf-tabs__tab", className)}
      onClick={composeEventHandlers(onClick, () => select(value))}
    />
  );
});

/** Content for one tab. `value` (required) must match the `value` of its `Tabs.Tab`. */
export const TabPanel = forwardRef(function TabPanel({ value, className, children, ...rest }, ref) {
  const { baseId, selectedValue } = useTabsContext("Tabs.Panel");
  const isSelected = selectedValue === value;

  // Inactive panels stay in the DOM (so `aria-controls` resolves) but are
  // hidden and don't mount their content.
  return (
    <div
      {...rest}
      ref={ref}
      role="tabpanel"
      id={getPanelId(baseId, value)}
      aria-labelledby={getTabId(baseId, value)}
      hidden={!isSelected}
      tabIndex={0}
      className={cx("shelf-tabs__panel", className)}
    >
      {isSelected ? children : null}
    </div>
  );
});

/**
 * Accessible tabs following the WAI-ARIA tabs pattern.
 *
 * - `value`: controlled selected tab value.
 * - `defaultValue`: initially selected tab when uncontrolled. Defaults to the first enabled tab.
 * - `onValueChange`: called with the newly selected tab value.
 *
 * @example
 * <Tabs defaultValue="overview">
 *   <Tabs.List aria-label="Project">
 *     <Tabs.Tab value="overview">Overview</Tabs.Tab>
 *     <Tabs.Tab value="settings">Settings</Tabs.Tab>
 *   </Tabs.List>
 *   <Tabs.Panel value="overview">…</Tabs.Panel>
 *   <Tabs.Panel value="settings">…</Tabs.Panel>
 * </Tabs>
 */
export const Tabs = Object.assign(TabsRoot, {
  List: TabList,
  Tab,
  Panel: TabPanel,
});
