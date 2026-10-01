/** Internal 24×24 stroke icons. Decorative by default (`aria-hidden`). */
export function createIcon(displayName, paths) {
  function Icon(props) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
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
  }
  Icon.displayName = displayName;
  return Icon;
}

export const CloseIcon = createIcon("CloseIcon", <path d="M18 6 6 18M6 6l12 12" />);

export const MenuIcon = createIcon("MenuIcon", <path d="M4 6h16M4 12h16M4 18h16" />);

export const ChevronDownIcon = createIcon("ChevronDownIcon", <path d="m6 9 6 6 6-6" />);

export const ChevronUpIcon = createIcon("ChevronUpIcon", <path d="m18 15-6-6-6 6" />);

export const ChevronLeftIcon = createIcon("ChevronLeftIcon", <path d="m15 18-6-6 6-6" />);

export const ChevronRightIcon = createIcon("ChevronRightIcon", <path d="m9 18 6-6-6-6" />);

export const CheckIcon = createIcon("CheckIcon", <path d="M20 6 9 17l-5-5" />);

export const MinusIcon = createIcon("MinusIcon", <path d="M5 12h14" />);

export const PauseIcon = createIcon("PauseIcon", <path d="M9 5v14M15 5v14" />);

export const PlayIcon = createIcon("PlayIcon", <path d="M7 4.5v15L19 12 7 4.5Z" />);

export const PlusIcon = createIcon("PlusIcon", <path d="M12 5v14M5 12h14" />);

export const ArrowUpIcon = createIcon("ArrowUpIcon", <path d="M12 19V5M6 11l6-6 6 6" />);

export const ArrowDownIcon = createIcon("ArrowDownIcon", <path d="M12 5v14M18 13l-6 6-6-6" />);

export const ChevronsUpDownIcon = createIcon(
  "ChevronsUpDownIcon",
  <path d="m7 15 5 5 5-5M7 9l5-5 5 5" />,
);

export const SearchIcon = createIcon(
  "SearchIcon",
  <>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" />
  </>,
);

export const CalendarIcon = createIcon(
  "CalendarIcon",
  <>
    <rect x="3" y="4.5" width="18" height="16.5" rx="2" />
    <path d="M3 9.5h18M8 3v3M16 3v3" />
  </>,
);

export const StarIcon = createIcon(
  "StarIcon",
  <path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2L12 17.3l-5.6 2.9 1.1-6.2L3 9.6l6.2-.9L12 3Z" />,
);

export const UploadIcon = createIcon(
  "UploadIcon",
  <>
    <path d="M12 15V4M7 9l5-5 5 5" />
    <path d="M4 15v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3" />
  </>,
);

export const FileIcon = createIcon(
  "FileIcon",
  <>
    <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Z" />
    <path d="M14 3v5h5" />
  </>,
);

export const ExternalLinkIcon = createIcon(
  "ExternalLinkIcon",
  <>
    <path d="M14 4h6v6M20 4l-9 9" />
    <path d="M18 14v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4" />
  </>,
);

export const PanelLeftIcon = createIcon(
  "PanelLeftIcon",
  <>
    <rect x="3" y="4" width="18" height="16" rx="2" />
    <path d="M9 4v16" />
  </>,
);

export const UserIcon = createIcon(
  "UserIcon",
  <>
    <circle cx="12" cy="8" r="4" />
    <path d="M4.5 20.5a7.5 7.5 0 0 1 15 0" />
  </>,
);

export const InfoIcon = createIcon(
  "InfoIcon",
  <>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 16v-4M12 8h.01" />
  </>,
);

export const SuccessIcon = createIcon(
  "SuccessIcon",
  <>
    <circle cx="12" cy="12" r="9" />
    <path d="m8.5 12 2.5 2.5 4.5-5" />
  </>,
);

export const WarningIcon = createIcon(
  "WarningIcon",
  <>
    <path d="M10.3 3.9 2.4 17.5A2 2 0 0 0 4.1 20.5h15.8a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" />
    <path d="M12 9v4M12 17h.01" />
  </>,
);

export const ErrorIcon = createIcon(
  "ErrorIcon",
  <>
    <circle cx="12" cy="12" r="9" />
    <path d="m15 9-6 6M9 9l6 6" />
  </>,
);

/** Default icon for each feedback tone (used by Alert and Toast). */
export const statusIcons = {
  info: InfoIcon,
  success: SuccessIcon,
  warning: WarningIcon,
  error: ErrorIcon,
};
