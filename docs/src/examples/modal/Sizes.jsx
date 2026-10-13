import { Button, Modal } from "@shelf-ui/react";
import { useState } from "react";

const sizes = ["sm", "md", "lg"];

export default function ModalSizes() {
  const [size, setSize] = useState(null);

  return (
    <>
      {sizes.map((option) => (
        <Button key={option} variant="outline" onClick={() => setSize(option)}>
          Open {option}
        </Button>
      ))}
      <Modal
        open={size !== null}
        onClose={() => setSize(null)}
        size={size ?? "md"}
        title={`A ${size} modal`}
        description="Modals grow up to their size's max width and always stay inside the viewport."
        footer={<Button onClick={() => setSize(null)}>Done</Button>}
      />
    </>
  );
}
