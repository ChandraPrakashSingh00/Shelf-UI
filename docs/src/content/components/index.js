import { accordionDoc } from "./accordion.jsx";
import { alertDoc } from "./alert.jsx";
import { alertDialogDoc } from "./alert-dialog.jsx";
import { avatarDoc } from "./avatar.jsx";
import { badgeDoc } from "./badge.jsx";
import { bannerDoc } from "./banner.jsx";
import { breadcrumbDoc } from "./breadcrumb.jsx";
import { buttonDoc } from "./button.jsx";
import { calendarDoc } from "./calendar.jsx";
import { cardDoc } from "./card.jsx";
import { carouselDoc } from "./carousel.jsx";
import { checkboxDoc } from "./checkbox.jsx";
import { comboboxDoc } from "./combobox.jsx";
import { commandPaletteDoc } from "./command-palette.jsx";
import { datePickerDoc } from "./date-picker.jsx";
import { descriptionListDoc } from "./description-list.jsx";
import { dividerDoc } from "./divider.jsx";
import { drawerDoc } from "./drawer.jsx";
import { dropdownDoc } from "./dropdown.jsx";
import { emptyStateDoc } from "./empty-state.jsx";
import { fileUploadDoc } from "./file-upload.jsx";
import { iconButtonDoc } from "./icon-button.jsx";
import { inputDoc } from "./input.jsx";
import { kbdDoc } from "./kbd.jsx";
import { linkDoc } from "./link.jsx";
import { modalDoc } from "./modal.jsx";
import { navbarDoc } from "./navbar.jsx";
import { numberInputDoc } from "./number-input.jsx";
import { paginationDoc } from "./pagination.jsx";
import { pinInputDoc } from "./pin-input.jsx";
import { popoverDoc } from "./popover.jsx";
import { progressDoc } from "./progress.jsx";
import { radioGroupDoc } from "./radio-group.jsx";
import { ratingDoc } from "./rating.jsx";
import { selectDoc } from "./select.jsx";
import { sidebarDoc } from "./sidebar.jsx";
import { skeletonDoc } from "./skeleton.jsx";
import { sliderDoc } from "./slider.jsx";
import { spinnerDoc } from "./spinner.jsx";
import { statDoc } from "./stat.jsx";
import { stepperDoc } from "./stepper.jsx";
import { switchDoc } from "./switch.jsx";
import { tableDoc } from "./table.jsx";
import { tabsDoc } from "./tabs.jsx";
import { tagDoc } from "./tag.jsx";
import { textareaDoc } from "./textarea.jsx";
import { timelineDoc } from "./timeline.jsx";
import { toastDoc } from "./toast.jsx";
import { toggleGroupDoc } from "./toggle-group.jsx";
import { tooltipDoc } from "./tooltip.jsx";

/**
 * Every documented component, in alphabetical order. Each doc is an object with:
 *
 * - `slug`, `name` and `category` (one of `categoryOrder`).
 * - `summary`: one sentence for cards and search results.
 * - `description`: lead paragraph on the component page (inline markdown).
 * - `keywords`: extra search terms.
 * - `imports`: named exports shown in the import snippet.
 * - `Thumbnail`: small decorative preview for the components grid.
 * - `Playground` (optional): interactive props playground, made with `definePlayground`.
 * - `examples`: `{ id, title, description, Component, code, responsive, minHeight }` objects.
 *   `code` is the example file's own source (imported with `?raw`); `responsive` adds a
 *   width switcher; `minHeight` (a CSS length) makes room for content that opens below
 *   its trigger, like menus, and aligns the preview to the top.
 * - `api`: props tables — `{ title, description, props }`, where each prop is
 *   `{ name, type, default, description, required }`.
 * - `keyboard` (optional): `{ keys, description }` rows; a key combination is one string,
 *   e.g. "Shift + Tab".
 * - `accessibility`: notes (inline markdown).
 */
export const componentDocs = [
  accordionDoc,
  alertDialogDoc,
  alertDoc,
  avatarDoc,
  badgeDoc,
  bannerDoc,
  breadcrumbDoc,
  buttonDoc,
  calendarDoc,
  cardDoc,
  carouselDoc,
  checkboxDoc,
  comboboxDoc,
  commandPaletteDoc,
  datePickerDoc,
  descriptionListDoc,
  dividerDoc,
  drawerDoc,
  dropdownDoc,
  emptyStateDoc,
  fileUploadDoc,
  iconButtonDoc,
  inputDoc,
  kbdDoc,
  linkDoc,
  modalDoc,
  navbarDoc,
  numberInputDoc,
  paginationDoc,
  pinInputDoc,
  popoverDoc,
  progressDoc,
  radioGroupDoc,
  ratingDoc,
  selectDoc,
  sidebarDoc,
  skeletonDoc,
  sliderDoc,
  spinnerDoc,
  statDoc,
  stepperDoc,
  switchDoc,
  tableDoc,
  tabsDoc,
  tagDoc,
  textareaDoc,
  timelineDoc,
  toastDoc,
  toggleGroupDoc,
  tooltipDoc,
].sort((a, b) => a.name.localeCompare(b.name));

export const categoryOrder = [
  "Actions",
  "Forms",
  "Data display",
  "Feedback",
  "Overlays",
  "Navigation",
];

export function getComponentDoc(slug) {
  return componentDocs.find((doc) => doc.slug === slug);
}
