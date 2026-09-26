import { useEffect, useState } from "react";
import {
  Alert,
  Badge,
  Button,
  Card,
  Dropdown,
  Input,
  Modal,
  Navbar,
  Tabs,
  ToastProvider,
  useToast,
} from "@codecps/ui";

function Section({ id, title, children }) {
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
    <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth={2}>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}

function ToastDemo() {
  const { toast } = useToast();
  return (
    <div className="pg-row">
      <Button variant="secondary" onClick={() => toast({ variant: "success", title: "Project created", message: "codecps-web is ready to deploy." })}>
        Success toast
      </Button>
      <Button variant="secondary" onClick={() => toast({ variant: "error", title: "Build failed", message: "3 errors in src/App.jsx." })}>
        Error toast
      </Button>
      <Button variant="secondary" onClick={() => toast({ variant: "warning", title: "Usage at 90%", message: "Upgrade to avoid throttling." })}>
        Warning toast
      </Button>
      <Button variant="secondary" onClick={() => toast({ variant: "info", title: "New version", message: "CodeCPS UI 0.2 is available.", duration: Infinity })}>
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

  useEffect(() => {
    document.documentElement.dataset.cpsTheme = theme;
  }, [theme]);

  return (
    <ToastProvider>
      <Navbar sticky>
        <Navbar.Brand href="#top">
          <span className="pg-logo" aria-hidden="true" />
          CodeCPS UI
        </Navbar.Brand>
        <Navbar.Menu>
          <Navbar.Links>
            <Navbar.Link href="#top" active>
              Home
            </Navbar.Link>
            <Navbar.Link href="#button">Components</Navbar.Link>
            <Navbar.Link href="#docs">Documentation</Navbar.Link>
            <Navbar.Link href="#about">About</Navbar.Link>
          </Navbar.Links>
          <Navbar.Actions>
            <Input
              aria-label="Search components"
              placeholder="Search…"
              size="sm"
              leftIcon={<SearchIcon />}
              className="pg-search"
            />
            <Button variant="ghost" size="sm" onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
              {theme === "light" ? "Dark" : "Light"} mode
            </Button>
            <Button variant="ghost" size="sm">
              Login
            </Button>
            <Button size="sm">Get Started</Button>
          </Navbar.Actions>
        </Navbar.Menu>
      </Navbar>

      <main id="top" className="pg-main">
        <header className="pg-hero">
          <Badge variant="primary">v0.1.0</Badge>
          <h1>CodeCPS UI</h1>
          <p>Accessible React components from CodeCPS Technologies.</p>
        </header>

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

        <Section id="input" title="Input">
          <div className="pg-grid">
            <Input label="Email" placeholder="Enter your email" type="email" required />
            <Input label="Username" helperText="Lowercase letters and numbers only." />
            <Input label="Email" placeholder="Enter your email" defaultValue="hello@" error="Invalid email" />
            <Input label="Plan" defaultValue="Enterprise" disabled />
          </div>
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
              footer={<Button variant="outline" size="sm">View all</Button>}
            >
              12 successful · 1 failed
            </Card>
            <Card variant="filled">Hello CodeCPS</Card>
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

        <Section id="alert" title="Alert">
          <div className="pg-stack">
            <Alert variant="info" title="Scheduled maintenance" description="The dashboard will be read-only on Sunday, 02:00–03:00 IST." />
            <Alert variant="success" title="Payment received" description="Invoice #1042 has been paid." />
            <Alert
              variant="warning"
              title="API key expires soon"
              description="Rotate your key within 7 days."
              action={<Button size="sm" variant="outline">Rotate key</Button>}
            />
            {showAlert && (
              <Alert variant="error" title="Deployment failed" description="Build exited with code 1." onDismiss={() => setShowAlert(false)} />
            )}
          </div>
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
            <Input label="Project name" placeholder="codecps-web" required />
          </Modal>
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
            <span className="pg-muted">{lastAction ? `Selected: ${lastAction}` : "Nothing selected yet"}</span>
          </div>
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
            <Tabs.Panel value="overview">Project health, recent activity and quick links.</Tabs.Panel>
            <Tabs.Panel value="deployments">A list of production and preview deployments.</Tabs.Panel>
            <Tabs.Panel value="analytics">Traffic and performance metrics.</Tabs.Panel>
            <Tabs.Panel value="settings">Domains, environment variables and members.</Tabs.Panel>
          </Tabs>
        </Section>

        <Section id="toast" title="Toast">
          <ToastDemo />
        </Section>
      </main>
    </ToastProvider>
  );
}
