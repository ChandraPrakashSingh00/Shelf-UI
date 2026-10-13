import { Link } from "react-router";
import { BrandLogo } from "../components/Logo.jsx";
import { SocialLinks } from "../components/SocialLinks.jsx";
import { issuesUrl, licenseUrl, productName, releasesUrl, repositoryUrl } from "../content/site.js";

const quickLinks = [
  { to: "/", label: "Home" },
  { to: "/components", label: "Components" },
  { to: "/docs", label: "Documentation" },
  { to: "/blog", label: "Blog" },
  { to: "/about", label: "About" },
];

const resourceLinks = [
  { to: "/docs/installation", label: "Installation" },
  { to: "/docs/theming", label: "Guides" },
  { to: "/changelog", label: "Changelog" },
  { to: "/components", label: "Examples" },
  { href: issuesUrl, label: "Support" },
];

function FooterLink({ link }) {
  return link.href ? (
    <a href={link.href} target="_blank" rel="noreferrer">
      {link.label}
    </a>
  ) : (
    <Link to={link.to}>{link.label}</Link>
  );
}

export function SiteFooter() {
  return (
    <footer className="docs-footer">
      <div className="docs-container docs-footer__grid">
        <div className="docs-footer__about">
          <Link to="/" className="docs-footer__logo" aria-label={`${productName} home`}>
            <BrandLogo tone="inverse" byline />
          </Link>
          <p className="docs-footer__tagline">Off-the-shelf components, made to fit your brand.</p>
          <SocialLinks />
        </div>

        <nav className="docs-footer__column" aria-labelledby="footer-quick-links">
          <h2 id="footer-quick-links" className="docs-footer__title">
            Quick Links
          </h2>
          <ul>
            {quickLinks.map((link) => (
              <li key={link.label}>
                <FooterLink link={link} />
              </li>
            ))}
          </ul>
        </nav>

        <nav className="docs-footer__column" aria-labelledby="footer-resources">
          <h2 id="footer-resources" className="docs-footer__title">
            Resources
          </h2>
          <ul>
            {resourceLinks.map((link) => (
              <li key={link.label}>
                <FooterLink link={link} />
              </li>
            ))}
          </ul>
        </nav>

        <section className="docs-footer__column" aria-labelledby="footer-updates">
          <h2 id="footer-updates" className="docs-footer__title">
            Stay updated
          </h2>
          <p className="docs-footer__text">
            Every release lists its new components and fixes in the changelog.
          </p>
          <div className="docs-footer__actions">
            <Link to="/changelog" className="docs-footer__button">
              Read the changelog
            </Link>
            <a
              href={releasesUrl}
              target="_blank"
              rel="noreferrer"
              className="docs-footer__button docs-footer__button--ghost"
            >
              Watch releases on GitHub
            </a>
          </div>
        </section>
      </div>

      <div className="docs-container docs-footer__bottom">
        <p>
          © {new Date().getFullYear()} {productName} contributors. Released under the MIT License.
        </p>
        <ul className="docs-footer__legal">
          <li>
            <a href={licenseUrl} target="_blank" rel="noreferrer">
              License
            </a>
          </li>
          <li>
            <a href={repositoryUrl} target="_blank" rel="noreferrer">
              Source code
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
}
