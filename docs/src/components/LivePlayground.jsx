import { Button, Input } from "@shelf-ui/react";
import { useId, useState } from "react";
import { CodeBlock } from "./CodeBlock.jsx";
import { SegmentedControl } from "./SegmentedControl.jsx";

function ControlField({ control, value, onChange }) {
  const id = useId();

  if (control.type === "boolean") {
    return (
      <label className="docs-control docs-control--checkbox" htmlFor={id}>
        <input
          id={id}
          type="checkbox"
          checked={value === true}
          onChange={(e) => onChange(e.target.checked)}
        />
        {control.label}
      </label>
    );
  }

  if (control.type === "text") {
    return (
      <Input
        size="sm"
        label={control.label}
        value={String(value)}
        onChange={(e) => onChange(e.target.value)}
        className="docs-control"
      />
    );
  }

  return (
    <SegmentedControl
      legend={control.label}
      options={control.options}
      value={String(value)}
      onChange={onChange}
    />
  );
}

export function LivePlayground({ config }) {
  const [values, setValues] = useState(config.defaults);
  // Every control has a matching key in `defaults`.
  const names = Object.keys(config.controls);

  const setValue = (name, value) => setValues((current) => ({ ...current, [name]: value }));

  return (
    <div className="docs-playground">
      <div className="docs-playground__stage docs-preview">
        <div className="docs-preview__frame">{config.render(values)}</div>
      </div>
      <form
        className="docs-playground__controls"
        aria-label="Props"
        onSubmit={(event) => event.preventDefault()}
      >
        {names.map((name) => (
          <ControlField
            key={name}
            control={config.controls[name]}
            value={values[name]}
            onChange={(value) => setValue(name, value)}
          />
        ))}
        <Button variant="ghost" size="sm" onClick={() => setValues(config.defaults)}>
          Reset
        </Button>
      </form>
      <CodeBlock code={config.code(values)} language="jsx" className="docs-playground__code" />
    </div>
  );
}

/**
 * Binds a playground config into a component for a component doc's `Playground`.
 * The config has:
 *
 * - `defaults`: the initial value of every control, keyed by prop name
 *   (a string, or a boolean for checkboxes).
 * - `controls`: one control per key of `defaults` — `{ type: "boolean", label }`,
 *   `{ type: "text", label }` or `{ type: "select", label, options }`.
 * - `render(values)`: the live preview for the current values.
 * - `code(values)`: the source code for the current values.
 */
export function definePlayground(config) {
  return function Playground() {
    return <LivePlayground config={config} />;
  };
}
