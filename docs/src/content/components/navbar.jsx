import { Navbar } from "shelf-ui-react";
import Basic from "../../examples/navbar/Basic.jsx";
import basicCode from "../../examples/navbar/Basic.jsx?raw";
import RouterLinks from "../../examples/navbar/RouterLinks.jsx";
import routerLinksCode from "../../examples/navbar/RouterLinks.jsx?raw";

function NavbarThumbnail() {
  // Narrow on purpose: the navbar collapses to its menu toggle.
  return (
    <div style={{ width: "100%", maxWidth: 260 }}>
      <Navbar label="Preview">
        <Navbar.Brand href="#preview">Acme</Navbar.Brand>
        <Navbar.Menu>
          <Navbar.Links>
            <Navbar.Link href="#preview">Home</Navbar.Link>
          </Navbar.Links>
        </Navbar.Menu>
      </Navbar>
    </div>
  );
}

export const navbarDoc = {
  slug: "navbar",
  name: "Navbar",
  category: "Navigation",
  summary: "Responsive site header with a brand, links and actions.",
  description:
    "The header for sites and apps: brand, primary links and actions like search or sign in. When it's narrower than 768px, the links and actions collapse behind a menu button. Use `asChild` to render your router's links.",
  keywords: [
    "header",
    "navigation",
    "nav",
    "menu",
    "app bar",
    "top bar",
    "hamburger",
    "responsive",
  ],
  imports: ["Navbar"],
  Thumbnail: NavbarThumbnail,
  examples: [
    {
      id: "basic",
      title: "Basic",
      description:
        "Switch the preview to Mobile to see the menu collapse, then open it with the menu button.",
      Component: Basic,
      code: basicCode,
      responsive: true,
      minHeight: "30rem",
    },
    {
      id: "router-links",
      title: "With router links",
      description:
        "`asChild` renders your router's `Link` with the navbar's styling and behavior. These links work: they navigate these docs.",
      Component: RouterLinks,
      code: routerLinksCode,
      responsive: true,
      minHeight: "30rem",
    },
  ],
  api: [
    {
      title: "Navbar",
      description:
        "Renders a `<header>` containing a `<nav>`. Other props go to the `<header>`. Also exported parts: `NavbarBrand`, `NavbarMenu`, `NavbarLinks`, `NavbarLink`, `NavbarActions`.",
      props: [
        {
          name: "sticky",
          type: "boolean",
          default: "false",
          description: "Sticks to the top of the viewport while scrolling.",
        },
        {
          name: "label",
          type: "string",
          default: '"Main"',
          description: "Accessible name of the `<nav>` landmark.",
        },
        {
          name: "menuOpen",
          type: "boolean",
          description: "Controlled open state of the collapsed menu.",
        },
        {
          name: "defaultMenuOpen",
          type: "boolean",
          default: "false",
          description: "Initial menu state when uncontrolled.",
        },
        {
          name: "onMenuOpenChange",
          type: "function(open)",
          description: "Called when the menu opens or closes.",
        },
      ],
    },
    {
      title: "Navbar.Brand",
      description: "An `<a>` by default.",
      props: [
        { name: "href", type: "string", description: "Link target, usually the home page." },
        {
          name: "asChild",
          type: "boolean",
          default: "false",
          description: "Renders the child element (e.g. a router `Link`) instead of an `<a>`.",
        },
      ],
    },
    {
      title: "Navbar.Menu",
      description:
        "Holds `Navbar.Links` and `Navbar.Actions`, and renders the menu button used when collapsed.",
      props: [
        {
          name: "toggleLabel",
          type: "string",
          default: '"Toggle navigation"',
          description: "Accessible name of the menu button.",
        },
      ],
    },
    {
      title: "Navbar.Link",
      description:
        "Renders `<li><a></a></li>`; use it inside `Navbar.Links`. Choosing a link closes the collapsed menu.",
      props: [
        { name: "href", type: "string", description: "Link target." },
        {
          name: "active",
          type: "boolean",
          default: "false",
          description: 'Marks the current page (`aria-current="page"`).',
        },
        {
          name: "asChild",
          type: "boolean",
          default: "false",
          description: "Renders the child element (e.g. a router `Link`) instead of an `<a>`.",
        },
      ],
    },
  ],
  keyboard: [
    { keys: ["Tab"], description: "Moves through the brand, links and actions in order." },
    {
      keys: ["Enter", "Space"],
      description: "On the menu button: opens or closes the collapsed menu.",
    },
    { keys: ["Escape"], description: "Closes the open menu and returns focus to the menu button." },
  ],
  accessibility: [
    'Renders a `<header>` with a `<nav>` landmark named by `label` ("Main" by default). Give each navbar on a page a distinct label.',
    'The active link gets `aria-current="page"`.',
    "The menu button exposes `aria-expanded` and `aria-controls`. While collapsed, the menu is hidden from assistive technology.",
    "Escape, a click outside, or choosing a link closes the open menu.",
    "It collapses based on its own width (a CSS container query), so it also adapts inside narrow layouts.",
  ],
};
