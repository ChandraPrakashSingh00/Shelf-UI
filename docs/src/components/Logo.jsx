import { useId } from "react";

/**
 * The CodeCPS ribbon mark: two folded ribbons, each a 180° turn of the other.
 * Decorative, so label the link or element around it instead.
 */
export function LogoMark(props) {
  // Gradient ids must be unique per instance; useId's punctuation isn't valid in url(#…).
  const id = useId().replace(/[^\w-]/g, "");

  return (
    <svg
      viewBox="470 98 618 490"
      width="1.26em"
      height="1em"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <defs>
        <linearGradient id={`${id}-arm`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#1f8bff" />
          <stop offset="1" stopColor="#0757ec" />
        </linearGradient>
        <linearGradient id={`${id}-fold`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#0a4fe3" />
          <stop offset="1" stopColor="#0c3fca" />
        </linearGradient>
        <linearGradient id={`${id}-wave`} x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" stopColor="#1c86ff" />
          <stop offset="1" stopColor="#0a45d8" />
        </linearGradient>
      </defs>
      <g id={`${id}-half`}>
        <path fill={`url(#${id}-arm)`} d="M708 103 475 270v105l80-58 153-110Z" />
        <path fill={`url(#${id}-fold)`} d="m475 375 80-58 125 108c-40 30-85 37-125 15Z" />
        <path
          fill={`url(#${id}-wave)`}
          d="M620 343h98l132-99c35-26 85-44 125-30l7-8c-42-41-102-56-152-21Z"
        />
      </g>
      <use href={`#${id}-half`} transform="rotate(180 779 343)" />
    </svg>
  );
}

/**
 * The CodeCPS Technologies logo: the mark and the wordmark. `tone="inverse"`
 * is for dark backgrounds. The logo is decorative; label its link.
 */
export function BrandLogo({ tone = "default", size = "md", className }) {
  const classes = [
    "docs-brand",
    `docs-brand--${size}`,
    tone === "inverse" && "docs-brand--inverse",
    className,
  ];

  return (
    <span className={classes.filter(Boolean).join(" ")} aria-hidden="true">
      <LogoMark className="docs-brand__mark" />
      <span className="docs-brand__text">
        <span className="docs-brand__name">
          CODE<span className="docs-brand__accent">CPS</span>
        </span>
        <span className="docs-brand__tagline">Technologies</span>
      </span>
    </span>
  );
}
