/**
 * A highlighted box with an icon, a title, text and optional actions, e.g.
 * "Need help?" or "You're all set!".
 */
export function Callout({ icon: Icon, title, children, actions, tone = "primary" }) {
  return (
    <aside className={`docs-callout docs-callout--${tone}`}>
      {Icon && (
        <span className="docs-callout__icon">
          <Icon />
        </span>
      )}
      <div className="docs-callout__body">
        <p className="docs-callout__title">{title}</p>
        <div className="docs-callout__text">{children}</div>
        {actions && <div className="docs-callout__actions">{actions}</div>}
      </div>
    </aside>
  );
}
