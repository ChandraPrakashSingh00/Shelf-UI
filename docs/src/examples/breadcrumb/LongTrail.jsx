import { Breadcrumb } from "@shelf-ui/react";

export default function BreadcrumbLongTrail() {
  return (
    <div style={{ width: "100%", maxWidth: 420 }}>
      <Breadcrumb>
        <Breadcrumb.Item href="#home">Home</Breadcrumb.Item>
        <Breadcrumb.Item href="#clients">Clients</Breadcrumb.Item>
        <Breadcrumb.Item href="#sharma-textiles">Sharma Textiles Pvt. Ltd.</Breadcrumb.Item>
        <Breadcrumb.Item href="#projects">Projects</Breadcrumb.Item>
        <Breadcrumb.Item href="#onboarding-portal">
          Customer onboarding portal redesign (Phase 2)
        </Breadcrumb.Item>
        <Breadcrumb.Item href="#deployments">Deployments</Breadcrumb.Item>
        <Breadcrumb.Item current>dpl_7Hq2kX9mPa</Breadcrumb.Item>
      </Breadcrumb>
    </div>
  );
}
