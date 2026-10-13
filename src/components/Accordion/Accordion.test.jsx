import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef } from "react";
import { describe, expect, it, vi } from "vitest";
import { Accordion, AccordionItem } from "./Accordion.jsx";

function FaqItems() {
  return (
    <>
      <Accordion.Item value="billing" title="How does billing work?">
        Billed monthly per project.
      </Accordion.Item>
      <Accordion.Item value="plans" title="Can I change my plan?">
        Upgrade or downgrade any time.
      </Accordion.Item>
      <Accordion.Item value="sso" title="Do you support SSO?" disabled>
        Available on the Business plan.
      </Accordion.Item>
      <Accordion.Item value="refunds" title="Do you offer refunds?">
        Within 14 days of your first payment.
      </Accordion.Item>
    </>
  );
}

function renderAccordion(props = {}) {
  const user = userEvent.setup();
  const result = render(
    <Accordion {...props}>
      <FaqItems />
    </Accordion>,
  );
  return { user, ...result };
}

const header = (name) => screen.getByRole("button", { name });
const billing = () => header("How does billing work?");
const plans = () => header("Can I change my plan?");
const sso = () => header("Do you support SSO?");
const refunds = () => header("Do you offer refunds?");

const panelOf = (button) => document.getElementById(button.getAttribute("aria-controls"));

