import { Breadcrumb } from "@codecps/ui";
import { Link } from "react-router";

export default function BreadcrumbRouterLinks() {
  return (
    <Breadcrumb>
      <Breadcrumb.Item asChild>
        <Link to="/">Home</Link>
      </Breadcrumb.Item>
      <Breadcrumb.Item asChild>
        <Link to="/components">Components</Link>
      </Breadcrumb.Item>
      <Breadcrumb.Item current>Breadcrumb</Breadcrumb.Item>
    </Breadcrumb>
  );
}
