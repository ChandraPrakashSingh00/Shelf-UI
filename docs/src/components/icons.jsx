function icon(paths) {
  return function Icon(props) {
    return (
      <svg
        viewBox="0 0 24 24"
        width="1em"
        height="1em"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        focusable="false"
        {...props}
      >
        {paths}
      </svg>
    );
  };
}

export const SearchIcon = icon(
  <>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" />
  </>,
);
export const CopyIcon = icon(
  <>
    <rect x="9" y="9" width="12" height="12" rx="2" />
    <path d="M5 15V5a2 2 0 0 1 2-2h10" />
  </>,
);
export const CheckIcon = icon(<path d="m5 12 5 5 9-10" />);
export const SunIcon = icon(
  <>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
  </>,
);
export const MoonIcon = icon(<path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5Z" />);
export const ArrowRightIcon = icon(<path d="M5 12h14M13 6l6 6-6 6" />);
export const ArrowLeftIcon = icon(<path d="M19 12H5M11 6l-6 6 6 6" />);
export const AccessibleIcon = icon(
  <>
    <circle cx="12" cy="4.5" r="1.5" />
    <path d="M5 8.5 12 10l7-1.5M12 10v4l-3 6M12 14l3 6" />
  </>,
);
export const CodeIcon = icon(<path d="m8 16-4-4 4-4M16 8l4 4-4 4M13.5 5l-3 14" />);
export const PaletteIcon = icon(
  <>
    <path d="M12 3a9 9 0 1 0 0 18c1.1 0 1.5-.8 1.5-1.5 0-1.2-1-1.5-1-2.5s.7-1.5 1.7-1.5H17a4 4 0 0 0 4-4c0-4.7-4-8.5-9-8.5Z" />
    <circle cx="7.5" cy="11" r="1" />
    <circle cx="10" cy="7" r="1" />
    <circle cx="15" cy="7" r="1" />
  </>,
);
export const FeatherIcon = icon(
  <>
    <path d="M20 4c-6 0-11 4-12 11l-3 5" />
    <path d="M8 15h6c3 0 5-3 6-7" />
  </>,
);
export const ServerIcon = icon(
  <>
    <rect x="3" y="4" width="18" height="7" rx="2" />
    <rect x="3" y="13" width="18" height="7" rx="2" />
    <path d="M7 7.5h.01M7 16.5h.01" />
  </>,
);
export const LayersIcon = icon(
  <>
    <path d="m12 3 9 5-9 5-9-5 9-5Z" />
    <path d="m3 13 9 5 9-5" />
  </>,
);

/** CodeCPS UI mark. */
export function Logo(props) {
  return (
    <svg viewBox="0 0 32 32" width="1em" height="1em" aria-hidden="true" focusable="false" {...props}>
      <rect width="32" height="32" rx="8" fill="#086FFD" />
      <path
        d="M19.5 11.2a6 6 0 1 0 0 9.6"
        fill="none"
        stroke="#fff"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}
