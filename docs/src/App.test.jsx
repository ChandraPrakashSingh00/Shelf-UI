import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RouterProvider, createMemoryRouter } from "react-router";
import { beforeAll, beforeEach, describe, expect, it } from "vitest";
import { categories, componentDocs } from "./content/components/index.js";
import { docsPages } from "./content/docsPages.js";
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

const repo = "https://github.com/ChandraPrakashSingh00/CodeCPS-UI-Library-";

describe("pages", () => {
  it("renders the home page inside the site header and footer", async () => {
    renderAt("/");
    expect(
      await screen.findByRole("heading", { level: 1, name: /build beautiful uis faster/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole("navigation", { name: "Main" })).toBeInTheDocument();
    expect(screen.getByRole("contentinfo")).toHaveTextContent("CodeCPS Technologies");
    expect(
      screen.getByRole("heading", { level: 2, name: "Popular Components" }),
    ).toBeInTheDocument();
  });

  it("works under a sub-path, as on GitHub Pages", async () => {
    const { user } = renderAt("/CodeCPS-UI-Library-/components/button", {
      basename: "/CodeCPS-UI-Library-",
    });
    expect(await screen.findByRole("heading", { level: 1, name: "Button" })).toBeInTheDocument();

    const header = screen.getByRole("navigation", { name: "Main" });
    expect(within(header).getByRole("link", { name: "Home" })).toHaveAttribute(
      "href",
      "/CodeCPS-UI-Library-",
    );

    await user.click(within(header).getByRole("link", { name: "Docs" }));
    expect(
      await screen.findByRole("heading", { level: 1, name: "Introduction" }),
    ).toBeInTheDocument();
  });

  it.each(componentDocs.map((doc) => [doc.name, doc]))(
    "renders the %s page with every example and its API reference",
    async (_name, doc) => {
      const { user } = renderAt(`/components/${doc.slug}#examples`);

      expect(await screen.findByRole("heading", { level: 1, name: doc.name })).toBeInTheDocument();
      for (const example of doc.examples) {
        expect(screen.getByRole("heading", { level: 3, name: example.title })).toBeInTheDocument();
      }
      expect(document.title).toBe(`${doc.name} · CodeCPS UI`);

      await user.click(screen.getByRole("tab", { name: "Props" }));
      expect(screen.getByRole("heading", { level: 2, name: "API reference" })).toBeInTheDocument();
    },
  );

  it.each([
    ["/components", "All Components"],
    ["/docs", "Introduction"],
    ["/docs/installation", "Installation"],
    ["/docs/setup", "Setup"],
    ["/docs/theming", "Theming"],
    ["/docs/customization", "Customization"],
    ["/docs/accessibility", "Accessibility"],
    ["/docs/component-api", "Component API"],
    ["/docs/design-tokens", "Design tokens"],
    ["/changelog", "Changelog"],
    ["/blog", "Blog & Resources"],
    ["/blog/whats-new-in-0-2-0", "What's new in CodeCPS UI 0.2.0"],
    ["/search?q=button", "Search Results"],
    ["/about", "About Us"],
    ["/components/unknown", "Page Not Found"],
    ["/blog/unknown", "Page Not Found"],
    ["/no-such-page", "Page Not Found"],
  ])("renders %s", async (path, heading) => {
    renderAt(path);
    expect(await screen.findByRole("heading", { level: 1, name: heading })).toBeInTheDocument();
  });

  it("links to the source code on GitHub from the footer and the About page", async () => {
    renderAt("/about");
    await screen.findByRole("heading", { level: 1, name: "About Us" });

    const footer = screen.getByRole("contentinfo");
    expect(within(footer).getByRole("link", { name: "GitHub" })).toHaveAttribute("href", repo);
    expect(within(footer).getByRole("link", { name: "Support" })).toHaveAttribute(
      "href",
      `${repo}/issues`,
    );
    expect(screen.getByRole("link", { name: "View on GitHub" })).toHaveAttribute("href", repo);
    expect(screen.getByRole("link", { name: "Open an issue" })).toHaveAttribute(
      "href",
      `${repo}/issues`,
    );
  });

  it("lists every docs page and component category in the docs sidebar", async () => {
    renderAt("/docs");
    await screen.findByRole("heading", { level: 1, name: "Introduction" });

    const [sidebar] = screen.getAllByRole("navigation", { name: "Documentation" });
    if (!sidebar) throw new Error("sidebar not found");
    for (const page of docsPages) {
      expect(within(sidebar).getByRole("link", { name: page.title })).toHaveAttribute(
        "href",
        page.href,
      );
    }
    for (const category of categories) {
      expect(
        within(sidebar).getByRole("link", { name: new RegExp(`^${category.name} \\d+$`) }),
      ).toHaveAttribute("href", `/components?category=${category.slug}`);
    }
  });

  it("collapses a docs sidebar group", async () => {
    const { user } = renderAt("/docs");
    await screen.findByRole("heading", { level: 1, name: "Introduction" });

    const [sidebar] = screen.getAllByRole("navigation", { name: "Documentation" });
    const toggle = within(sidebar).getByRole("button", { name: "Guides" });
    expect(toggle).toHaveAttribute("aria-expanded", "true");

    await user.click(toggle);
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(within(sidebar).queryByRole("link", { name: "Theming" })).not.toBeInTheDocument();
  });

  it("lists every component on the components page", async () => {
    renderAt("/components");
    await screen.findByRole("heading", { level: 1, name: "All Components" });

    const index = screen.getByRole("heading", { level: 2, name: /A–Z/ }).closest("section");
    for (const doc of componentDocs) {
      expect(within(index).getByRole("link", { name: doc.name })).toHaveAttribute(
        "href",
        `/components/${doc.slug}`,
      );
    }
  });

  it("shows one category's components", async () => {
    renderAt("/components?category=media");
    expect(await screen.findByRole("heading", { level: 2, name: "Media" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Avatar" })).toHaveAttribute(
      "href",
      "/components/avatar",
    );
    expect(screen.getByRole("link", { name: "Carousel" })).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Button" })).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: /^Media \d+$/ })).toHaveAttribute(
      "aria-current",
      "page",
    );
  });

  it("renders the changelog from CHANGELOG.md", async () => {
    renderAt("/changelog");
    expect(await screen.findByRole("heading", { level: 2, name: "v0.2.0" })).toBeInTheDocument();
    expect(screen.getByText("Latest")).toBeInTheDocument();
    expect(screen.getAllByText("Added")).not.toHaveLength(0);
  });

  it("lists the design tokens from the library's stylesheet", async () => {
    renderAt("/docs/design-tokens");
    await screen.findByRole("heading", { level: 1, name: "Design tokens" });
    expect(screen.getByRole("heading", { level: 2, name: "Primary" })).toBeInTheDocument();
    expect(screen.getByText("--cps-color-primary")).toBeInTheDocument();
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

  it("opens every result for a query on the search page", async () => {
    const { router, user } = renderAt("/");
    await user.click(await screen.findByRole("button", { name: "Search documentation" }));
    await user.type(screen.getByRole("combobox"), "button");
    await user.click(screen.getByRole("button", { name: "See all results for “button”" }));

    expect(
      await screen.findByRole("heading", { level: 1, name: "Search Results" }),
    ).toBeInTheDocument();
    expect(router.state.location.search).toBe("?q=button");
    expect(screen.getByRole("link", { name: "Button" })).toHaveAttribute(
      "href",
      "/components/button",
    );
  });

  it("filters search results by category", async () => {
    const { user } = renderAt("/search?q=button");
    await screen.findByRole("heading", { level: 1, name: "Search Results" });

    const filters = screen.getByRole("navigation", { name: "Filter by Category" });
    await user.click(within(filters).getByRole("link", { name: /^Examples \d+$/ }));

    expect(await screen.findByText(/^\d+ results? in Examples$/)).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Button" })).not.toBeInTheDocument();

    await user.click(screen.getByRole("link", { name: "Clear filter" }));
    expect(screen.getByRole("link", { name: "Button" })).toBeInTheDocument();
  });

  it("searches components from the components page", async () => {
    const { router, user } = renderAt("/components");
    await screen.findByRole("heading", { level: 1, name: "All Components" });

    await user.type(screen.getByRole("searchbox", { name: "Search components" }), "date{Enter}");
    expect(
      await screen.findByRole("heading", { level: 1, name: "Search Results" }),
    ).toBeInTheDocument();
    expect(router.state.location.search).toBe("?q=date");
    expect(screen.getByRole("link", { name: "DatePicker" })).toBeInTheDocument();
  });

  it("filters and searches blog posts", async () => {
    const { user } = renderAt("/blog");
    await screen.findByRole("heading", { level: 1, name: "Blog & Resources" });
    expect(screen.getByRole("navigation", { name: "Article pages" })).toBeInTheDocument();

    const categoriesNav = screen.getByRole("navigation", { name: "Article categories" });
    await user.click(within(categoriesNav).getByRole("link", { name: "Updates" }));
    expect(
      screen.getByRole("heading", { level: 2, name: "Introducing CodeCPS UI" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { level: 2, name: "Five habits for accessible forms" }),
    ).not.toBeInTheDocument();

    await user.click(within(categoriesNav).getByRole("link", { name: "All" }));
    await user.type(screen.getByRole("searchbox", { name: "Search articles" }), "tailwind");
    expect(screen.getAllByRole("heading", { level: 2 }).map((h) => h.textContent)).toContain(
      "Using CodeCPS UI with Tailwind CSS",
    );
    expect(screen.getByText("1 article")).toHaveAttribute("role", "status");
  });

  it("opens the tab a link points to on a component page", async () => {
    const { router, user } = renderAt("/components/button#loading");
    await screen.findByRole("heading", { level: 1, name: "Button" });

    expect(screen.getByRole("tab", { name: "Examples" })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("heading", { level: 3, name: "Loading" })).toBeInTheDocument();

    await user.click(screen.getByRole("tab", { name: "Accessibility" }));
    expect(router.state.location.hash).toBe("#accessibility");
    expect(
      screen.getByRole("heading", { level: 2, name: "Keyboard interactions" }),
    ).toBeInTheDocument();
  });

  it("sends links to sections that moved off the installation page to their new page", async () => {
    const { router } = renderAt("/docs/installation#dark-mode");
    expect(await screen.findByRole("heading", { level: 1, name: "Theming" })).toBeInTheDocument();
    expect(router.state.location.pathname).toBe("/docs/theming");
    expect(router.state.location.hash).toBe("#dark-mode");
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

    await user.click(screen.getByRole("button", { name: "Copy install command" }));

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

    expect(await screen.findByRole("heading", { level: 1, name: "All Components" })).toHaveFocus();
  });
});
