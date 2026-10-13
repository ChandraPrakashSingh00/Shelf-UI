import { Link } from "shelf-ui-react";
import { Link as RouterLink } from "react-router";

export default function LinkRouterLinks() {
  return (
    <p style={{ margin: 0 }}>
      Filters on the product page use{" "}
      <Link asChild>
        <RouterLink to="/components/tag">Tag</RouterLink>
      </Link>{" "}
      and{" "}
      <Link asChild>
        <RouterLink to="/components/toggle-group">ToggleGroup</RouterLink>
      </Link>
      .
    </p>
  );
}
