import { Button, useToast } from "@shelf-ui/react";

export default function ToastWithAction() {
  const { toast, dismiss } = useToast();

  const archive = () =>
    toast({
      id: "archived",
      title: "Project archived",
      message: "storefront-web was moved to the archive.",
      // Stay open so people have time to reach the Undo button.
      duration: Infinity,
      action: (
        <Button size="sm" variant="outline" onClick={() => dismiss("archived")}>
          Undo
        </Button>
      ),
    });

  return (
    <Button variant="secondary" onClick={archive}>
      Archive project
    </Button>
  );
}
