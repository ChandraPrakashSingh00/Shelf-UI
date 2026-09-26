import { useEffect, useMemo, useState } from "react";
import { copyText } from "../lib/clipboard.js";
import { tokenize } from "../lib/highlight.js";
import { CheckIcon, CopyIcon } from "./icons.jsx";

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timer);
  }, [copied]);

  return (
    <>
      <button
        type="button"
        className="docs-copy"
        aria-label="Copy code"
        onClick={async () => setCopied(await copyText(text))}
      >
        {copied ? <CheckIcon /> : <CopyIcon />}
        <span aria-hidden="true">{copied ? "Copied" : "Copy"}</span>
      </button>
      {/* Always rendered, so the announcement is picked up when it changes. */}
      <span role="status" className="docs-visually-hidden">
        {copied ? "Copied to clipboard" : ""}
      </span>
    </>
  );
}

/**
 * Highlighted code with a copy button. `language` is "jsx" (default), "css" or
 * "bash"; `title` labels the header (e.g. a file name) and defaults to the language.
 */
export function CodeBlock({ code, language = "jsx", title, className }) {
  const source = code.trimEnd();
  const tokens = useMemo(() => tokenize(source, language), [source, language]);

  return (
    <div className={["docs-code", className].filter(Boolean).join(" ")}>
      <div className="docs-code__header">
        <span className="docs-code__title">{title ?? language}</span>
        <CopyButton text={source} />
      </div>
      <pre className="docs-code__pre" tabIndex={0}>
        <code>
          {tokens.map((token, index) =>
            token.type === "plain" ? (
              token.value
            ) : (
              <span key={index} className={`tok-${token.type}`}>
                {token.value}
              </span>
            ),
          )}
        </code>
      </pre>
    </div>
  );
}
