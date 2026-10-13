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
          fill="#6938ef"
        />
      ))}
      <circle cx="70" cy="70" r="2.5" fill="#b69cff" />
      <circle cx="190" cy="64" r="2" fill="#b69cff" />
      <circle cx="214" cy="160" r="2.5" fill="#b69cff" />

      <g className="docs-astronaut__planet">
        <circle cx="56" cy="170" r="26" fill="#ffd2c2" />
        <circle cx="48" cy="162" r="5" fill="#ffb399" />
        <circle cx="64" cy="180" r="3.5" fill="#ffb399" />
        <ellipse
          cx="56"
          cy="170"
          rx="44"
          ry="9"
          fill="none"
          stroke="#ff7a4d"
          strokeWidth="4"
          transform="rotate(-16 56 170)"
        />
      </g>

      <path
        d="M118 146c-24 26-46 8-62 -4"
        fill="none"
        stroke="#a7a1bd"
        strokeWidth="3"
        strokeDasharray="4 6"
        strokeLinecap="round"
      />

      <g className="docs-astronaut__body">
        <g transform="rotate(-14 150 110)" stroke="#110d24" strokeWidth="3" strokeLinejoin="round">
          <rect x="116" y="80" width="68" height="64" rx="14" fill="#ddd2ff" />
          <rect x="130" y="136" width="18" height="40" rx="9" fill="#ffffff" />
          <rect x="152" y="136" width="18" height="40" rx="9" fill="#ffffff" />
          <rect x="127" y="166" width="24" height="14" rx="7" fill="#6938ef" />
          <rect x="149" y="166" width="24" height="14" rx="7" fill="#6938ef" />
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
          <circle cx="99" cy="91" r="8" fill="#6938ef" />
          <circle cx="203" cy="119" r="8" fill="#6938ef" />
          <rect x="124" y="90" width="52" height="58" rx="17" fill="#ffffff" />
          <rect x="138" y="106" width="24" height="16" rx="4" fill="#f4f1ff" />
          <circle cx="145" cy="114" r="2.5" fill="#22c55e" stroke="none" />
          <circle cx="155" cy="114" r="2.5" fill="#6938ef" stroke="none" />
          <path d="M172 38l7-10" fill="none" />
          <circle cx="180" cy="26" r="4.5" fill="#6938ef" />
          <circle cx="150" cy="64" r="32" fill="#ffffff" />
          <rect x="127" y="49" width="46" height="31" rx="15.5" fill="#110d24" />
          <path
            d="M135 59c4-5 10-6 15-5"
            fill="none"
            stroke="#b69cff"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
        </g>
      </g>
    </svg>
  );
}
