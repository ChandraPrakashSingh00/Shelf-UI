import { Divider } from "shelf-ui-react";

const row = { display: "flex", justifyContent: "space-between", gap: 16 };

export default function DividerBasic() {
  return (
    <section
      aria-label="Order summary"
      style={{
        width: "100%",
        maxWidth: 360,
        padding: 20,
        border: "1px solid var(--shelf-color-border)",
        borderRadius: "var(--shelf-radius-lg)",
        backgroundColor: "var(--shelf-color-surface)",
      }}
    >
      <div style={row}>
        <span>Cotton kurta × 2</span>
        <span>₹2,598</span>
      </div>
      <div style={{ ...row, marginTop: 8 }}>
        <span>Running sneakers</span>
        <span>₹2,499</span>
      </div>
      <Divider />
      <div style={row}>
        <span>Delivery to Bengaluru</span>
        <span>Free</span>
      </div>
      <Divider />
      <div style={{ ...row, fontWeight: 600 }}>
        <span>Total</span>
        <span>₹5,097</span>
      </div>
    </section>
  );
}
