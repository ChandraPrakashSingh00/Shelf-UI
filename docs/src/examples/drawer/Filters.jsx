import { Button, Drawer, Input } from "@codecps/ui";
import { useState } from "react";

const statuses = ["Ready", "Building", "Failed", "Canceled"];
const environments = ["Production", "Preview"];
const noFilters = { statuses: [], environments: [], branch: "" };

const toggle = (list, item) =>
  list.includes(item) ? list.filter((entry) => entry !== item) : [...list, item];

function ToggleGroup({ legend, options, selected, onToggle }) {
  return (
    <fieldset style={{ margin: 0, padding: 0, border: 0 }}>
      <legend style={{ marginBottom: 8, padding: 0, fontWeight: 500 }}>{legend}</legend>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {options.map((option) => {
          const pressed = selected.includes(option);
          return (
            <Button
              key={option}
              size="sm"
              variant={pressed ? "primary" : "outline"}
              aria-pressed={pressed}
              onClick={() => onToggle(option)}
            >
              {option}
            </Button>
          );
        })}
      </div>
    </fieldset>
  );
}

export default function DrawerFilters() {
  const [open, setOpen] = useState(false);
  const [applied, setApplied] = useState(noFilters);
  const [draft, setDraft] = useState(noFilters);

  const activeCount =
    applied.statuses.length + applied.environments.length + (applied.branch ? 1 : 0);

  const openFilters = () => {
    setDraft(applied);
    setOpen(true);
  };

  const applyFilters = () => {
    setApplied(draft);
    setOpen(false);
  };

  return (
    <>
      <Button variant="outline" onClick={openFilters}>
        {activeCount > 0 ? `Filters (${activeCount})` : "Filters"}
      </Button>
      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        title="Filter deployments"
        description="Show only the deployments you care about."
        footer={
          <>
            <Button variant="ghost" onClick={() => setDraft(noFilters)}>
              Reset
            </Button>
            <Button onClick={applyFilters}>Apply filters</Button>
          </>
        }
      >
        <div style={{ display: "grid", gap: 24 }}>
          <ToggleGroup
            legend="Status"
            options={statuses}
            selected={draft.statuses}
            onToggle={(status) => setDraft({ ...draft, statuses: toggle(draft.statuses, status) })}
          />
          <ToggleGroup
            legend="Environment"
            options={environments}
            selected={draft.environments}
            onToggle={(environment) =>
              setDraft({ ...draft, environments: toggle(draft.environments, environment) })
            }
          />
          <Input
            label="Branch"
            placeholder="main"
            value={draft.branch}
            onChange={(event) => setDraft({ ...draft, branch: event.target.value })}
          />
        </div>
      </Drawer>
    </>
  );
}
