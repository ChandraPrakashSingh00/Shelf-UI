const WIDTH = 1200;
const HEIGHT = 48;
const SHELF = 4;
const GAP = 3;

// Widths and heights of the spines, repeated along the shelf.
const SIZES = [
  [14, 30],
  [10, 22],
  [16, 38],
  [12, 26],
  [18, 34],
  [10, 18],
  [14, 40],
];
const COLORS = ["#b69cff", "#ddd2ff", "#ff7a4d", "#8a5cff", "#ffffff"];

const spines = [];
for (let x = 0, index = 0; x < WIDTH; index += 1) {
  const [width, height] = SIZES[index % SIZES.length];
  spines.push({ x, width, height, color: COLORS[index % COLORS.length] });
  x += width + GAP;
}

/** A row of book spines on a shelf, for dark panels. Decorative. */
export function ShelfArt({ className }) {
  return (
    <svg
      className={className}
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      preserveAspectRatio="xMidYMax slice"
      aria-hidden="true"
      focusable="false"
    >
      {spines.map((spine) => (
        <rect
          key={spine.x}
          x={spine.x}
          y={HEIGHT - SHELF - spine.height}
          width={spine.width}
          height={spine.height + 2}
          rx="2"
          fill={spine.color}
        />
      ))}
      <rect y={HEIGHT - SHELF} width={WIDTH} height={SHELF} fill="#ddd2ff" />
    </svg>
  );
}
