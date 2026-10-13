import { Rating } from "@shelf-ui/react";
import { useState } from "react";

export function RatingDemo() {
  const [rating, setRating] = useState(0);
  return (
    <div className="pg-grid">
      <div className="pg-stack">
        <Rating label="Rate this product" value={rating} onValueChange={setRating} />
        <span className="pg-muted">
          {rating ? `You rated it ${rating} out of 5.` : "Not rated yet."}
        </span>
      </div>
      <div className="pg-stack">
        <Rating readOnly value={4.3} showValue count={128400} />
        <Rating readOnly size="sm" value={3.6} showValue count={842} />
        <Rating readOnly size="lg" value={5} />
      </div>
      <div className="pg-stack">
        <Rating label="Small" size="sm" defaultValue={3} />
        <Rating label="Disabled" defaultValue={4} disabled />
        <Rating label="Required" required error="Choose a rating." />
      </div>
    </div>
  );
}
