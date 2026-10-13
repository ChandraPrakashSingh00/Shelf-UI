import { Accordion } from "shelf-ui-react";

export default function AccordionMultiple() {
  return (
    <Accordion
      multiple
      defaultValue={["build", "domains"]}
      style={{ width: "100%", maxWidth: 560 }}
    >
      <Accordion.Item value="build" title="Build settings">
        Framework: Vite · Build command: npm run build · Output directory: dist
      </Accordion.Item>
      <Accordion.Item value="environment" title="Environment variables">
        6 variables for Production and 4 for Preview deployments.
      </Accordion.Item>
      <Accordion.Item value="domains" title="Domains">
        example.com and www.example.com point to this project.
      </Accordion.Item>
    </Accordion>
  );
}
