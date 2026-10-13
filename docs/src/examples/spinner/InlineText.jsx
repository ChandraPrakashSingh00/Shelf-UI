import { Spinner } from "@shelf-ui/react";

export default function SpinnerInlineText() {
  return (
    // The visible text is the status, so the spinner itself is decorative (label="").
    <div role="status" style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <Spinner size="sm" label="" />
      Loading deployments…
    </div>
  );
}
