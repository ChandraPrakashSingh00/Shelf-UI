# Changelog

All notable changes to `@codecps/ui` are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project follows [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- 17 new components, for 27 in total. Each one has a documentation page with a live preview, examples, an API reference and keyboard and accessibility notes.
- `Textarea`: a multi-line text field wired like `Input` (label, helper text, error), with `rows`, `resize`, `autoResize` (grows with its content) and `showCount` (a character count).
- `Select`: a styled native `<select>` with a label, helper text, error, sizes, a `placeholder`, and `options` (strings or `{ value, label, disabled }`) or `<option>` / `<optgroup>` children.
- `Checkbox`: a native checkbox with a custom look, a description, an error, sizes, and an `indeterminate` state for "select all".
- `RadioGroup` and `Radio`: single-choice groups built on native radios, with a label, a description, an error, a horizontal layout and two sizes.
- `Switch`: an on/off toggle built on a native checkbox with `role="switch"`, with a description and two sizes.
- `Slider`: a native range input with a styled track, a value readout and `formatValue` (also used for `aria-valuetext`).
- `Avatar` and `AvatarGroup`: profile pictures that fall back to initials or an icon (also when the image fails to load), in five sizes and two shapes, plus an overlapping group with a "+N" summary.
- `Carousel` (with `Carousel.Slide`): an image and content slider with previous/next buttons, slide picker dots, touch swipe, `loop`, and optional `autoPlay` that pauses on hover and focus and respects reduced motion.
- `Progress`: a progress bar with a label, value text, `formatValue`, an indeterminate mode, three sizes and four variants.
- `Skeleton`: text, circular and rectangular loading placeholders, with multi-line text and a subtle shimmer.
- `Spinner`: a loading indicator with a visually hidden label (`role="status"`) in three sizes, which can also be purely decorative.
- `Drawer`: a modal panel that slides in from the right, the left or the bottom, in three sizes, with the same focus trap, Escape, overlay-click and scroll-lock behavior as `Modal`.
- `Popover`: a non-modal dialog that opens from a button, with focus management and dismissal by Escape, a click outside and focus moving out.
- `Tooltip`: a short hint shown on hover and keyboard focus (WCAG 1.4.13), rendered in a portal and positioned so it flips and stays inside the viewport.
- `Accordion` (with `Accordion.Item`): collapsible sections with one or `multiple` open items and ↑ ↓ Home End navigation between headers.
- `Breadcrumb` (with `Breadcrumb.Item`): a labelled trail with `aria-current` on the current page, custom separators, `asChild` for router links and truncation of long labels.
- `Pagination`: Previous/Next and page buttons with ellipses for long ranges (`siblingCount`, `boundaryCount`), a stable number of buttons as the page moves, and translatable accessible names.
- `--cps-z-tooltip` design token, so tooltips stack above modals and toasts.

### Changed

- The library, documentation site and tooling are now written in plain JavaScript and JSX instead of TypeScript. Component behavior and the public API are unchanged.

### Removed

- TypeScript type declarations (`.d.ts` files) are no longer included in the package.

## [0.1.0] - 2026-09-25

### Added

- First release with 10 components: `Button`, `Input`, `Card`, `Badge`, `Alert`, `Modal`, `Dropdown`, `Tabs`, `Navbar` and `Toast` (with `ToastProvider` and `useToast`).
- `Button` `asChild` prop to render a link (or any element) with button styling.
- Design tokens as CSS custom properties, with light and dark themes (`data-cps-theme="dark"`).
- TypeScript types for every component and its props.
- ESM build that tree-shakes, plus a single stylesheet: `@codecps/ui/styles.css`.
- `"use client"` directives for React Server Components (Next.js App Router).
- Keyboard and screen reader support following the WAI-ARIA Authoring Practices.
- Responsive `Navbar` that collapses based on its own width (CSS container query), so it also adapts inside narrow layouts.
