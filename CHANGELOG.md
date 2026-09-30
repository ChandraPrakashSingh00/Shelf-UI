# Changelog

All notable changes to `@codecps/ui` are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project follows [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.1.0] - 2026-09-30

### Added

- First release, with 27 components. Each one has a documentation page with a live preview, examples, an API reference and keyboard and accessibility notes.
- Actions: `Button` (with `asChild` to render a link, or any element, with button styling) and `Dropdown`.
- Forms: `Input`, `Textarea`, `Select`, `Checkbox`, `RadioGroup` (with `Radio`), `Switch` and `Slider`. They're built on native form controls, so they submit and reset with their form.
- Data display: `Card`, `Badge`, `Avatar` (with `AvatarGroup`) and `Carousel`.
- Feedback: `Alert`, `Toast` (with `ToastProvider` and `useToast`), `Progress`, `Skeleton` and `Spinner`.
- Overlays: `Modal`, `Drawer`, `Popover` and `Tooltip`.
- Navigation: `Tabs`, `Navbar`, `Accordion`, `Breadcrumb` and `Pagination`.
- Design tokens as CSS custom properties, with light and dark themes (`data-cps-theme="dark"`).
- ESM build that tree-shakes, plus a single stylesheet: `@codecps/ui/styles.css`.
- `"use client"` directives for React Server Components (Next.js App Router).
- Keyboard and screen reader support following the WAI-ARIA Authoring Practices.
- Responsive `Navbar` that collapses based on its own width (CSS container query), so it also adapts inside narrow layouts.
