import { npmUrl, repositoryUrl } from "../content/site.js";
import { GitHubIcon, NpmIcon } from "./icons.jsx";

const links = [
  { href: repositoryUrl, label: "GitHub", Icon: GitHubIcon },
  { href: npmUrl, label: "npm", Icon: NpmIcon },
];

/** Icon links to Shelf UI on GitHub and npm. */
export function SocialLinks({ className }) {
  return (
    <ul className={["docs-social", className].filter(Boolean).join(" ")}>
      {links.map(({ href, label, Icon }) => (
        <li key={label}>
          <a href={href} aria-label={label} title={label} target="_blank" rel="noreferrer">
            <Icon />
          </a>
        </li>
      ))}
    </ul>
  );
}
