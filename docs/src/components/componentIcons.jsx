import { icon } from "./icons.jsx";

/** One icon per component, keyed by doc slug. */
const componentIcons = {
  accordion: icon(
    <>
      <rect x="3" y="4" width="18" height="6" rx="1.5" />
      <rect x="3" y="14" width="18" height="6" rx="1.5" />
      <path d="m14.5 6.5 1.5 1.5 1.5-1.5" />
    </>,
  ),
  "alert-dialog": icon(
    <>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M12 8.5v4M12 15.5h.01" />
    </>,
  ),
  alert: icon(
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7.5v5M12 16h.01" />
    </>,
  ),
  avatar: icon(
    <>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="10" r="3" />
      <path d="M6.7 18.4a6 6 0 0 1 10.6 0" />
    </>,
  ),
  badge: icon(
    <>
      <rect x="3" y="8" width="18" height="8" rx="4" />
      <path d="M8 12h8" />
    </>,
  ),
  banner: icon(
    <>
      <rect x="2" y="4" width="20" height="6" rx="1.5" />
      <path d="M4 14h16M4 18h10" />
    </>,
  ),
  breadcrumb: icon(<path d="m4 7 5 5-5 5M12 7l5 5-5 5" />),
  button: icon(
    <>
      <rect x="3" y="7" width="18" height="10" rx="3" />
      <path d="M8 12h8" />
    </>,
  ),
  calendar: icon(
    <>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M3 10h18M8 3v4M16 3v4M8 14h.01M12 14h.01M16 14h.01M8 17h.01M12 17h.01" />
    </>,
  ),
  card: icon(
    <>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M3 11h18M7 15h7M7 18h4" />
    </>,
  ),
  carousel: icon(
    <>
      <rect x="6" y="5" width="12" height="14" rx="2" />
      <path d="M3 8v8M21 8v8" />
    </>,
  ),
  checkbox: icon(
    <>
      <rect x="4" y="4" width="16" height="16" rx="3" />
      <path d="m8 12 3 3 5-6" />
    </>,
  ),
  combobox: icon(
    <>
      <rect x="3" y="6" width="18" height="12" rx="2" />
      <circle cx="9" cy="11.5" r="2.2" />
      <path d="m10.6 13.1 1.4 1.4M15 11l1.5 1.5L18 11" />
    </>,
  ),
  "command-palette": icon(
    <path d="M9 6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3Z" />,
  ),
  "date-picker": icon(
    <>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M3 10h18M8 3v4M16 3v4" />
      <rect x="7" y="13" width="4" height="4" rx="1" />
    </>,
  ),
  "description-list": icon(<path d="M4 6h5M13 6h7M4 12h5M13 12h7M4 18h5M13 18h7" />),
  divider: icon(<path d="M3 12h18M7 6h10M7 18h10" />),
  drawer: icon(
    <>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M14 4v16M16.5 8h2M16.5 11h2" />
    </>,
  ),
  dropdown: icon(
    <>
      <rect x="4" y="3" width="16" height="5" rx="1.5" />
      <rect x="4" y="11" width="16" height="10" rx="1.5" />
      <path d="M7 14.5h10M7 17.5h6" />
    </>,
  ),
  "empty-state": icon(
    <>
      <path d="M3 13h5l1.5 2h5l1.5-2h5" />
      <path d="M5.5 5h13L21 13v5a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-5Z" />
    </>,
  ),
  "file-upload": icon(
    <>
      <path d="M12 15V4M8 8l4-4 4 4" />
      <path d="M4 15v4a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-4" />
    </>,
  ),
  "icon-button": icon(
    <>
      <rect x="4" y="4" width="16" height="16" rx="4" />
      <path d="M12 8v8M8 12h8" />
    </>,
  ),
  input: icon(
    <>
      <rect x="3" y="6" width="18" height="12" rx="2" />
      <path d="M7 9v6" />
    </>,
  ),
  kbd: icon(
    <>
      <rect x="2" y="6" width="20" height="12" rx="2" />
      <path d="M6 10h.01M10 10h.01M14 10h.01M18 10h.01M8 14h8" />
    </>,
  ),
  link: icon(
    <>
      <path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1" />
      <path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1" />
    </>,
  ),
  modal: icon(
    <>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M3 9h18M15.5 5.5l2 2M17.5 5.5l-2 2M7 13h10M7 16h6" />
    </>,
  ),
  navbar: icon(
    <>
      <rect x="2" y="4" width="20" height="6" rx="1.5" />
      <path d="M5 7h3M13 7h2M17 7h2M4 15h16M4 19h10" />
    </>,
  ),
  "number-input": icon(
    <>
      <rect x="3" y="6" width="18" height="12" rx="2" />
      <path d="M6.5 12h4M16 9.5v5M13.5 12h5" />
    </>,
  ),
  pagination: icon(<path d="m7 8-4 4 4 4M17 8l4 4-4 4M9.5 12h.01M12 12h.01M14.5 12h.01" />),
  "pin-input": icon(
    <>
      <rect x="2" y="7" width="5" height="10" rx="1.5" />
      <rect x="9.5" y="7" width="5" height="10" rx="1.5" />
      <rect x="17" y="7" width="5" height="10" rx="1.5" />
    </>,
  ),
  popover: icon(
    <>
      <path d="M4 4h16a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1h-7l-4 4v-4H4a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1Z" />
      <path d="M7 8h10M7 12h6" />
    </>,
  ),
  progress: icon(
    <>
      <rect x="2" y="9" width="20" height="6" rx="3" />
      <path d="M5 12h8" />
    </>,
  ),
  "radio-group": icon(
    <>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="3.5" fill="currentColor" />
    </>,
  ),
  rating: icon(<path d="m12 3 2.8 5.6 6.2.9-4.5 4.4 1 6.1L12 17.1 6.5 20l1-6.1L3 9.5l6.2-.9Z" />),
  select: icon(
    <>
      <rect x="3" y="6" width="18" height="12" rx="2" />
      <path d="m14.5 11 1.5 1.5 1.5-1.5M6.5 12h5" />
    </>,
  ),
  sidebar: icon(
    <>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M9 4v16M5.5 8h1.5M5.5 11h1.5M5.5 14h1.5" />
    </>,
  ),
  skeleton: icon(
    <>
      <circle cx="6" cy="8" r="3" />
      <path d="M12 7h9M12 10h6M3 15h18M3 19h12" />
    </>,
  ),
  slider: icon(
    <>
      <path d="M3 12h4M13 12h8" />
      <circle cx="10" cy="12" r="3" />
    </>,
  ),
  spinner: icon(<path d="M12 3a9 9 0 1 0 9 9" />),
  stat: icon(
    <>
      <path d="m3 17 6-6 4 4 8-8" />
      <path d="M15 7h6v6" />
    </>,
  ),
  stepper: icon(
    <>
      <circle cx="5" cy="12" r="2.5" />
      <circle cx="12" cy="12" r="2.5" />
      <circle cx="19" cy="12" r="2.5" />
      <path d="M7.5 12h2M14.5 12h2" />
    </>,
  ),
  switch: icon(
    <>
      <rect x="2" y="7" width="20" height="10" rx="5" />
      <circle cx="16" cy="12" r="3" />
    </>,
  ),
  table: icon(
    <>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M3 10h18M3 15h18M9 10v10M15 10v10" />
    </>,
  ),
  tabs: icon(
    <>
      <rect x="3" y="8" width="18" height="12" rx="2" />
      <path d="M3 8V5a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v3M11 5h5a1 1 0 0 1 1 1v2" />
    </>,
  ),
  tag: icon(
    <>
      <path d="M3 12V4a1 1 0 0 1 1-1h8l9 9-9 9Z" />
      <circle cx="7.5" cy="7.5" r="1.5" />
    </>,
  ),
  textarea: icon(
    <>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M7 8h10M7 12h10M7 16h5" />
    </>,
  ),
  timeline: icon(
    <>
      <circle cx="6" cy="5" r="2" />
      <circle cx="6" cy="12" r="2" />
      <circle cx="6" cy="19" r="2" />
      <path d="M6 7v3M6 14v3M11 5h9M11 12h9M11 19h6" />
    </>,
  ),
  toast: icon(
    <>
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    </>,
  ),
  "toggle-group": icon(
    <>
      <rect x="2" y="7" width="20" height="10" rx="2" />
      <path d="M9 7v10M15 7v10" />
    </>,
  ),
  tooltip: icon(
    <>
      <rect x="4" y="3" width="16" height="9" rx="2" />
      <path d="m10 12 2 2.5 2-2.5M12 18v3" />
    </>,
  ),
};

