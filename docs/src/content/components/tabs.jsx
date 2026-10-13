import { Tabs } from "@shelf-ui/react";
import Basic from "../../examples/tabs/Basic.jsx";
import basicCode from "../../examples/tabs/Basic.jsx?raw";
import Controlled from "../../examples/tabs/Controlled.jsx";
import controlledCode from "../../examples/tabs/Controlled.jsx?raw";
import Disabled from "../../examples/tabs/Disabled.jsx";
import disabledCode from "../../examples/tabs/Disabled.jsx?raw";

function TabsThumbnail() {
  return (
    <Tabs defaultValue="overview" style={{ width: "100%", maxWidth: 260 }}>
      <Tabs.List aria-label="Preview">
        <Tabs.Tab value="overview">Overview</Tabs.Tab>
        <Tabs.Tab value="activity">Activity</Tabs.Tab>
        <Tabs.Tab value="settings">Settings</Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel value="overview">Project health at a glance.</Tabs.Panel>
      <Tabs.Panel value="activity">Recent activity.</Tabs.Panel>
      <Tabs.Panel value="settings">Project settings.</Tabs.Panel>
    </Tabs>
  );
}

export const tabsDoc = {
  slug: "tabs",
  name: "Tabs",
  category: "Navigation",
  summary: "Switches between related panels of content in the same place.",
  description:
    "Tabs organize related content into panels and show one at a time, like a project's overview, deployments and settings. Compose them from `Tabs.List`, `Tabs.Tab` and `Tabs.Panel`, matched by `value`.",
  keywords: ["tab", "tablist", "segmented", "panels", "switcher"],
  imports: ["Tabs"],
  Thumbnail: TabsThumbnail,
  examples: [
    {
      id: "basic",
      title: "Basic",
      description: "Click a tab, or focus one and use the arrow keys.",
      Component: Basic,
      code: basicCode,
    },
    {
      id: "disabled",
      title: "Disabled tab",
      description: "Disabled tabs can't be selected and are skipped by the arrow keys.",
      Component: Disabled,
      code: disabledCode,
    },
    {
      id: "controlled",
      title: "Controlled",
      description: "Pass `value` and `onValueChange` to drive the selection from your own state.",
      Component: Controlled,
      code: controlledCode,
    },
  ],
  api: [
    {
      title: "Tabs",
      description: "Root element (`<div>`); accepts its native attributes.",
      props: [
        { name: "value", type: "string", description: "Selected tab (controlled)." },
        {
          name: "defaultValue",
          type: "string",
          description: "Initially selected tab (uncontrolled). Defaults to the first enabled tab.",
        },
        {
          name: "onValueChange",
          type: "function(value)",
          description: "Called with the newly selected tab's value.",
        },
      ],
    },
    {
      title: "Tabs.List",
      description: "Also exported as `TabList`.",
      props: [
        {
          name: "aria-label",
          type: "string",
          description: "Names the set of tabs for screen readers, e.g. “Project sections”.",
        },
      ],
    },
    {
      title: "Tabs.Tab",
      description: "A `<button>`; also exported as `Tab`.",
      props: [
        {
          name: "value",
          type: "string",
          required: true,
          description: "Identifies the tab and its panel.",
        },
        {
          name: "disabled",
          type: "boolean",
          default: "false",
          description: "Prevents selecting the tab.",
        },
        { name: "children", type: "node", description: "The tab's label." },
      ],
    },
    {
      title: "Tabs.Panel",
      description: "Also exported as `TabPanel`.",
      props: [
        {
          name: "value",
          type: "string",
          required: true,
          description: "Value of the tab that shows this panel.",
        },
        {
          name: "children",
          type: "node",
          description: "Panel content, mounted only while the panel is selected.",
        },
      ],
    },
  ],
  keyboard: [
    {
      keys: ["→", "←"],
      description:
        "Moves to the next or previous tab and selects it, skipping disabled tabs and wrapping around.",
    },
    { keys: ["Home", "End"], description: "Moves to the first or last tab and selects it." },
    { keys: ["Tab"], description: "Moves focus from the selected tab into its panel." },
  ],
  accessibility: [
    'Uses the WAI-ARIA tabs pattern: `role="tablist"`, `role="tab"` and `role="tabpanel"`, wired with `aria-selected`, `aria-controls` and `aria-labelledby`.',
    "Only the selected tab is in the page's Tab order (roving tabindex), so the whole tab list is one Tab stop.",
    "Inactive panels are hidden and their content isn't mounted. Keep state you need across tabs in a parent component.",
    "Give `Tabs.List` an `aria-label` that describes the set.",
  ],
};
