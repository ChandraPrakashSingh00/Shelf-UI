import { Rating } from "@codecps/ui";

export default function RatingBasic() {
  return (
    <div style={{ display: "grid", gap: 20 }}>
      <Rating label="Rate this product" />
      <Rating label="Rate the seller" defaultValue={4} />
    </div>
  );
}
