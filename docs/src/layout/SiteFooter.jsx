import { Link } from "react-router";
import { BrandLogo } from "../components/Logo.jsx";
import { NewsletterForm } from "../components/NewsletterForm.jsx";
import { SocialLinks } from "../components/SocialLinks.jsx";
import { issuesUrl, privacyUrl, termsUrl } from "../content/site.js";

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
          <Link to="/" className="docs-footer__logo" aria-label="CodeCPS UI home">
            <BrandLogo tone="inverse" />
          </Link>
          <p className="docs-footer__tagline">Build Faster. Build Better.</p>
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

        <section className="docs-footer__column" aria-labelledby="footer-newsletter">
          <h2 id="footer-newsletter" className="docs-footer__title">
            Newsletter
          </h2>
          <p className="docs-footer__text">Get updates on new components and features.</p>
          <NewsletterForm />
        </section>
      </div>

      <div className="docs-container docs-footer__bottom">
        <p>© {new Date().getFullYear()} CodeCPS Technologies. Released under the MIT License.</p>
        <ul className="docs-footer__legal">
          <li>
            <a href={privacyUrl} target="_blank" rel="noreferrer">
              Privacy Policy
            </a>
          </li>
          <li>
            <a href={termsUrl} target="_blank" rel="noreferrer">
              Terms of Service
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
}
