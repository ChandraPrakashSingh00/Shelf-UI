import { Button, ToastProvider, useToast } from "@codecps/ui";

function SaveButton() {
  const { toast } = useToast();
  return (
    <Button
      variant="secondary"
      onClick={() => toast({ variant: "success", title: "Settings saved" })}
    >
      Show at the top
    </Button>
  );
}

export default function ToastPosition() {
  return (
    <ToastProvider position="top-center">
      <SaveButton />
    </ToastProvider>
  );
}
