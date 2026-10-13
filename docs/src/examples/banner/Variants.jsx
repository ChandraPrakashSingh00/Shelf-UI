import { Banner } from "@shelf-ui/react";

export default function BannerVariants() {
  return (
    <div style={{ display: "grid", gap: 12, width: "100%" }}>
      <Banner variant="info" action={<a href="#shipping-policy">Know more</a>}>
        Free delivery on all orders above ₹499.
      </Banner>
      <Banner variant="success">
        Your GSTIN is verified. Invoices will now include your business details.
      </Banner>
      <Banner variant="warning" title="Cash on Delivery is unavailable">
        for pincode 110001. Pay online with UPI or cards to place this order.
      </Banner>
      <Banner variant="danger" title="UPI payments are delayed.">
        Some payments may take up to 30 minutes to confirm.
      </Banner>
      <Banner variant="neutral">Scheduled maintenance on Sunday, 2:00–4:00 AM IST.</Banner>
    </div>
  );
}
