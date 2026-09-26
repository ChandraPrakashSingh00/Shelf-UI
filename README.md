# CodeCPS UI

Accessible React components from **CodeCPS Technologies**.

`@codecps/ui` is the shared component library for CodeCPS products. It gives every
project the same buttons, forms, overlays and navigation, built once, tested once,
and styled with the CodeCPS design system.

- **Accessible by default.** Keyboard navigation, focus management and ARIA wiring
  follow the WAI-ARIA Authoring Practices.
- **Plain JavaScript.** Written in modern JavaScript and JSX, with sensible prop defaults
  and every prop documented.
- **Themeable.** Design tokens are CSS custom properties, with light and dark themes.
- **Lightweight.** No runtime dependencies besides React. ESM output that tree-shakes,
  plus a single stylesheet (~4 kB gzipped).
- **Framework-friendly.** SSR-safe, and ships `"use client"` for the Next.js App Router.

> Status: `0.1.0` (pre-release). The API may still change before `1.0`.

## Installation

```bash
npm install @codecps/ui
```

React and React DOM **18 or 19** are peer dependencies.

## Setup

Import the stylesheet once, in your app's entry file (for example `main.jsx`, or
`app/layout.js` in Next.js):

```jsx
import "@codecps/ui/styles.css";
```

Components use the [Inter](https://fonts.google.com/specimen/Inter) font when it is
available and fall back to the system UI font. Load Inter in your app for the intended look.

## Basic usage

```jsx
import { Button, Card, Input } from "@codecps/ui";

export function App() {
  return (
    <Card title="Start a project" description="Tell us where to send the proposal.">
      <Input label="Email" type="email" placeholder="Enter your email" required />
      <Button variant="primary">Start Project</Button>
    </Card>
  );
}
```

## Components

| Component    | Purpose                    | Key props                                                                                            |
| ------------ | -------------------------- | ---------------------------------------------------------------------------------------------------- |
| **Button**   | Actions                    | `variant`: primary · secondary · outline · ghost · danger; `size`: sm · md · lg; `loading`, `disabled`, `leftIcon`, `rightIcon`, `fullWidth`, `asChild` |
| **Input**    | Labelled text field        | `label`, `helperText`, `error`, `size`, `required`, `disabled`, `leftIcon`, `rightIcon`              |
| **Card**     | Content container          | `variant`: outlined · elevated · filled; `title`, `description`, `footer`; `Card.Header` · `Card.Title` · `Card.Description` · `Card.Content` · `Card.Footer` |
| **Badge**    | Status label               | `variant`: primary · success · warning · danger · neutral; `size`: sm · md                           |
| **Alert**    | Inline message             | `variant`: info · success · warning · error; `title`, `description`, `action`, `onDismiss`, `icon`   |
| **Modal**    | Dialog                     | `open`, `onClose`, `title`, `description`, `footer`, `size`, `closeOnEscape`, `closeOnOverlayClick`, `initialFocusRef` |
| **Dropdown** | Menu button                | `trigger`, `items` (`id`, `label`, `icon`, `disabled`, `danger`, `onSelect`), `onSelect`, `align`, `label` |
| **Tabs**     | Tabbed panels              | `value` / `defaultValue` / `onValueChange`; `Tabs.List` · `Tabs.Tab` (`disabled`) · `Tabs.Panel`     |
| **Navbar**   | Responsive site header     | `sticky`, `label`; `Navbar.Brand` · `Navbar.Menu` · `Navbar.Links` · `Navbar.Link` (`active`, `asChild`) · `Navbar.Actions` |
| **Toast**    | Notifications              | `ToastProvider` (`position`, `limit`, `defaultDuration`); `useToast()` → `toast()`, `dismiss()`, `dismissAll()` |

Every component forwards unknown props (`id`, `data-*`, `aria-*`, event handlers) to its
root DOM element and merges `className`. The exceptions:

- **Input**: `className` and `style` target the field wrapper; everything else (and the `ref`) goes to the `<input>`.
- **Modal**: extra props go to the dialog panel, not the overlay.
- **Dropdown**: takes only the props listed above.

### Button

```jsx
<Button variant="primary" size="md">Start Project</Button>
<Button variant="outline" leftIcon={<PlusIcon />}>New project</Button>
<Button loading>Saving</Button>
```

`Button` renders a native `<button>` with `type="button"` by default, so it never submits a
form by accident. Pass `type="submit"` for submit buttons.

For navigation, render a link with button styling using `asChild`:

```jsx
import { Link } from "react-router";

<Button asChild>
  <Link to="/pricing">View pricing</Link>
</Button>
```

### Input

```jsx
<Input
  label="Email"
  type="email"
  placeholder="Enter your email"
  helperText="We never share your email."
  error={emailError} // string shows a message; `true` marks the field invalid
  required
/>
```

### Card

```jsx
<Card>
  <Card.Header>
    <Card.Title>Starter</Card.Title>
    <Card.Description>For freelancers and small teams.</Card.Description>
  </Card.Header>
  <Card.Content>5 projects · 10 GB storage</Card.Content>
  <Card.Footer>
    <Button>Choose plan</Button>
  </Card.Footer>
</Card>

{/* Shorthand */}
<Card title="Deployments" description="Last 24 hours" footer={<Button size="sm">View all</Button>}>
  12 successful · 1 failed
</Card>
```

`Card.Title` renders an `<h3>`. Use `as="h2"` (or any heading level) to fit your page outline.

### Badge and Alert

```jsx
<Badge variant="success">Active</Badge>

<Alert
  variant="error"
  title="Deployment failed"
  description="Build exited with code 1."
  action={<Button size="sm" variant="outline">View logs</Button>}
  onDismiss={() => setVisible(false)}
/>
```

### Modal

```jsx
const [open, setOpen] = useState(false);

<Button onClick={() => setOpen(true)}>Delete project</Button>
<Modal
  open={open}
  onClose={() => setOpen(false)}
  title="Delete project?"
  description="This action cannot be undone."
  footer={
    <>
      <Button variant="secondary" onClick={() => setOpen(false)}>Cancel</Button>
      <Button variant="danger" onClick={deleteProject}>Delete</Button>
    </>
  }
/>
```

### Dropdown

```jsx
<Dropdown
  trigger={<Button variant="outline">Actions</Button>}
  items={[
    { id: "edit", label: "Edit" },
    { id: "transfer", label: "Transfer", disabled: true },
    { id: "delete", label: "Delete", danger: true },
  ]}
  onSelect={(id) => handleAction(id)}
/>
```

The trigger can be any element that passes `id`, `onClick`, `onKeyDown` and `aria-*` props
through to a focusable element, as `Button` does.

### Tabs

```jsx
<Tabs defaultValue="overview">
  <Tabs.List aria-label="Project">
    <Tabs.Tab value="overview">Overview</Tabs.Tab>
    <Tabs.Tab value="settings">Settings</Tabs.Tab>
    <Tabs.Tab value="billing" disabled>Billing</Tabs.Tab>
  </Tabs.List>
  <Tabs.Panel value="overview">…</Tabs.Panel>
  <Tabs.Panel value="settings">…</Tabs.Panel>
  <Tabs.Panel value="billing">…</Tabs.Panel>
</Tabs>
```

### Navbar

```jsx
import { Link } from "react-router";

<Navbar sticky>
  <Navbar.Brand asChild>
    <Link to="/">CodeCPS UI</Link>
  </Navbar.Brand>
  <Navbar.Menu>
    <Navbar.Links>
      <Navbar.Link asChild active={pathname === "/"}>
        <Link to="/">Home</Link>
      </Navbar.Link>
      <Navbar.Link href="/docs">Documentation</Navbar.Link>
    </Navbar.Links>
    <Navbar.Actions>
      <Button variant="ghost">Login</Button>
      <Button>Get Started</Button>
    </Navbar.Actions>
  </Navbar.Menu>
</Navbar>
```

When the navbar is narrower than 768px, the menu collapses behind a toggle button. This
is based on the navbar's own width (a CSS container query), so it also works inside narrow
layouts. `asChild` renders your router's link component instead of a plain `<a>`, merging
the library's classes and props onto it.

### Toast

```jsx
import { ToastProvider, useToast } from "@codecps/ui";

function Root() {
  return (
    <ToastProvider position="bottom-right">
      <App />
    </ToastProvider>
  );
}

function SaveButton() {
  const { toast } = useToast();
  return (
    <Button onClick={() => toast({ variant: "success", title: "Saved", message: "Your changes are live." })}>
      Save
    </Button>
  );
}
```

Toasts auto-dismiss after 5 seconds by default. The timer pauses while a toast is hovered or
focused. Pass `duration: Infinity` to keep one open until it is dismissed.

## Theming

All colors, radii, font sizes and control heights are CSS custom properties prefixed with
`--cps-`. Override them on `:root` to theme the whole app. The docs site's Installation page
has a live theme builder that generates this CSS for you.

```css
:root {
  --cps-color-primary: #086ffd;
  --cps-radius-md: 10px;
  --cps-font-sans: "Inter", system-ui, sans-serif;
}
```

| Token                                          | Default                  | Used for                           |
| ---------------------------------------------- | ------------------------ | ---------------------------------- |
| `--cps-color-primary`                          | `#086FFD` (CodeCPS blue) | Primary buttons, links, focus      |
| `--cps-color-text`                             | `#191B1F` (CodeCPS dark) | Body text                          |
| `--cps-color-bg`, `--cps-color-surface`        | `#FFFFFF`                | Page and component backgrounds     |
| `--cps-radius-sm` / `-md` / `-lg`              | 6px / 8px / 12px         | Corner radius                      |
| `--cps-control-height-sm` / `-md` / `-lg`      | 32px / 40px / 48px       | Button and input heights           |
| `--cps-font-sans`                              | Inter, system fonts      | All component text                 |

See [`src/styles/tokens.css`](src/styles/tokens.css) for the full list. You can also set
tokens on a single container, but tokens defined in terms of others (like
`--cps-color-info`, which follows `--cps-color-primary`) must then be set on that container too.

**Dark mode.** Add `data-cps-theme="dark"` to the `<html>` element. Setting it on `<html>`
(rather than a nested container) makes sure modals and toasts, which render into
`document.body`, use the same theme.

```html
<html data-cps-theme="dark"></html>
```

## Accessibility

- Components use native elements (`<button>`, `<input>`, `<label>`, `<nav>`, headings)
  wherever possible. ARIA is added only where HTML has no equivalent.
- **Button**: while `loading`, the button stays focusable (`aria-disabled` + `aria-busy`
  instead of `disabled`), so keyboard users don't lose their place.
- **Modal**: `role="dialog"` with `aria-modal`; named by its title and described by its
  description. Focus moves into the dialog (to `initialFocusRef`, an `autoFocus` field, or
  the first focusable element) and is trapped there. Escape closes it, and focus returns to
  the element that opened it. Page scroll is locked while it is open.
- **Dropdown**: WAI-ARIA menu button. Enter, Space and ↓ open the menu; ↑ opens it on the
  last item. ↑ ↓ Home End move between items, skipping disabled ones. Escape closes the menu
  and returns focus to the trigger.
- **Tabs**: WAI-ARIA tabs with a roving tabindex. ← → Home End move between tabs and select
  them, skipping disabled tabs.
- **Input**: labels, helper text and errors are linked via `htmlFor`,
  `aria-describedby` and `aria-invalid`.
- **Navbar**: a labelled `<nav>` landmark. The mobile toggle exposes `aria-expanded`, and
  Escape or a tap outside closes the menu.
- **Alert / Toast**: errors and warnings use `role="alert"`; info and success use the polite
  `role="status"`.
- All interactive elements have a visible `:focus-visible` outline, and animations respect
  `prefers-reduced-motion`.

## Framework notes

- **Next.js App Router.** Every module ships with `"use client"`, so components can be
  rendered from Server Components. In Server Components, use the named parts (`CardHeader`,
  `TabList`, `NavbarLink`, …) instead of dot notation (`Card.Header`), because Next.js does
  not allow dotting into a client module from the server.
- **SSR.** Components render on the server. Modals and toasts appear after hydration because
  they use portals.
- **Module format.** The package is ESM-only.

## Development

Requirements: **Node.js 22.22+** and npm 10+.

```bash
npm install           # install dev dependencies
npm run docs:dev      # documentation site → http://localhost:5173
npm run dev           # playground: one scratch page with every component
npm test              # run all tests (library and docs) once
npm run test:watch    # re-run tests on change
npm run build         # build the package into dist/
npm run docs:build    # build the docs site into docs/dist/
npm run docs:preview  # serve the built docs site
```

`npm run build` and `npm run docs:build` always build for production, even when a machine
sets `NODE_ENV=development` globally. After the library build, `scripts/verify-dist.mjs`
fails the build if the output would break consumers, for example JSX compiled with React's
development runtime.

### Project structure

```
src/
├── components/        # one folder per public component
│   └── Button/
│       ├── Button.jsx         # implementation (props documented above the component)
│       ├── Button.css         # styles (registered in styles/index.css)
│       └── Button.test.jsx    # tests
├── hooks/             # internal hooks (focus trap, scroll lock, controllable state, …)
├── icons/             # internal SVG icons
├── primitives/        # internal building blocks (Portal, Slot, Spinner, IconButton)
├── styles/            # design tokens, base styles, stylesheet entry
├── utils/             # helpers (cx, composeEventHandlers, mergeRefs, focus)
└── index.js           # public API — the only entry point consumers can import
docs/                  # documentation site (not published)
├── src/content/       # one file per component: examples, props, keyboard and a11y notes
├── src/examples/      # example files, rendered live and shown as code
├── src/pages/         # Home, Components, Installation, Changelog
└── vite.config.js
playground/            # scratch page for quick experiments (`npm run dev`)
scripts/verify-dist.mjs # checks the build output before it can be published
test/setup.js          # test environment setup
vite.config.js         # library build and playground dev server
vitest.config.js       # test runner (library and docs tests)
CHANGELOG.md           # release notes, also shown on the docs site
```

### Documentation site

`docs/` is a Vite + React Router app that renders the library from `src/`, so it always shows
the current code. Each component page is generated from
`docs/src/content/components/<name>.jsx`:

- **Examples** live in `docs/src/examples/<name>/`. Each file is rendered as a live preview and
  imported with `?raw` to show its source, so the code on the page is exactly the code that runs.
- **Props tables** are plain data in the same file. When you add, rename or remove a prop,
  update its row there (and the comment above the component) in the same change.

`npm run docs:build` outputs a static site in `docs/dist/`. It's a single-page app, so configure
your host to serve `index.html` for every path (for example, a rewrite rule on Vercel or
Netlify).

### Build output

`npm run build` produces:

- `dist/index.js`, with one ES module per source file so bundlers can tree-shake
- `dist/styles.css`, the complete stylesheet

Only `dist/` is included in the published package. To try the package in another app before
publishing, run `npm pack` and install the generated `.tgz` file there.

## Contributing

1. Create a branch from `main` (`feat/<name>`, `fix/<name>`).
2. Make your change, following the conventions below.
3. For changes users will notice, add a line under `## [Unreleased]` in `CHANGELOG.md`.
4. Make sure `npm test`, `npm run build` and `npm run docs:build` all pass.
5. Open a pull request that describes what changed and why. Include screenshots for visual
   changes.

**Adding a component**

1. Create `src/components/<Name>/` with `<Name>.jsx`, `<Name>.css` and `<Name>.test.jsx`.
2. Register the stylesheet in `src/styles/index.css`.
3. Export the component from `src/index.js`.
4. Document it: add examples in `docs/src/examples/<name>/`, a page in
   `docs/src/content/components/<name>.jsx`, and register the page in
   `docs/src/content/components/index.js`. The docs tests then render every example.
5. Test behaviour, not implementation: rendering, props and variants, keyboard interaction and
   accessibility semantics.

**Conventions**

- Style with design tokens (`var(--cps-…)`). Don't hard-code colors.
- Class names use the `cps-` prefix with BEM-style modifiers (`cps-button--primary`).
- Forward refs to the main DOM element, spread remaining props onto it, and merge `className`
  with `cx`.
- Prefer native HTML semantics. Add ARIA only when HTML can't express the behaviour.
- Plain JavaScript and JSX only (`.js` / `.jsx`), with explicit file extensions in relative
  imports.
- Give props their defaults in the destructuring (`variant = "primary"`), and describe each
  prop in the comment above the component.
- Discuss new runtime dependencies before adding them.

## Current limitations

- Dropdown menus open below the trigger and don't reposition near the edges of the viewport yet.
- The package is ESM-only; there is no CommonJS build.

## License

[MIT](LICENSE) © CodeCPS Technologies
