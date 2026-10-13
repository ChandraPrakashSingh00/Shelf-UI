import { createContext, useContext, useEffect, useState } from "react";
import {
  Accordion,
  Alert,
  Avatar,
  AvatarGroup,
  Badge,
  Breadcrumb,
  Button,
  Card,
  Carousel,
  Checkbox,
  Drawer,
  Dropdown,
  Input,
  Modal,
  Navbar,
  Pagination,
  Popover,
  Progress,
  Radio,
  RadioGroup,
  Select,
  Skeleton,
  Slider,
  Spinner,
  Switch,
  Tabs,
  Textarea,
  ToastProvider,
  Tooltip,
  useToast,
} from "@shelf-ui/react";
import packageJson from "../package.json";
import { AlertDialogDemo } from "./demos/AlertDialogDemo.jsx";
import { BannerDemo } from "./demos/BannerDemo.jsx";
import { CalendarDemo } from "./demos/CalendarDemo.jsx";
import { ComboboxDemo } from "./demos/ComboboxDemo.jsx";
import { CommandPaletteDemo } from "./demos/CommandPaletteDemo.jsx";
import { DatePickerDemo } from "./demos/DatePickerDemo.jsx";
import { DescriptionListDemo } from "./demos/DescriptionListDemo.jsx";
import { DividerDemo } from "./demos/DividerDemo.jsx";
import { EmptyStateDemo } from "./demos/EmptyStateDemo.jsx";
import { FileUploadDemo } from "./demos/FileUploadDemo.jsx";
import { IconButtonDemo } from "./demos/IconButtonDemo.jsx";
import { KbdDemo } from "./demos/KbdDemo.jsx";
import { LinkDemo } from "./demos/LinkDemo.jsx";
import { NumberInputDemo } from "./demos/NumberInputDemo.jsx";
import { PinInputDemo } from "./demos/PinInputDemo.jsx";
import { RatingDemo } from "./demos/RatingDemo.jsx";
import { SidebarDemo } from "./demos/SidebarDemo.jsx";
import { StatDemo } from "./demos/StatDemo.jsx";
import { StepperDemo } from "./demos/StepperDemo.jsx";
import { TableDemo } from "./demos/TableDemo.jsx";
import { TagDemo } from "./demos/TagDemo.jsx";
import { TimelineDemo } from "./demos/TimelineDemo.jsx";
import { ToggleGroupDemo } from "./demos/ToggleGroupDemo.jsx";

const repositoryUrl = packageJson.repository.url.replace(/^git\+/, "").replace(/\.git$/, "");

// Section titles, in page order; the search box filters by these.
const SECTION_TITLES = [
  "Button",
  "IconButton",
  "Input",
  "Textarea",
  "Select",
  "Checkbox",
  "RadioGroup",
  "Switch",
  "Slider",
  "Combobox",
  "Calendar",
  "DatePicker",
  "NumberInput",
  "PinInput",
  "FileUpload",
  "Rating",
  "ToggleGroup",
  "Card",
  "Badge",
  "Avatar",
  "Carousel",
  "Table",
  "Tag",
  "Divider",
  "Stat",
  "Timeline",
  "EmptyState",
  "DescriptionList",
  "Kbd",
  "Alert",
  "Progress",
  "Skeleton",
  "Spinner",
  "Banner",
  "Modal",
  "Drawer",
  "Popover",
  "Tooltip",
  "Dropdown",
  "AlertDialog",
  "CommandPalette",
  "Tabs",
  "Accordion",
  "Breadcrumb",
  "Pagination",
  "Stepper",
  "Sidebar",
  "Link",
  "Toast",
];

const NAV_LINKS = [
  { href: "#button", label: "Actions" },
  { href: "#input", label: "Forms" },
  { href: "#card", label: "Data display" },
  { href: "#alert", label: "Feedback" },
  { href: "#modal", label: "Overlays" },
  { href: "#tabs", label: "Navigation" },
];

const SearchQuery = createContext("");

const matchesQuery = (title, query) => title.toLowerCase().includes(query.trim().toLowerCase());

