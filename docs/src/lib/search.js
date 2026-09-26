function normalize(text) {
  return text.toLowerCase().trim();
}

function scoreTerm(term, entry) {
  const title = normalize(entry.title);
  const keywords = entry.keywords.map(normalize);

  if (title === term) return 120;
  if (title.startsWith(term)) return 100;
  if (title.split(/[\s.·-]+/).some((word) => word.startsWith(term))) return 80;
  if (title.includes(term)) return 60;
  if (keywords.includes(term)) return 50;
  if (keywords.some((keyword) => keyword.startsWith(term))) return 40;
  if (keywords.some((keyword) => keyword.includes(term))) return 25;
  if (normalize(entry.description).includes(term)) return 10;
  return 0;
}

/**
 * Ranks entries for a query. Every word of the query must match the title,
 * a keyword or the description; title matches rank highest. An empty query
 * returns the first `limit` entries in index order.
 *
 * Each entry is `{ id, title, section, href, description, keywords }`, where
 * `section` is the group shown next to the title (e.g. "Components" or the
 * parent component) and `keywords` is an array of extra search terms.
 */
export function searchEntries(entries, query, limit = 12) {
  const terms = normalize(query).split(/\s+/).filter(Boolean);
  if (terms.length === 0) return entries.slice(0, limit);

  const ranked = [];
  for (const entry of entries) {
    let score = 0;
    for (const term of terms) {
      const termScore = scoreTerm(term, entry);
      if (termScore === 0) {
        score = 0;
        break;
      }
      score += termScore;
    }
    if (score > 0) ranked.push({ entry, score });
  }

  return ranked
    .sort((a, b) => b.score - a.score || a.entry.title.localeCompare(b.entry.title))
    .slice(0, limit)
    .map(({ entry }) => entry);
}
