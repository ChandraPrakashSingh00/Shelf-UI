import { Input, Modal } from "@codecps/ui";
import { useEffect, useId, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { searchIndex } from "../content/searchIndex.js";
import { searchEntries } from "../lib/search.js";
import { ArrowRightIcon, SearchIcon } from "./icons.jsx";

/** Command-palette search (⌘K / Ctrl+K) following the ARIA combobox pattern. */
export function SearchDialog({ open, onClose }) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-label="Search documentation"
      hideCloseButton
      className="docs-search"
    >
      {/* Mounted only while open, so every search starts fresh. */}
      <SearchPanel onClose={onClose} />
    </Modal>
  );
}

function SearchPanel({ onClose }) {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const results = useMemo(() => searchEntries(searchIndex, query), [query]);
  const listboxId = useId();
  const optionId = (index) => `${listboxId}-option-${index}`;
  const activeEntry = results[activeIndex];
  const trimmedQuery = query.trim();

  useEffect(() => {
    document
      .getElementById(`${listboxId}-option-${activeIndex}`)
      ?.scrollIntoView?.({ block: "nearest" });
  }, [listboxId, activeIndex]);

  const openEntry = (entry) => {
    onClose();
    navigate(entry.href);
  };

  const handleKeyDown = (event) => {
    if (results.length === 0) return;
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((index) => (index + 1) % results.length);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((index) => (index - 1 + results.length) % results.length);
    } else if (event.key === "Enter" && activeEntry) {
      event.preventDefault();
      openEntry(activeEntry);
    }
  };

  return (
    <div className="docs-search__panel">
      <Input
        aria-label="Search documentation"
        placeholder="Search components, examples and guides…"
        leftIcon={<SearchIcon />}
        value={query}
        onChange={(event) => {
          setQuery(event.target.value);
          setActiveIndex(0);
        }}
        onKeyDown={handleKeyDown}
        role="combobox"
        aria-expanded={results.length > 0}
        aria-controls={listboxId}
        aria-activedescendant={activeEntry ? optionId(activeIndex) : undefined}
        aria-autocomplete="list"
        autoComplete="off"
        spellCheck={false}
      />

      <div className="docs-search__results">
        <ul id={listboxId} role="listbox" aria-label="Search results" className="docs-search__list">
          {results.map((entry, index) => (
            <li
              key={entry.id}
              id={optionId(index)}
              role="option"
              aria-selected={index === activeIndex}
              className="docs-search__option"
              onMouseMove={() => setActiveIndex(index)}
              onClick={() => openEntry(entry)}
            >
              <span className="docs-search__option-title">
                {entry.title}
                <span className="docs-search__option-section">{entry.section}</span>
              </span>
              <span className="docs-search__option-description">{entry.description}</span>
            </li>
          ))}
        </ul>
        {results.length === 0 && (
          <p className="docs-search__empty" role="status">
            No results for “{query}”.
          </p>
        )}
      </div>

      {trimmedQuery && (
        <button
          type="button"
          className="docs-search__all"
          onClick={() => {
            onClose();
            navigate(`/search?q=${encodeURIComponent(trimmedQuery)}`);
          }}
        >
          See all results for “{trimmedQuery}”
          <ArrowRightIcon />
        </button>
      )}

      <div className="docs-search__footer" aria-hidden="true">
        <span>
          <kbd className="docs-kbd">↑</kbd>
          <kbd className="docs-kbd">↓</kbd> navigate
        </span>
        <span>
          <kbd className="docs-kbd">Enter</kbd> open
        </span>
        <span>
          <kbd className="docs-kbd">Esc</kbd> close
        </span>
      </div>
    </div>
  );
}