function useLocationHash() {
  const [hash, setHash] = useState(() => window.location.hash);
  useEffect(() => {
    const handleChange = () => setHash(window.location.hash);
    window.addEventListener("hashchange", handleChange);
    return () => window.removeEventListener("hashchange", handleChange);
  }, []);
  return hash;
}

function Section({ id, title, children }) {
  const query = useContext(SearchQuery);
  if (!matchesQuery(title, query)) return null;

  return (
    <section id={id} className="pg-section" aria-labelledby={`${id}-title`}>
      <h2 id={`${id}-title`} className="pg-section__title">
        {title}
      </h2>
      {children}
    </section>
  );
}

function SearchIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}

function CopyIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="9" y="9" width="11" height="11" rx="2" />
      <path d="M5 15V6a2 2 0 0 1 2-2h9" />
    </svg>
  );
}

const ENVIRONMENTS = ["Production", "Preview", "Development"];
const TEAM = [
  "Aditi Rao",
  "Rohan Mehta",
  "Sneha Iyer",
  "Arjun Nair",
  "Kavya Reddy",
  "Vikram Singh",
];
const SHARE_LINK = "https://example.com/p/storefront-web";

function TextareaDemo() {
  const [notes, setNotes] = useState("");
  return (
    <div className="pg-grid">
      <Textarea
        label="Project description"
        placeholder="What are you building?"
        helperText="Shown on the project's overview page."
      />
      <Textarea
        label="Release notes"
        value={notes}
        onChange={(event) => setNotes(event.target.value)}
        showCount
        maxLength={280}
        autoResize
        rows={2}
      />
      <Textarea label="Feedback" required error="Tell us a little more." defaultValue="Slow" />
      <Textarea label="Plan details" disabled defaultValue="Enterprise · SSO and audit logs" />
    </div>
  );
}

function SelectDemo() {
  const [region, setRegion] = useState("");
  return (
    <div className="pg-grid">
      <Select
        label="Framework preset"
        placeholder="Choose a framework"
        options={["Vite", "Next.js", "Remix", "Astro"]}
        helperText="Sets the build command and output folder."
      />
      <Select
        label="Region"
        required
        placeholder="Choose a region"
        value={region}
        onChange={(event) => setRegion(event.target.value)}
        error={region === "" ? "Choose where to deploy." : undefined}
        options={[
          { value: "ap-south-1", label: "Mumbai (ap-south-1)" },
          { value: "ap-southeast-1", label: "Singapore (ap-southeast-1)" },
          { value: "eu-central-1", label: "Frankfurt (eu-central-1)", disabled: true },
        ]}
      />
      <Select
        label="Plan"
        disabled
        defaultValue="pro"
        options={[{ value: "pro", label: "Pro · ₹2,499 per month" }]}
      />
    </div>
  );
}

function CheckboxDemo() {
  const [selected, setSelected] = useState(["Production"]);
  const allSelected = selected.length === ENVIRONMENTS.length;
  return (
    <div className="pg-stack">
      <Checkbox
        label="All environments"
        checked={allSelected}
        indeterminate={selected.length > 0 && !allSelected}
        onCheckedChange={(checked) => setSelected(checked ? ENVIRONMENTS : [])}
      />
      {ENVIRONMENTS.map((name) => (
        <Checkbox
          key={name}
          label={name}
          style={{ marginInlineStart: 24 }}
          checked={selected.includes(name)}
          onCheckedChange={(checked) =>
            setSelected((current) =>
              checked ? [...current, name] : current.filter((item) => item !== name),
            )
          }
        />
      ))}
      <Checkbox
        label="Email me when a deployment fails"
        description="Sent to every project owner."
        defaultChecked
      />
      <Checkbox
        label="I agree to the Terms of Service"
        required
        error="Accept the terms to continue."
      />
      <Checkbox label="Disabled" disabled defaultChecked />
    </div>
  );
}

