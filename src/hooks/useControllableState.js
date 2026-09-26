import { useCallback, useState } from "react";

/**
 * State that can be either controlled by the parent (`value` + `onChange`) or
 * managed internally (`defaultValue`), matching native form element semantics.
 *
 * - `value`: controlled value. When defined, the component mirrors it.
 * - `defaultValue`: initial value used while uncontrolled.
 * - `onChange`: called whenever the value should change (controlled or not).
 *
 * Returns `[value, setValue]`, like `useState`.
 */
export function useControllableState({ value, defaultValue, onChange }) {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const isControlled = value !== undefined;
  const currentValue = isControlled ? value : internalValue;

  const setValue = useCallback(
    (next) => {
      if (Object.is(next, currentValue)) return;
      if (!isControlled) setInternalValue(next);
      onChange?.(next);
    },
    [currentValue, isControlled, onChange],
  );

  return [currentValue, setValue];
}
