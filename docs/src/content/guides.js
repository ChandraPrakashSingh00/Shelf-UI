/** Guide pages and sections, used by the sidebar and search. */
export const installationGuide = {
  title: "Installation",
  href: "/docs/installation",
  description: "Install the package, import the styles and render your first component.",
  keywords: ["getting started", "setup", "install", "npm", "pnpm", "yarn", "styles", "css"],
};

export const changelogGuide = {
  title: "Changelog",
  href: "/changelog",
  description: "New features, changes and fixes in each release.",
  keywords: ["release", "releases", "version", "versions", "history", "what's new"],
};

export const aboutGuide = {
  title: "About",
  href: "/about",
  description: "What CodeCPS UI is, its principles, status, license and where to find the source.",
  keywords: ["about", "codecps", "github", "source", "license", "contributing", "status"],
};

export const guideSections = [
  {
    title: "Theming",
    href: "/docs/installation#theming",
    description: "Override design tokens (CSS custom properties) to match your brand.",
    keywords: ["tokens", "css variables", "custom properties", "colors", "brand", "radius", "font"],
  },
  {
    title: "Dark mode",
    href: "/docs/installation#dark-mode",
    description: 'Switch themes with data-cps-theme="dark" on the <html> element.',
    keywords: ["dark", "theme", "night", "color scheme"],
  },
  {
    title: "Next.js",
    href: "/docs/installation#nextjs",
    description: "Use CodeCPS UI with the Next.js App Router and React Server Components.",
    keywords: ["next", "nextjs", "app router", "server components", "rsc", "ssr", "use client"],
  },
  {
    title: "Wrap a component",
    href: "/docs/installation#wrapping",
    description: "Build your own components on top of CodeCPS UI and pass props through.",
    keywords: ["wrapper", "wrap", "custom component", "props", "spread", "composition"],
  },
];
