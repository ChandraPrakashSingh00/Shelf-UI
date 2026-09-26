import { Button, Tooltip } from "@codecps/ui";

export default function TooltipBasic() {
  return (
    <Tooltip content="Deploys the latest commit on main to production">
      <Button>Deploy</Button>
    </Tooltip>
  );
}
