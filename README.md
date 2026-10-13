# Shelf UI

[![CI](https://github.com/ChandraPrakashSingh00/shelf-ui/actions/workflows/ci.yml/badge.svg)](https://github.com/ChandraPrakashSingh00/shelf-ui/actions/workflows/ci.yml)

Off-the-shelf, accessible React components, made to fit your brand.

`@shelf-ui/react` gives every project the same buttons, forms, overlays and navigation,
built once, tested once, and styled with design tokens you can make your own.

To browse the documentation site locally, with live previews of every component, run
`npm install` and `npm run dev` in this repository.

- **Accessible by default.** Keyboard navigation, focus management and ARIA wiring
  follow the WAI-ARIA Authoring Practices.
- **Plain JavaScript.** Written in modern JavaScript and JSX, with sensible prop defaults
  and every prop documented.
- **Themeable.** Design tokens are CSS custom properties, with light and dark themes.
- **Lightweight.** No runtime dependencies besides React. ESM output that tree-shakes,
  plus a single stylesheet (~18 kB gzipped).
- **Framework-friendly.** SSR-safe, and ships `"use client"` for the Next.js App Router.

> Status: `0.3.0` (pre-release). The API may still change before `1.0`.

## Installation

```bash
npm install @shelf-ui/react
```

React and React DOM **18 or 19** are peer dependencies.

## Setup

Import the stylesheet once, in your app's entry file (for example `main.jsx`, or
`app/layout.js` in Next.js):

```jsx
import "@shelf-ui/react/styles.css";
```

Components use the [Inter](https://fonts.google.com/specimen/Inter) font when it is
available and fall back to the system UI font. Load Inter in your app for the intended look.

## Basic usage

```jsx
import { Button, Card, Input } from "@shelf-ui/react";

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

50 components, grouped as on the documentation site: actions, forms, data display, feedback,
overlays and navigation.

| Component           | Purpose                     | Key props |
| ------------------- | --------------------------- | --------- |
| **Button**          | Actions                     | `variant`: primary · secondary · outline · ghost · danger; `size`: sm · md · lg; `loading`, `disabled`, `leftIcon`, `rightIcon`, `fullWidth`, `asChild` |
| **IconButton**      | Icon-only button            | `label` (required), `variant`: ghost · secondary · outline · primary · danger; `size`: sm · md · lg; `shape`: square · circle; `pressed`, `tooltip`, `tooltipSide`, `loading`, `disabled`, `asChild` |
| **Dropdown**        | Menu button                 | `trigger`, `items` (`id`, `label`, `icon`, `disabled`, `danger`, `onSelect`), `onSelect`, `align`, `label` |
| **Input**           | Labelled text field         | `label`, `helperText`, `error`, `size`, `required`, `disabled`, `leftIcon`, `rightIcon` |
| **Textarea**        | Multi-line text field       | `label`, `helperText`, `error`, `size`, `rows`, `resize`: vertical · none · both; `autoResize`, `showCount`, `maxLength`, `required`, `disabled` |
| **Select**          | Native select field         | `label`, `helperText`, `error`, `size`, `placeholder`, `options` (strings or `value`, `label`, `disabled`) or `<option>` children, `leftIcon`, `required`, `disabled` |
| **Checkbox**        | Checkable option            | `label`, `description`, `error`, `checked` / `defaultChecked` / `onCheckedChange`, `indeterminate`, `size`: sm · md; `required`, `disabled` |
| **RadioGroup**      | Single choice from a list   | `label`, `description`, `error`, `value` / `defaultValue` / `onValueChange`, `name`, `orientation`: vertical · horizontal; `size`: sm · md; `required`, `disabled`; `Radio` (`value`, `label`, `description`, `disabled`) |
| **Switch**          | On/off setting              | `label`, `description`, `checked` / `defaultChecked` / `onCheckedChange`, `size`: sm · md; `required`, `disabled` |
| **Slider**          | Number from a range         | `label`, `helperText`, `value` / `defaultValue` / `onValueChange`, `min`, `max`, `step`, `showValue`, `formatValue`, `size`: sm · md; `disabled` |
| **Combobox**        | Searchable option picker    | `label`, `helperText`, `error`, `size`: sm · md · lg; `options` (strings or `value`, `label`, `description`, `disabled`), `value` / `defaultValue` / `onValueChange`, `inputValue` / `onInputChange`, `filter`, `emptyMessage`, `loading`, `clearable`, `openOnFocus`, `name`, `required`, `disabled` |
| **Calendar**        | Inline month calendar       | `mode`: single · range; `value` / `defaultValue` / `onValueChange`, `month` / `defaultMonth` / `onMonthChange`, `min`, `max`, `isDateDisabled`, `weekStartsOn`, `locale`, `showOutsideDays`, `label`, `name` |
| **DatePicker**      | Date field with calendar    | `label`, `helperText`, `error`, `size`: sm · md · lg; `mode`: single · range; `value` / `defaultValue` / `onValueChange`, `min`, `max`, `isDateDisabled`, `formatDate`, `presets`, `name`, `clearable`, `closeOnSelect`, `open` / `defaultOpen` / `onOpenChange`, `align`: start · end; `required`, `disabled` |
| **NumberInput**     | Number stepper field        | `label`, `helperText`, `error`, `value` / `defaultValue` / `onValueChange`, `min`, `max`, `step`, `largeStep`, `precision`, `formatValue`, `clampOnBlur`, `allowEmpty`, `variant`: default · compact; `size`: sm · md · lg; `name`, `required`, `disabled`, `readOnly` |
| **PinInput**        | OTP and PIN codes           | `length`, `value` / `defaultValue` / `onValueChange`, `onComplete`, `type`: numeric · alphanumeric; `mask`, `placeholder`, `label`, `helperText`, `error`, `getInputLabel`, `size`: sm · md · lg; `otp`, `name`, `required`, `disabled`, `autoFocus` |
| **FileUpload**      | Drag-and-drop file picker   | `label`, `helperText`, `error`, `value` / `defaultValue` / `onValueChange`, `onReject`, `accept`, `multiple`, `maxSize`, `maxFiles`, `showPreview`, `browseText`, `dropText`, `getRemoveLabel`, `name`, `required`, `disabled` |
| **Rating**          | Star rating                 | `value` / `defaultValue` / `onValueChange`, `max`, `label`, `helperText`, `error`, `getLabel`, `clearable`, `size`: sm · md · lg; `name`, `required`, `disabled`, `readOnly`, `showValue`, `count`, `formatCount` |
| **ToggleGroup**     | Toggle button set           | `type`: single · multiple; `value` / `defaultValue` / `onValueChange`, `allowDeselect`, `label`, `name`, `size`: sm · md · lg; `variant`: outline · ghost; `orientation`: horizontal · vertical; `fullWidth`, `disabled`; `ToggleGroup.Item` (`value`, `disabled`) |
| **Card**            | Content container           | `variant`: outlined · elevated · filled; `title`, `description`, `footer`; `Card.Header` · `Card.Title` · `Card.Description` · `Card.Content` · `Card.Footer` |
| **Badge**           | Status label                | `variant`: primary · success · warning · danger · neutral; `size`: sm · md |
| **Avatar**          | Profile picture             | `src`, `name` (initials, alt), `alt`, `fallback`; `size`: xs · sm · md · lg · xl; `shape`: circle · square; `AvatarGroup` (`max`, `size`, `label`) |
| **Carousel**        | Image and content slider    | `label`, `index` / `defaultIndex` / `onIndexChange`, `loop`, `autoPlay`, `interval`, `showArrows`, `showDots`; `Carousel.Slide` |
| **Table**           | Sortable data table         | `columns` (`key`, `header`, `accessor`, `render`, `sortable`, `sortFn`, `align`, `numeric`, `rowHeader`, `width`, `footer`), `data`, `getRowId`, `caption`, `sort` / `defaultSort` / `onSortChange`, `manualSort`, `selectable`, `selectedIds` / `defaultSelectedIds` / `onSelectionChange`, `isRowSelectable`, `getRowLabel`, `emptyState`, `loading`, `size`: sm · md; `striped`, `hoverable`, `bordered`, `stickyHeader`, `maxHeight` |
| **Tag**             | Removable label or filter   | `variant`: neutral · primary · success · warning · danger; `size`: sm · md; `icon`, `onRemove`, `removeLabel`, `disabled` |
| **Divider**         | Content separator           | `orientation`: horizontal · vertical; `label`, `labelPosition`: start · center · end; `variant`: solid · dashed; `spacing`: sm · md · lg; `decorative` |
| **Stat**            | Dashboard metric            | `label`, `value`, `change`, `formatChange`, `changeLabel`, `higherIsBetter`, `icon`, `description`, `loading`, `variant`: card · plain; `size`: sm · md |
| **Timeline**        | Order tracking and history  | `orientation`: vertical · horizontal; `size`: sm · md; `statusLabels`; `Timeline.Item` (`title`, `description`, `time`, `dateTime`, `status`: complete · current · upcoming · error; `icon`) |
| **EmptyState**      | Empty view placeholder      | `title`, `description`, `icon`, `image`, `actions`, `headingLevel`, `size`: sm · md · lg; `variant`: plain · bordered; `tone`: neutral · primary · success · warning · danger; `align`: center · start |
| **DescriptionList** | Term–value pairs            | `items`, `layout`: horizontal · vertical; `columns`: 1 · 2 · 3; `divided`, `size`: sm · md; `align`: start · end; `termWidth`; `DescriptionList.Item` (`term`, `fullWidth`) |
| **Kbd**             | Keyboard key or shortcut    | `children` (one key) or `keys` (combination), `separator`, `size`: sm · md |
| **Alert**           | Inline message              | `variant`: info · success · warning · error; `title`, `description`, `action`, `onDismiss`, `icon` |
| **Toast**           | Notifications               | `ToastProvider` (`position`, `limit`, `defaultDuration`); `useToast()` → `toast()`, `dismiss()`, `dismissAll()` |
| **Progress**        | Progress bar                | `value` (omit for indeterminate), `max`, `label`, `showValue`, `formatValue`; `size`: sm · md · lg; `variant`: primary · success · warning · danger |
| **Skeleton**        | Loading placeholder         | `variant`: text · circular · rectangular; `width`, `height`, `lines`, `animated` |
| **Spinner**         | Loading indicator           | `size`: sm · md · lg; `label` (screen reader text; `""` makes it decorative) |
| **Banner**          | Announcement bar            | `variant`: primary · info · success · warning · danger · neutral; `title`, `icon`, `action`, `onDismiss`, `dismissLabel`, `sticky`, `align`: center · start; `label` |
| **Modal**           | Dialog                      | `open`, `onClose`, `title`, `description`, `footer`, `size`, `closeOnEscape`, `closeOnOverlayClick`, `initialFocusRef` |
| **Drawer**          | Slide-in panel              | `open`, `onClose`, `side`: right · left · bottom; `size`: sm · md · lg; `title`, `description`, `footer`, `closeOnEscape`, `closeOnOverlayClick`, `initialFocusRef` |
| **Popover**         | Non-modal dialog            | `trigger`, `title` / `label`, `side`: bottom · top · left · right; `align`: start · center · end; `showCloseButton`, `initialFocusRef`, `open` / `defaultOpen` / `onOpenChange` |
| **Tooltip**         | Hover and focus hint        | `content`, `side`: top · right · bottom · left; `delay`, `open` / `defaultOpen` / `onOpenChange`, `disabled` |
| **AlertDialog**     | Confirmation dialog         | `open`, `onClose`, `onConfirm` (may return a promise), `title`, `description`, `confirmLabel`, `cancelLabel`, `variant`: danger · primary; `icon`, `loading`, `confirmDisabled`, `closeOnConfirm`, `closeOnOverlayClick`, `closeOnEscape`, `size`: sm · md; `initialFocusRef` |
| **CommandPalette**  | Ctrl + K command menu       | `items` (`id`, `label`, `description`, `icon`, `group`, `keywords`, `shortcut`, `disabled`, `onSelect`), `onSelect`, `open` / `defaultOpen` / `onOpenChange`, `hotkey`, `closeOnSelect`, `filter`, `placeholder`, `emptyMessage`, `label`, `footer` |
| **Tabs**            | Tabbed panels               | `value` / `defaultValue` / `onValueChange`; `Tabs.List` · `Tabs.Tab` (`disabled`) · `Tabs.Panel` |
| **Accordion**       | Collapsible sections        | `value` / `defaultValue` / `onValueChange` (arrays of open items), `multiple`; `Accordion.Item` (`value`, `title`, `headingLevel`, `disabled`) |
| **Breadcrumb**      | Page location trail         | `label`, `separator`; `Breadcrumb.Item` (`href`, `current`, `asChild`) |
| **Pagination**      | Page navigation             | `totalPages`, `page` / `defaultPage` / `onPageChange`, `siblingCount`, `boundaryCount`, `size`: sm · md; `label`, `previousLabel`, `nextLabel`, `getPageLabel` |
| **Navbar**          | Responsive site header      | `sticky`, `label`; `Navbar.Brand` · `Navbar.Menu` · `Navbar.Links` · `Navbar.Link` (`active`, `asChild`) · `Navbar.Actions` |
| **Stepper**         | Multi-step progress         | `steps` (`id`, `title`, `description`, `optional`, `status`), `activeStep`, `onStepClick`, `orientation`: horizontal · vertical; `size`: sm · md; `label`, `statusLabels`, `optionalLabel` |
| **Sidebar**         | Collapsible side navigation | `label`, `collapsed` / `defaultCollapsed` / `onCollapsedChange`, `width`, `collapsedWidth`; `Sidebar.Header` · `Sidebar.Content` · `Sidebar.Section` (`title`) · `Sidebar.Item` (`icon`, `href`, `active`, `badge`, `disabled`, `asChild`, `tooltip`) · `Sidebar.Group` (`label`, `icon`, `open` / `defaultOpen` / `onOpenChange`) · `Sidebar.Footer` · `Sidebar.Toggle` |
| **Link**            | Styled text link            | `href`, `variant`: primary · muted · inherit; `underline`: hover · always · none; `external`, `externalLabel`, `showExternalIcon`, `asChild` |

Every component forwards unknown props (`id`, `data-*`, `aria-*`, event handlers) to its
root DOM element and merges `className`. The exceptions:

- **Form controls** (Input, Textarea, Select, Checkbox, Radio, Switch, Slider, Combobox,
  NumberInput, FileUpload): `className` and `style` target the wrapper; everything else (and the
  `ref`) goes to the native `<input>`, `<textarea>` or `<select>`. FileUpload's is its visually
  hidden file input.
- **DatePicker**: `className` and `style` target the wrapper; everything else (and the `ref`)
  goes to the field's `<button>`.
- **PinInput**: `className` and `style` target the wrapper, other props go to the
  `role="group"`, and the `ref` goes to the first box.
- **Modal, Drawer, AlertDialog, CommandPalette**: extra props go to the dialog panel, not the
  overlay (for Drawer, AlertDialog and CommandPalette, the `ref` too).
- **Popover**: extra props and the `ref` go to the popover panel.
- **Tooltip**: extra props and the `ref` go to its child, the trigger; `className` styles the
  tooltip itself. This lets a Tooltip be the `trigger` of a Dropdown or Popover.
- **Breadcrumb.Item, Sidebar.Item**: extra props and the `ref` go to the link (or the current
  page's `<span>`, or the item's `<button>`), not the `<li>`.
- **Table**: extra props and the `ref` go to the `<table>`; `className` and `style` go to the
  scrolling container.
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

### IconButton

```jsx
<IconButton label="Add to wishlist" pressed={saved} onClick={() => setSaved(!saved)} tooltip>
  <HeartIcon />
</IconButton>

<IconButton label="Share" variant="outline" shape="circle">
  <ShareIcon />
</IconButton>
```

An icon-only button with Button's variants and sizes. `label` is required: it becomes the
accessible name, and the icon is hidden from screen readers. `pressed` makes it a toggle
(`aria-pressed`), and `tooltip` also shows the label on hover and keyboard focus.

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

### Combobox

```jsx
<Combobox
  label="Delivery city"
  placeholder="Search cities"
  options={["Bengaluru", "Chennai", "Delhi", "Mumbai", "Pune"]}
  value={city}
  onValueChange={setCity}
  name="city"
/>
```

Typing filters the options, ignoring case and accents; ↓ / ↑ and Enter pick one, and the value
is always one of the options (or `null`). With `required`, the form won't submit until an option
is picked; typed text alone doesn't count. Use `{ value, label, description, disabled }` objects
for richer options. For server-side search, pass `filter={null}` with `loading` and
`onInputChange(text, reason)`.

### Calendar and DatePicker

```jsx
<Calendar
  label="Delivery date"
  value={date}
  onValueChange={setDate}
  min={tomorrow}
  isDateDisabled={(day) => day.getDay() === 0}
  weekStartsOn={1}
/>

<DatePicker
  mode="range"
  label="Report period"
  name="report"
  value={period}
  onValueChange={setPeriod}
  presets={[{ label: "Last 7 days", value: { start: weekAgo, end: today } }]}
/>
```

Dates are local `Date` objects at midnight, and `mode="range"` uses `{ start, end }`. The
calendar follows the WAI-ARIA date grid pattern: arrow keys, Home / End, Page Up / Page Down
(with Shift for years) and Enter. `DatePicker` is a field button that opens the calendar in a
non-modal popup, shows the value in the user's locale ("6–12 Oct 2026"), and submits
`YYYY-MM-DD` (`reportStart` / `reportEnd` for a range).

### NumberInput and PinInput

```jsx
<NumberInput label="Quantity" min={1} max={10} value={quantity} onValueChange={setQuantity} />

<PinInput label="Enter OTP" length={6} onComplete={verifyOtp} />
```

`NumberInput` is a spinbutton with − / + buttons: ↑ / ↓, Page Up / Page Down, Home and End step
the value, and the mouse wheel never changes it. `onValueChange` receives a number, or `null`
when the field is empty. `formatValue` shows e.g. "₹2,499" while the field isn't focused (and
sets `aria-valuetext`), and `variant="compact"` is the − 1 + pill for carts.

`PinInput` has one box per character: typing moves forward, Backspace moves back, and pasting or
SMS autofill fills every box. `onComplete` fires when the last box is filled, and `name` submits
the whole code through a hidden input.

### FileUpload

```jsx
<FileUpload
  label="Product images"
  multiple
  accept="image/png,image/jpeg"
  maxSize={5 * 1024 * 1024}
  maxFiles={6}
  helperText="PNG or JPG, up to 5 MB each."
  onValueChange={setImages}
/>
```

Picked and dropped files are validated the same way; rejected files are listed with the reason
and passed to `onReject`. A visually hidden native file input keeps keyboard access and normal
form submission. It doesn't upload anything itself: send `value` to your server.

### Rating and ToggleGroup

```jsx
<Rating label="Rate this product" value={rating} onValueChange={setRating} />
<Rating readOnly value={4.3} showValue count={1284} />

<ToggleGroup label="Size" name="size" defaultValue="m">
  <ToggleGroup.Item value="s">S</ToggleGroup.Item>
  <ToggleGroup.Item value="m">M</ToggleGroup.Item>
  <ToggleGroup.Item value="xl" disabled>XL</ToggleGroup.Item>
</ToggleGroup>
```

An interactive `Rating` is a group of native radio buttons, so arrow keys and forms work without
extra code. `readOnly` shows a fractional average as one image named "Rated 4.3 out of 5,
1,284 ratings".

`ToggleGroup` is a set of toggle buttons where one (`type="single"`, the default) or several
(`type="multiple"`) can be pressed. It's a single Tab stop, the arrow keys move between items,
and `name` submits the value with a form.

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

### Table

```jsx
const columns = [
  { key: "id", header: "Order", rowHeader: true, render: (order) => `#${order.id}` },
  { key: "customer", header: "Customer", sortable: true },
  { key: "status", header: "Status", render: (order) => <Badge>{order.status}</Badge> },
  {
    key: "amount",
    header: "Amount",
    numeric: true,
    sortable: true,
    render: (order) => `₹${order.amount.toLocaleString("en-IN")}`,
  },
];

<Table
  caption="Recent orders"
  columns={columns}
  data={orders}
  selectable
  selectedIds={selected}
  onSelectionChange={setSelected}
  getRowLabel={(order) => `Select order #${order.id}`}
/>
```

A native `<table>` that scrolls sideways on small screens. Sortable headers cycle ascending →
descending → unsorted and set `aria-sort`; amounts sort as numbers and dates by time. Add
`manualSort` to sort on the server, and `loading` for skeleton rows.

### Stat

```jsx
<Stat label="Revenue" value="₹4,52,300" change={12.5} changeLabel="vs last week" />
<Stat label="Refunds" value="₹12,400" change={-18} higherIsBetter={false} />
```

The trend has an arrow, a color and hidden "Increased by" / "Decreased by" text. Set
`higherIsBetter={false}` when a drop is good news.

### Timeline

```jsx
<Timeline aria-label="Order status">
  <Timeline.Item status="complete" title="Order placed" time="6 Oct, 10:42 AM" />
  <Timeline.Item status="current" title="Shipped" description="Blue Dart · AWB 7788 1234 56" />
  <Timeline.Item title="Delivered" />
</Timeline>
```

An `<ol>` of events. Each item tells screen readers its status, and the current one has
`aria-current="step"`. With `orientation="horizontal"` it stacks vertically in narrow containers.

### EmptyState and DescriptionList

```jsx
<EmptyState
  icon={<CartIcon />}
  title="Your cart is empty"
  description="Free delivery on orders above ₹499."
  actions={<Button>Continue shopping</Button>}
/>

<DescriptionList
  align="end"
  divided
  items={[
    { term: "Subtotal", description: "₹2,598" },
    { term: "Shipping", description: "Free" },
  ]}
>
  <DescriptionList.Item term="Total">
    <strong>₹2,866</strong>
  </DescriptionList.Item>
</DescriptionList>
```

Use `size="sm"` for an `EmptyState` inside tables and cards (for example as a Table's
`emptyState`), and `tone="danger"` when something failed to load. `DescriptionList` is a
semantic `<dl>`: use `columns={2}` for spec sheets and `layout="vertical"` in cards; the layout
adapts to the list's own width.

### Tag, Divider and Kbd

```jsx
<Tag variant="primary" removeLabel="Remove filter" onRemove={() => removeFilter("red")}>
  Red
</Tag>

<Divider label="OR" />
<Divider orientation="vertical" />

Press <Kbd>Esc</Kbd> to close, or <Kbd keys={["Ctrl", "S"]} /> to save.
```

`onRemove` adds a × button named after the tag ("Remove filter Red"); moving focus after a
removal is up to you. `Divider` renders an `<hr>`, or a vertical separator that stretches in a
flex row. `Kbd` renders `<kbd>`, and a combination as nested `<kbd>`s joined by a spaced
separator (`separator="then"` for sequences like G then O).

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
<Progress label="Deploying storefront-web" value={62} showValue />
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

### Banner

```jsx
<Banner
  title="Diwali Sale is live!"
  action={<Link href="/sale">Shop now</Link>}
  onDismiss={() => setVisible(false)}
>
  Flat 50% off on electronics.
</Banner>
```

A full-width `<section>` landmark, not a live region, because it's part of the page when it
loads. `onDismiss` adds a × button; hiding the banner and remembering that choice is up to you.

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

### AlertDialog

```jsx
<AlertDialog
  open={open}
  onClose={() => setOpen(false)}
  onConfirm={() => api.deleteProduct(id)}
  title="Delete “Cotton Kurta – Indigo”?"
  description="This can't be undone."
  confirmLabel="Delete product"
/>
```

Focus starts on Cancel, the least destructive action. If `onConfirm` returns a promise, the
dialog shows a spinner until it settles: it closes on success and stays open on failure.

### CommandPalette

```jsx
<CommandPalette
  items={[
    { id: "orders", label: "Orders", group: "Go to", shortcut: ["G", "O"] },
    { id: "new-product", label: "Add a product", group: "Actions" },
    { id: "gst", label: "Download GST report", group: "Reports", keywords: ["tax"] },
  ]}
  onSelect={(item) => runCommand(item.id)}
/>
```

Ctrl + K (⌘ K on a Mac) opens it from anywhere. Change the shortcut with
`hotkey="ctrl+shift+p"`, or turn it off with `hotkey={null}` and open it from your own button.
It behaves like `Modal` (focus trap, Escape, overlay click, scroll lock, focus restore), and every
word typed must match the label, description or keywords.

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
  <Breadcrumb.Item current>storefront-web</Breadcrumb.Item>
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
    <Link to="/">Shelf UI</Link>
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

### Stepper

```jsx
<Stepper
  steps={[{ title: "Address" }, { title: "Payment" }, { title: "Review" }]}
  activeStep={step}
  onStepClick={setStep}
/>
```

Your code owns the flow: pass `steps.length` as `activeStep` when everything is done. Completed
steps become buttons with `onStepClick`, each step has hidden status text, and the current step
has `aria-current="step"`.

### Sidebar

```jsx
<Sidebar label="Admin">
  <Sidebar.Header>
    ShopKart <Sidebar.Toggle />
  </Sidebar.Header>
  <Sidebar.Content>
    <Sidebar.Section title="Store">
      <Sidebar.Item asChild icon={<OrdersIcon />} badge={12}>
        <NavLink to="/orders">Orders</NavLink>
      </Sidebar.Item>
      <Sidebar.Group label="Products" icon={<BoxIcon />}>
        <Sidebar.Item href="/products">All products</Sidebar.Item>
      </Sidebar.Group>
    </Sidebar.Section>
  </Sidebar.Content>
</Sidebar>
```

Collapsing turns it into an icon rail where the labels show in tooltips. On phones, put the same
content inside a `Drawer`.

### Link

```jsx
<Link href="https://www.gst.gov.in" external>GST portal</Link>

<Link asChild>
  <RouterLink to="/orders">Your orders</RouterLink>
</Link>
```

A styled `<a>` with a visible focus ring. `external` opens a new tab safely, adds an icon and
says "(opens in a new tab)" to screen readers. Use `asChild` for router links.

### Toast

```jsx
import { ToastProvider, useToast } from "@shelf-ui/react";

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
`--shelf-`. Override them on `:root` to theme the whole app. The docs site's Theming page has a
live theme builder that generates this CSS for you.

```css
:root {
  --shelf-color-primary: #0f766e;
  --shelf-radius-md: 10px;
  --shelf-font-sans: "Inter", system-ui, sans-serif;
}
```

| Token                                          | Default                  | Used for                           |
| ---------------------------------------------- | ------------------------ | ---------------------------------- |
| `--shelf-color-primary`                          | `#6938EF` (Shelf violet) | Primary buttons, links, focus      |
| `--shelf-color-text`                             | `#16122B` (Shelf ink)    | Body text                          |
| `--shelf-color-bg`, `--shelf-color-surface`        | `#FFFFFF`                | Page and component backgrounds     |
| `--shelf-radius-sm` / `-md` / `-lg`              | 6px / 8px / 12px         | Corner radius                      |
| `--shelf-control-height-sm` / `-md` / `-lg`      | 32px / 40px / 48px       | Button and input heights           |
| `--shelf-font-sans`                              | Inter, system fonts      | All component text                 |

See [`src/styles/tokens.css`](src/styles/tokens.css) for the full list. You can also set
tokens on a single container, but tokens defined in terms of others (like
`--shelf-color-info`, which follows `--shelf-color-primary`) must then be set on that container too.

**Dark mode.** Add `data-shelf-theme="dark"` to the `<html>` element. Setting it on `<html>`
(rather than a nested container) makes sure modals and toasts, which render into
`document.body`, use the same theme.

```html
<html data-shelf-theme="dark"></html>
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
- **IconButton**: `label` is required and becomes the accessible name. Its tooltip repeats the
  label, so it is hidden from screen readers instead of being read twice.
- **Combobox**: WAI-ARIA combobox with list autocomplete. ↓ ↑ move through the options
  (`aria-activedescendant`, focus stays in the input), Enter selects, and Escape closes the list,
  then clears the field. "No results" and loading messages are announced.
- **Calendar / DatePicker**: WAI-ARIA date grid with a single Tab stop. Days are buttons named by
  the full date, today has `aria-current="date"`, and disabled days stay focusable. The
  DatePicker popup is a non-modal dialog; Escape closes it and returns focus to the field.
- **NumberInput / PinInput / Rating**: `role="spinbutton"` with `aria-valuemin`, `-max` and
  `-text`; one labelled input per PIN box ("Digit 2 of 6"); native radio buttons for an
  interactive rating, and one `role="img"` with a full description for a read-only one.
- **FileUpload**: a visually hidden native file input in the Tab order; added, removed and
  rejected files are announced, and focus moves to a sensible place after a removal.
- **ToggleGroup**: toggle buttons (`aria-pressed`) in a labelled group with a roving tabindex.
  ← → (↑ ↓ when vertical) Home End move between items.
- **Table**: native table semantics. Sortable headers are buttons, and the sorted
  column has `aria-sort`. A table that scrolls becomes a labelled, focusable region so keyboard
  users can scroll it.
- **AlertDialog**: `role="alertdialog"` named by its title and described by its description.
  Focus starts on Cancel, the least destructive action; the buttons stay focusable while a
  confirm is pending.
- **CommandPalette**: a modal dialog with Modal's focus handling. The search input is a combobox
  that controls a grouped listbox; ↑ ↓ Home End move and Enter runs the command.
- **Stepper / Timeline**: ordered lists; each step or event has visually hidden status text, and
  the current one has `aria-current="step"`.
- **Sidebar**: a labelled `<nav>`. Groups are disclosure buttons (`aria-expanded`), the current
  page has `aria-current="page"`, and in the collapsed rail the labels stay the accessible names.
- **Banner**: a labelled `<section>` landmark, not a live region.
- **Link**: `external` adds a visually hidden "(opens in a new tab)".
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
├── utils/             # helpers (cx, mergeRefs, focus, pagination, dates, sorting, search, …)
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

- Style with design tokens (`var(--shelf-…)`). Don't hard-code colors.
- Class names use the `shelf-` prefix with BEM-style modifiers (`shelf-button--primary`).
- Forward refs to the main DOM element, spread remaining props onto it, and merge `className`
  with `cx`.
- Prefer native HTML semantics. Add ARIA only when HTML can't express the behaviour.
- Plain JavaScript and JSX only (`.js` / `.jsx`), with explicit file extensions in relative
  imports.
- Give props their defaults in the destructuring (`variant = "primary"`), and describe each
  prop in the comment above the component.
- Discuss new runtime dependencies before adding them.

## Current limitations

- Dropdown menus, popovers, Combobox lists and the DatePicker calendar are placed with CSS and
  don't reposition near the edges of the viewport yet. Tooltips do.
- A few built-in accessible texts are English-only: Carousel's slide names and buttons,
  AvatarGroup's "N more", Textarea's character count and FileUpload's rejection messages
  (replace those with `onReject` and `error`). Other labels are props.
- Right-to-left layouts aren't fully supported yet (for example Carousel swipes and arrows, and
  Calendar's arrow keys).
- `NumberInput` only accepts `.` as the decimal separator.
- The package is ESM-only; there is no CommonJS build.

## License

[MIT](LICENSE) © Shelf UI contributors
