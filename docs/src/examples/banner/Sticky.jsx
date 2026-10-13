import { Banner } from "@shelf-ui/react";

const products = [
  { name: "Cotton Kurta – Indigo", city: "Jaipur", price: "₹899" },
  { name: "Handloom Saree – Maroon", city: "Varanasi", price: "₹3,499" },
  { name: "Brass Diya Set (4 pcs)", city: "Moradabad", price: "₹649" },
  { name: "Kolhapuri Chappals", city: "Kolhapur", price: "₹1,199" },
  { name: "Darjeeling Tea, 250 g", city: "Darjeeling", price: "₹450" },
  { name: "Channapatna Toy Train", city: "Bengaluru", price: "₹799" },
];

export default function BannerSticky() {
  return (
    // A scrolling box stands in for the page here; `sticky` works the same on the page.
    <div
      tabIndex={0}
      role="region"
      aria-label="Product list"
      style={{
        width: "100%",
        height: 240,
        overflowY: "auto",
        border: "1px solid var(--shelf-color-border)",
        borderRadius: "var(--shelf-radius-lg)",
      }}
    >
      <Banner sticky title="Free shipping this week" action={<a href="#free-shipping">Details</a>}>
        on every order above ₹499.
      </Banner>
      <ul style={{ display: "grid", gap: 8, margin: 0, padding: 16, listStyle: "none" }}>
        {products.map((product) => (
          <li
            key={product.name}
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 16,
              padding: "12px 16px",
              border: "1px solid var(--shelf-color-border)",
              borderRadius: "var(--shelf-radius-md)",
            }}
          >
            <span>
              {product.name}
              <br />
              <small style={{ color: "var(--shelf-color-text-muted)" }}>From {product.city}</small>
            </span>
            <strong>{product.price}</strong>
          </li>
        ))}
      </ul>
    </div>
  );
}
