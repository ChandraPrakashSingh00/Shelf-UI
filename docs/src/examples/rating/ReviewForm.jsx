import { Button, Rating, Textarea } from "@codecps/ui";
import { useState } from "react";

export default function RatingReviewForm() {
  const [rating, setRating] = useState(0);
  const [showErrors, setShowErrors] = useState(false);
  const [submitted, setSubmitted] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    if (rating === 0) {
      setShowErrors(true);
      return;
    }
    const data = new FormData(event.currentTarget);
    setSubmitted(`Thanks! You rated it ${data.get("rating")} out of 5.`);
  };

  return (
    <form
      noValidate
      onSubmit={handleSubmit}
      style={{ display: "grid", gap: 16, width: "100%", maxWidth: 400 }}
    >
      <Rating
        label="Overall rating"
        name="rating"
        required
        value={rating}
        onValueChange={(value) => {
          setRating(value);
          setSubmitted("");
        }}
        error={showErrors && rating === 0 ? "Choose a rating to post your review." : undefined}
      />
      <Textarea
        label="Review"
        name="review"
        placeholder="The kurta fits well and the colour is exactly as shown…"
        rows={3}
      />
      <Button type="submit" style={{ justifySelf: "start" }}>
        Post review
      </Button>
      <p role="status" style={{ margin: 0, fontSize: 14 }}>
        {submitted}
      </p>
    </form>
  );
}
