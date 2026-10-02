const STAR = "M0-7 1.8-1.8 7 0 1.8 1.8 0 7-1.8 1.8-7 0-1.8-1.8Z";

const stars = [
  [38, 40, 1],
  [214, 30, 0.8],
  [232, 120, 1.1],
  [24, 112, 0.7],
  [196, 188, 0.6],
];

/** A floating astronaut for the "page not found" page. Decorative. */
export function Astronaut({ className }) {
  return (
    <svg className={className} viewBox="0 0 260 220" aria-hidden="true" focusable="false">
      {stars.map(([x, y, scale]) => (
        <path
          key={`${x}-${y}`}
          d={STAR}
          transform={`translate(${x} ${y}) scale(${scale})`}
          fill="#086ffd"
        />
      ))}
      <circle cx="70" cy="70" r="2.5" fill="#6aa9ff" />
      <circle cx="190" cy="64" r="2" fill="#6aa9ff" />
      <circle cx="214" cy="160" r="2.5" fill="#6aa9ff" />

      <g className="docs-astronaut__planet">
        <circle cx="56" cy="170" r="26" fill="#c7ddff" />
        <circle cx="48" cy="162" r="5" fill="#a9c9ff" />
        <circle cx="64" cy="180" r="3.5" fill="#a9c9ff" />
        <ellipse
          cx="56"
          cy="170"
          rx="44"
          ry="9"
          fill="none"
          stroke="#086ffd"
          strokeWidth="4"
          transform="rotate(-16 56 170)"
        />
      </g>

      <path
        d="M118 146c-24 26-46 8-62 -4"
        fill="none"
        stroke="#9ea7b3"
        strokeWidth="3"
        strokeDasharray="4 6"
        strokeLinecap="round"
      />

      <g className="docs-astronaut__body">
        <g transform="rotate(-14 150 110)" stroke="#0b1736" strokeWidth="3" strokeLinejoin="round">
          <rect x="116" y="80" width="68" height="64" rx="14" fill="#c7ddff" />
          <rect x="130" y="136" width="18" height="40" rx="9" fill="#ffffff" />
          <rect x="152" y="136" width="18" height="40" rx="9" fill="#ffffff" />
          <rect x="127" y="166" width="24" height="14" rx="7" fill="#086ffd" />
          <rect x="149" y="166" width="24" height="14" rx="7" fill="#086ffd" />
          <rect
            x="96"
            y="98"
            width="38"
            height="17"
            rx="8.5"
            fill="#ffffff"
            transform="rotate(-32 115 106)"
          />
          <rect
            x="166"
            y="100"
            width="38"
            height="17"
            rx="8.5"
            fill="#ffffff"
            transform="rotate(28 185 108)"
          />
          <circle cx="99" cy="91" r="8" fill="#086ffd" />
          <circle cx="203" cy="119" r="8" fill="#086ffd" />
          <rect x="124" y="90" width="52" height="58" rx="17" fill="#ffffff" />
          <rect x="138" y="106" width="24" height="16" rx="4" fill="#eef5ff" />
          <circle cx="145" cy="114" r="2.5" fill="#22c55e" stroke="none" />
          <circle cx="155" cy="114" r="2.5" fill="#086ffd" stroke="none" />
          <path d="M172 38l7-10" fill="none" />
          <circle cx="180" cy="26" r="4.5" fill="#086ffd" />
          <circle cx="150" cy="64" r="32" fill="#ffffff" />
          <rect x="127" y="49" width="46" height="31" rx="15.5" fill="#0b1f5c" />
          <path
            d="M135 59c4-5 10-6 15-5"
            fill="none"
            stroke="#6aa9ff"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
        </g>
      </g>
    </svg>
  );
}
