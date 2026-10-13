import { Badge, Table } from "shelf-ui-react";

const rupees = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});
const units = new Intl.NumberFormat("en-IN");

const products = [
  { sku: "KRT-BLU-M", name: "Cotton kurta", category: "Clothing", stock: 124, price: 899 },
  { sku: "SAR-SLK-01", name: "Banarasi silk saree", category: "Clothing", stock: 8, price: 7499 },
  { sku: "EAR-WL-02", name: "Wireless earbuds", category: "Electronics", stock: 0, price: 1999 },
  { sku: "PWB-20K", name: "20000 mAh power bank", category: "Electronics", stock: 57, price: 1499 },
  { sku: "BTL-STL-1L", name: "Steel water bottle", category: "Kitchen", stock: 310, price: 449 },
  { sku: "TAW-CI-12", name: "Cast iron tawa", category: "Kitchen", stock: 42, price: 1199 },
  { sku: "MAT-YOG-6", name: "Yoga mat, 6 mm", category: "Fitness", stock: 76, price: 699 },
  { sku: "SHO-RUN-9", name: "Running shoes, UK 9", category: "Footwear", stock: 3, price: 2999 },
  { sku: "BAG-LAP-15", name: "Laptop backpack", category: "Accessories", stock: 95, price: 1599 },
  { sku: "LMP-LED-01", name: "LED desk lamp", category: "Home", stock: 0, price: 899 },
  { sku: "CHA-MSL-250", name: "Masala chai, 250 g", category: "Grocery", stock: 540, price: 249 },
  { sku: "WTC-SMT-02", name: "Smartwatch", category: "Electronics", stock: 19, price: 3499 },
];

const totalUnits = products.reduce((sum, product) => sum + product.stock, 0);

const columns = [
  { key: "name", header: "Product", rowHeader: true, sortable: true, footer: "Total" },
  { key: "sku", header: "SKU", sortable: true },
  { key: "category", header: "Category", sortable: true },
  {
    key: "stock",
    header: "Stock",
    numeric: true,
    sortable: true,
    render: (product) =>
      product.stock === 0 ? (
        <Badge variant="danger" size="sm">
          Out of stock
        </Badge>
      ) : (
        units.format(product.stock)
      ),
    footer: `${units.format(totalUnits)} units`,
  },
  {
    key: "price",
    header: "Price",
    numeric: true,
    sortable: true,
    render: (product) => rupees.format(product.price),
  },
];

export default function TableInventory() {
  return (
    <Table
      caption="Inventory"
      columns={columns}
      data={products}
      getRowId={(product) => product.sku}
      size="sm"
      striped
      stickyHeader
      maxHeight="20rem"
    />
  );
}
