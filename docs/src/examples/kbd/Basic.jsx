import { Kbd } from "@codecps/ui";

export default function KbdBasic() {
  return (
    <p style={{ margin: 0, lineHeight: 2 }}>
      Press <Kbd>Enter</Kbd> to place your order, or <Kbd>Esc</Kbd> to go back to the cart. Use{" "}
      <Kbd>↑</Kbd> and <Kbd>↓</Kbd> to change the quantity.
    </p>
  );
}
