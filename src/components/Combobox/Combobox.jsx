import { forwardRef, useEffect, useId, useMemo, useRef, useState } from "react";
import { useControllableState } from "../../hooks/useControllableState.js";
import { CheckIcon, ChevronDownIcon, CloseIcon } from "../../icons/index.jsx";
import { Spinner } from "../../primitives/Spinner.jsx";
import { composeEventHandlers } from "../../utils/composeEventHandlers.js";
import { cx } from "../../utils/cx.js";
import { mergeRefs } from "../../utils/mergeRefs.js";
import { findTextMatch, normalizeSearchText } from "../../utils/textSearch.js";

const NO_OPTIONS = [];

// Options can be plain strings (or numbers) or `{ value, label, description, disabled }` objects.
function toOption(option) {
  if (option !== null && typeof option === "object") {
    return option.label == null ? { ...option, label: String(option.value) } : option;
  }
  return { value: option, label: String(option) };
}

// Case- and accent-insensitive "label contains the query".
function defaultFilter(option, query) {
  return normalizeSearchText(option.label).includes(normalizeSearchText(query).trim());
}

// Index of the next enabled option after `from` (-1: from the start or end), wrapping around.
function findEnabledIndex(options, from, step) {
  const count = options.length;
  const origin = from === -1 ? (step > 0 ? -1 : count) : from;
  for (let offset = 1; offset <= count; offset += 1) {
    const index = (((origin + step * offset) % count) + count) % count;
    if (!options[index].disabled) return index;
  }
  return -1;
}

const toCssLength = (length) => (typeof length === "number" ? `${length}px` : length);

// Keeps focus in the input when the list or the buttons are pressed.
const preventFocusLoss = (event) => event.preventDefault();

function HighlightedLabel({ label, query }) {
  const match = findTextMatch(label, query);
  if (!match) return label;
  const [start, end] = match;
  return (
    <>
      {label.slice(0, start)}
      <span className="shelf-combobox__match">{label.slice(start, end)}</span>
      {label.slice(end)}
    </>
  );
}

/**
 * Text field with a list of suggestions, following the WAI-ARIA combobox pattern
 * (editable, list autocomplete with manual selection). Typing filters the options
 * and ↓ / ↑ move through them; the value is always one of the options (or `null`),
 * and leaving the field puts the selected option's label back in the input. Typing
 * an option's whole label selects it when the field is left or Enter is pressed.
 * `className` and `style` apply to the field wrapper; every other native attribute
 * (and the `ref`) goes to the `<input>`.
 *
 * - `label`: visible label, linked to the input. Without it, pass `aria-label`.
 * - `helperText`: hint below the field, exposed as its accessible description.
 * - `error`: error message; replaces `helperText` and marks the input `aria-invalid`.
 *   Pass `true` to mark the field invalid without a message.
 * - `size`: "sm", "md" (default) or "lg" — control height and font size.
 * - `options`: array of strings (or numbers) or `{ value, label, description, disabled }`
 *   objects. Values must be unique and not `null`; `label` is the text shown in the
 *   input once selected (defaults to the value as a string).
 * - `value` / `defaultValue` / `onValueChange`: the selected option's value, or `null`
 *   (`defaultValue` defaults to `null`).
 * - `inputValue` / `defaultInputValue` / `onInputChange`: the text in the input.
 *   `onInputChange(text, reason)` gets the reason: "input" (typing), "select", "clear",
 *   "restore" (leaving the field puts the selected label back) or "reset" (form reset).
 * - `open` / `defaultOpen` / `onOpenChange`: whether the list is open (default `false`).
 * - `filter`: `function(option, query)` returning whether an option matches the typed
 *   text. The default keeps options whose label contains it, ignoring case and accents.
 *   Pass `null` to show `options` as they are, e.g. results from a server search.
 * - `emptyMessage`: shown when nothing matches (default "No results").
 * - `loading`: shows a spinner (and `loadingMessage` when there are no options yet),
 *   and marks the input `aria-busy` (default `false`).
 * - `loadingMessage`: text for the loading state (default "Loading…").
 * - `clearable`: adds a × button while there's a value or text; Escape (on a closed list)
 *   and erasing the text also clear the value (default `true`).
 * - `clearLabel`: accessible name of the clear button (default "Clear").
 * - `toggleLabel`: accessible name of the button that opens the list (default "Show options").
 * - `name`: submits the selected value with a form, through a hidden input.
 * - `openOnFocus`: opens the list when the input gets focus (default `false`).
 * - `maxHeight`: maximum height of the list, a CSS length or a number of px (default 16rem).
 * - `required`: an option must be selected to submit the form — typed text alone
 *   isn't enough. The browser shows its own message and points the user at the
 *   input, which gets `aria-required` and an asterisk after the label.
 * - `placeholder`, `leftIcon`, `disabled`, `readOnly`, `id`: as on `Input`.
 */
