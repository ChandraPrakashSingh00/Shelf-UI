import { Fragment } from "react";
import { InlineMarkdown } from "./InlineMarkdown.jsx";

export function toAnchorId(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/** API reference table for one component (or compound part). */
export function PropsTable({ group }) {
  const id = `api-${toAnchorId(group.title)}`;

  return (
    <section className="docs-props" aria-labelledby={id}>
      <h3 id={id} className="docs-h3">
        <code>{group.title}</code>
      </h3>
      {group.description && (
        <p className="docs-text">
          <InlineMarkdown text={group.description} />
        </p>
      )}
      {/* Focusable so keyboard users can scroll the table on small screens. */}
      <div className="docs-table-wrap" role="region" aria-labelledby={id} tabIndex={0}>
        <table className="docs-table">
          <thead>
            <tr>
              <th scope="col">Prop</th>
              <th scope="col">Type</th>
              <th scope="col">Default</th>
              <th scope="col">Description</th>
            </tr>
          </thead>
          <tbody>
            {group.props.map((prop) => (
              <tr key={prop.name}>
                <th scope="row">
                  <code className="docs-table__name">{prop.name}</code>
                  {prop.required && <span className="docs-table__required">required</span>}
                </th>
                <td>
                  <code className="docs-table__type">{prop.type}</code>
                </td>
                <td>{prop.default ? <code>{prop.default}</code> : <span aria-label="None">—</span>}</td>
                <td>
                  <InlineMarkdown text={prop.description} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export function KeyboardTable({ keys }) {
  return (
    <div className="docs-table-wrap">
      <table className="docs-table">
        <thead>
          <tr>
            <th scope="col">Key</th>
            <th scope="col">Action</th>
          </tr>
        </thead>
        <tbody>
          {keys.map((entry) => (
            <tr key={entry.keys.join("+") + entry.description}>
              <th scope="row" className="docs-table__keys">
                {entry.keys.map((key, index) => (
                  <Fragment key={key}>
                    {index > 0 && <span className="docs-table__or"> or </span>}
                    <kbd className="docs-kbd">{key}</kbd>
                  </Fragment>
                ))}
              </th>
              <td>
                <InlineMarkdown text={entry.description} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
