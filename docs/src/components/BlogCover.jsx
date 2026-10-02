import { useId } from "react";

const WHITE = "#ffffff";
const SOFT = "rgba(255, 255, 255, 0.16)";
const LINE = "rgba(255, 255, 255, 0.55)";

function Release() {
  return (
    <g>
      <rect x="62" y="44" width="120" height="92" rx="10" fill={SOFT} />
      <rect x="82" y="34" width="120" height="92" rx="10" fill={WHITE} />
      <rect x="96" y="50" width="56" height="8" rx="4" fill="#0b1736" opacity="0.85" />
      <rect x="96" y="66" width="88" height="6" rx="3" fill="#c7ddff" />
      <rect x="96" y="80" width="72" height="6" rx="3" fill="#c7ddff" />
      <rect x="96" y="100" width="44" height="14" rx="7" fill="#086ffd" />
      <rect x="146" y="100" width="40" height="14" rx="7" fill="#eef5ff" stroke="#c7ddff" />
      <rect x="196" y="112" width="74" height="30" rx="15" fill="#22c55e" />
      <text x="233" y="132" fill={WHITE} fontSize="14" fontWeight="700" textAnchor="middle">
        0.2.0
      </text>
      <circle cx="244" cy="58" r="16" fill={SOFT} />
      <path
        d="m236 58 6 6 10-12"
        stroke={WHITE}
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
      />
    </g>
  );
}

function Tutorial() {
  const lines = [
    [0, 52, "#ff7b72"],
    [12, 70, "#a5d6ff"],
    [12, 44, "#7ee787"],
    [24, 60, "#d2a8ff"],
    [12, 38, "#7ee787"],
    [0, 30, "#ff7b72"],
  ];
  return (
    <g>
      <rect x="40" y="30" width="150" height="120" rx="10" fill="#0b1736" />
      <circle cx="54" cy="43" r="3.5" fill="#ff5f57" />
      <circle cx="65" cy="43" r="3.5" fill="#febc2e" />
      <circle cx="76" cy="43" r="3.5" fill="#28c840" />
      {lines.map(([indent, width, color], index) => (
        <rect
          key={index}
          x={54 + indent}
          y={60 + index * 13}
          width={width}
          height="6"
          rx="3"
          fill={color}
          opacity="0.9"
        />
      ))}
      <rect x="170" y="56" width="110" height="98" rx="10" fill={WHITE} />
      <rect x="184" y="70" width="50" height="7" rx="3.5" fill="#0b1736" />
      <rect x="184" y="86" width="82" height="16" rx="5" fill="none" stroke="#c8ced8" />
      <rect x="184" y="108" width="82" height="16" rx="5" fill="none" stroke="#c8ced8" />
      <rect x="184" y="130" width="82" height="14" rx="5" fill="#086ffd" />
    </g>
  );
}

function Accessibility() {
  return (
    <g>
      <circle cx="160" cy="90" r="54" fill={SOFT} />
      <circle cx="160" cy="90" r="40" fill={WHITE} />
      <g stroke="#086ffd" strokeWidth="6" strokeLinecap="round" fill="none">
        <circle cx="160" cy="68" r="5" fill="#086ffd" stroke="none" />
        <path d="m136 80 24 5 24-5M160 85v14l-10 18M160 99l10 18" />
      </g>
      <rect x="44" y="52" width="62" height="12" rx="6" fill={SOFT} />
      <rect x="44" y="72" width="44" height="12" rx="6" fill={SOFT} />
      <rect x="226" y="104" width="54" height="12" rx="6" fill={SOFT} />
      <rect x="236" y="124" width="44" height="12" rx="6" fill={SOFT} />
    </g>
  );
}

function Theming() {
  const swatches = ["#086ffd", "#7c3aed", "#0f766e", "#e11d48", "#ea580c"];
  return (
    <g>
      <rect x="56" y="38" width="208" height="104" rx="12" fill={WHITE} />
      {swatches.map((color, index) => (
        <circle key={color} cx={92 + index * 34} cy="74" r="14" fill={color} />
      ))}
      <circle cx="92" cy="74" r="19" fill="none" stroke="#0b1736" strokeWidth="2.5" />
      <rect x="78" y="106" width="164" height="6" rx="3" fill="#e2e6ec" />
      <rect x="78" y="106" width="96" height="6" rx="3" fill="#086ffd" />
      <circle cx="174" cy="109" r="8" fill={WHITE} stroke="#086ffd" strokeWidth="3" />
    </g>
  );
}

function Layers() {
  const layer = (y, fill, opacity) => (
    <path d={`M160 ${y}l80 26-80 26-80-26Z`} fill={fill} opacity={opacity} />
  );
  return (
    <g>
      {layer(92, SOFT, 1)}
      {layer(70, LINE, 1)}
      {layer(48, WHITE, 1)}
      <path d="M160 58l44 14-44 14-44-14Z" fill="#086ffd" opacity="0.18" />
      <text x="160" y="80" fill="#0b1736" fontSize="11" fontWeight="700" textAnchor="middle">
        components
      </text>
    </g>
  );
}

function Launch() {
  return (
    <g>
      {[
        [62, 40],
        [96, 132],
        [248, 46],
        [276, 120],
        [210, 150],
      ].map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r="2.5" fill={WHITE} opacity="0.8" />
      ))}
      <g transform="translate(118 26) scale(3.5)" fill="none" strokeLinejoin="round">
        <path
          d="M5 15c-1.5 1.3-2 5-2 5s3.7-.5 5-2c.7-.8.7-2.1-.1-2.9a2.2 2.2 0 0 0-2.9-.1Z"
          fill="#febc2e"
        />
        <path
          d="m12 15-3-3a22 22 0 0 1 2-4A12.9 12.9 0 0 1 22 2c0 2.7-.8 7.5-6 11a22.4 22.4 0 0 1-4 2Z"
          fill={WHITE}
        />
        <path d="M9 12H4s.6-3 2-4c1.6-1.1 5 0 5 0M12 15v5s3-.6 4-2c1.1-1.6 0-5 0-5" fill={LINE} />
        <circle cx="16" cy="8" r="1.6" fill="#086ffd" />
      </g>
    </g>
  );
}

const artwork = {
  release: Release,
  tutorial: Tutorial,
  accessibility: Accessibility,
  theming: Theming,
  layers: Layers,
  launch: Launch,
};

/** Decorative 16:9 artwork for a blog post card. */
export function BlogCover({ variant, className }) {
  const id = useId().replace(/[^\w-]/g, "");
  const Art = artwork[variant] ?? Release;

  return (
    <svg
      className={className}
      viewBox="0 0 320 180"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id={`${id}-bg`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#0b1f5c" />
          <stop offset="1" stopColor="#086ffd" />
        </linearGradient>
        <pattern id={`${id}-dots`} width="16" height="16" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1" fill="rgba(255,255,255,0.12)" />
        </pattern>
      </defs>
      <rect width="320" height="180" fill={`url(#${id}-bg)`} />
      <rect width="320" height="180" fill={`url(#${id}-dots)`} />
      <Art />
    </svg>
  );
}
