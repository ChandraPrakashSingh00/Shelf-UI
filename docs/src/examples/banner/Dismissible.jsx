import { Banner, Button } from "@shelf-ui/react";
import { useState } from "react";

export default function BannerDismissible() {
  const [visible, setVisible] = useState(true);

  if (!visible) {
    return (
      // The dismiss button is gone, so move focus somewhere sensible.
      <Button variant="outline" autoFocus onClick={() => setVisible(true)}>
        Show the banner again
      </Button>
    );
  }

  return (
    <Banner
      variant="info"
      action={<a href="#get-the-app">Get the app</a>}
      onDismiss={() => setVisible(false)}
    >
      Download the ShopKart app and get ₹100 off your first order.
    </Banner>
  );
}
