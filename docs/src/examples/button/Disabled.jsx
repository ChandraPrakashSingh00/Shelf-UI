import { Button } from "@codecps/ui";

export default function ButtonDisabled() {
  return (
    <>
      <Button disabled>Primary</Button>
      <Button variant="secondary" disabled>
        Secondary
      </Button>
      <Button variant="outline" disabled>
        Outline
      </Button>
    </>
  );
}
