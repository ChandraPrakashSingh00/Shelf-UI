import { Spinner } from "shelf-ui-react";

export default function SpinnerCustomLabel() {
  return (
    <>
      <Spinner label="Syncing with GitHub…" />
      <Spinner label="Verifying payment…" style={{ color: "var(--shelf-color-success)" }} />
    </>
  );
}
