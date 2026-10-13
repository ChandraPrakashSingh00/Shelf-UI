import { Accordion } from "@shelf-ui/react";

export default function AccordionDisabled() {
  return (
    <Accordion style={{ width: "100%", maxWidth: 560 }}>
      <Accordion.Item value="members" title="Team members">
        Invite up to 10 members on the Pro plan.
      </Accordion.Item>
      <Accordion.Item value="sso" title="Single sign-on (Business plan)" disabled>
        Sign in with Google Workspace or Microsoft Entra ID.
      </Accordion.Item>
      <Accordion.Item value="audit" title="Audit log">
        Every change to your projects, kept for 90 days.
      </Accordion.Item>
    </Accordion>
  );
}
