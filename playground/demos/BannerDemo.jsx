import { Banner, Button } from "shelf-ui-react";
import { useState } from "react";

export function BannerDemo() {
  const [showSale, setShowSale] = useState(true);

  return (
    <div className="pg-stack">
      {showSale ? (
        <Banner
          title="Diwali Sale is live!"
          action={<a href="#banner">Shop now</a>}
          onDismiss={() => setShowSale(false)}
        >
          Flat 50% off on electronics.
        </Banner>
      ) : (
        <div className="pg-row">
          <Button variant="outline" onClick={() => setShowSale(true)}>
            Show the sale banner again
          </Button>
        </div>
      )}
      <Banner variant="info" action={<a href="#banner">Know more</a>}>
        Free delivery on all orders above ₹499.
      </Banner>
      <Banner variant="success">Your GSTIN is verified.</Banner>
      <Banner variant="warning" title="Cash on Delivery is unavailable">
        for pincode 110001.
      </Banner>
      <Banner variant="danger" align="start">
        UPI payments are delayed. Some payments may take up to 30 minutes to confirm.
      </Banner>
      <Banner variant="neutral" align="start" onDismiss={() => {}}>
        Scheduled maintenance on Sunday, 2:00–4:00 AM IST.
      </Banner>
    </div>
  );
}
