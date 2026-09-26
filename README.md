# CodeCPS UI

[![CI](https://github.com/ChandraPrakashSingh00/CodeCPS-UI-Library-/actions/workflows/ci.yml/badge.svg)](https://github.com/ChandraPrakashSingh00/CodeCPS-UI-Library-/actions/workflows/ci.yml)

Accessible React components from **CodeCPS Technologies**.

**Documentation:** https://code-cps-ui-library.vercel.app

`@codecps/ui` is the shared component library for CodeCPS products. It gives every
project the same buttons, forms, overlays and navigation, built once, tested once,
and styled with the CodeCPS design system.

- **Accessible by default.** Keyboard navigation, focus management and ARIA wiring
  follow the WAI-ARIA Authoring Practices.
- **Plain JavaScript.** Written in modern JavaScript and JSX, with sensible prop defaults
  and every prop documented.
- **Themeable.** Design tokens are CSS custom properties, with light and dark themes.
- **Lightweight.** No runtime dependencies besides React. ESM output that tree-shakes,
  plus a single stylesheet (~9 kB gzipped).
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

27 components, grouped as on the documentation site: actions, forms, data display, feedback,
overlays and navigation.

| Component      | Purpose                    | Key props |
| -------------- | -------------------------- | --------- |
| **Button**     | Actions                    | `variant`: primary · secondary · outline · ghost · danger; `size`: sm · md · lg; `loading`, `disabled`, `leftIcon`, `rightIcon`, `fullWidth`, `asChild` |
| **Dropdown**   | Menu button                | `trigger`, `items` (`id`, `label`, `icon`, `disabled`, `danger`, `onSelect`), `onSelect`, `align`, `label` |
| **Input**      | Labelled text field        | `label`, `helperText`, `error`, `size`, `required`, `disabled`, `leftIcon`, `rightIcon` |
| **Textarea**   | Multi-line text field      | `label`, `helperText`, `error`, `size`, `rows`, `resize`: vertical · none · both; `autoResize`, `showCount`, `maxLength`, `required`, `disabled` |
| **Select**     | Native select field        | `label`, `helperText`, `error`, `size`, `placeholder`, `options` (strings or `value`, `label`, `disabled`) or `<option>` children, `leftIcon`, `required`, `disabled` |
| **Checkbox**   | Checkable option           | `label`, `description`, `error`, `checked` / `defaultChecked` / `onCheckedChange`, `indeterminate`, `size`: sm · md; `required`, `disabled` |
| **RadioGroup** | Single choice from a list  | `label`, `description`, `error`, `value` / `defaultValue` / `onValueChange`, `name`, `orientation`: vertical · horizontal; `size`: sm · md; `required`, `disabled`; `Radio` (`value`, `label`, `description`, `disabled`) |
| **Switch**     | On/off setting             | `label`, `description`, `checked` / `defaultChecked` / `onCheckedChange`, `size`: sm · md; `required`, `disabled` |
| **Slider**     | Number from a range        | `label`, `helperText`, `value` / `defaultValue` / `onValueChange`, `min`, `max`, `step`, `showValue`, `formatValue`, `size`: sm · md; `disabled` |
| **Card**       | Content container          | `variant`: outlined · elevated · filled; `title`, `description`, `footer`; `Card.Header` · `Card.Title` · `Card.Description` · `Card.Content` · `Card.Footer` |
| **Badge**      | Status label               | `variant`: primary · success · warning · danger · neutral; `size`: sm · md |
| **Avatar**     | Profile picture            | `src`, `name` (initials, alt), `alt`, `fallback`; `size`: xs · sm · md · lg · xl; `shape`: circle · square; `AvatarGroup` (`max`, `size`, `label`) |
| **Carousel**   | Image and content slider   | `label`, `index` / `defaultIndex` / `onIndexChange`, `loop`, `autoPlay`, `interval`, `showArrows`, `showDots`; `Carousel.Slide` |
| **Alert**      | Inline message             | `variant`: info · success · warning · error; `title`, `description`, `action`, `onDismiss`, `icon` |
| **Toast**      | Notifications              | `ToastProvider` (`position`, `limit`, `defaultDuration`); `useToast()` → `toast()`, `dismiss()`, `dismissAll()` |
| **Progress**   | Progress bar               | `value` (omit for indeterminate), `max`, `label`, `showValue`, `formatValue`; `size`: sm · md · lg; `variant`: primary · success · warning · danger |
| **Skeleton**   | Loading placeholder        | `variant`: text · circular · rectangular; `width`, `height`, `lines`, `animated` |
| **Spinner**    | Loading indicator          | `size`: sm · md · lg; `label` (screen reader text; `""` makes it decorative) |
| **Modal**      | Dialog                     | `open`, `onClose`, `title`, `description`, `footer`, `size`, `closeOnEscape`, `closeOnOverlayClick`, `initialFocusRef` |
| **Drawer**     | Slide-in panel             | `open`, `onClose`, `side`: right · left · bottom; `size`: sm · md · lg; `title`, `description`, `footer`, `closeOnEscape`, `closeOnOverlayClick`, `initialFocusRef` |
| **Popover**    | Non-modal dialog           | `trigger`, `title` / `label`, `side`: bottom · top · left · right; `align`: start · center · end; `showCloseButton`, `initialFocusRef`, `open` / `defaultOpen` / `onOpenChange` |
| **Tooltip**    | Hover and focus hint       | `content`, `side`: top · right · bottom · left; `delay`, `open` / `defaultOpen` / `onOpenChange`, `disabled` |
| **Tabs**       | Tabbed panels              | `value` / `defaultValue` / `onValueChange`; `Tabs.List` · `Tabs.Tab` (`disabled`) · `Tabs.Panel` |
| **Accordion**  | Collapsible sections       | `value` / `defaultValue` / `onValueChange` (arrays of open items), `multiple`; `Accordion.Item` (`value`, `title`, `headingLevel`, `disabled`) |
| **Breadcrumb** | Page location trail        | `label`, `separator`; `Breadcrumb.Item` (`href`, `current`, `asChild`) |
| **Pagination** | Page navigation            | `totalPages`, `page` / `defaultPage` / `onPageChange`, `siblingCount`, `boundaryCount`, `size`: sm · md; `label`, `previousLabel`, `nextLabel`, `getPageLabel` |
| **Navbar**     | Responsive site header     | `sticky`, `label`; `Navbar.Brand` · `Navbar.Menu` · `Navbar.Links` · `Navbar.Link` (`active`, `asChild`) · `Navbar.Actions` |

Every component forwards unknown props (`id`, `data-*`, `aria-*`, event handlers) to its
root DOM element and merges `className`. The exceptions:

- **Form controls** (Input, Textarea, Select, Checkbox, Radio, Switch, Slider): `className` and
  `style` target the wrapper; everything else (and the `ref`) goes to the native `<input>`,
  `<textarea>` or `<select>`.
- **Modal, Drawer**: extra props go to the dialog panel, not the overlay (Drawer's `ref` too).
- **Popover**: extra props and the `ref` go to the popover panel.
- **Tooltip**: extra props and the `ref` go to its child, the trigger; `className` styles the
  tooltip itself. This lets a Tooltip be the `trigger` of a Dropdown or Popover.
- **Breadcrumb.Item**: extra props and the `ref` go to the link (or the current page's
  `<span>`), not the `<li>`.
- **Progress**: `aria-label`, `aria-labelledby` and `aria-describedby` go to the
  `role="progressbar"` element.
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

### Textarea and Select

```jsx
<Textarea
  label="Release notes"
  placeholder="What changed in this release?"
  showCount
  maxLength={500}
  autoResize
/>

<Select
  label="Region"
  placeholder="Choose a region"
  options={[
    { value: "ap-south-1", label: "Mumbai (ap-south-1)" },
    { value: "ap-southeast-1", label: "Singapore (ap-southeast-1)" },
    { value: "eu-central-1", label: "Frankfurt (eu-central-1)", disabled: true },
  ]}
  required
/>
```

Both are wired like `Input` (label, helper text, error). `autoResize` grows the textarea with
its content; cap it with a CSS `max-height` through `textareaClassName`. `Select` is a styled
native `<select>`, so keyboard support, autofill and mobile pickers come from the browser.
Without `options`, it renders its `<option>` and `<optgroup>` children.

### Checkbox, RadioGroup and Switch

```jsx
<Checkbox
  label="All environments"
  checked={allSelected}
  indeterminate={someSelected}
  onCheckedChange={(checked) => setSelected(checked ? allIds : [])}
/>

<RadioGroup label="Deployment region" defaultValue="mumbai" onValueChange={setRegion}>
  <Radio value="mumbai" label="Mumbai" />
  <Radio value="hyderabad" label="Hyderabad" description="Newest region" />
  <Radio value="singapore" label="Singapore" disabled />
</RadioGroup>

<Switch
  label="Auto-deploy"
  description="Deploy every push to the main branch."
  checked={autoDeploy}
  onCheckedChange={setAutoDeploy}
/>
```

All three are native inputs underneath, so they submit and reset with their form.
`onCheckedChange` and `onValueChange` receive the new value; a native `onChange` still works
and runs first. `indeterminate` is controlled, so update it from your state.

### Slider

```jsx
<Slider
  label="Monthly budget"
  min={1000}
  max={100000}
  step={1000}
  value={budget}
  onValueChange={setBudget}
  formatValue={(value) => `₹${value.toLocaleString("en-IN")}`}
/>
```

A native range input: the arrow keys, Page Up / Page Down, Home and End work out of the box.
`onValueChange` receives a number, and `formatValue` also sets `aria-valuetext`.

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

### Avatar and Carousel

```jsx
<Avatar src={user.photoUrl} name="Aditi Rao" />

<AvatarGroup max={4} label="Project members">
  {members.map((member) => (
    <Avatar key={member.id} src={member.photo} name={member.name} />
  ))}
</AvatarGroup>

<Carousel label="Featured projects" autoPlay interval={6000}>
  <Carousel.Slide>
    <img src={dashboard} alt="Project dashboard with traffic charts" />
  </Carousel.Slide>
  <Carousel.Slide>
    <img src={deployments} alt="Deployment pipeline going to production" />
  </Carousel.Slide>
</Carousel>
```

Without `src`, or when the image fails to load, an avatar shows `fallback`, the initials of
`name`, or a user icon. Pass `alt=""` when the name is already visible next to it.

Each child of `Carousel` is one `Carousel.Slide`. With `autoPlay`, rotation pauses on hover
and focus, has a stop/start button, and starts stopped for people who prefer reduced motion.

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

### Progress, Skeleton and Spinner

```jsx
<Progress label="Deploying codecps-web" value={62} showValue />
<Progress label="Preparing your workspace…" />

<div aria-busy={loading}>
  {loading ? <Skeleton lines={3} /> : <ProjectSummary project={project} />}
</div>

<Spinner size="lg" label="Loading build logs…" />
```

Leave out `value` for an indeterminate progress bar. Skeletons are hidden from screen readers,
so mark the loading region `aria-busy` and keep a text status. `Spinner` is a `role="status"`
with a visually hidden label; pass `label=""` when visible text already says what is loading.
For buttons, use `Button`'s `loading` prop instead.

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

### Drawer

```jsx
<Button onClick={() => setOpen(true)}>Filters</Button>
<Drawer
  open={open}
  onClose={() => setOpen(false)}
  title="Filter deployments"
  footer={<Button onClick={applyFilters}>Apply</Button>}
>
  …
</Drawer>
```

It behaves like `Modal`: focus trap, Escape, overlay click, scroll lock and focus restore. Use
`side="left"` for navigation or `side="bottom"` for a bottom sheet.

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

### Popover and Tooltip

```jsx
<Popover trigger={<Button variant="outline">Share</Button>} title="Share project">
  <Input label="Project link" value={shareUrl} readOnly />
  <Button onClick={copyLink}>Copy link</Button>
</Popover>

<Tooltip content="Copy a link to this deployment">
  <Button variant="outline" aria-label="Copy link">
    <LinkIcon />
  </Button>
</Tooltip>
```

`Popover` is a non-modal dialog: focus moves inside when it opens, and Escape (which returns
focus to the trigger), a click outside or tabbing out closes it. Its trigger follows the same
rules as Dropdown's. `Tooltip` shows on hover and keyboard focus and describes its trigger. It
supplements a label, so icon-only buttons still need an `aria-label`.

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

### Accordion, Breadcrumb and Pagination

```jsx
import { Link } from "react-router";

<Accordion defaultValue={["billing"]}>
  <Accordion.Item value="billing" title="How does billing work?">
    Each project is billed monthly: ₹999 on Starter and ₹2,499 on Pro.
  </Accordion.Item>
  <Accordion.Item value="refunds" title="Do you offer refunds?">
    Yes, within 14 days of your first payment.
  </Accordion.Item>
</Accordion>

<Breadcrumb>
  <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
  <Breadcrumb.Item asChild>
    <Link to="/projects">Projects</Link>
  </Breadcrumb.Item>
  <Breadcrumb.Item current>codecps-web</Breadcrumb.Item>
</Breadcrumb>

<Pagination totalPages={Math.ceil(projects.length / 10)} page={page} onPageChange={setPage} />
```

An accordion's `value` is the array of open items; one item is open at a time unless you add
`multiple`. Mark the last breadcrumb `current`; `asChild` renders your router's link. Long page
ranges collapse into ellipses around the current page (`siblingCount`) and at the ends
(`boundaryCount`).

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
- **Form controls**: Input, Textarea, Select, Checkbox, Radio, Switch (`role="switch"`) and
  Slider are native elements, so keyboard support and form participation come from the
  browser. Labels, descriptions and errors are linked via `htmlFor`, `aria-describedby` and
  `aria-invalid`; a radio group is a `<fieldset>` named by its legend.
- **Drawer**: a modal dialog with the same focus handling as Modal.
- **Popover**: a non-modal `role="dialog"`. Focus moves inside when it opens, and Escape
  closes it and returns focus to the trigger.
- **Tooltip**: `role="tooltip"`, linked to its trigger with `aria-describedby` while
  visible. It opens on hover and keyboard focus, stays open while hovered, and Escape hides
  it without moving focus (WCAG 1.4.13).
- **Accordion**: header buttons inside headings, with `aria-expanded` and `aria-controls`;
  open panels are labelled regions. ↑ ↓ Home End move between headers.
- **Carousel**: WAI-ARIA carousel with slides named "2 of 5", a "Choose slide" group and a
  stop/start button first in the Tab order. Rotation pauses on hover and focus, and doesn't
  start for people who prefer reduced motion.
- **Navbar, Breadcrumb, Pagination**: labelled `<nav>` landmarks. The current page has
  `aria-current="page"`; separators and ellipses are hidden from screen readers. The
  navbar's mobile toggle exposes `aria-expanded`, and Escape or a tap outside closes the menu.
- **Alert / Toast**: errors and warnings use `role="alert"`; info and success use the polite
  `role="status"`.
- **Progress / Spinner / Skeleton**: `role="progressbar"` with its value (and `aria-valuetext`
  from `formatValue`); a `role="status"` with a visually hidden label; skeletons are hidden
  from screen readers.
- All interactive elements have a visible `:focus-visible` outline, and animations respect
  `prefers-reduced-motion`.

## Framework notes

- **Next.js App Router.** Every module ships with `"use client"`, so components can be
  rendered from Server Components. In Server Components, use the named parts (`CardHeader`,
  `TabList`, `NavbarLink`, `AccordionItem`, …) instead of dot notation (`Card.Header`), because
  Next.js does not allow dotting into a client module from the server.
- **SSR.** Components render on the server. Modals, drawers, tooltips and toasts appear after
  hydration because they use portals.
- **Module format.** The package is ESM-only.

## Development

Requirements: **Node.js 22.22+** and npm 10+.

```bash
npm install           # install dev dependencies
npm run dev           # documentation site (opens in the browser) → http://localhost:5173
npm run playground    # playground: every component on one page, for quick checks
npm test              # run all tests (library and docs) once
npm run test:watch    # re-run tests on change
npm run lint          # ESLint (JavaScript, JSX and the rules of hooks)
npm run format        # format every file with Prettier
npm run format:check  # check formatting without changing files
npm run build         # build the package into dist/
npm run docs:build    # build the docs site into docs/dist/
npm run docs:preview  # serve the built docs site
```

`npm run build` and `npm run docs:build` always build for production, even when a machine
sets `NODE_ENV=development` globally. After the library build, `scripts/verify-dist.mjs`
fails the build if the output would break consumers, for example JSX compiled with React's
development runtime.

### Continuous integration

[`.github/workflows/ci.yml`](.github/workflows/ci.yml) runs on every push and pull request:
lint, format check, tests, the library build and the docs build. On `main`, once those pass,
it also publishes the docs site to GitHub Pages. That needs a one-time setting: repository
**Settings → Pages → Source: GitHub Actions**.

### Project structure

```
src/
├── components/        # one folder per public component
│   └── Button/
│       ├── Button.jsx         # implementation (props documented above the component)
│       ├── Button.css         # styles (registered in styles/index.css)
│       └── Button.test.jsx    # tests
├── hooks/             # internal hooks (focus trap, scroll lock, floating position, …)
├── icons/             # internal SVG icons
├── primitives/        # internal building blocks (Portal, Slot, Spinner, IconButton)
├── styles/            # design tokens, base and shared field styles, stylesheet entry
├── utils/             # helpers (cx, composeEventHandlers, mergeRefs, focus, pagination)
└── index.js           # public API — the only entry point consumers can import
docs/                  # documentation site (not published)
├── src/content/       # one file per component: examples, props, keyboard and a11y notes
├── src/examples/      # example files, rendered live and shown as code
├── src/pages/         # Home, Components, Installation, Changelog, About
└── vite.config.js
playground/            # scratch page for quick experiments (`npm run playground`)
scripts/verify-dist.mjs # checks the build output before it can be published
test/setup.js          # test environment setup
.github/workflows/     # CI and the docs deployment to GitHub Pages
eslint.config.js       # lint rules
.prettierrc.json       # formatting (Prettier, 100-character lines)
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
your host to serve `index.html` for every path (for example, a rewrite rule on Netlify; on
GitHub Pages, CI copies it to `404.html`). To serve it from a sub-path, set
`DOCS_BASE_PATH` when building, e.g. `DOCS_BASE_PATH=/my-repo/ npm run docs:build`.

**Vercel.** [`vercel.json`](vercel.json) configures the docs deployment: it builds with
`npm run docs:build`, serves `docs/dist/`, and rewrites every path to `index.html`. It also
turns off Vercel's framework detection, which would otherwise pick up the root
`vite.config.js` and build the library instead of the docs. Import the repository in Vercel
and keep the Root Directory at the repository root.

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
4. Run `npm run format`, then make sure `npm run lint`, `npm test`, `npm run build` and
   `npm run docs:build` all pass (CI runs the same checks).
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

- Dropdown menus and popovers are placed with CSS and don't reposition near the edges of the
  viewport yet. Tooltips do.
- A few built-in accessible texts are English-only: Carousel's slide names and buttons,
  AvatarGroup's "N more" and Textarea's character count. Other labels are props.
- Right-to-left layouts aren't fully supported yet (for example Carousel swipes and arrows).
- The package is ESM-only; there is no CommonJS build.

## License

[MIT](LICENSE) © CodeCPS Technologies
