import { Avatar, AvatarGroup } from "shelf-ui-react";
import { definePlayground } from "../../components/LivePlayground.jsx";
import aditi from "../../examples/avatar/aditi.svg";
import Fallbacks from "../../examples/avatar/Fallbacks.jsx";
import fallbacksCode from "../../examples/avatar/Fallbacks.jsx?raw";
import Group from "../../examples/avatar/Group.jsx";
import groupCode from "../../examples/avatar/Group.jsx?raw";
import Images from "../../examples/avatar/Images.jsx";
import imagesCode from "../../examples/avatar/Images.jsx?raw";
import rohan from "../../examples/avatar/rohan.svg";
import Sizes from "../../examples/avatar/Sizes.jsx";
import sizesCode from "../../examples/avatar/Sizes.jsx?raw";
import sneha from "../../examples/avatar/sneha.svg";
import Square from "../../examples/avatar/Square.jsx";
import squareCode from "../../examples/avatar/Square.jsx?raw";
import { formatJsx, withImport } from "../../lib/jsx.js";

const sizes = ["xs", "sm", "md", "lg", "xl"];
const shapes = ["circle", "square"];

function AvatarThumbnail() {
  return (
    <AvatarGroup size="lg" max={3}>
      <Avatar src={aditi} name="Aditi Rao" />
      <Avatar src={rohan} name="Rohan Mehta" />
      <Avatar src={sneha} name="Sneha Iyer" />
      <Avatar name="Arjun Nair" />
      <Avatar name="Kavya Reddy" />
    </AvatarGroup>
  );
}

export const avatarDoc = {
  slug: "avatar",
  name: "Avatar",
  category: "Media",
  summary: "Picture of a person or workspace, with initials when there's no image.",
  description:
    "Shows a profile picture, and falls back to initials (or an icon) when there's no image or it fails to load. Stack several in an `AvatarGroup` to show who's on a project, with a “+N” for the rest.",
  keywords: [
    "profile picture",
    "user",
    "photo",
    "initials",
    "team",
    "members",
    "avatar group",
    "stack",
    "facepile",
  ],
  imports: ["Avatar", "AvatarGroup"],
  Thumbnail: AvatarThumbnail,
  Playground: definePlayground({
    defaults: { size: "lg", shape: "circle", name: "Aditi Rao", image: true },
    controls: {
      size: { type: "select", label: "Size", options: sizes },
      shape: { type: "select", label: "Shape", options: shapes },
      name: { type: "text", label: "Name" },
      image: { type: "boolean", label: "Image" },
    },
    render: (values) => (
      <Avatar
        src={values.image ? aditi : undefined}
        name={values.name || undefined}
        size={values.size}
        shape={values.shape}
      />
    ),
    code: (values) =>
      withImport(
        ["Avatar"],
        formatJsx(
          "Avatar",
          {
            src: values.image ? "/avatars/aditi-rao.svg" : undefined,
            name: values.name || undefined,
            size: values.size,
            shape: values.shape,
          },
          undefined,
          { defaults: { size: "md", shape: "circle" } },
        ),
      ),
  }),
  examples: [
    {
      id: "images",
      title: "Images",
      description:
        "`name` becomes the image's alt text. Pass `alt` to describe the image differently, as on the last avatar.",
      Component: Images,
      code: imagesCode,
    },
    {
      id: "fallbacks",
      title: "Fallbacks",
      description:
        "Without `src`, or when the image fails to load, the avatar shows your `fallback`, the initials of `name`, or a user icon. The second image URL is broken on purpose.",
      Component: Fallbacks,
      code: fallbacksCode,
    },
    { id: "sizes", title: "Sizes", Component: Sizes, code: sizesCode },
    {
      id: "square",
      title: "Square",
      description:
        'Use `shape="square"` for workspaces, teams and projects. When the name is shown next to the avatar, pass `alt=""` so screen readers don\'t read it twice.',
      Component: Square,
      code: squareCode,
    },
    {
      id: "group",
      title: "Group",
      description:
        "`AvatarGroup` overlaps its avatars and shows the first `max`, then a “+N” avatar for the rest. Its `size` applies to every avatar inside.",
      Component: Group,
      code: groupCode,
    },
  ],
  api: [
    {
      title: "Avatar",
      description:
        "Renders a `<span>` and accepts its native attributes. The `ref` points to it. For a custom size, set the `--shelf-avatar-size` CSS variable (for example with `style`).",
      props: [
        {
          name: "src",
          type: "string",
          description: "Image URL. When it's missing or fails to load, the fallback shows.",
        },
        {
          name: "name",
          type: "string",
          description:
            "The person's name. Gives the initials (first letters of the first and last words) and the default `alt`.",
        },
        {
          name: "alt",
          type: "string",
          default: "name",
          description:
            "Accessible name: the image's alt text, or the fallback's label. Pass `\"\"` when the name is visible next to the avatar.",
        },
        {
          name: "fallback",
          type: "node",
          description: "Content shown instead of the initials when there's no image, e.g. an icon.",
        },
        {
          name: "size",
          type: '"xs" | "sm" | "md" | "lg" | "xl"',
          default: '"md"',
          description:
            "24, 32, 40, 56 or 72 px (at the default font size). Inside an `AvatarGroup`, defaults to the group's size.",
        },
        {
          name: "shape",
          type: '"circle" | "square"',
          default: '"circle"',
          description: "Round, or a rounded square for workspaces and teams.",
        },
      ],
    },
    {
      title: "AvatarGroup",
      description:
        'Renders a `<span role="group">` and accepts its native attributes. The `ref` points to it. The ring between avatars uses the `--shelf-avatar-group-ring` CSS variable (the page background by default): set it to the color behind the group, e.g. `var(--shelf-color-surface)` on a card.',
      props: [
        {
          name: "children",
          type: "node",
          required: true,
          description:
            "The `Avatar` elements, in display order. They can be wrapped, for example in links to profiles.",
        },
        {
          name: "max",
          type: "number",
          description: "How many avatars to show. The rest are summed up in a “+N” avatar.",
        },
        {
          name: "size",
          type: '"xs" | "sm" | "md" | "lg" | "xl"',
          default: '"md"',
          description: "Size of every avatar in the group. An avatar's own `size` wins.",
        },
        {
          name: "label",
          type: "string",
          description: "Accessible name of the group, e.g. “Project members”.",
        },
      ],
    },
  ],
  accessibility: [
    'With an image, `alt` (which defaults to `name`) is the image\'s alternative text. While the fallback shows, the avatar has `role="img"` and the same accessible name.',
    "Without `name` or `alt`, the avatar is decorative and hidden from screen readers (`aria-hidden`).",
    "When the person's name is visible next to the avatar, pass `alt=\"\"` so screen readers don't announce it twice.",
    '`AvatarGroup` is a `role="group"`: give it a `label` such as “Project members”. The “+N” avatar is announced as “N more”.',
    "Avatars aren't interactive. To link to a profile, wrap the avatar in a link or button with an accessible name.",
  ],
};
