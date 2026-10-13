import { NumberInput } from "@shelf-ui/react";
import { useState } from "react";

const products = [
  { id: "airdopes", name: "boAt Airdopes 141", price: 1299, stock: 8 },
  { id: "bottle", name: "Milton Thermosteel Bottle, 1 L", price: 849, stock: 12 },
  { id: "kurta", name: "Cotton Kurta, Indigo (M)", price: 1599, stock: 3 },
];

const rupees = (amount) => `₹${amount.toLocaleString("en-IN")}`;

export default function NumberInputCartQuantity() {
  const [quantities, setQuantities] = useState({ airdopes: 1, bottle: 2, kurta: 1 });
  const subtotal = products.reduce(
    (total, product) => total + product.price * quantities[product.id],
    0,
  );

  return (
    <div style={{ display: "grid", gap: 12, width: "100%", maxWidth: 480 }}>
      {products.map((product) => (
        <div
          key={product.id}
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            gap: 12,
            paddingBottom: 12,
            borderBottom: "1px solid var(--shelf-color-border)",
          }}
        >
          <div style={{ flex: "1 1 180px", minWidth: 0 }}>
            <div style={{ fontWeight: 500 }}>{product.name}</div>
            <div style={{ color: "var(--shelf-color-text-muted)", fontSize: 14 }}>
              {rupees(product.price)} · {product.stock} in stock
            </div>
          </div>
          <NumberInput
            variant="compact"
            size="sm"
            aria-label={`Quantity of ${product.name}`}
            decrementLabel={`Remove one ${product.name}`}
            incrementLabel={`Add one ${product.name}`}
            min={1}
            max={product.stock}
            allowEmpty={false}
            value={quantities[product.id]}
            onValueChange={(quantity) =>
              setQuantities((current) => ({ ...current, [product.id]: quantity }))
            }
          />
          <strong style={{ minWidth: 72, textAlign: "end" }}>
            {rupees(product.price * quantities[product.id])}
          </strong>
        </div>
      ))}
      <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 600 }}>
        <span>Subtotal</span>
        <span>{rupees(subtotal)}</span>
      </div>
    </div>
  );
}
