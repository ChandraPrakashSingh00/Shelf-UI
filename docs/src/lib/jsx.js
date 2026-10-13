/**
 * Marks a prop value to be written verbatim inside `{…}`, e.g.
 * `onClose={() => setOpen(false)}`.
 */
export const expr = (expression) => ({ expression });

const MAX_INLINE_LENGTH = 72;

function formatAttribute(name, value) {
  if (value === undefined || value === null || value === false) return null;
  if (value === true) return name;
  if (typeof value === "number") return `${name}={${value}}`;
  if (typeof value === "object") return `${name}={${value.expression}}`;
  return value.includes('"') ? `${name}={${JSON.stringify(value)}}` : `${name}="${value}"`;
}

function formatChildren(children) {
  // Characters with meaning in JSX must be wrapped in an expression.
  return /[{}<>]/.test(children) ? `{${JSON.stringify(children)}}` : children;
}

/**
 * Formats a JSX element the way a developer would write it. Prop values can be
 * strings, numbers, booleans or `expr(...)`; `false`, `null` and `undefined`
 * props are left out, and so are props equal to their entry in `defaults`
 * (the component's default values).
 */
export function formatJsx(component, props, children, { defaults = {} } = {}) {
  const attributes = Object.entries(props)
    .filter(([name, value]) => !(name in defaults && defaults[name] === value))
    .map(([name, value]) => formatAttribute(name, value))
    .filter((attribute) => attribute !== null);

  const content = children ? formatChildren(children) : "";
  const inlineAttributes = attributes.map((attribute) => ` ${attribute}`).join("");
  const inline = content
    ? `<${component}${inlineAttributes}>${content}</${component}>`
    : `<${component}${inlineAttributes} />`;
  if (inline.length <= MAX_INLINE_LENGTH || attributes.length === 0) return inline;

  const openTag = `<${component}\n${attributes.map((attribute) => `  ${attribute}`).join("\n")}\n`;
  return content ? `${openTag}>\n  ${content}\n</${component}>` : `${openTag}/>`;
}

/** Prefixes a snippet with the `shelf-ui-react` import it needs. */
export function withImport(names, code) {
  return `import { ${names.join(", ")} } from "shelf-ui-react";\n\n${code}`;
}
