import { describe, expect, it } from "vitest";
import changelogSource from "../../../CHANGELOG.md?raw";
import packageJson from "../../../package.json";
import { parseChangelog } from "./changelog.js";

describe("parseChangelog", () => {
  it("parses releases, dates, sections and wrapped list items", () => {
    const markdown = [
      "# Changelog",
      "",
      "Intro text is ignored.",
      "",
      "## [Unreleased]",
      "",
      "### Fixed",
      "",
      "- Fixed focus in a nested `Modal`",
      "  when both close at once.",
      "",
      "## [1.0.0] - 2026-10-01",
      "",
      "### Added",
      "- One",
      "- Two",
      "",
      "### Removed",
      "",
      "[1.0.0]: https://example.com/releases/1.0.0",
    ].join("\n");

    expect(parseChangelog(markdown)).toEqual([
      {
        version: "Unreleased",
        date: null,
        sections: [{ title: "Fixed", items: ["Fixed focus in a nested `Modal` when both close at once."] }],
      },
      // The empty "Removed" section is dropped.
      { version: "1.0.0", date: "2026-10-01", sections: [{ title: "Added", items: ["One", "Two"] }] },
    ]);
  });

  it("drops releases that have no entries", () => {
    expect(parseChangelog("## [Unreleased]\n\n### Added\n")).toEqual([]);
  });

  it("has an entry in CHANGELOG.md for the current package version", () => {
    const [latest] = parseChangelog(changelogSource).filter((release) => release.date !== null);
    expect(latest?.version).toBe(packageJson.version);
    expect(latest?.sections.length).toBeGreaterThan(0);
  });
});
