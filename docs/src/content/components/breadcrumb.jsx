import { Breadcrumb } from "shelf-ui-react";
import Basic from "../../examples/breadcrumb/Basic.jsx";
import basicCode from "../../examples/breadcrumb/Basic.jsx?raw";
import CustomSeparator from "../../examples/breadcrumb/CustomSeparator.jsx";
import customSeparatorCode from "../../examples/breadcrumb/CustomSeparator.jsx?raw";
import LongTrail from "../../examples/breadcrumb/LongTrail.jsx";
import longTrailCode from "../../examples/breadcrumb/LongTrail.jsx?raw";
import RouterLinks from "../../examples/breadcrumb/RouterLinks.jsx";
import routerLinksCode from "../../examples/breadcrumb/RouterLinks.jsx?raw";

function BreadcrumbThumbnail() {
  return (
    <Breadcrumb label="Preview">
      <Breadcrumb.Item href="#preview">Home</Breadcrumb.Item>
      <Breadcrumb.Item href="#preview">Projects</Breadcrumb.Item>
      <Breadcrumb.Item current>storefront-web</Breadcrumb.Item>
    </Breadcrumb>
  );
}

export const breadcrumbDoc = {
  slug: "breadcrumb",
  name: "Breadcrumb",
  category: "Navigation",
  summary: "Trail of links showing where the current page sits in the site.",
  description:
    "A trail of links from the top of your site or app down to the current page, like Projects › storefront-web › Settings. It helps people see where they are and go back up a level. Use `asChild` to render your router's links.",
  keywords: ["breadcrumbs", "trail", "path", "hierarchy", "location", "crumbs", "navigation"],
  imports: ["Breadcrumb"],
  Thumbnail: BreadcrumbThumbnail,
  examples: [
    {
      id: "basic",
      title: "Basic",
      description:
        "Link each level with `href`, top level first, and mark the last item as `current`.",
      Component: Basic,
      code: basicCode,
    },
    {
      id: "router-links",
      title: "With router links",
      description:
        "`asChild` renders your router's `Link` with the breadcrumb's styling. These links work: they navigate these docs.",
      Component: RouterLinks,
      code: routerLinksCode,
    },
    {
      id: "custom-separator",
      title: "Custom separator",
      description: "Pass any text or icon as `separator`, like a slash for a file path.",
      Component: CustomSeparator,
      code: customSeparatorCode,
    },
    {
      id: "long-trail",
      title: "Long trail",
      description:
        "Items wrap onto more lines when space runs out, and labels wider than 16rem end in an ellipsis. Set `--shelf-breadcrumb-item-max-width` to change that limit.",
      Component: LongTrail,
      code: longTrailCode,
    },
  ],
  api: [
    {
      title: "Breadcrumb",
      description:
        "Renders a `<nav>` around an `<ol>`. Other props and the `ref` go to the `<nav>`.",
      props: [
        {
          name: "label",
          type: "string",
          default: '"Breadcrumb"',
          description: "Accessible name of the `<nav>` landmark.",
        },
        {
          name: "separator",
          type: "node",
          description:
            'Shown between items, for example `"/"`. Defaults to a chevron icon. Hidden from screen readers.',
        },
        {
          name: "children",
          type: "node",
          description: "`Breadcrumb.Item` elements, from the top level down to the current page.",
        },
      ],
    },
    {
      title: "Breadcrumb.Item",
      description:
        "Also exported as `BreadcrumbItem`. Renders `<li><a></a></li>`; other props and the `ref` go to the link (or to the current page's `<span>`).",
      props: [
        { name: "href", type: "string", description: "Link target." },
        {
          name: "current",
          type: "boolean",
          default: "false",
          description:
            'Marks the current page, rendered as a `<span aria-current="page">` instead of a link.',
        },
        {
          name: "asChild",
          type: "boolean",
          default: "false",
          description:
            "Renders the child element (e.g. a router `Link`) instead of an `<a>`. Put the link target and any `ref` on the child.",
        },
        { name: "children", type: "node", description: "The item's label." },
      ],
    },
  ],
  keyboard: [
    {
      keys: ["Tab"],
      description:
        "Moves through the links in order. The current page isn't a link, so it's skipped.",
    },
    { keys: ["Enter"], description: "Follows the focused link." },
  ],
  accessibility: [
    'Follows the WAI-ARIA breadcrumb pattern: a `<nav>` landmark named "Breadcrumb" (change it with `label`) around an ordered list.',
    'The current page has `aria-current="page"` and isn\'t a link, since it would only lead to itself.',
    "Separators are `aria-hidden`, so screen readers read just the trail.",
    "A truncated label keeps its full text in the DOM, so screen readers read all of it. To show it on hover too, add a `title`.",
  ],
};
