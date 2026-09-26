import { Button, useToast } from "@codecps/ui";

// useToast() needs a <ToastProvider> above it, usually once at the root of your app.
export default function ToastVariants() {
  const { toast } = useToast();

  return (
    <>
      <Button
        variant="secondary"
        onClick={() =>
          toast({
            variant: "success",
            title: "Project created",
            message: "codecps-web is ready to deploy.",
          })
        }
      >
        Success
      </Button>
      <Button
        variant="secondary"
        onClick={() =>
          toast({ variant: "error", title: "Build failed", message: "3 errors in src/App.jsx." })
        }
      >
        Error
      </Button>
      <Button
        variant="secondary"
        onClick={() =>
          toast({ variant: "warning", title: "Usage at 90%", message: "Upgrade to avoid rate limits." })
        }
      >
        Warning
      </Button>
      <Button
        variant="secondary"
        onClick={() =>
          toast({ variant: "info", title: "New version", message: "CodeCPS UI 0.2 is available." })
        }
      >
        Info
      </Button>
    </>
  );
}
