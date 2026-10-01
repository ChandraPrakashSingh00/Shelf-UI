import { Divider } from "@codecps/ui";

export default function DividerDashedSpacing() {
  return (
    <div
      style={{
        width: "100%",
        maxWidth: 320,
        padding: 20,
        border: "1px dashed var(--cps-color-border-strong)",
        borderRadius: "var(--cps-radius-lg)",
        textAlign: "center",
      }}
    >
      <div style={{ fontSize: 13, color: "var(--cps-color-text-muted)" }}>Coupon</div>
      <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: 2 }}>DIWALI500</div>
      <Divider variant="dashed" spacing="lg" />
      <div>₹500 off on orders above ₹2,999</div>
      <Divider variant="dashed" spacing="sm" decorative />
      <div style={{ fontSize: 13, color: "var(--cps-color-text-muted)" }}>Valid till 5 Nov</div>
    </div>
  );
}
