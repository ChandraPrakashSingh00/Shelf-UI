import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Tabs } from "./Tabs.jsx";

function renderTabs(props = { defaultValue: "overview" }) {
  const user = userEvent.setup();
  render(
    <Tabs {...props}>
      <Tabs.List aria-label="Project sections">
        <Tabs.Tab value="overview">Overview</Tabs.Tab>
        <Tabs.Tab value="activity">Activity</Tabs.Tab>
        <Tabs.Tab value="billing" disabled>
          Billing
        </Tabs.Tab>
        <Tabs.Tab value="settings">Settings</Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel value="overview">Overview content</Tabs.Panel>
      <Tabs.Panel value="activity">Activity content</Tabs.Panel>
      <Tabs.Panel value="billing">Billing content</Tabs.Panel>
      <Tabs.Panel value="settings">Settings content</Tabs.Panel>
    </Tabs>,
  );
  return user;
}

const tab = (name) => screen.getByRole("tab", { name });

describe("Tabs", () => {
  it("wires tabs and panels together with ARIA", () => {
    renderTabs();

    expect(screen.getByRole("tablist", { name: "Project sections" })).toBeInTheDocument();
    expect(tab("Overview")).toHaveAttribute("aria-selected", "true");
    expect(tab("Activity")).toHaveAttribute("aria-selected", "false");

    const panel = screen.getByRole("tabpanel", { name: "Overview" });
    expect(tab("Overview")).toHaveAttribute("aria-controls", panel.id);
    expect(panel).toHaveTextContent("Overview content");
  });

  it("keeps only the selected tab in the page Tab order", () => {
    renderTabs();
    expect(tab("Overview")).toHaveAttribute("tabindex", "0");
    expect(tab("Activity")).toHaveAttribute("tabindex", "-1");
    expect(tab("Settings")).toHaveAttribute("tabindex", "-1");
  });

  it("switches panels on click and does not mount inactive panel content", async () => {
    const user = renderTabs();
    await user.click(tab("Activity"));

    expect(tab("Activity")).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("tabpanel", { name: "Activity" })).toHaveTextContent("Activity content");
    expect(screen.queryByText("Overview content")).not.toBeInTheDocument();
  });

  it("moves and activates with arrow keys, Home and End, skipping disabled tabs", async () => {
    const user = renderTabs();
    await user.tab();
    expect(tab("Overview")).toHaveFocus();

    await user.keyboard("{ArrowRight}");
    expect(tab("Activity")).toHaveFocus();
    expect(tab("Activity")).toHaveAttribute("aria-selected", "true");

    await user.keyboard("{ArrowRight}");
    expect(tab("Settings")).toHaveFocus();

    await user.keyboard("{ArrowRight}");
    expect(tab("Overview")).toHaveFocus();

    await user.keyboard("{ArrowLeft}");
    expect(tab("Settings")).toHaveFocus();

    await user.keyboard("{Home}");
    expect(tab("Overview")).toHaveFocus();

    await user.keyboard("{End}");
    expect(tab("Settings")).toHaveFocus();
    expect(screen.getByRole("tabpanel")).toHaveTextContent("Settings content");
  });

  it("moves focus from the selected tab into the panel with Tab", async () => {
    const user = renderTabs();
    await user.tab();
    await user.tab();
    expect(screen.getByRole("tabpanel", { name: "Overview" })).toHaveFocus();
  });

  it("does not select a disabled tab", async () => {
    const user = renderTabs();
    expect(tab("Billing")).toBeDisabled();

    await user.click(tab("Billing"));
    expect(tab("Overview")).toHaveAttribute("aria-selected", "true");
  });

  it("supports controlled usage", async () => {
    const onValueChange = vi.fn();
    const user = renderTabs({ value: "overview", onValueChange });

    await user.click(tab("Activity"));
    expect(onValueChange).toHaveBeenCalledWith("activity");
    // The parent did not update `value`, so the selection stays put.
    expect(tab("Overview")).toHaveAttribute("aria-selected", "true");
  });

  it("selects the first enabled tab when no value is provided", () => {
    renderTabs({});
    expect(tab("Overview")).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("tabpanel")).toHaveTextContent("Overview content");
  });

  it("explains misuse outside <Tabs>", () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => render(<Tabs.Tab value="orphan">Orphan</Tabs.Tab>)).toThrow(
      "<Tabs.Tab> must be rendered inside <Tabs>.",
    );
  });
});
