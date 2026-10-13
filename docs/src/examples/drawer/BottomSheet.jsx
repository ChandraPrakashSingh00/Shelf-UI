import { Button, Drawer, Input } from "@shelf-ui/react";
import { useState } from "react";

const previewUrl = "https://storefront-web-git-checkout.example.com";
const channels = ["Email", "WhatsApp", "Slack", "Microsoft Teams"];

export default function DrawerBottomSheet() {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const close = () => {
    setOpen(false);
    setCopied(false);
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(previewUrl);
      setCopied(true);
    } catch {
      // The browser blocked clipboard access; the link can still be copied from the field.
    }
  };

  return (
    <>
      <Button onClick={() => setOpen(true)}>Share preview</Button>
      <Drawer
        open={open}
        onClose={close}
        side="bottom"
        title="Share preview"
        description="Anyone with the link can view this preview of storefront-web."
      >
        <div style={{ display: "grid", gap: 16, maxWidth: 560 }}>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 8 }}>
            <Input label="Preview link" value={previewUrl} readOnly style={{ flex: 1 }} />
            <Button variant="secondary" onClick={copyLink}>
              {copied ? "Copied" : "Copy link"}
            </Button>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {channels.map((channel) => (
              <Button key={channel} variant="outline" size="sm" onClick={close}>
                {channel}
              </Button>
            ))}
          </div>
        </div>
      </Drawer>
    </>
  );
}
