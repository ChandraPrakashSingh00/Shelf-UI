import { Fragment, forwardRef, useEffect, useId, useMemo, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { useControllableState } from "../../hooks/useControllableState.js";
import { useFocusTrap } from "../../hooks/useFocusTrap.js";
import { useScrollLock } from "../../hooks/useScrollLock.js";
import { SearchIcon } from "../../icons/index.jsx";
import { Portal } from "../../primitives/Portal.jsx";
import { composeEventHandlers } from "../../utils/composeEventHandlers.js";
import { cx } from "../../utils/cx.js";
import {
  hasCommandModifier,
  isApplePlatform,
  matchesHotkey,
  parseHotkey,
} from "../../utils/hotkey.js";
import { mergeRefs } from "../../utils/mergeRefs.js";
import { matchesAllWords } from "../../utils/textSearch.js";

const NO_ITEMS = [];

// Every word of the query must appear in the label, the description or a keyword.
function defaultFilter(item, query) {
  return matchesAllWords([item.label, item.description, ...(item.keywords ?? [])], query);
}

const isTextEntry = (target) =>
  target instanceof HTMLElement &&
  (target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName));

// IME composition: Safari sends the keydown that ends it with `isComposing` false
// but keyCode 229, so an Enter that picks a word must not run a command.
const isComposing = (event) => event.isComposing || event.keyCode === 229;

// Keeps focus in the search input when an option is pressed.
const preventFocusLoss = (event) => event.preventDefault();

/**
 * Searchable list of commands in a modal dialog, opened with a keyboard shortcut
 * (Ctrl + K or ⌘ K by default) or from your own button. The search input is a
 * WAI-ARIA combobox: typing filters the commands, ↑ ↓ Home End move through them
 * and Enter runs the highlighted one. Like `Modal`, it renders in a portal, traps
 * focus, locks page scroll, closes on Escape or an overlay click and returns focus.
 *
 * - `items`: array of commands, each an object with:
 *   - `id` (required): unique key;
 *   - `label` (required): the command's name (a string works best with the default filter);
 *   - `description`: supporting text below the label;
 *   - `icon`: decorative icon before the label;
 *   - `group`: heading to group it under; groups appear in order of first use;
 *   - `keywords`: array of extra search terms, e.g. synonyms;
 *   - `shortcut`: array of keys shown as a visual hint, e.g. `["G", "O"]`;
 *   - `disabled`: shown, but skipped by the keyboard and can't be run;
 *   - `onSelect`: called with the item when it's run.
 * - `onSelect`: called with the item that was run (after the item's own `onSelect`).
 * - `closeOnSelect`: closes the palette when a command runs (default `true`). It closes
 *   first, so the command can move focus or open another dialog.
 * - `open` / `defaultOpen` / `onOpenChange`: controlled or uncontrolled open state
 *   (`defaultOpen` defaults to `false`).
 * - `hotkey`: shortcut that toggles the palette from anywhere on the page, e.g. "mod+k"
 *   (default; `mod` is Ctrl, or ⌘ on Apple devices), "ctrl+shift+p" or "alt+j". `null`
 *   turns it off. It's skipped when something else already handled the key press, and
 *   a shortcut without Ctrl, ⌘ or Alt is ignored while typing in a field.
 * - `filter`: `function(item, query)` returning whether an item matches. The default
 *   requires every word of the query in the label, description or keywords, ignoring
 *   case and accents. Items keep their order. `null` shows every item.
 * - `placeholder`: search input placeholder (default "Type a command or search…").
 * - `emptyMessage`: shown when nothing matches (default "No results found.").
 * - `label`: accessible name of the dialog and the list (default "Command palette").
 * - `searchLabel`: accessible name of the search input (default "Search commands").
 * - `footer`: content below the list, e.g. keyboard hints.
 * - `className`: class for the dialog panel. Other props go to the panel too, and the
 *   `ref` points to it (`null` while closed).
 */
