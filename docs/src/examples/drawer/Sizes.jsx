import { Button, Drawer } from "@codecps/ui";
import { useState } from "react";

const sizes = ["sm", "md", "lg"];

export default function DrawerSizes() {
  const [size, setSize] = useState(null);

  return (
    <>
      {sizes.map((option) => (
        <Button key={option} variant="outline" onClick={() => setSize(option)}>
          Open {option}
        </Button>
      ))}
      <Drawer
        open={size !== null}
        onClose={() => setSize(null)}
        size={size ?? "md"}
        title={`A ${size} drawer`}
        description="Side drawers are 20rem, 26rem or 36rem wide and never wider than the screen. Bottom drawers use the size as their maximum height."
        footer={<Button onClick={() => setSize(null)}>Done</Button>}
      />
    </>
  );
}
