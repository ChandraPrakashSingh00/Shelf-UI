import { Breadcrumb } from "shelf-ui-react";

export default function BreadcrumbBasic() {
  return (
    <Breadcrumb>
      <Breadcrumb.Item href="#dashboard">Dashboard</Breadcrumb.Item>
      <Breadcrumb.Item href="#projects">Projects</Breadcrumb.Item>
      <Breadcrumb.Item href="#storefront-web">storefront-web</Breadcrumb.Item>
      <Breadcrumb.Item current>Settings</Breadcrumb.Item>
    </Breadcrumb>
  );
}