/** One icon per category, keyed by category slug. */
const categoryIcons = {
  actions: icon(
    <>
      <path d="m9 9 5 12 1.8-5.2L21 14Z" />
      <path d="M7.2 2.2 8 5.1M5.1 8l-2.9-.8M14 4.1 12 6M6 12l-1.9 2" />
    </>,
  ),
  forms: icon(
    <>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M7 8h10M7 12h10M7 16h5" />
    </>,
  ),
  "data-display": icon(<path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />),
  layout: icon(
    <>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M3 9h18M9 21V9" />
    </>,
  ),
  media: icon(
    <>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <circle cx="9" cy="10" r="2" />
      <path d="m21 16-5-5L5 20" />
    </>,
  ),
  feedback: icon(<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2Z" />),
  overlays: icon(
    <>
      <rect x="8" y="8" width="13" height="13" rx="2" />
      <path d="M16 4H5a2 2 0 0 0-2 2v11" />
    </>,
  ),
  navigation: icon(
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="m15.5 8.5-2 5-5 2 2-5Z" />
    </>,
  ),
};

const FallbackIcon = categoryIcons.layout;

export function ComponentIcon({ slug, ...props }) {
  const Icon = componentIcons[slug] ?? FallbackIcon;
  return <Icon {...props} />;
}

export function CategoryIcon({ slug, ...props }) {
  const Icon = categoryIcons[slug] ?? FallbackIcon;
  return <Icon {...props} />;
}