describe("Accordion", () => {
  it("renders each header as a button inside a heading, wired to its panel", () => {
    renderAccordion({ defaultValue: ["billing"] });

    const heading = screen.getByRole("heading", { level: 3, name: "How does billing work?" });
    expect(heading).toContainElement(billing());
    expect(billing()).toHaveAttribute("type", "button");
    expect(billing()).toHaveAttribute("aria-expanded", "true");
    expect(billing().querySelector("svg")).toHaveAttribute("aria-hidden", "true");

    const panel = screen.getByRole("region", { name: "How does billing work?" });
    expect(billing()).toHaveAttribute("aria-controls", panel.id);
    expect(panel).toHaveAttribute("aria-labelledby", billing().id);
    expect(panel).toHaveTextContent("Billed monthly per project.");
  });

  it("hides closed panels but keeps their content mounted", () => {
    renderAccordion();

    expect(plans()).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByRole("region")).not.toBeInTheDocument();
    expect(panelOf(plans())).not.toBeVisible();
    expect(panelOf(plans())).toHaveTextContent("Upgrade or downgrade any time.");
  });

  it("opens one item at a time by default and closes an open item", async () => {
    const onValueChange = vi.fn();
    const { user } = renderAccordion({ onValueChange });

    await user.click(billing());
    expect(billing()).toHaveAttribute("aria-expanded", "true");
    expect(panelOf(billing())).toBeVisible();

    await user.click(plans());
    expect(plans()).toHaveAttribute("aria-expanded", "true");
    expect(billing()).toHaveAttribute("aria-expanded", "false");
    expect(onValueChange).toHaveBeenLastCalledWith(["plans"]);

    await user.click(plans());
    expect(plans()).toHaveAttribute("aria-expanded", "false");
    expect(onValueChange).toHaveBeenLastCalledWith([]);
    expect(screen.queryByRole("region")).not.toBeInTheDocument();
  });

  it("keeps several items open with multiple", async () => {
    const onValueChange = vi.fn();
    const { user } = renderAccordion({ multiple: true, onValueChange });

    await user.click(billing());
    await user.click(refunds());
    expect(billing()).toHaveAttribute("aria-expanded", "true");
    expect(refunds()).toHaveAttribute("aria-expanded", "true");
    expect(onValueChange).toHaveBeenLastCalledWith(["billing", "refunds"]);

    await user.click(billing());
    expect(billing()).toHaveAttribute("aria-expanded", "false");
    expect(onValueChange).toHaveBeenLastCalledWith(["refunds"]);
  });

  it("supports controlled usage", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    const { rerender } = render(
      <Accordion value={["billing"]} onValueChange={onValueChange}>
        <FaqItems />
      </Accordion>,
    );

    await user.click(plans());
    expect(onValueChange).toHaveBeenCalledWith(["plans"]);
    // The parent did not update `value`, so nothing changes.
    expect(billing()).toHaveAttribute("aria-expanded", "true");
    expect(plans()).toHaveAttribute("aria-expanded", "false");

    rerender(
      <Accordion value={["plans", "refunds"]} onValueChange={onValueChange}>
        <FaqItems />
      </Accordion>,
    );
    expect(billing()).toHaveAttribute("aria-expanded", "false");
    expect(plans()).toHaveAttribute("aria-expanded", "true");
    expect(refunds()).toHaveAttribute("aria-expanded", "true");
  });

  it("toggles the focused item with Enter and Space", async () => {
    const { user } = renderAccordion();
    await user.tab();
    expect(billing()).toHaveFocus();

    await user.keyboard("{Enter}");
    expect(billing()).toHaveAttribute("aria-expanded", "true");
    await user.keyboard(" ");
    expect(billing()).toHaveAttribute("aria-expanded", "false");
  });

  it("moves focus with the arrow keys, Home and End, skipping disabled items", async () => {
    const { user } = renderAccordion();
    await user.tab();

    await user.keyboard("{ArrowDown}");
    expect(plans()).toHaveFocus();
    await user.keyboard("{ArrowDown}");
    expect(refunds()).toHaveFocus();
    await user.keyboard("{ArrowDown}");
    expect(billing()).toHaveFocus();
    await user.keyboard("{ArrowUp}");
    expect(refunds()).toHaveFocus();
    await user.keyboard("{Home}");
    expect(billing()).toHaveFocus();
    await user.keyboard("{End}");
    expect(refunds()).toHaveFocus();

    // Moving focus doesn't open anything.
    expect(screen.queryByRole("region")).not.toBeInTheDocument();
  });

  it("does not toggle a disabled item", async () => {
    const { user } = renderAccordion();
    expect(sso()).toBeDisabled();

    await user.click(sso());
    expect(sso()).toHaveAttribute("aria-expanded", "false");
  });

  it("keeps arrow key navigation within each nested accordion", async () => {
    const user = userEvent.setup();
    render(
      <Accordion defaultValue={["deployments"]}>
        <Accordion.Item value="deployments" title="Deployments">
          <Accordion>
            <Accordion.Item value="production" title="Production" headingLevel={4}>
              example.com
            </Accordion.Item>
            <Accordion.Item value="preview" title="Preview" headingLevel={4}>
              preview.example.com
            </Accordion.Item>
          </Accordion>
        </Accordion.Item>
        <Accordion.Item value="domains" title="Domains">
          2 domains
        </Accordion.Item>
      </Accordion>,
    );

    header("Deployments").focus();
    await user.keyboard("{ArrowDown}");
    expect(header("Domains")).toHaveFocus();

    header("Preview").focus();
    await user.keyboard("{ArrowDown}");
    expect(header("Production")).toHaveFocus();
    await user.keyboard("{End}");
    expect(header("Preview")).toHaveFocus();
  });

  it("runs the consumer's onKeyDown first, which can prevent the focus move", async () => {
    const user = userEvent.setup();
    const onKeyDown = vi.fn((event) => {
      if (event.key === "End") event.preventDefault();
    });
    render(
      <Accordion onKeyDown={onKeyDown}>
        <FaqItems />
      </Accordion>,
    );

    billing().focus();
    await user.keyboard("{End}");
    expect(billing()).toHaveFocus();
    await user.keyboard("{ArrowDown}");
    expect(plans()).toHaveFocus();
    expect(onKeyDown).toHaveBeenCalledTimes(2);
  });

  it("wraps the header button in a heading of the given level, from 2 to 6", () => {
    render(
      <Accordion>
        <Accordion.Item value="two" title="Level two" headingLevel={2}>
          Content
        </Accordion.Item>
        <Accordion.Item value="five" title="Level five" headingLevel={5}>
          Content
        </Accordion.Item>
        <Accordion.Item value="one" title="Level one" headingLevel={1}>
          Content
        </Accordion.Item>
      </Accordion>,
    );

    expect(screen.getByRole("heading", { level: 2, name: "Level two" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 5, name: "Level five" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: "Level one" })).toBeInTheDocument();
  });

  it("forwards refs, merges className and passes other props", () => {
    const rootRef = createRef();
    const itemRef = createRef();
    render(
      <Accordion ref={rootRef} className="faq" data-testid="faq">
        <AccordionItem
          ref={itemRef}
          value="billing"
          title="Billing"
          className="faq-item"
          data-testid="billing-item"
        >
          Billed monthly.
        </AccordionItem>
      </Accordion>,
    );

    expect(rootRef.current).toBe(screen.getByTestId("faq"));
    expect(rootRef.current).toHaveClass("shelf-accordion", "faq");
    expect(itemRef.current).toBe(screen.getByTestId("billing-item"));
    expect(itemRef.current).toHaveClass("shelf-accordion__item", "faq-item");
    expect(itemRef.current).not.toHaveAttribute("title");
    expect(Accordion.Item).toBe(AccordionItem);
  });

  it("explains misuse outside <Accordion>", () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => render(<AccordionItem value="orphan" title="Orphan" />)).toThrow(
      "<Accordion.Item> must be rendered inside <Accordion>.",
    );
  });
});
