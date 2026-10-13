/**
 * Documentation pages, grouped as in the docs sidebar. Search indexes every
 * page, so `description` and `keywords` should say what each page covers.
 */
export const introductionPage = {
  title: "Introduction",
  href: "/docs",
  description: "What Shelf UI is, a quick install, peer dependencies and a basic setup.",
  keywords: ["overview", "getting started", "quick start", "peer dependencies", "react"],
};

export const installationPage = {
  title: "Installation",
  href: "/docs/installation",
  description: "Install the package, import the styles and render your first component.",
  keywords: ["install", "npm", "pnpm", "yarn", "bun", "styles", "css", "font", "inter"],
};

export const setupPage = {
  title: "Setup",
  href: "/docs/setup",
  description: "Set up Shelf UI in Vite or the Next.js App Router, and enable toasts.",
  keywords: ["vite", "next", "nextjs", "app router", "server components", "toast", "provider"],
};

export const changelogPage = {
  title: "Changelog",
  href: "/changelog",
  description: "New features, changes and fixes in each release.",
  keywords: ["release", "releases", "version", "versions", "history", "what's new"],
};

export const themingPage = {
  title: "Theming",
  href: "/docs/theming",
  description: "Override design tokens to match your brand, and switch to dark mode.",
  keywords: ["tokens", "css variables", "custom properties", "brand", "colors", "dark mode"],
};

export const customizationPage = {
  title: "Customization",
  href: "/docs/customization",
  description: "Add classes, wrap components, render links with asChild and use Tailwind CSS.",
  keywords: ["classname", "wrapper", "wrap", "aschild", "tailwind", "css layers", "override"],
};

export const accessibilityPage = {
  title: "Accessibility",
  href: "/docs/accessibility",
  description: "What the components handle for you, and what your app still needs to provide.",
  keywords: ["a11y", "aria", "keyboard", "focus", "screen reader", "reduced motion", "wcag"],
};

export const componentApiPage = {
  title: "Component API",
  href: "/docs/component-api",
  description: "Conventions every component follows: props, refs, state, events and forms.",
  keywords: ["props", "ref", "controlled", "uncontrolled", "compound", "events", "forms", "i18n"],
};

export const designTokensPage = {
  title: "Design tokens",
  href: "/docs/design-tokens",
  description: "Every --shelf- custom property, with its light and dark value.",
  keywords: ["tokens", "theme api", "css variables", "colors", "radius", "shadow", "z-index"],
};

export const docsGroups = [
  {
    title: "Getting started",
    pages: [introductionPage, installationPage, setupPage, changelogPage],
  },
  { title: "Guides", pages: [themingPage, customizationPage, accessibilityPage] },
  { title: "API reference", pages: [componentApiPage, designTokensPage] },
];

export const docsPages = docsGroups.flatMap((group) => group.pages);

/** The previous and next page in sidebar order, for the links under each page. */
export function getAdjacentDocsPages(href) {
  const index = docsPages.findIndex((page) => page.href === href);
  return { previous: docsPages[index - 1], next: docsPages[index + 1] };
}
