import { Badge } from "@codecps/ui";

export default function BadgeVariants() {
  return (
    <>
      <Badge variant="primary">New</Badge>
      <Badge variant="success">Active</Badge>
      <Badge variant="warning">Pending</Badge>
      <Badge variant="danger">Failed</Badge>
      <Badge variant="neutral">Draft</Badge>
    </>
  );
}
