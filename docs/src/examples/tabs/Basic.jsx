import { Tabs } from "shelf-ui-react";

export default function TabsBasic() {
  return (
    <Tabs defaultValue="overview" style={{ width: "100%" }}>
      <Tabs.List aria-label="Project">
        <Tabs.Tab value="overview">Overview</Tabs.Tab>
        <Tabs.Tab value="deployments">Deployments</Tabs.Tab>
        <Tabs.Tab value="settings">Settings</Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel value="overview">Project health, recent activity and quick links.</Tabs.Panel>
      <Tabs.Panel value="deployments">Production and preview deployments.</Tabs.Panel>
      <Tabs.Panel value="settings">Domains, environment variables and members.</Tabs.Panel>
    </Tabs>
  );
}
