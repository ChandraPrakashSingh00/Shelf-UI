import { Badge } from "@codecps/ui";
import changelogSource from "../../../CHANGELOG.md?raw";
import { InlineMarkdown } from "../components/InlineMarkdown.jsx";
import { changelogPage } from "../content/docsPages.js";
import { DocsPageNav, PageHeader } from "../layout/PageParts.jsx";
import { parseChangelog } from "../lib/changelog.js";
import { useDocumentTitle } from "../lib/document.js";

const releases = parseChangelog(changelogSource);

// Keep a Changelog section names → badge colors.
const SECTION_VARIANTS = {
  Added: "success",
  Changed: "primary",
  Deprecated: "warning",
  Removed: "danger",
  Fixed: "primary",
  Security: "danger",
};

const dateFormat = new Intl.DateTimeFormat("en", { dateStyle: "long", timeZone: "UTC" });

export function ChangelogPage() {
  useDocumentTitle("Changelog");
  const latestVersion = releases.find((release) => release.date !== null)?.version;

  return (
    <article className="docs-article">
      <PageHeader
        title="Changelog"
        lead="Every notable change to `@codecps/ui`. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and versions follow [Semantic Versioning](https://semver.org)."
      />
      <ol className="docs-releases">
        {releases.map((release) => {
          const headingId = `release-${release.version.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
          return (
            <li key={release.version} className="docs-release">
              <section aria-labelledby={headingId}>
                <div className="docs-release__header">
                  <h2 id={headingId} className="docs-release__version">
                    {release.date ? `v${release.version}` : release.version}
                  </h2>
                  {release.version === latestVersion && <Badge variant="primary">Latest</Badge>}
                  {release.date && (
                    <time className="docs-release__date" dateTime={release.date}>
                      {dateFormat.format(new Date(`${release.date}T00:00:00Z`))}
                    </time>
                  )}
                </div>
                {release.sections.map((section) => (
                  <div key={section.title} className="docs-release__section">
                    <h3 className="docs-release__section-title">
                      <Badge variant={SECTION_VARIANTS[section.title] ?? "neutral"}>
                        {section.title}
                      </Badge>
                    </h3>
                    <ul className="docs-list">
                      {section.items.map((item) => (
                        <li key={item}>
                          <InlineMarkdown text={item} />
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </section>
            </li>
          );
        })}
      </ol>
      <DocsPageNav page={changelogPage} />
    </article>
  );
}
