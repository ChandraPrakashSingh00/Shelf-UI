/** Joins the truthy class names into a single `className` string. */
export function cx(...classes) {
  return classes.filter(Boolean).join(" ");
}
