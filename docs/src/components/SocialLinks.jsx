import { contactEmail, instagramUrl, npmUrl, repositoryUrl } from "../content/site.js";
import { GitHubIcon, InstagramIcon, MailIcon, NpmIcon } from "./icons.jsx";

const links = [
  { href: repositoryUrl, label: "GitHub", Icon: GitHubIcon },
  { href: npmUrl, label: "npm", Icon: NpmIcon },
  { href: instagramUrl, label: "Instagram", Icon: InstagramIcon },
  { href: `mailto:${contactEmail}`, label: "Email", Icon: MailIcon },
];

/** Icon links to CodeCPS on GitHub, npm, Instagram and email. */
export function SocialLinks({ className }) {
  return (
    <ul className={["docs-social", className].filter(Boolean).join(" ")}>
      {links.map(({ href, label, Icon }) => (
        <li key={label}>
          <a
            href={href}
            aria-label={label}
            title={label}
            {...(href.startsWith("mailto:") ? {} : { target: "_blank", rel: "noreferrer" })}
          >
            <Icon />
          </a>
        </li>
      ))}
    </ul>
  );
}
