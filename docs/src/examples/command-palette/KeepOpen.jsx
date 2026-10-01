import { Button, CommandPalette } from "@codecps/ui";
import { useState } from "react";

const products = [
  { id: "atta", label: "Whole wheat atta, 5 kg", price: 289, group: "Staples" },
  { id: "rice", label: "Basmati rice, 1 kg", price: 149, group: "Staples" },
  { id: "dal", label: "Toor dal, 1 kg", price: 172, group: "Staples" },
  { id: "ghee", label: "Desi ghee, 500 ml", price: 365, group: "Dairy" },
  { id: "paneer", label: "Fresh paneer, 200 g", price: 95, group: "Dairy" },
  { id: "chai", label: "Masala chai, 250 g", price: 320, group: "Beverages" },
];

const formatPrice = (amount) => `₹${amount.toLocaleString("en-IN")}`;
const items = products.map((product) => ({ ...product, description: formatPrice(product.price) }));

export default function CommandPaletteKeepOpen() {
  const [open, setOpen] = useState(false);
  const [cart, setCart] = useState([]);
  const total = cart.reduce((sum, product) => sum + product.price, 0);

  return (
    <div style={{ display: "grid", justifyItems: "center", gap: 12 }}>
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 8 }}>
        <Button onClick={() => setOpen(true)}>Quick add to cart</Button>
        <Button variant="ghost" onClick={() => setCart([])} disabled={cart.length === 0}>
          Empty cart
        </Button>
      </div>
      <p style={{ margin: 0, fontSize: 14 }}>
        {cart.length === 0
          ? "Your cart is empty."
          : `${cart.length} ${cart.length === 1 ? "item" : "items"} · ${formatPrice(total)}`}
      </p>
      <CommandPalette
        open={open}
        onOpenChange={setOpen}
        hotkey={null}
        closeOnSelect={false}
        label="Quick add"
        searchLabel="Search groceries"
        placeholder="Search groceries and press Enter to add…"
        items={items}
        onSelect={(item) => setCart((current) => [...current, item])}
        footer={
          <>
            {/* Announces each addition while focus stays in the search input. */}
            <span role="status">
              {cart.length} in cart · {formatPrice(total)}
            </span>
            <Button
              size="sm"
              variant="secondary"
              style={{ marginInlineStart: "auto" }}
              onClick={() => setOpen(false)}
            >
              Done
            </Button>
          </>
        }
      />
    </div>
  );
}
