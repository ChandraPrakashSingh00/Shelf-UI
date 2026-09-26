import { Accordion } from "@codecps/ui";

export default function AccordionBasic() {
  return (
    <Accordion defaultValue={["billing"]} style={{ width: "100%", maxWidth: 560 }}>
      <Accordion.Item value="billing" title="How does billing work?">
        Each project is billed monthly: ₹999 on Starter and ₹2,499 on Pro. Usage above your plan's
        limits is added to the next invoice.
      </Accordion.Item>
      <Accordion.Item value="plans" title="Can I change my plan later?">
        Yes. Upgrades apply straight away and are prorated; downgrades take effect from your next
        billing cycle.
      </Accordion.Item>
      <Accordion.Item value="refunds" title="Do you offer refunds?">
        If you cancel within 14 days of your first payment, we refund it in full.
      </Accordion.Item>
      <Accordion.Item value="data" title="Where is my data stored?">
        Projects run in data centres in Mumbai and Hyderabad, and backups never leave India.
      </Accordion.Item>
    </Accordion>
  );
}
