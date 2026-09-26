/** Internal 24×24 stroke icons. Decorative by default (`aria-hidden`). */
function createIcon(displayName, paths) {
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
