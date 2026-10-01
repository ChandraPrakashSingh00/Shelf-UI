import { Link } from "@codecps/ui";

export default function LinkExternal() {
  return (
    <ul style={{ display: "grid", gap: 12, margin: 0, padding: 0, listStyle: "none" }}>
      <li>
        Check a supplier's GSTIN on the{" "}
        <Link href="https://www.gst.gov.in" external>
          GST portal
        </Link>
      </li>
      <li>
        Speed Post parcels:{" "}
        <Link href="https://www.indiapost.gov.in" external>
          track on India Post
        </Link>
      </li>
      <li>
        <Link
          href="https://www.npci.org.in"
          external
          variant="muted"
          externalLabel="(opens NPCI in a new tab)"
        >
          How UPI payments work
        </Link>
      </li>
    </ul>
  );
}
