import { Breadcrumb } from "@shelf-ui/react";

export default function BreadcrumbCustomSeparator() {
  return (
    <Breadcrumb label="File path" separator="/">
      <Breadcrumb.Item href="#acme">acme</Breadcrumb.Item>
      <Breadcrumb.Item href="#storefront-api">storefront-api</Breadcrumb.Item>
      <Breadcrumb.Item href="#src">src</Breadcrumb.Item>
      <Breadcrumb.Item current>server.js</Breadcrumb.Item>
    </Breadcrumb>
  );
}
