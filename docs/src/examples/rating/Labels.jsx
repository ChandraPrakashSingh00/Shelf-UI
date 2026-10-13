import { Rating } from "shelf-ui-react";
import { useState } from "react";

const feedback = ["Tap a star to rate", "Poor", "Fair", "Good", "Very good", "Excellent"];

export default function RatingLabels() {
  const [rating, setRating] = useState(0);

  return (
    <div style={{ display: "grid", gap: 8 }}>
      <Rating
        label="How was your delivery?"
        size="lg"
        value={rating}
        onValueChange={setRating}
        getLabel={(value) => `${value} ${value === 1 ? "star" : "stars"}, ${feedback[value]}`}
      />
      {/* Screen readers already hear this in each star's name. */}
      <span aria-hidden="true" style={{ color: "var(--shelf-color-text-muted)", fontSize: 14 }}>
        {feedback[rating]}
      </span>
    </div>
  );
}
