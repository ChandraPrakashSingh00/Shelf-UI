import { Divider } from "shelf-ui-react";

export function DividerDemo() {
  return (
    <div className="pg-stack pg-narrow">
      <span>Subtotal · ₹5,097</span>
      <Divider spacing="sm" />
      <span>Delivery · Free</span>
      <Divider label="OR" />
      <Divider label="More options" labelPosition="start" variant="dashed" />
      <Divider label="Step 1 of 2" labelPosition="end" />
      <div style={{ display: "flex", alignItems: "center" }}>
        <span>Orders 1,248</span>
        <Divider orientation="vertical" />
        <span>Revenue ₹4,52,300</span>
        <Divider orientation="vertical" variant="dashed" />
        <span>Returns 32</span>
      </div>
    </div>
  );
}
