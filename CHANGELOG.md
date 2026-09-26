# Changelog

All notable changes to `@codecps/ui` are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project follows [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

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
