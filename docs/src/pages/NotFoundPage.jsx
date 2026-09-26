import { Button } from "@codecps/ui";
import { Link, isRouteErrorResponse, useRouteError } from "react-router";
import { useDocumentTitle } from "../lib/document.js";

export function NotFoundContent() {
  return (
    <div className="docs-empty">
      <p className="docs-eyebrow">404</p>
      <h1 className="docs-h1">Page not found</h1>
      <p className="docs-lead">
        The page you're looking for doesn't exist or has moved. Try search (Ctrl K) or head back home.
      </p>
      <div className="docs-empty__actions">
        <Button asChild>
          <Link to="/">Back to home</Link>
        </Button>
        <Button asChild variant="outline">
          <Link to="/components">Browse components</Link>
        </Button>
      </div>
    </div>
  );
}

export function NotFoundPage() {
  useDocumentTitle("Page not found");
  return (
    <div className="docs-container">
      <NotFoundContent />
    </div>
  );
}

/** Shown when a route throws while rendering. */
export function RouteError() {
  const error = useRouteError();
  const message = isRouteErrorResponse(error)
    ? `${error.status} ${error.statusText}`
    : error instanceof Error
      ? error.message
      : "Unknown error";

  return (
    <main className="docs-container docs-empty">
      <p className="docs-eyebrow">Error</p>
      <h1 className="docs-h1">Something went wrong</h1>
      <p className="docs-lead">{message}</p>
      <div className="docs-empty__actions">
        <Button asChild>
          <a href="/">Reload the docs</a>
        </Button>
      </div>
    </main>
  );
}