function AvatarDemo() {
  return (
    <div className="pg-stack">
      <div className="pg-row">
        <Avatar name="Aditi Rao" size="xs" />
        <Avatar name="Rohan Mehta" size="sm" />
        <Avatar name="Sneha Iyer" />
        <Avatar src="/missing.png" name="Kavya Reddy" size="lg" />
        <Avatar name="Acme Studio" shape="square" size="xl" />
        <Avatar />
      </div>
      <AvatarGroup max={4} label="Project members">
        {TEAM.map((name) => (
          <Avatar key={name} name={name} />
        ))}
      </AvatarGroup>
    </div>
  );
}

function ProgressDemo() {
  const [uploaded, setUploaded] = useState(null);
  const isUploading = uploaded !== null && uploaded < 24;

  useEffect(() => {
    if (!isUploading) return;
    const interval = setInterval(() => setUploaded((mb) => Math.min(mb + 2, 24)), 250);
    return () => clearInterval(interval);
  }, [isUploading]);

  return (
    <div className="pg-stack pg-narrow">
      <Progress label="Deploying storefront-web" value={62} showValue />
      <Progress label="Backup complete" value={100} showValue variant="success" size="sm" />
      <Progress label="Preparing your workspace…" size="lg" />
      <Progress
        label="project-assets.zip"
        value={uploaded ?? 0}
        max={24}
        showValue
        formatValue={(value, max) => `${value} MB of ${max} MB`}
        variant={uploaded === 24 ? "success" : "primary"}
      />
      <div className="pg-row">
        <Button size="sm" loading={isUploading} onClick={() => setUploaded(0)}>
          {isUploading ? "Uploading…" : "Start upload"}
        </Button>
        <span role="status" className="pg-muted">
          {uploaded === 24 ? "Uploaded" : ""}
        </span>
      </div>
    </div>
  );
}

function SkeletonDemo() {
  const [loading, setLoading] = useState(true);
  return (
    <div className="pg-stack pg-narrow">
      <Card aria-busy={loading}>
        {loading ? (
          <>
            <Skeleton variant="circular" width={40} />
            <Skeleton lines={3} />
          </>
        ) : (
          <>
            <Avatar name="Aditi Rao" />
            <p style={{ margin: 0 }}>
              Aditi deployed storefront-web to production. 12 checks passed.
            </p>
          </>
        )}
      </Card>
      <div className="pg-row">
        <Button variant="secondary" size="sm" onClick={() => setLoading(!loading)}>
          {loading ? "Show content" : "Show skeleton"}
        </Button>
        <span role="status" className="pg-muted">
          {loading ? "Loading activity…" : "Activity loaded."}
        </span>
      </div>
    </div>
  );
}

function PopoverDemo() {
  const [copied, setCopied] = useState(false);
  return (
    <div className="pg-row">
      <Popover
        trigger={<Button variant="outline">Share</Button>}
        title="Share project"
        onOpenChange={() => setCopied(false)}
      >
        <div className="pg-stack">
          <Input
            label="Project link"
            value={SHARE_LINK}
            readOnly
            onFocus={(event) => event.target.select()}
          />
          <Button
            size="sm"
            onClick={() => navigator.clipboard.writeText(SHARE_LINK).then(() => setCopied(true))}
          >
            {copied ? "Copied" : "Copy link"}
          </Button>
        </div>
      </Popover>
      <Popover
        trigger={<Button variant="ghost">Build minutes</Button>}
        label="About build minutes"
        side="top"
        showCloseButton
      >
        Build minutes reset on the 1st of every month. <a href="#usage">See usage</a>
      </Popover>
    </div>
  );
}

function TooltipDemo() {
  return (
    <div className="pg-row">
      <Tooltip content="Deploys the latest commit on main">
        <Button>Deploy</Button>
      </Tooltip>
      <Tooltip content="Copy a link to this deployment" side="bottom">
        <Button variant="outline" aria-label="Copy link">
          <CopyIcon />
        </Button>
      </Tooltip>
      <Tooltip content="Only project owners can delete a project">
        <span tabIndex={0} style={{ display: "inline-flex", borderRadius: 8 }}>
          <Button variant="danger" disabled style={{ pointerEvents: "none" }}>
            Delete project
          </Button>
        </span>
      </Tooltip>
    </div>
  );
}

const HIGHLIGHTS = ["Instant rollbacks", "Preview deployments", "Usage insights"];

