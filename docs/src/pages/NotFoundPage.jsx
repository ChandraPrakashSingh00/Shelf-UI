import { Button } from "shelf-ui-react";
import { Link, isRouteErrorResponse, useRouteError } from "react-router";
import { Astronaut } from "../components/Astronaut.jsx";
import { isApplePlatform, useDocumentTitle } from "../lib/document.js";

export function NotFoundContent() {
  const shortcut = isApplePlatform() ? "⌘ K" : "Ctrl K";

  return (
    <div className="docs-404">
      <Astronaut className="docs-404__art" />
      <p className="docs-404__code" aria-hidden="true">
        404
      </p>
      <h1 className="docs-404__title">Page Not Found</h1>
      <p className="docs-404__text">
        The page you're looking for doesn't exist or has moved. Try search ({shortcut}) or head back
        home.
      </p>
      <div className="docs-404__actions">
        <Button asChild>
          <Link to="/">Go Back Home</Link>
        </Button>
        <Button asChild variant="outline">
          <Link to="/components">Browse Components</Link>
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
    <main className="docs-container docs-404">
      <h1 className="docs-404__title">Something went wrong</h1>
      <p className="docs-404__text">{message}</p>
      <div className="docs-404__actions">
        <Button asChild>
          <a href={import.meta.env.BASE_URL}>Reload the docs</a>
        </Button>
      </div>
    </main>
  );
}
