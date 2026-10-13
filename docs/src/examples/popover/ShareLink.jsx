import { Button, Input, Popover } from "@shelf-ui/react";
import { useState } from "react";

const link = "https://example.com/p/storefront-web";

export default function PopoverShareLink() {
  const [copied, setCopied] = useState(false);

  const copyLink = () => {
    navigator.clipboard.writeText(link).then(() => setCopied(true));
  };

  return (
    <Popover
      trigger={<Button variant="outline">Share</Button>}
      title="Share project"
      onOpenChange={() => setCopied(false)}
    >
      <div style={{ display: "grid", gap: 12 }}>
        <p style={{ margin: 0 }}>
          Anyone with the link can view storefront-web and its deployments.
        </p>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 8 }}>
          <Input
            label="Project link"
            value={link}
            readOnly
            onFocus={(event) => event.target.select()}
          />
          <Button onClick={copyLink}>Copy</Button>
        </div>
        <p
          role="status"
          style={{ minHeight: "1.5em", margin: 0, color: "var(--shelf-color-success-text)" }}
        >
          {copied ? "Link copied to the clipboard." : ""}
        </p>
      </div>
    </Popover>
  );
}