function CarouselDemo() {
  return (
    <Carousel label="Release highlights" autoPlay interval={4000} className="pg-narrow">
      {HIGHLIGHTS.map((title) => (
        <Carousel.Slide key={title}>
          <div className="pg-slide">{title}</div>
        </Carousel.Slide>
      ))}
    </Carousel>
  );
}

function DrawerDemo() {
  const [side, setSide] = useState(null);
  return (
    <div className="pg-row">
      {["right", "left", "bottom"].map((option) => (
        <Button key={option} variant="outline" onClick={() => setSide(option)}>
          Open {option}
        </Button>
      ))}
      <Drawer
        open={side !== null}
        onClose={() => setSide(null)}
        side={side ?? "right"}
        title="Project settings"
        description="Changes apply to every deployment of storefront-web."
        footer={<Button onClick={() => setSide(null)}>Done</Button>}
      >
        <Input label="Project name" defaultValue="storefront-web" />
      </Drawer>
    </div>
  );
}

function RadioGroupDemo() {
  const [region, setRegion] = useState("mumbai");
  return (
    <div className="pg-grid">
      <RadioGroup
        label="Deployment region"
        description="Pick the region closest to your users."
        value={region}
        onValueChange={setRegion}
      >
        <Radio value="mumbai" label="Mumbai (ap-south-1)" />
        <Radio value="hyderabad" label="Hyderabad (ap-south-2)" />
        <Radio value="singapore" label="Singapore (ap-southeast-1)" disabled />
      </RadioGroup>
      <RadioGroup label="Billing cycle" orientation="horizontal" size="sm" defaultValue="monthly">
        <Radio value="monthly" label="Monthly" />
        <Radio value="yearly" label="Yearly" description="2 months free" />
      </RadioGroup>
      <RadioGroup label="Plan" error="Choose a plan to continue." required>
        <Radio value="starter" label="Starter" />
        <Radio value="pro" label="Pro" />
      </RadioGroup>
    </div>
  );
}

function SwitchDemo() {
  const [autoDeploy, setAutoDeploy] = useState(true);
  return (
    <div className="pg-stack">
      <Switch
        label="Auto-deploy"
        description="Deploy every push to the main branch."
        checked={autoDeploy}
        onCheckedChange={setAutoDeploy}
      />
      <Switch size="sm" label="Preview comments" />
      <Switch label="Audit log export" disabled />
    </div>
  );
}

function SliderDemo() {
  const [storage, setStorage] = useState(100);
  return (
    <div className="pg-grid">
      <Slider label="Volume" defaultValue={60} />
      <Slider
        label="Storage"
        min={10}
        max={500}
        step={10}
        value={storage}
        onValueChange={setStorage}
        formatValue={(value) => `${value} GB`}
        helperText={`₹${(storage * 2).toLocaleString("en-IN")} per month`}
      />
      <Slider
        label="Log retention"
        size="sm"
        min={1}
        max={30}
        defaultValue={7}
        formatValue={(value) => `${value} days`}
        disabled
      />
    </div>
  );
}

function PaginationDemo() {
  const [page, setPage] = useState(3);
  return (
    <div className="pg-row">
      <Pagination totalPages={20} page={page} onPageChange={setPage} />
      <span className="pg-muted">Page {page} of 20</span>
    </div>
  );
}

function ToastDemo() {
  const { toast } = useToast();
  return (
    <div className="pg-row">
      <Button
        variant="secondary"
        onClick={() =>
          toast({
            variant: "success",
            title: "Project created",
            message: "storefront-web is ready to deploy.",
          })
        }
      >
        Success toast
      </Button>
      <Button
        variant="secondary"
        onClick={() =>
          toast({ variant: "error", title: "Build failed", message: "3 errors in src/App.jsx." })
        }
      >
        Error toast
      </Button>
      <Button
        variant="secondary"
        onClick={() =>
          toast({
            variant: "warning",
            title: "Usage at 90%",
            message: "Upgrade to avoid throttling.",
          })
        }
      >
        Warning toast
      </Button>
      <Button
        variant="secondary"
        onClick={() =>
          toast({
            variant: "info",
            title: "New version",
            message: "Shelf UI 0.3 is available.",
            duration: Infinity,
          })
        }
      >
        Persistent info toast
      </Button>
    </div>
  );
}

