import { componentDocs } from "./components/index.js";
import { aboutGuide, changelogGuide, guideSections, installationGuide } from "./guides.js";

const guideEntry = (guide) => ({
  id: `guide:${guide.href}`,
  title: guide.title,
  section: "Guides",
  href: guide.href,
  description: guide.description,
  keywords: guide.keywords,
});

/**
 * Everything search can find. Order matters for an empty query, which shows
 * the first results: installation, then every component.
 */
export const searchIndex = [
  guideEntry(installationGuide),
  ...componentDocs.map((doc) => ({
    id: `component:${doc.slug}`,
    title: doc.name,
    section: "Components",
    href: `/components/${doc.slug}`,
    description: doc.summary,
    keywords: [
      ...doc.keywords,
      doc.category,
      ...doc.api.flatMap((group) => group.props.map((prop) => prop.name)),
    ],
  })),
  ...guideSections.map(guideEntry),
  guideEntry(changelogGuide),
  guideEntry(aboutGuide),
  ...componentDocs.flatMap((doc) =>
    doc.examples.map((example) => ({
      id: `example:${doc.slug}:${example.id}`,
      title: example.title,
      section: doc.name,
      href: `/components/${doc.slug}#${example.id}`,
      description: `${doc.name} example`,
      keywords: [doc.name, doc.slug],
    })),
  ),
];
