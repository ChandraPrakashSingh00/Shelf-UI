import { Divider, Link } from "@shelf-ui/react";

const stats = [
  { label: "Orders today", value: "1,248" },
  { label: "Revenue", value: "₹4,52,300" },
  { label: "Returns", value: "32" },
];

export default function DividerVertical() {
  return (
    <div style={{ display: "grid", gap: 24, justifyItems: "center" }}>
      {/* In a flex row, a vertical divider stretches to the row's height. */}
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}>
        {stats.map((stat, index) => (
          <div key={stat.label} style={{ display: "flex" }}>
            {index > 0 && <Divider orientation="vertical" spacing="lg" />}
            <div>
              <div style={{ color: "var(--shelf-color-text-muted)", fontSize: 14 }}>
                {stat.label}
              </div>
              <div style={{ fontSize: 22, fontWeight: 600 }}>{stat.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Between inline items it's as tall as the text; decorative, as the links speak for themselves. */}
      <p style={{ margin: 0, fontSize: 14 }}>
        <Link href="#mumbai" variant="muted">
          Mumbai
        </Link>
        <Divider orientation="vertical" spacing="sm" decorative />
        <Link href="#delhi" variant="muted">
          Delhi
        </Link>
        <Divider orientation="vertical" spacing="sm" decorative />
        <Link href="#bengaluru" variant="muted">
          Bengaluru
        </Link>
      </p>
    </div>
  );
}