export function App() {
  const [theme, setTheme] = useState("light");
  const [modalOpen, setModalOpen] = useState(false);
  const [showAlert, setShowAlert] = useState(true);
  const [lastAction, setLastAction] = useState(null);
  const [query, setQuery] = useState("");
  const hash = useLocationHash();
  const hasResults = SECTION_TITLES.some((title) => matchesQuery(title, query));

  useEffect(() => {
    document.documentElement.dataset.shelfTheme = theme;
  }, [theme]);

  return (
    <ToastProvider>
      <Navbar sticky className="pg-navbar">
        <Navbar.Brand href="#top">
          <span className="pg-logo" aria-hidden="true" />
          Shelf UI
          <Badge size="sm" className="pg-navbar__badge">
            Playground
          </Badge>
        </Navbar.Brand>
        <Navbar.Menu>
          <Navbar.Links>
            {NAV_LINKS.map((link) => (
              <Navbar.Link
                key={link.href}
                href={link.href}
                active={hash === link.href}
                // On mid-size screens the links scroll sideways; keep the focused one in view.
                onFocus={(event) =>
                  event.currentTarget.scrollIntoView({ block: "nearest", inline: "nearest" })
                }
              >
                {link.label}
              </Navbar.Link>
            ))}
          </Navbar.Links>
          <Navbar.Actions>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            >
              {theme === "light" ? "Dark" : "Light"} mode
            </Button>
            <Button asChild variant="outline" size="sm">
              <a href={repositoryUrl} target="_blank" rel="noreferrer">
                GitHub
              </a>
            </Button>
          </Navbar.Actions>
        </Navbar.Menu>
      </Navbar>

      <main id="top" className="pg-main">
        <header className="pg-hero">
          <Badge variant="primary">v{packageJson.version}</Badge>
          <h1>Shelf UI playground</h1>
          <p>
            Every component on one page, for quick checks while you work on the library. The full
            documentation site, with guides, examples and API references, runs with{" "}
            <code>npm run dev</code>.
          </p>
        </header>

        <Input
          type="search"
          aria-label="Filter components"
          placeholder="Filter components…"
          leftIcon={<SearchIcon />}
          className="pg-search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />

        {!hasResults && (
          <p className="pg-muted" role="status">
            No components match “{query}”.
          </p>
        )}

        <SearchQuery.Provider value={query}>
          <Section id="button" title="Button">
            <div className="pg-row">
              <Button>Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="danger">Danger</Button>
            </div>
            <div className="pg-row">
              <Button size="sm">Small</Button>
              <Button size="md">Medium</Button>
              <Button size="lg">Large</Button>
              <Button disabled>Disabled</Button>
              <Button loading>Saving</Button>
            </div>
          </Section>

          <Section id="icon-button" title="IconButton">
            <IconButtonDemo />
          </Section>

          <Section id="input" title="Input">
            <div className="pg-grid">
              <Input label="Email" placeholder="Enter your email" type="email" required />
              <Input label="Username" helperText="Lowercase letters and numbers only." />
              <Input
                label="Email"
                placeholder="Enter your email"
                defaultValue="hello@"
                error="Invalid email"
              />
              <Input label="Plan" defaultValue="Enterprise" disabled />
            </div>
          </Section>

          <Section id="textarea" title="Textarea">
            <TextareaDemo />
          </Section>

          <Section id="select" title="Select">
            <SelectDemo />
          </Section>

          <Section id="checkbox" title="Checkbox">
            <CheckboxDemo />
          </Section>

          <Section id="radio-group" title="RadioGroup">
            <RadioGroupDemo />
          </Section>

          <Section id="switch" title="Switch">
            <SwitchDemo />
          </Section>

          <Section id="slider" title="Slider">
            <SliderDemo />
          </Section>

          <Section id="combobox" title="Combobox">
            <ComboboxDemo />
          </Section>

          <Section id="calendar" title="Calendar">
            <CalendarDemo />
          </Section>

          <Section id="date-picker" title="DatePicker">
            <DatePickerDemo />
          </Section>

          <Section id="number-input" title="NumberInput">
            <NumberInputDemo />
          </Section>

          <Section id="pin-input" title="PinInput">
            <PinInputDemo />
          </Section>

          <Section id="file-upload" title="FileUpload">
            <FileUploadDemo />
          </Section>

          <Section id="rating" title="Rating">
            <RatingDemo />
          </Section>

          <Section id="toggle-group" title="ToggleGroup">
            <ToggleGroupDemo />
          </Section>

          <Section id="card" title="Card">
            <div className="pg-grid">
              <Card>
                <Card.Header>
                  <Card.Title>Starter</Card.Title>
                  <Card.Description>For freelancers and small projects.</Card.Description>
                </Card.Header>
                <Card.Content>5 projects · 10 GB storage · Email support</Card.Content>
                <Card.Footer>
                  <Button fullWidth>Start Project</Button>
                </Card.Footer>
              </Card>
              <Card
                variant="elevated"
                title="Deployments"
                description="Last 24 hours"
                footer={
                  <Button variant="outline" size="sm">
                    View all
                  </Button>
                }
              >
                12 successful · 1 failed
              </Card>
              <Card variant="filled">Hello Acme</Card>
            </div>
          </Section>

          <Section id="badge" title="Badge">
            <div className="pg-row">
              <Badge variant="primary">Primary</Badge>
              <Badge variant="success">Active</Badge>
              <Badge variant="warning">Pending</Badge>
              <Badge variant="danger">Failed</Badge>
              <Badge variant="neutral">Draft</Badge>
              <Badge size="sm">Small</Badge>
            </div>
          </Section>

          <Section id="avatar" title="Avatar">
            <AvatarDemo />
          </Section>

          <Section id="carousel" title="Carousel">
            <CarouselDemo />
          </Section>

          <Section id="table" title="Table">
            <TableDemo />
          </Section>

          <Section id="tag" title="Tag">
            <TagDemo />
          </Section>

          <Section id="divider" title="Divider">
            <DividerDemo />
          </Section>

          <Section id="stat" title="Stat">
            <StatDemo />
          </Section>

          <Section id="timeline" title="Timeline">
            <TimelineDemo />
          </Section>

          <Section id="empty-state" title="EmptyState">
            <EmptyStateDemo />
          </Section>

          <Section id="description-list" title="DescriptionList">
            <DescriptionListDemo />
          </Section>

          <Section id="kbd" title="Kbd">
            <KbdDemo />
          </Section>

          <Section id="alert" title="Alert">
            <div className="pg-stack">
              <Alert
                variant="info"
                title="Scheduled maintenance"
                description="The dashboard will be read-only on Sunday, 02:00–03:00 IST."
              />
              <Alert
                variant="success"
                title="Payment received"
                description="Invoice #1042 has been paid."
              />
              <Alert
                variant="warning"
                title="API key expires soon"
                description="Rotate your key within 7 days."
                action={
                  <Button size="sm" variant="outline">
                    Rotate key
                  </Button>
                }
              />
              {showAlert && (
                <Alert
                  variant="error"
                  title="Deployment failed"
                  description="Build exited with code 1."
                  onDismiss={() => setShowAlert(false)}
                />
              )}
            </div>
          </Section>

          <Section id="progress" title="Progress">
            <ProgressDemo />
          </Section>

          <Section id="skeleton" title="Skeleton">
            <SkeletonDemo />
          </Section>

          <Section id="spinner" title="Spinner">
            <div className="pg-row">
              <Spinner size="sm" />
              <Spinner />
              <Spinner size="lg" label="Loading build logs…" />
              <div role="status" className="pg-row pg-muted">
                <Spinner size="sm" label="" />
                Loading deployments…
              </div>
            </div>
          </Section>

          <Section id="banner" title="Banner">
            <BannerDemo />
          </Section>

          <Section id="modal" title="Modal">
            <div className="pg-row">
              <Button onClick={() => setModalOpen(true)}>Open modal</Button>
            </div>
            <Modal
              open={modalOpen}
              onClose={() => setModalOpen(false)}
              title="Create project"
              description="Projects group your deployments and environment variables."
              footer={
                <>
                  <Button variant="secondary" onClick={() => setModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => setModalOpen(false)}>Create</Button>
                </>
              }
            >
              <Input label="Project name" placeholder="storefront-web" required />
            </Modal>
          </Section>

          <Section id="drawer" title="Drawer">
            <DrawerDemo />
          </Section>

          <Section id="popover" title="Popover">
            <PopoverDemo />
          </Section>

          <Section id="tooltip" title="Tooltip">
            <TooltipDemo />
          </Section>

          <Section id="dropdown" title="Dropdown">
            <div className="pg-row">
              <Dropdown
                trigger={<Button variant="outline">Project actions</Button>}
                onSelect={setLastAction}
                items={[
                  { id: "rename", label: "Rename" },
                  { id: "duplicate", label: "Duplicate" },
                  { id: "transfer", label: "Transfer (owners only)", disabled: true },
                  { id: "delete", label: "Delete project", danger: true },
                ]}
              />
              <span className="pg-muted">
                {lastAction ? `Selected: ${lastAction}` : "Nothing selected yet"}
              </span>
            </div>
          </Section>

          <Section id="alert-dialog" title="AlertDialog">
            <AlertDialogDemo />
          </Section>

          <Section id="command-palette" title="CommandPalette">
            <CommandPaletteDemo />
          </Section>

          <Section id="tabs" title="Tabs">
            <Tabs defaultValue="overview">
              <Tabs.List aria-label="Project">
                <Tabs.Tab value="overview">Overview</Tabs.Tab>
                <Tabs.Tab value="deployments">Deployments</Tabs.Tab>
                <Tabs.Tab value="analytics" disabled>
                  Analytics
                </Tabs.Tab>
                <Tabs.Tab value="settings">Settings</Tabs.Tab>
              </Tabs.List>
              <Tabs.Panel value="overview">
                Project health, recent activity and quick links.
              </Tabs.Panel>
              <Tabs.Panel value="deployments">
                A list of production and preview deployments.
              </Tabs.Panel>
              <Tabs.Panel value="analytics">Traffic and performance metrics.</Tabs.Panel>
              <Tabs.Panel value="settings">Domains, environment variables and members.</Tabs.Panel>
            </Tabs>
          </Section>

          <Section id="accordion" title="Accordion">
            <Accordion defaultValue={["billing"]} className="pg-narrow">
              <Accordion.Item value="billing" title="How does billing work?">
                Each project is billed monthly: ₹999 on Starter and ₹2,499 on Pro.
              </Accordion.Item>
              <Accordion.Item value="plans" title="Can I change my plan later?">
                Yes. Upgrades apply straight away; downgrades from your next billing cycle.
              </Accordion.Item>
              <Accordion.Item value="sso" title="Single sign-on (Business plan)" disabled>
                Sign in with Google Workspace or Microsoft Entra ID.
              </Accordion.Item>
              <Accordion.Item value="refunds" title="Do you offer refunds?">
                Within 14 days of your first payment.
              </Accordion.Item>
            </Accordion>
          </Section>

          <Section id="breadcrumb" title="Breadcrumb">
            <Breadcrumb>
              <Breadcrumb.Item href="#dashboard">Dashboard</Breadcrumb.Item>
              <Breadcrumb.Item href="#projects">Projects</Breadcrumb.Item>
              <Breadcrumb.Item href="#storefront-web">storefront-web</Breadcrumb.Item>
              <Breadcrumb.Item current>Settings</Breadcrumb.Item>
            </Breadcrumb>
          </Section>

          <Section id="pagination" title="Pagination">
            <PaginationDemo />
          </Section>

          <Section id="stepper" title="Stepper">
            <StepperDemo />
          </Section>

          <Section id="sidebar" title="Sidebar">
            <SidebarDemo />
          </Section>

          <Section id="link" title="Link">
            <LinkDemo />
          </Section>

          <Section id="toast" title="Toast">
            <ToastDemo />
          </Section>
        </SearchQuery.Provider>
      </main>
    </ToastProvider>
  );
}