export const Combobox = forwardRef(function Combobox(
  {
    label,
    helperText,
    error,
    size = "md",
    placeholder,
    leftIcon,
    id,
    required,
    disabled = false,
    readOnly = false,
    className,
    style,
    options = NO_OPTIONS,
    value,
    defaultValue = null,
    onValueChange,
    inputValue,
    defaultInputValue,
    onInputChange,
    open: openProp,
    defaultOpen = false,
    onOpenChange,
    filter = defaultFilter,
    emptyMessage = "No results",
    loading = false,
    loadingMessage = "Loading…",
    clearable = true,
    clearLabel = "Clear",
    toggleLabel = "Show options",
    name,
    form: formId,
    openOnFocus = false,
    maxHeight,
    onChange,
    onKeyDown,
    onFocus,
    onBlur,
    "aria-describedby": ariaDescribedBy,
    ...rest
  },
  forwardedRef,
) {
  const generatedId = useId();
  const inputId = id ?? `shelf-combobox-${generatedId}`;
  const labelId = `${inputId}-label`;
  const listboxId = `${inputId}-listbox`;
  const messageId = `${inputId}-message`;
  const optionId = (index) => `${listboxId}-option-${index}`;

  const inputRef = useRef(null);
  const ref = useMemo(() => mergeRefs(inputRef, forwardedRef), [forwardedRef]);

  const hasError = error != null && error !== false && error !== "";
  const message = hasError && error !== true ? error : helperText;
  const describedBy = [ariaDescribedBy, message != null ? messageId : null]
    .filter(Boolean)
    .join(" ");

  const items = useMemo(() => options.map(toOption), [options]);
  const findOption = (optionValue) => items.find((option) => option.value === optionValue);

  const [currentValue, setValue] = useControllableState({
    value,
    defaultValue,
    onChange: onValueChange,
  });
  const selectedValue = currentValue ?? null;

  // The selected option as last seen in `options`, so its label survives a server
  // search that no longer returns it, however the value was set.
  const [picked, setPicked] = useState(() => {
    const initialValue = value !== undefined ? value : defaultValue;
    if (initialValue == null) return null;
    const initialLabel = findOption(initialValue)?.label ?? defaultInputValue ?? inputValue ?? "";
    return { value: initialValue, label: initialLabel };
  });
  const listedOption = selectedValue == null ? undefined : findOption(selectedValue);
  if (
    listedOption &&
    (picked?.value !== listedOption.value || picked.label !== listedOption.label)
  ) {
    setPicked({ value: listedOption.value, label: listedOption.label });
  }
  const selectedOption =
    selectedValue == null
      ? null
      : (listedOption ?? (picked?.value === selectedValue ? picked : null));
  const selectedLabel = selectedOption?.label ?? "";

  const [uncontrolledText, setUncontrolledText] = useState(
    () => defaultInputValue ?? selectedLabel,
  );
  const isTextControlled = inputValue !== undefined;
  const text = isTextControlled ? inputValue : uncontrolledText;
  const setText = (next, reason) => {
    if (next === text) return;
    if (!isTextControlled) setUncontrolledText(next);
    onInputChange?.(next, reason);
  };

  // The input shows the selected option's label: follow it when the value changes
  // from outside, or when the selected option's label arrives later.
  const [syncedLabel, setSyncedLabel] = useState(selectedLabel);
  if (syncedLabel !== selectedLabel) {
    setSyncedLabel(selectedLabel);
    if (!isTextControlled) setUncontrolledText(selectedLabel);
  }

  const [openState, setOpenState] = useControllableState({
    value: openProp,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  });
  const interactive = !disabled && !readOnly;
  const isOpen = Boolean(openState) && interactive;

  // Value of the option highlighted with the arrow keys or the pointer (`null`: none).
  const [activeValue, setActiveValue] = useState(null);

  // While the input just shows the selection, every option is listed; typing filters them.
  const query = text === selectedLabel ? "" : text;
  const visibleOptions = useMemo(() => {
    if (typeof filter !== "function" || query.trim() === "") return items;
    return items.filter((option) => filter(option, query));
  }, [items, filter, query]);

  const activeIndex =
    activeValue == null
      ? -1
      : visibleOptions.findIndex((option) => option.value === activeValue && !option.disabled);
  const hasOptions = visibleOptions.length > 0;
  const listboxVisible = isOpen && hasOptions;
  const showLoading = isOpen && loading && !hasOptions;
  const showEmpty =
    isOpen && !loading && !hasOptions && emptyMessage != null && emptyMessage !== "";
  const announcement = isOpen && !hasOptions ? (loading ? loadingMessage : emptyMessage) : null;

  useEffect(() => {
    if (!listboxVisible || activeIndex === -1) return;
    document
      .getElementById(`${listboxId}-option-${activeIndex}`)
      ?.scrollIntoView?.({ block: "nearest" });
  }, [listboxVisible, activeIndex, listboxId]);

  const selectedIndexIn = (list) =>
    list.findIndex((option) => option.value === selectedValue && !option.disabled);

  const openList = (nextActiveValue) => {
    setOpenState(true);
    setActiveValue(nextActiveValue);
  };

  const closeList = () => {
    setOpenState(false);
    setActiveValue(null);
  };

  const isValueControlled = value !== undefined;

  const selectOption = (option) => {
    if (option.disabled) return;
    setValue(option.value);
    setPicked({ value: option.value, label: option.label });
    if (isValueControlled && !isTextControlled && option.value !== selectedValue) {
      // The text follows once the parent accepts the new value (see `syncedLabel`);
      // until then, or if it never does, the field shows the current selection.
      onInputChange?.(option.label, "select");
      setUncontrolledText(selectedLabel);
    } else {
      setText(option.label, "select");
    }
    closeList();
  };

  const clearSelection = () => {
    setValue(null);
    setPicked(null);
    setText("", "clear");
    setActiveValue(null);
  };

  // Resetting the form doesn't fire change events: go back to the default selection.
  const resetText =
    defaultInputValue ?? (defaultValue == null ? "" : findOption(defaultValue)?.label) ?? "";
  useEffect(() => {
    const form = inputRef.current?.form;
    if (!form) return;
    const handleReset = () => {
      setOpenState(false);
      setActiveValue(null);
      if (isValueControlled) return;
      setValue(defaultValue);
      setPicked(defaultValue == null ? null : { value: defaultValue, label: resetText });
      if (resetText === text) return;
      if (!isTextControlled) setUncontrolledText(resetText);
      onInputChange?.(resetText, "reset");
    };
    form.addEventListener("reset", handleReset);
    return () => form.removeEventListener("reset", handleReset);
  }, [
    isValueControlled,
    isTextControlled,
    defaultValue,
    resetText,
    text,
    setValue,
    setOpenState,
    onInputChange,
  ]);

  const handleChange = composeEventHandlers(onChange, (event) => {
    const next = event.target.value;
    setText(next, "input");
    setActiveValue(null);
    // Erasing the text clears the selection.
    if (next === "" && clearable && selectedValue != null) {
      setValue(null);
      setPicked(null);
    }
    setOpenState(true);
  });

  // The enabled option whose whole label was typed, if any.
  const findExactMatch = () => {
    const typed = normalizeSearchText(query).trim();
    if (typed === "") return undefined;
    return visibleOptions.find(
      (option) => !option.disabled && normalizeSearchText(option.label).trim() === typed,
    );
  };

  const handleKeyDown = composeEventHandlers(onKeyDown, (event) => {
    // Keys that end an IME composition (keyCode 229 in Safari) belong to the IME.
    if (!interactive || event.nativeEvent.isComposing || event.keyCode === 229) return;

    switch (event.key) {
      case "ArrowDown":
      case "ArrowUp": {
        event.preventDefault();
        const step = event.key === "ArrowDown" ? 1 : -1;
        if (event.altKey) {
          // Alt+↓ opens without highlighting an option; Alt+↑ closes.
          if (step < 0) closeList();
          else if (!isOpen) openList(null);
          return;
        }
        if (!isOpen) {
          const selectedIndex = selectedIndexIn(visibleOptions);
          const index =
            selectedIndex !== -1 ? selectedIndex : findEnabledIndex(visibleOptions, -1, step);
          openList(index === -1 ? null : visibleOptions[index].value);
          return;
        }
        const index = findEnabledIndex(visibleOptions, activeIndex, step);
        if (index !== -1) setActiveValue(visibleOptions[index].value);
        return;
      }
      case "Enter": {
        if (isOpen && activeIndex !== -1) {
          event.preventDefault();
          selectOption(visibleOptions[activeIndex]);
          return;
        }
        // Like leaving the field, Enter selects the option whose whole label was
        // typed, before the form submits.
        const exactMatch = findExactMatch();
        if (exactMatch) selectOption(exactMatch);
        return;
      }
      case "Escape":
        // The first Escape closes the list, the next one clears the field.
        if (isOpen) {
          event.preventDefault();
          event.stopPropagation();
          closeList();
        } else if (clearable && (selectedValue != null || text !== "")) {
          event.preventDefault();
          event.stopPropagation();
          clearSelection();
        }
        return;
      case "Tab":
        if (isOpen) closeList();
        return;
      default:
    }
  });

  const handleFocus = composeEventHandlers(onFocus, () => {
    if (openOnFocus && interactive) setOpenState(true);
  });

  const handleBlur = composeEventHandlers(onBlur, () => {
    // Typing an option's whole label and leaving the field selects it (which closes the list).
    const exactMatch = findExactMatch();
    if (exactMatch) {
      selectOption(exactMatch);
      return;
    }
    closeList();
    setText(selectedLabel, "restore");
  });

  // The button also focuses the field; with `openOnFocus`, that focus mustn't open
  // (or re-open) the list a second time.
  const handleToggleClick = () => {
    const input = inputRef.current;
    if (isOpen) {
      // Focusing the field of an open list leaves it open: then it closes.
      input?.focus();
      closeList();
      return;
    }
    const selectedIndex = selectedIndexIn(visibleOptions);
    setActiveValue(selectedIndex === -1 ? null : visibleOptions[selectedIndex].value);
    const focusOpens = openOnFocus && input != null && input.ownerDocument.activeElement !== input;
    if (!focusOpens) setOpenState(true);
    input?.focus();
  };

  const handleClearClick = () => {
    clearSelection();
    inputRef.current?.focus();
  };

  const showClear = clearable && interactive && (selectedValue != null || text !== "");
  const listboxLabelledBy = label != null ? labelId : rest["aria-labelledby"];

  return (
    <div
      className={cx(
        "shelf-field",
        `shelf-field--${size}`,
        "shelf-combobox",
        isOpen && "shelf-combobox--open",
        hasError && "shelf-field--invalid",
        disabled && "shelf-field--disabled",
        className,
      )}
      style={style}
    >
      {label != null && (
        <label id={labelId} className="shelf-field__label" htmlFor={inputId}>
          {label}
          {required && (
            <span className="shelf-field__required" aria-hidden="true">
              *
            </span>
          )}
        </label>
      )}

      <div className="shelf-combobox__anchor">
        <div className="shelf-combobox__box">
          {leftIcon && (
            <span className="shelf-combobox__icon" aria-hidden="true">
              {leftIcon}
            </span>
          )}
          <input
            autoComplete="off"
            spellCheck={false}
            {...rest}
            ref={ref}
            id={inputId}
            type="text"
            role="combobox"
            form={formId}
            value={text}
            placeholder={placeholder}
            disabled={disabled}
            readOnly={readOnly}
            aria-required={required || undefined}
            aria-autocomplete="list"
            aria-expanded={listboxVisible}
            aria-controls={listboxVisible ? listboxId : undefined}
            aria-activedescendant={
              listboxVisible && activeIndex !== -1 ? optionId(activeIndex) : undefined
            }
            aria-invalid={hasError || undefined}
            aria-describedby={describedBy || undefined}
            aria-busy={loading || undefined}
            className="shelf-combobox__input"
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
          {loading && <Spinner className="shelf-combobox__spinner" />}
          {showClear && (
            <button
              type="button"
              tabIndex={-1}
              aria-label={clearLabel}
              className="shelf-combobox__button"
              onMouseDown={preventFocusLoss}
              onClick={handleClearClick}
            >
              <CloseIcon />
            </button>
          )}
          <button
            type="button"
            tabIndex={-1}
            aria-label={toggleLabel}
            aria-expanded={listboxVisible}
            aria-controls={listboxVisible ? listboxId : undefined}
            disabled={!interactive}
            className="shelf-combobox__button shelf-combobox__toggle"
            onMouseDown={preventFocusLoss}
            onClick={handleToggleClick}
          >
            <ChevronDownIcon />
          </button>
        </div>

        {/*
         * `required` is about the selected value, not the typed text: a visually
         * hidden input holds the value, so the browser blocks submitting without a
         * selection (with its own message) and points the user at the combobox.
         */}
        {required && interactive && (
          <input
            tabIndex={-1}
            aria-hidden="true"
            required
            form={formId}
            value={selectedValue == null ? "" : String(selectedValue)}
            onChange={() => {}}
            onFocus={() => inputRef.current?.focus()}
            className="shelf-combobox__validation"
          />
        )}

        {(listboxVisible || showLoading || showEmpty) && (
          <div
            className="shelf-combobox__popup"
            style={
              maxHeight != null
                ? { "--shelf-combobox-max-height": toCssLength(maxHeight) }
                : undefined
            }
            onMouseDown={preventFocusLoss}
          >
            {listboxVisible && (
              <ul
                id={listboxId}
                role="listbox"
                aria-labelledby={listboxLabelledBy}
                aria-label={listboxLabelledBy ? undefined : rest["aria-label"]}
                className="shelf-combobox__listbox"
              >
                {visibleOptions.map((option, index) => {
                  const selected = option.value === selectedValue;
                  return (
                    <li
                      key={String(option.value)}
                      id={optionId(index)}
                      role="option"
                      aria-selected={selected}
                      aria-disabled={option.disabled || undefined}
                      className={cx(
                        "shelf-combobox__option",
                        index === activeIndex && "shelf-combobox__option--active",
                        selected && "shelf-combobox__option--selected",
                        option.disabled && "shelf-combobox__option--disabled",
                      )}
                      onMouseMove={() => {
                        if (!option.disabled && index !== activeIndex) {
                          setActiveValue(option.value);
                        }
                      }}
                      onClick={() => selectOption(option)}
                    >
                      <span className="shelf-combobox__option-text">
                        <span className="shelf-combobox__option-label">
                          <HighlightedLabel label={option.label} query={query} />
                        </span>
                        {option.description != null && (
                          <span className="shelf-combobox__option-description">
                            {option.description}
                          </span>
                        )}
                      </span>
                      {selected && <CheckIcon className="shelf-combobox__check" />}
                    </li>
                  );
                })}
              </ul>
            )}
            {/* Announced through the status region below instead. */}
            {(showLoading || showEmpty) && (
              <div className="shelf-combobox__status" aria-hidden="true">
                {showLoading && <Spinner className="shelf-combobox__status-spinner" />}
                {showLoading ? loadingMessage : emptyMessage}
              </div>
            )}
          </div>
        )}
      </div>

      {name != null && (
        <input
          type="hidden"
          name={name}
          form={formId}
          value={selectedValue == null ? "" : String(selectedValue)}
          disabled={disabled}
        />
      )}
      <span className="shelf-visually-hidden" role="status">
        {announcement}
      </span>

      {message != null && (
        <p id={messageId} className="shelf-field__message">
          {message}
        </p>
      )}
    </div>
  );
});
