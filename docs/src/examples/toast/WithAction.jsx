import { Button, useToast } from "@codecps/ui";

export default function ToastWithAction() {
  const { toast, dismiss } = useToast();

  const archive = () =>
    toast({
      id: "archived",
      title: "Project archived",
      message: "codecps-web was moved to the archive.",
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
