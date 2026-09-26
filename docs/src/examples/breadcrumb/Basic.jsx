import { Breadcrumb } from "@codecps/ui";

export default function BreadcrumbBasic() {
  return (
    <Breadcrumb>
      <Breadcrumb.Item href="#dashboard">Dashboard</Breadcrumb.Item>
      <Breadcrumb.Item href="#projects">Projects</Breadcrumb.Item>
      <Breadcrumb.Item href="#codecps-web">codecps-web</Breadcrumb.Item>
      <Breadcrumb.Item current>Settings</Breadcrumb.Item>
    </Breadcrumb>
  );
}
