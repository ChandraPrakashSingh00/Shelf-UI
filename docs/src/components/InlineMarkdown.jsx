const INLINE = /`([^`]+)`|\*\*([^*]+)\*\*|\[([^\]]+)\]\(([^)\s]+)\)/g;

/** Renders the inline markdown used in docs content: `code`, **bold** and [links](url). */
export function InlineMarkdown({ text }) {
  const nodes = [];
  let cursor = 0;

  for (const match of text.matchAll(INLINE)) {
    const index = match.index;
    if (index > cursor) nodes.push(text.slice(cursor, index));

    const [whole, code, bold, linkText, href] = match;
    if (code !== undefined) {
      nodes.push(<code key={index}>{code}</code>);
    } else if (bold !== undefined) {
      nodes.push(<strong key={index}>{bold}</strong>);
    } else if (linkText !== undefined && href !== undefined) {
      const external = /^https?:\/\//.test(href);
      nodes.push(
        <a key={index} href={href} {...(external ? { target: "_blank", rel: "noreferrer" } : {})}>
          {linkText}
        </a>,
      );
    }
    cursor = index + whole.length;
  }

  if (cursor < text.length) nodes.push(text.slice(cursor));
  return <>{nodes}</>;
}
