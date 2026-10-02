import { SearchIcon } from "./icons.jsx";

/**
 * A search field with a submit button. Calls `onSearch` with the trimmed
 * query; `defaultValue` fills it in (it resets when `defaultValue` changes).
 */
export function SearchForm({ label, placeholder, defaultValue = "", onSearch, className }) {
  const handleSubmit = (event) => {
    event.preventDefault();
    const query = String(new FormData(event.currentTarget).get("q") ?? "").trim();
    onSearch(query);
  };

  return (
    <form
      role="search"
      className={["docs-searchbar", className].filter(Boolean).join(" ")}
      onSubmit={handleSubmit}
    >
      <SearchIcon className="docs-searchbar__icon" />
      <input
        key={defaultValue}
        type="search"
        name="q"
        className="docs-searchbar__input"
        aria-label={label}
        placeholder={placeholder}
        defaultValue={defaultValue}
        autoComplete="off"
        spellCheck={false}
      />
      <button type="submit" className="docs-searchbar__button" aria-label="Search">
        <SearchIcon />
      </button>
    </form>
  );
}
