import { Navigate } from "react-router";
import { DocsLayout } from "./layout/DocsLayout.jsx";
import { SiteLayout } from "./layout/SiteLayout.jsx";
import { AboutPage } from "./pages/AboutPage.jsx";
import { ChangelogPage } from "./pages/ChangelogPage.jsx";
import { ComponentPage } from "./pages/ComponentPage.jsx";
import { ComponentsPage } from "./pages/ComponentsPage.jsx";
import { HomePage } from "./pages/HomePage.jsx";
import { InstallationPage } from "./pages/InstallationPage.jsx";
import { NotFoundPage, RouteError } from "./pages/NotFoundPage.jsx";

/** Shared by the browser router (main.jsx) and the tests (memory router). */
export const routes = [
  {
    element: <SiteLayout />,
    errorElement: <RouteError />,
    children: [
      { index: true, element: <HomePage /> },
      {
        element: <DocsLayout />,
        children: [
          { path: "docs", element: <Navigate to="/docs/installation" replace /> },
          { path: "docs/installation", element: <InstallationPage /> },
          { path: "components", element: <ComponentsPage /> },
          { path: "components/:slug", element: <ComponentPage /> },
          { path: "changelog", element: <ChangelogPage /> },
          { path: "about", element: <AboutPage /> },
        ],
      },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
];
