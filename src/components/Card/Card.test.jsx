import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Button } from "../Button/Button.jsx";
import { Card } from "./Card.jsx";

describe("Card", () => {
  it("renders compound parts in order", () => {
    render(
      <Card data-testid="card">
        <Card.Header>
          <Card.Title>Starter plan</Card.Title>
          <Card.Description>For small teams</Card.Description>
        </Card.Header>
        <Card.Content>Up to 5 projects</Card.Content>
        <Card.Footer>
          <Button>Choose plan</Button>
        </Card.Footer>
      </Card>,
    );

    expect(screen.getByRole("heading", { level: 3, name: "Starter plan" })).toBeInTheDocument();
    expect(screen.getByText("For small teams")).toBeInTheDocument();
    expect(screen.getByText("Up to 5 projects")).toHaveClass("shelf-card__content");
    expect(screen.getByRole("button", { name: "Choose plan" })).toBeInTheDocument();
  });

  it("lets the title use the heading level that fits the page", () => {
    render(
      <Card>
        <Card.Title as="h2">Billing</Card.Title>
      </Card>,
    );
    expect(screen.getByRole("heading", { level: 2, name: "Billing" })).toBeInTheDocument();
  });

  it("builds header, content and footer from shorthand props", () => {
    render(
      <Card title="Deployments" description="Last 24 hours" footer={<Button>View all</Button>}>
        12 successful
      </Card>,
    );

    expect(screen.getByRole("heading", { name: "Deployments" })).toBeInTheDocument();
    expect(screen.getByText("Last 24 hours")).toHaveClass("shelf-card__description");
    expect(screen.getByText("12 successful")).toHaveClass("shelf-card__content");
    expect(screen.getByRole("button", { name: "View all" }).parentElement).toHaveClass(
      "shelf-card__footer",
    );
  });

  it("renders plain children directly when no shorthand is used", () => {
    render(<Card data-testid="card">Hello Acme</Card>);
    const card = screen.getByTestId("card");
    expect(card).toHaveTextContent("Hello Acme");
    expect(card.querySelector(".shelf-card__content")).not.toBeInTheDocument();
  });

  it("does not forward the title prop as a tooltip attribute", () => {
    render(<Card data-testid="card" title="Usage" />);
    expect(screen.getByTestId("card")).not.toHaveAttribute("title");
  });

  it("defaults to the outlined variant and accepts others", () => {
    const { rerender } = render(<Card data-testid="card" />);
    expect(screen.getByTestId("card")).toHaveClass("shelf-card--outlined");

    rerender(<Card data-testid="card" variant="elevated" />);
    expect(screen.getByTestId("card")).toHaveClass("shelf-card--elevated");
  });
});
