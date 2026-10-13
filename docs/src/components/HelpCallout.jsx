import { Button } from "shelf-ui-react";
import { issuesUrl, repositoryUrl } from "../content/site.js";
import { Callout } from "./Callout.jsx";
import { GitHubIcon, HelpIcon } from "./icons.jsx";

/** "Need help?" box pointing to the GitHub repository and issues. */
export function HelpCallout() {
  return (
    <Callout
      icon={HelpIcon}
      title="Need help?"
      actions={
        <>
          <Button asChild size="sm">
            <a href={repositoryUrl} target="_blank" rel="noreferrer">
              <GitHubIcon />
              View on GitHub
            </a>
          </Button>
          <Button asChild size="sm" variant="outline">
            <a href={issuesUrl} target="_blank" rel="noreferrer">
              Open an issue
            </a>
          </Button>
        </>
      }
    >
      Read the source on GitHub, or open an issue to report a bug or ask for a component.
    </Callout>
  );
}
