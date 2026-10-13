import { Button, Tooltip } from "@shelf-ui/react";

export default function TooltipBasic() {
  return (
    <Tooltip content="Deploys the latest commit on main to production">
      <Button>Deploy</Button>
    </Tooltip>
  );
}
