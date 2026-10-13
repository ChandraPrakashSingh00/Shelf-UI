import { Button, Tabs } from "shelf-ui-react";
import { useState } from "react";

export default function TabsControlled() {
  const [period, setPeriod] = useState("monthly");

  return (
    <div style={{ display: "grid", gap: 16, width: "100%" }}>
      <Tabs value={period} onValueChange={setPeriod}>
        <Tabs.List aria-label="Billing period">
          <Tabs.Tab value="monthly">Monthly</Tabs.Tab>
          <Tabs.Tab value="yearly">Yearly</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="monthly">₹999 per month, billed monthly.</Tabs.Panel>
        <Tabs.Panel value="yearly">₹9,990 per year: two months free.</Tabs.Panel>
      </Tabs>
      <div>
        <Button size="sm" variant="outline" onClick={() => setPeriod("yearly")}>
          Switch to yearly
        </Button>
      </div>
    </div>
  );
}
