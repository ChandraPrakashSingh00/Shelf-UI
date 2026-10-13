import { blogPosts } from "./blog.js";
import { componentDocs } from "./components/index.js";
import { docsPages, installationPage, introductionPage } from "./docsPages.js";

/** Sections inside docs pages that people search for by name. */
const docsSections = [
  {
    title: "Dark mode",
    href: "/docs/theming#dark-mode",
    description: 'Switch themes with data-shelf-theme="dark" on the <html> element.',
    keywords: ["dark", "theme", "night", "color scheme"],
  },
  {
    title: "Next.js",
    href: "/docs/setup#nextjs",
    description: "Use Shelf UI with the Next.js App Router and React Server Components.",
    keywords: ["next", "nextjs", "app router", "server components", "rsc", "ssr", "use client"],
  },
  {
    title: "Tailwind CSS",
    href: "/docs/customization#tailwind",
    description:
      "Import the styles into Tailwind's components layer so utilities can override them.",
    keywords: ["tailwind", "css layers", "utilities", "layer"],
  },
  {
    title: "Wrap a component",
    href: "/docs/customization#wrapping",
    description: "Build your own components on top of Shelf UI and pass props through.",
    keywords: ["wrapper", "wrap", "custom component", "props", "spread", "composition"],
  },
];

const docsEntry = (page) => ({
  id: `docs:${page.href}`,
  title: page.title,
  section: "Docs",
  category: "Documentation",
  href: page.href,
  description: page.description,
  keywords: page.keywords,
});

/**
 * Everything search can find. Each entry is `{ id, title, section, category,
 * href, description, keywords }`: `section` is the label shown in the search
 * dialog and `category` groups results on the search page. Order matters for
 * an empty query, which shows the first results: getting started, then every
 * component.
 */
export const searchIndex = [
  docsEntry(introductionPage),
  docsEntry(installationPage),
  ...componentDocs.map((doc) => ({
    id: `component:${doc.slug}`,
    title: doc.name,
    section: "Components",
    category: doc.category,
    href: `/components/${doc.slug}`,
    description: doc.summary,
    keywords: [
      ...doc.keywords,
      doc.category,
      ...doc.api.flatMap((group) => group.props.map((prop) => prop.name)),
    ],
  })),
  ...docsPages
    .filter((page) => page !== introductionPage && page !== installationPage)
    .map(docsEntry),
  ...docsSections.map(docsEntry),
  ...blogPosts.map((post) => ({
    id: `blog:${post.slug}`,
    title: post.title,
    section: "Blog",
    category: "Blog",
    href: `/blog/${post.slug}`,
    description: post.excerpt,
    keywords: [post.category],
  })),
  ...componentDocs.flatMap((doc) =>
    doc.examples.map((example) => ({
      id: `example:${doc.slug}:${example.id}`,
      title: example.title,
      section: doc.name,
      category: "Examples",
      href: `/components/${doc.slug}#${example.id}`,
      description: `${doc.name} example`,
      keywords: [doc.name, doc.slug],
    })),
  ),
];
