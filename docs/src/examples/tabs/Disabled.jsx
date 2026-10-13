import { Tabs } from "@shelf-ui/react";

export default function TabsDisabled() {
  return (
    <Tabs defaultValue="usage" style={{ width: "100%" }}>
      <Tabs.List aria-label="Billing">
        <Tabs.Tab value="usage">Usage</Tabs.Tab>
        <Tabs.Tab value="invoices">Invoices</Tabs.Tab>
        <Tabs.Tab value="analytics" disabled>
          Analytics
        </Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel value="usage">8.2 GB of 10 GB used this month.</Tabs.Panel>
      <Tabs.Panel value="invoices">Your last invoice was paid on 1 September.</Tabs.Panel>
      <Tabs.Panel value="analytics">Available on the Pro plan.</Tabs.Panel>
    </Tabs>
  );
}
