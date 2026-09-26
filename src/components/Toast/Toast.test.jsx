import { act, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Toast } from "./Toast.jsx";
import { ToastProvider, useToast } from "./ToastProvider.jsx";

// Timer tests drive events synchronously (fireEvent / focus()) because
// user-event's async wrapper waits on a real timeout that fake timers block.
afterEach(() => {
  vi.useRealTimers();
});

describe("Toast", () => {
  it("announces politely for info/success and assertively for errors", () => {
    const { rerender } = render(
      <Toast variant="success" title="Saved" message="Your changes are live." />,
    );
    const status = screen.getByRole("status");
    expect(status).toHaveTextContent("Saved");
    expect(status).toHaveTextContent("Your changes are live.");

    rerender(<Toast variant="error" title="Upload failed" />);
    expect(screen.getByRole("alert")).toHaveTextContent("Upload failed");
  });

  it("dismisses itself after the duration", () => {
    vi.useFakeTimers();
    const onDismiss = vi.fn();
    render(<Toast title="Copied" duration={3000} onDismiss={onDismiss} />);

    act(() => vi.advanceTimersByTime(2999));
    expect(onDismiss).not.toHaveBeenCalled();
    act(() => vi.advanceTimersByTime(1));
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it("never auto-dismisses with an infinite duration", () => {
    vi.useFakeTimers();
    const onDismiss = vi.fn();
    render(<Toast title="Action required" duration={Infinity} onDismiss={onDismiss} />);

    act(() => vi.advanceTimersByTime(60_000));
    expect(onDismiss).not.toHaveBeenCalled();
  });

  it("pauses while hovered and resumes with the remaining time", () => {
    vi.useFakeTimers();
    const onDismiss = vi.fn();
    render(<Toast title="Deploying" duration={3000} onDismiss={onDismiss} />);
    const toast = screen.getByRole("status");

    act(() => vi.advanceTimersByTime(1000));
    fireEvent.mouseEnter(toast);
    act(() => vi.advanceTimersByTime(10_000));
    expect(onDismiss).not.toHaveBeenCalled();

    fireEvent.mouseLeave(toast);
    act(() => vi.advanceTimersByTime(1999));
    expect(onDismiss).not.toHaveBeenCalled();
    act(() => vi.advanceTimersByTime(1));
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it("pauses while keyboard focus is inside the toast", () => {
    vi.useFakeTimers();
    const onDismiss = vi.fn();
    render(<Toast title="Invite sent" duration={2000} onDismiss={onDismiss} />);
    const dismissButton = screen.getByRole("button", { name: "Dismiss" });

    act(() => dismissButton.focus());
    act(() => vi.advanceTimersByTime(5000));
    expect(onDismiss).not.toHaveBeenCalled();

    act(() => dismissButton.blur());
    act(() => vi.advanceTimersByTime(2000));
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it("can be dismissed with its close button", async () => {
    const onDismiss = vi.fn();
    render(<Toast title="Saved" onDismiss={onDismiss} />);

    await userEvent.click(screen.getByRole("button", { name: "Dismiss" }));
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });
});

describe("ToastProvider / useToast", () => {
  function renderProvider(props = {}) {
    let api = null;
    function CaptureApi() {
      api = useToast();
      return null;
    }
    render(
      <ToastProvider {...props}>
        <CaptureApi />
      </ToastProvider>,
    );
    return () => {
      if (!api) throw new Error("useToast() did not render");
      return api;
    };
  }

  it("shows toasts in a labelled notifications region and removes them on dismiss", async () => {
    const getApi = renderProvider();
    act(() => {
      getApi().toast({ variant: "success", title: "Project created", duration: Infinity });
    });

    const region = screen.getByRole("region", { name: "Notifications" });
    expect(region).toHaveTextContent("Project created");

    await userEvent.click(screen.getByRole("button", { name: "Dismiss" }));
    expect(screen.queryByRole("region", { name: "Notifications" })).not.toBeInTheDocument();
  });

  it("auto-dismisses using the provider's defaultDuration", () => {
    vi.useFakeTimers();
    const getApi = renderProvider({ defaultDuration: 1000 });
    act(() => {
      getApi().toast({ title: "Link copied" });
    });
    expect(screen.getByText("Link copied")).toBeInTheDocument();

    act(() => vi.advanceTimersByTime(1000));
    expect(screen.queryByText("Link copied")).not.toBeInTheDocument();
  });

  it("dismisses programmatically by id", () => {
    const getApi = renderProvider();
    let id = "";
    act(() => {
      id = getApi().toast({ title: "Uploading…", duration: Infinity });
    });
    act(() => getApi().dismiss(id));
    expect(screen.queryByText("Uploading…")).not.toBeInTheDocument();
  });

  it("replaces a toast that reuses an id", () => {
    const getApi = renderProvider();
    act(() => {
      getApi().toast({ id: "upload", title: "Uploading…", duration: Infinity });
      getApi().toast({ id: "upload", variant: "success", title: "Uploaded", duration: Infinity });
    });

    expect(screen.queryByText("Uploading…")).not.toBeInTheDocument();
    expect(screen.getAllByRole("status")).toHaveLength(1);
    expect(screen.getByRole("status")).toHaveTextContent("Uploaded");
  });

  it("keeps at most `limit` toasts, dropping the oldest", () => {
    const getApi = renderProvider({ limit: 2 });
    act(() => {
      for (const title of ["First", "Second", "Third"]) {
        getApi().toast({ title, duration: Infinity });
      }
    });

    expect(screen.queryByText("First")).not.toBeInTheDocument();
    expect(screen.getByText("Second")).toBeInTheDocument();
    expect(screen.getByText("Third")).toBeInTheDocument();
  });

  it("throws a helpful error outside a provider", () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    function Orphan() {
      useToast();
      return null;
    }
    expect(() => render(<Orphan />)).toThrow("useToast() must be used inside <ToastProvider>.");
  });
});
