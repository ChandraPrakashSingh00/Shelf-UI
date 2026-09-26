import { Breadcrumb } from "@codecps/ui";

export default function BreadcrumbCustomSeparator() {
  return (
    <Breadcrumb label="File path" separator="/">
      <Breadcrumb.Item href="#codecps">codecps</Breadcrumb.Item>
      <Breadcrumb.Item href="#codecps-api">codecps-api</Breadcrumb.Item>
      <Breadcrumb.Item href="#src">src</Breadcrumb.Item>
      <Breadcrumb.Item current>server.js</Breadcrumb.Item>
    </Breadcrumb>
  );
}