export const CommandPalette = forwardRef(function CommandPalette(
  { open: openProp, defaultOpen = false, onOpenChange, hotkey = "mod+k", ...props },
  ref,
) {
  const [open, setOpen] = useControllableState({
    value: openProp,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  });

  // Read by the hotkey listener, which stays subscribed while the palette opens and closes.
  const toggleRef = useRef(null);
  useEffect(() => {
    toggleRef.current = () => setOpen(!open);
  });

  useEffect(() => {
    const shortcut = parseHotkey(hotkey);
    if (!shortcut) return;
    const isMac = isApplePlatform();

    const handleKeyDown = (event) => {
      if (event.defaultPrevented || event.repeat || isComposing(event)) return;
      if (!matchesHotkey(event, shortcut, { isMac })) return;
      // A shortcut without Ctrl, ⌘ or Alt (like "/") would get in the way of typing.
      if (!hasCommandModifier(shortcut) && isTextEntry(event.target)) return;
      event.preventDefault();
      toggleRef.current?.();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [hotkey]);

  if (!open) return null;
  return (
    <Portal>
      <CommandPaletteDialog {...props} ref={ref} onClose={() => setOpen(false)} />
    </Portal>
  );
});

// Mounted only while open, so every search starts fresh and effects map to open/close.
const CommandPaletteDialog = forwardRef(function CommandPaletteDialog(
  {
    onClose,
    items = NO_ITEMS,
    onSelect,
    closeOnSelect = true,
    filter = defaultFilter,
    placeholder = "Type a command or search…",
    emptyMessage = "No results found.",
    label = "Command palette",
    searchLabel = "Search commands",
    footer,
    className,
    onKeyDown,
    ...rest
  },
  forwardedRef,
) {
  const dialogRef = useRef(null);
  const inputRef = useRef(null);
  const ref = useMemo(() => mergeRefs(dialogRef, forwardedRef), [forwardedRef]);
  const pressStartedOnOverlay = useRef(false);

  const baseId = useId();
  const listboxId = `${baseId}-listbox`;
  const optionId = (index) => `${baseId}-option-${index}`;

  const [query, setQuery] = useState("");
  const [activeId, setActiveId] = useState(null);

  useFocusTrap(dialogRef, { initialFocusRef: inputRef });
  useScrollLock();

  const groups = useMemo(() => {
    const results =
      typeof filter === "function" && query.trim() !== ""
        ? items.filter((item) => filter(item, query))
        : items;
    const byName = new Map();
    for (const item of results) {
      const name = item.group ?? null;
      if (!byName.has(name)) byName.set(name, []);
      byName.get(name).push(item);
    }
    return Array.from(byName, ([name, groupItems]) => ({ name, items: groupItems }));
  }, [items, filter, query]);

  // Options in the order they're shown, which is the order the arrow keys follow.
  const options = groups.flatMap((group) => group.items);
  const enabledOptions = options.filter((item) => !item.disabled);
  // The first enabled option is active until the pointer or the arrow keys move on.
  const activeItem =
    enabledOptions.find((item) => item.id === activeId) ?? enabledOptions[0] ?? null;
  const positions = new Map(options.map((item, index) => [item, index]));
  const activeIndex = activeItem ? positions.get(activeItem) : -1;
  const hasOptions = options.length > 0;

  useEffect(() => {
    if (activeIndex === -1) return;
    document
      .getElementById(`${baseId}-option-${activeIndex}`)
      ?.scrollIntoView?.({ block: "nearest" });
  }, [activeIndex, baseId]);

  const runItem = (item) => {
    if (item.disabled) return;
    // Close first, so focus is back on the trigger before the command runs: a
    // command can then move focus itself or open another dialog.
    if (closeOnSelect) flushSync(onClose);
    item.onSelect?.(item);
    onSelect?.(item);
  };

  const moveTo = (item) => {
    if (item) setActiveId(item.id);
  };

  const handleInputKeyDown = (event) => {
    if (isComposing(event.nativeEvent)) return;
    const count = enabledOptions.length;
    const position = enabledOptions.indexOf(activeItem);
    const hasModifier = event.shiftKey || event.ctrlKey || event.metaKey || event.altKey;

    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        if (count > 0) moveTo(enabledOptions[(position + 1) % count]);
        break;
      case "ArrowUp":
        event.preventDefault();
        if (count > 0) moveTo(enabledOptions[(position - 1 + count) % count]);
        break;
      case "Home":
      case "End":
        if (hasModifier || count === 0) return;
        event.preventDefault();
        moveTo(event.key === "Home" ? enabledOptions[0] : enabledOptions[count - 1]);
        break;
      case "Enter":
        if (!activeItem) return;
        event.preventDefault();
        runItem(activeItem);
        break;
      default:
    }
  };

  const handleKeyDown = (event) => {
    // Escape during IME composition only cancels the composition.
    if (event.key !== "Escape" || isComposing(event.nativeEvent)) return;
    // Keep a surrounding Modal open, and the page's own Escape handlers out of it.
    event.stopPropagation();
    onClose();
  };

  // Only close when the press both started and ended on the overlay, like Modal.
  const handleOverlayMouseDown = (event) => {
    pressStartedOnOverlay.current = event.target === event.currentTarget;
  };
  const handleOverlayClick = (event) => {
    if (pressStartedOnOverlay.current && event.target === event.currentTarget) onClose();
  };

  const renderOption = (item) => {
    const index = positions.get(item);
    const id = optionId(index);
    const active = index === activeIndex;
    const shortcut = Array.isArray(item.shortcut) ? item.shortcut : [];

    return (
      <div
        key={item.id}
        id={id}
        role="option"
        aria-selected={active}
        aria-disabled={item.disabled || undefined}
        aria-labelledby={`${id}-label`}
        aria-describedby={item.description != null ? `${id}-description` : undefined}
        className={cx(
          "shelf-command-palette__option",
          active && "shelf-command-palette__option--active",
          item.disabled && "shelf-command-palette__option--disabled",
        )}
        onMouseMove={() => {
          if (!item.disabled && !active) setActiveId(item.id);
        }}
        onClick={() => runItem(item)}
      >
        {item.icon != null && (
          <span className="shelf-command-palette__icon" aria-hidden="true">
            {item.icon}
          </span>
        )}
        <span className="shelf-command-palette__text">
          <span id={`${id}-label`} className="shelf-command-palette__label">
            {item.label}
          </span>
          {item.description != null && (
            <span id={`${id}-description`} className="shelf-command-palette__description">
              {item.description}
            </span>
          )}
        </span>
        {/* A visual hint only: the shortcut itself is up to your app. */}
        {shortcut.length > 0 && (
          <span className="shelf-command-palette__shortcut" aria-hidden="true">
            {shortcut.map((key, keyIndex) => (
              <kbd key={keyIndex} className="shelf-command-palette__kbd">
                {key}
              </kbd>
            ))}
          </span>
        )}
      </div>
    );
  };

  return (
    <div
      className="shelf-command-palette-overlay"
      onMouseDown={handleOverlayMouseDown}
      onClick={handleOverlayClick}
    >
      <div
        {...rest}
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-label={label}
        tabIndex={-1}
        className={cx("shelf-command-palette", className)}
        onKeyDown={composeEventHandlers(onKeyDown, handleKeyDown)}
      >
        <div className="shelf-command-palette__search">
          <SearchIcon className="shelf-command-palette__search-icon" />
          <input
            ref={inputRef}
            type="text"
            role="combobox"
            aria-label={searchLabel}
            aria-autocomplete="list"
            aria-expanded={hasOptions}
            aria-controls={hasOptions ? listboxId : undefined}
            aria-activedescendant={activeIndex !== -1 ? optionId(activeIndex) : undefined}
            autoComplete="off"
            spellCheck={false}
            placeholder={placeholder}
            value={query}
            className="shelf-command-palette__input"
            onChange={(event) => {
              setQuery(event.target.value);
              setActiveId(null);
            }}
            onKeyDown={handleInputKeyDown}
          />
        </div>

        <div className="shelf-command-palette__results" onMouseDown={preventFocusLoss}>
          {hasOptions ? (
            <div id={listboxId} role="listbox" aria-label={label}>
              {groups.map((group, groupIndex) => {
                if (group.name == null) {
                  return <Fragment key="ungrouped">{group.items.map(renderOption)}</Fragment>;
                }
                const headingId = `${baseId}-group-${groupIndex}`;
                return (
                  <div
                    key={group.name}
                    role="presentation"
                    className="shelf-command-palette__group"
                  >
                    <div
                      id={headingId}
                      className="shelf-command-palette__group-heading"
                      aria-hidden="true"
                    >
                      {group.name}
                    </div>
                    <div role="group" aria-labelledby={headingId}>
                      {group.items.map(renderOption)}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            // Announced through the status region below instead.
            <p className="shelf-command-palette__empty" aria-hidden="true">
              {emptyMessage}
            </p>
          )}
        </div>
        <span className="shelf-visually-hidden" role="status">
          {hasOptions ? null : emptyMessage}
        </span>

        {footer != null && <div className="shelf-command-palette__footer">{footer}</div>}
      </div>
    </div>
  );
});
