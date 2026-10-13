import { Rating } from "@shelf-ui/react";

const products = [
  { name: "boAt Rockerz 450 Headphones", price: 1499, rating: 4.3, reviews: 128400 },
  { name: "Prestige Iris Mixer Grinder, 750 W", price: 3299, rating: 4.1, reviews: 23517 },
  { name: "Cotton Bedsheet, Jaipuri Print", price: 649, rating: 3.6, reviews: 842 },
];

export default function RatingReadOnly() {
  return (
    <ul style={{ display: "grid", gap: 16, width: "100%", maxWidth: 360, margin: 0, padding: 0 }}>
      {products.map((product) => (
        <li key={product.name} style={{ display: "grid", gap: 4, listStyle: "none" }}>
          <span style={{ fontWeight: 500 }}>{product.name}</span>
          <Rating readOnly size="sm" value={product.rating} showValue count={product.reviews} />
          <strong>₹{product.price.toLocaleString("en-IN")}</strong>
        </li>
      ))}
    </ul>
  );
}
