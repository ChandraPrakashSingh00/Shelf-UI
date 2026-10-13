import { Tag } from "shelf-ui-react";

export default function TagVariants() {
  return (
    <>
      <Tag>Electronics</Tag>
      <Tag variant="primary">Bestseller</Tag>
      <Tag variant="success">In stock</Tag>
      <Tag variant="warning">Only 3 left</Tag>
      <Tag variant="danger">Discontinued</Tag>
    </>
  );
}
