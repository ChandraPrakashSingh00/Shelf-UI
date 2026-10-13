import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
import { Portal } from "../../primitives/Portal.jsx";
import { cx } from "../../utils/cx.js";
import { DEFAULT_TOAST_DURATION, Toast } from "./Toast.jsx";

const ToastContext = createContext(null);

/**
 * Hosts the toast stack. Wrap your app once, then call `useToast()` anywhere.
 *
 * - `position`: screen corner / edge where toasts stack — "top-left", "top-center",
 *   "top-right", "bottom-left", "bottom-center" or "bottom-right" (default).
 * - `limit`: maximum visible toasts; the oldest are removed first (default 5).
 * - `defaultDuration`: auto-dismiss delay in ms for toasts without their own (default 5000).
 * - `label`: accessible name of the notifications region (default "Notifications").
 */
export function ToastProvider({
  children,
  position = "bottom-right",
  limit = 5,
  defaultDuration = DEFAULT_TOAST_DURATION,
  label = "Notifications",
}) {
  const [toasts, setToasts] = useState([]);
  const nextId = useRef(0);

  const dismiss = useCallback((id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const dismissAll = useCallback(() => setToasts([]), []);

  const toast = useCallback(
    (options) => {
      nextId.current += 1;
      const id = options.id ?? `shelf-toast-${nextId.current}`;
      setToasts((current) =>
        [...current.filter((existing) => existing.id !== id), { ...options, id }].slice(-limit),
      );
      return id;
    },
    [limit],
  );

  const api = useMemo(() => ({ toast, dismiss, dismissAll }), [toast, dismiss, dismissAll]);

  return (
    <ToastContext.Provider value={api}>
      {children}
      {toasts.length > 0 && (
        <Portal>
          <section
            aria-label={label}
            className={cx("shelf-toast-viewport", `shelf-toast-viewport--${position}`)}
          >
            {toasts.map(({ id, duration, ...options }) => (
              <Toast
                key={id}
                {...options}
                duration={duration ?? defaultDuration}
                onDismiss={() => dismiss(id)}
              />
            ))}
          </section>
        </Portal>
      )}
    </ToastContext.Provider>
  );
}

/**
 * Returns `{ toast, dismiss, dismissAll }`. Must be used inside `<ToastProvider>`.
 *
 * `toast(options)` shows a toast and returns its id. Options: `variant`, `title`,
 * `message`, `action`, `duration` (overrides the provider's `defaultDuration`) and
 * `id` (reuse an id to replace an existing toast instead of stacking a new one).
 * `dismiss(id)` removes one toast; `dismissAll()` removes them all.
 */
export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast() must be used inside <ToastProvider>.");
  return context;
}
