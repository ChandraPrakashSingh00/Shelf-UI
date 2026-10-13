import { Button } from "shelf-ui-react";
import { Link } from "react-router";

export default function ButtonAsLink() {
  return (
    <>
      <Button asChild>
        <Link to="/docs/installation">Get started</Link>
      </Button>
      <Button asChild variant="outline">
        <Link to="/components">Browse components</Link>
      </Button>
    </>
  );
}
