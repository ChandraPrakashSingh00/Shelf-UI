import { Accordion, Button } from "@codecps/ui";
import { useState } from "react";

const releases = [
  {
    version: "v2.4.0",
    date: "12 September 2026",
    notes: "Preview deployments for every pull request, and faster cold starts.",
  },
  {
    version: "v2.3.0",
    date: "28 August 2026",
    notes: "Team roles: invite members as Owner, Developer or Viewer.",
  },
  {
    version: "v2.2.0",
    date: "10 August 2026",
    notes: "Pay for any plan with UPI or a RuPay card.",
  },
];

export default function AccordionControlled() {
  const [openReleases, setOpenReleases] = useState(["v2.4.0"]);

  return (
    <div style={{ display: "grid", gap: 12, width: "100%", maxWidth: 560 }}>
      <div style={{ display: "flex", gap: 8 }}>
        <Button
          size="sm"
          variant="outline"
          onClick={() => setOpenReleases(releases.map((release) => release.version))}
        >
          Expand all
        </Button>
        <Button size="sm" variant="ghost" onClick={() => setOpenReleases([])}>
          Collapse all
        </Button>
      </div>
      <Accordion multiple value={openReleases} onValueChange={setOpenReleases}>
        {releases.map((release) => (
          <Accordion.Item
            key={release.version}
            value={release.version}
            title={`${release.version} · ${release.date}`}
          >
            {release.notes}
          </Accordion.Item>
        ))}
      </Accordion>
    </div>
  );
}
