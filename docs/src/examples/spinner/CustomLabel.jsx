import { Spinner } from "@codecps/ui";

export default function SpinnerCustomLabel() {
  return (
    <>
      <Spinner label="Syncing with GitHub…" />
      <Spinner label="Verifying payment…" style={{ color: "var(--cps-color-success)" }} />
    </>
  );
}
