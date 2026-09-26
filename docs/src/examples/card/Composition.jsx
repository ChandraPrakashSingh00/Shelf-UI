import { Button, Card } from "@codecps/ui";

export default function CardComposition() {
  return (
    <Card style={{ width: "100%", maxWidth: 380 }}>
      <Card.Header>
        <Card.Title>Starter</Card.Title>
        <Card.Description>For freelancers and small teams getting started.</Card.Description>
      </Card.Header>
      <Card.Content>5 projects · 10 GB storage · Email support</Card.Content>
      <Card.Footer>
        <Button fullWidth>Choose Starter</Button>
      </Card.Footer>
    </Card>
  );
}
