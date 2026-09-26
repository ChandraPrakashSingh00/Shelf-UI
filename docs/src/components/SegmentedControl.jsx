import { useId } from "react";

/** A radio group styled as a row of pills. Native radios keep keyboard support (← →). */
export function SegmentedControl({ legend, options, value, onChange, getLabel }) {
  const name = useId();

  return (
    <fieldset className="docs-control docs-segmented">
      <legend>{legend}</legend>
      <div className="docs-segmented__options">
        {options.map((option) => (
          <label key={option} className="docs-segmented__option">
            <input
              type="radio"
              name={name}
              value={option}
              checked={value === option}
              onChange={() => onChange(option)}
            />
            <span>{getLabel ? getLabel(option) : option}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
