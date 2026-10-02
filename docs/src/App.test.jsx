import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RouterProvider, createMemoryRouter } from "react-router";
import { beforeAll, beforeEach, describe, expect, it } from "vitest";
import { componentDocs } from "./content/components/index.js";
import { routes } from "./routes.jsx";

beforeAll(() => {
  // jsdom doesn't implement scrolling; ScrollRestoration scrolls on navigation.
  window.scrollTo = () => {};
});

beforeEach(() => {
  localStorage.clear();
  document.documentElement.dataset.cpsTheme = "light";
});

function renderAt(path, { basename } = {}) {
  const router = createMemoryRouter(routes, { initialEntries: [path], basename });
  const user = userEvent.setup();
  render(<RouterProvider router={router} />);
  return { router, user };
}

describe("pages", () => {
  it("renders the home page inside the site header and footer", async () => {
    renderAt("/");
    expect(
      await screen.findByRole("heading", { level: 1, name: /component library/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole("navigation", { name: "Main" })).toBeInTheDocument();
    expect(screen.getByRole("contentinfo")).toHaveTextContent("CodeCPS Technologies");
  });

  it("works under a sub-path, as on GitHub Pages", async () => {
    const { user } = renderAt("/CodeCPS-UI-Library-/components/button", {
      basename: "/CodeCPS-UI-Library-",
    });
    expect(await screen.findByRole("heading", { level: 1, name: "Button" })).toBeInTheDocument();

    const header = screen.getByRole("navigation", { name: "Main" });
    const homeLink = within(header).getByRole("link", { name: "Home" });
    expect(homeLink).toHaveAttribute("href", "/CodeCPS-UI-Library-");

    await user.click(within(header).getByRole("link", { name: "Changelog" }));
    expect(await screen.findByRole("heading", { level: 1, name: "Changelog" })).toBeInTheDocument();
  });

  it.each(componentDocs.map((doc) => [doc.name, doc]))(
    "renders the %s page with every example and its API reference",
    async (_name, doc) => {
      renderAt(`/components/${doc.slug}`);

      expect(await screen.findByRole("heading", { level: 1, name: doc.name })).toBeInTheDocument();
      for (const example of doc.examples) {
        expect(screen.getByRole("heading", { level: 3, name: example.title })).toBeInTheDocument();
      }
      expect(screen.getByRole("heading", { level: 2, name: "API reference" })).toBeInTheDocument();
      expect(document.title).toBe(`${doc.name} · CodeCPS UI`);
    },
  );

  it.each([
    ["/components", "Components"],
    ["/docs/installation", "Installation"],
    ["/docs", "Installation"],
    ["/changelog", "Changelog"],
    ["/about", "About CodeCPS UI"],
    ["/components/unknown", "Page not found"],
    ["/no-such-page", "Page not found"],
  ])("renders %s", async (path, heading) => {
    renderAt(path);
    expect(await screen.findByRole("heading", { level: 1, name: heading })).toBeInTheDocument();
  });

  it("links to the source code on GitHub from the header, footer and About page", async () => {
    renderAt("/about");
    await screen.findByRole("heading", { level: 1, name: "About CodeCPS UI" });

    const repo = "https://github.com/ChandraPrakashSingh00/CodeCPS-UI-Library-";
    const header = screen.getByRole("navigation", { name: "Main" });
    expect(within(header).getByRole("link", { name: "GitHub repository" })).toHaveAttribute(
      "href",
      repo,
    );
    const footer = screen.getByRole("navigation", { name: "Footer" });
    expect(within(footer).getByRole("link", { name: "GitHub" })).toHaveAttribute("href", repo);
    expect(screen.getByRole("link", { name: "View on GitHub" })).toHaveAttribute("href", repo);
    expect(screen.getByRole("link", { name: "Open an issue" })).toHaveAttribute(
      "href",
      `${repo}/issues`,
    );
  });

  it("lists every component in the sidebar", async () => {
    renderAt("/components");
    await screen.findByRole("heading", { level: 1, name: "Components" });

    const [sidebar] = screen.getAllByRole("navigation", { name: "Documentation" });
    if (!sidebar) throw new Error("sidebar not found");
    for (const doc of componentDocs) {
      expect(within(sidebar).getByRole("link", { name: doc.name })).toHaveAttribute(
        "href",
        `/components/${doc.slug}`,
      );
    }
  });

  it("renders the changelog from CHANGELOG.md", async () => {
    renderAt("/changelog");
    expect(await screen.findByRole("heading", { level: 2, name: "v0.2.0" })).toBeInTheDocument();
    expect(screen.getByText("Latest")).toBeInTheDocument();
    expect(screen.getAllByText("Added")).not.toHaveLength(0);
  });
});

describe("site features", () => {
  it("opens search with Ctrl+K and navigates to the chosen result", async () => {
    const { router, user } = renderAt("/");
    await screen.findByRole("heading", { level: 1 });

    await user.keyboard("{Control>}k{/Control}");
    const input = await screen.findByRole("combobox", { name: "Search documentation" });
    expect(input).toHaveFocus();

    await user.type(input, "dropdown");
    expect(screen.getAllByRole("option")[0]).toHaveTextContent("Dropdown");

    await user.keyboard("{Enter}");
    expect(await screen.findByRole("heading", { level: 1, name: "Dropdown" })).toBeInTheDocument();
    expect(router.state.location.pathname).toBe("/components/dropdown");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("moves the active search result with the arrow keys", async () => {
    const { user } = renderAt("/");
    await user.click(await screen.findByRole("button", { name: "Search documentation" }));

    const input = screen.getByRole("combobox", { name: "Search documentation" });
    const options = screen.getAllByRole("option");
    expect(options[0]).toHaveAttribute("aria-selected", "true");
    expect(input).toHaveAttribute("aria-activedescendant", options[0]?.id);

    await user.keyboard("{ArrowDown}");
    expect(options[1]).toHaveAttribute("aria-selected", "true");
    expect(input).toHaveAttribute("aria-activedescendant", options[1]?.id);

    await user.keyboard("{ArrowUp}{ArrowUp}");
    expect(options.at(-1)).toHaveAttribute("aria-selected", "true");
  });

  it("says so when nothing matches", async () => {
    const { user } = renderAt("/");
    await user.click(await screen.findByRole("button", { name: "Search documentation" }));
    await user.type(screen.getByRole("combobox"), "qwerty");
    const dialog = screen.getByRole("dialog", { name: "Search documentation" });
    expect(within(dialog).getByRole("status")).toHaveTextContent("No results for “qwerty”.");
    expect(within(dialog).queryAllByRole("option")).toHaveLength(0);
  });

  it("toggles dark mode and remembers the choice", async () => {
    const { user } = renderAt("/");
    const toggle = await screen.findByRole("button", { name: "Dark mode" });
    expect(toggle).toHaveAttribute("aria-pressed", "false");

    await user.click(toggle);
    expect(document.documentElement.dataset.cpsTheme).toBe("dark");
    expect(toggle).toHaveAttribute("aria-pressed", "true");
    expect(localStorage.getItem("cps-docs-theme")).toBe("dark");
  });

  it("copies code to the clipboard and announces it", async () => {
    const { user } = renderAt("/");
    await screen.findByRole("heading", { level: 1 });

    const [installCopy] = screen.getAllByRole("button", { name: "Copy code" });
    if (!installCopy) throw new Error("copy button not found");
    await user.click(installCopy);

    expect(await navigator.clipboard.readText()).toBe("npm install @codecps/ui");
    expect(screen.getByText("Copied to clipboard")).toBeInTheDocument();
  });

  it("updates the live preview and its code when a prop changes", async () => {
    const { user } = renderAt("/components/button");
    await screen.findByRole("heading", { level: 1, name: "Button" });

    const controls = screen.getByRole("form", { name: "Props" });
    await user.click(within(controls).getByRole("radio", { name: "outline" }));
    await user.click(within(controls).getByRole("checkbox", { name: "Loading" }));

    const preview = screen.getByRole("button", { name: "Start Project" });
    expect(preview).toHaveClass("cps-button--outline");
    expect(preview).toHaveAttribute("aria-busy", "true");

    const code = document.querySelector(".docs-playground__code")?.textContent;
    expect(code).toContain('<Button variant="outline" loading>Start Project</Button>');
  });

  it("moves focus to the new page's heading after navigating", async () => {
    const { user } = renderAt("/");
    await screen.findByRole("heading", { level: 1 });

    const nav = screen.getByRole("navigation", { name: "Main" });
    await user.click(within(nav).getByRole("link", { name: "Components" }));

    expect(await screen.findByRole("heading", { level: 1, name: "Components" })).toHaveFocus();
  });
});
