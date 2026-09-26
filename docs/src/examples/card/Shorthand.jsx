import { Button, Card } from "@codecps/ui";

export default function CardShorthand() {
  return (
    <Card
      title="Deployments"
      description="Last 24 hours"
      footer={
        <Button variant="outline" size="sm">
          View all
        </Button>
      }
      style={{ width: "100%", maxWidth: 380 }}
    >
      12 successful · 1 failed
    </Card>
  );
}
