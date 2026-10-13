import { Banner } from "shelf-ui-react";

export default function BannerSale() {
  return (
    <Banner title="Diwali Sale is live!" action={<a href="#diwali-sale">Shop now</a>}>
      Flat 50% off on electronics, plus 10% instant discount with HDFC Bank cards.
    </Banner>
  );
}
