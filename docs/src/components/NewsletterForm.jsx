import { useId, useState } from "react";
import { contactEmail, packageName } from "../content/site.js";

/**
 * Release-update sign-up. There's no mailing-list backend yet, so submitting
 * opens the reader's email app with a subscribe request to CodeCPS.
 */
export function NewsletterForm() {
  const id = useId();
  const [requested, setRequested] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    const email = String(new FormData(event.currentTarget).get("email") ?? "").trim();
    const subject = `Subscribe to ${packageName} updates`;
    const body = `Please email ${email} when a new version of ${packageName} is released.`;
    window.location.href = `mailto:${contactEmail}?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body)}`;
    setRequested(true);
  };

  return (
    <form className="docs-newsletter" onSubmit={handleSubmit}>
      <label htmlFor={`${id}-email`} className="docs-visually-hidden">
        Email address
      </label>
      <input
        id={`${id}-email`}
        className="docs-newsletter__input"
        type="email"
        name="email"
        placeholder="Enter your email"
        autoComplete="email"
        required
      />
      <button type="submit" className="docs-newsletter__button">
        Subscribe
      </button>
      <p className="docs-newsletter__status" role="status">
        {requested
          ? `Send the email that opens to finish. No email app? Write to ${contactEmail}.`
          : ""}
      </p>
    </form>
  );
}
