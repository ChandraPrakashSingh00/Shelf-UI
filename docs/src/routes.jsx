import { DocsLayout } from "./layout/DocsLayout.jsx";
import { SiteLayout } from "./layout/SiteLayout.jsx";
import { AboutPage } from "./pages/AboutPage.jsx";
import { BlogPage } from "./pages/BlogPage.jsx";
import { BlogPostPage } from "./pages/BlogPostPage.jsx";
import { ChangelogPage } from "./pages/ChangelogPage.jsx";
import { ComponentPage } from "./pages/ComponentPage.jsx";
import { ComponentsPage } from "./pages/ComponentsPage.jsx";
import { AccessibilityPage } from "./pages/docs/AccessibilityPage.jsx";
import { ComponentApiPage } from "./pages/docs/ComponentApiPage.jsx";
import { CustomizationPage } from "./pages/docs/CustomizationPage.jsx";
import { DesignTokensPage } from "./pages/docs/DesignTokensPage.jsx";
import { InstallationPage } from "./pages/docs/InstallationPage.jsx";
import { IntroductionPage } from "./pages/docs/IntroductionPage.jsx";
import { SetupPage } from "./pages/docs/SetupPage.jsx";
import { ThemingPage } from "./pages/docs/ThemingPage.jsx";
import { HomePage } from "./pages/HomePage.jsx";
import { NotFoundPage, RouteError } from "./pages/NotFoundPage.jsx";
import { SearchPage } from "./pages/SearchPage.jsx";

/** Shared by the browser router (main.jsx) and the tests (memory router). */
export const routes = [
  {
    element: <SiteLayout />,
    errorElement: <RouteError />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "components", element: <ComponentsPage /> },
      { path: "components/:slug", element: <ComponentPage /> },
      {
        element: <DocsLayout />,
        children: [
          { path: "docs", element: <IntroductionPage /> },
          { path: "docs/installation", element: <InstallationPage /> },
          { path: "docs/setup", element: <SetupPage /> },
          { path: "docs/theming", element: <ThemingPage /> },
          { path: "docs/customization", element: <CustomizationPage /> },
          { path: "docs/accessibility", element: <AccessibilityPage /> },
          { path: "docs/component-api", element: <ComponentApiPage /> },
          { path: "docs/design-tokens", element: <DesignTokensPage /> },
          { path: "changelog", element: <ChangelogPage /> },
        ],
      },
      { path: "blog", element: <BlogPage /> },
      { path: "blog/:slug", element: <BlogPostPage /> },
      { path: "search", element: <SearchPage /> },
      { path: "about", element: <AboutPage /> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
];
