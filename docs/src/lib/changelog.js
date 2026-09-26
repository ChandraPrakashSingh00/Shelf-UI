const RELEASE_HEADING = /^##\s+\[?([^\]\s]+)\]?(?:\s+-\s+(\d{4}-\d{2}-\d{2}))?\s*$/;
const SECTION_HEADING = /^###\s+(.+?)\s*$/;
const LIST_ITEM = /^[-*]\s+(.+)$/;
const CONTINUATION = /^\s+\S/;

/**
 * Parses a Keep a Changelog markdown file into releases. Intro text and link
 * references are ignored; releases without any entries are dropped.
 *
 * Each release is `{ version, date, sections }`: `date` is an ISO date
 * (YYYY-MM-DD), or `null` for "Unreleased", and each section is `{ title, items }`
 * with a Keep a Changelog heading ("Added", "Changed", "Fixed", …) as its title.
 */
export function parseChangelog(markdown) {
  const releases = [];
  let release;
  let section;

  for (const line of markdown.split(/\r?\n/)) {
    const releaseMatch = RELEASE_HEADING.exec(line);
    if (releaseMatch) {
      release = { version: releaseMatch[1] ?? "", date: releaseMatch[2] ?? null, sections: [] };
      releases.push(release);
      section = undefined;
      continue;
    }
    if (!release) continue;

    const sectionMatch = SECTION_HEADING.exec(line);
    if (sectionMatch) {
      section = { title: sectionMatch[1] ?? "", items: [] };
      release.sections.push(section);
      continue;
    }
    if (!section) continue;

    const itemMatch = LIST_ITEM.exec(line);
    if (itemMatch) {
      section.items.push((itemMatch[1] ?? "").trim());
    } else if (CONTINUATION.test(line) && section.items.length > 0) {
      const last = section.items.length - 1;
      section.items[last] = `${section.items[last]} ${line.trim()}`;
    }
  }

  return releases
    .map((entry) => ({ ...entry, sections: entry.sections.filter((s) => s.items.length > 0) }))
    .filter((entry) => entry.sections.length > 0);
}
