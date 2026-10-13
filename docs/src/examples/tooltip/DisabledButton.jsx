import { Button, Tooltip } from "shelf-ui-react";

export default function TooltipDisabledButton() {
  return (
    <Tooltip content="Only project owners can delete a project">
      {/* A disabled button can't be focused or hovered, so this wrapper takes its place. */}
      <span tabIndex={0} style={{ display: "inline-flex", borderRadius: 8 }}>
        <Button variant="danger" disabled style={{ pointerEvents: "none" }}>
          Delete project
        </Button>
      </span>
    </Tooltip>
  );
}
