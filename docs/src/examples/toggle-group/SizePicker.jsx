import { Button, ToggleGroup } from "@codecps/ui";
import { useState } from "react";

const sizes = [
  { value: "s", label: "S" },
  { value: "m", label: "M" },
  { value: "l", label: "L" },
  { value: "xl", label: "XL", outOfStock: true },
  { value: "xxl", label: "XXL" },
];

export default function ToggleGroupSizePicker() {
  const [message, setMessage] = useState("");

  const addToCart = (event) => {
    event.preventDefault();
    const size = new FormData(event.currentTarget).get("size");
    setMessage(`Added Cotton kurta (size ${size.toUpperCase()}) to your cart.`);
  };

  return (
    <form onSubmit={addToCart} style={{ display: "grid", gap: 16, justifyItems: "start" }}>
      <div>
        <strong>Cotton kurta</strong>
        <div>₹1,299</div>
      </div>
      <ToggleGroup label="Size" name="size" defaultValue="m">
        {sizes.map((size) => (
          <ToggleGroup.Item
            key={size.value}
            value={size.value}
            disabled={size.outOfStock}
            aria-label={size.outOfStock ? `${size.label}, out of stock` : undefined}
          >
            {size.label}
          </ToggleGroup.Item>
        ))}
      </ToggleGroup>
      <Button type="submit">Add to cart</Button>
      <p role="status" style={{ margin: 0, minHeight: "1.5em" }}>
        {message}
      </p>
    </form>
  );
}
