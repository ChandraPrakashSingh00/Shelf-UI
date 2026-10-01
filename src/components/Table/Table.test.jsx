import { act, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef, useState } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Table } from "./Table.jsx";

const orders = [
  {
    id: 1042,
    customer: "Priya Sharma",
    city: "Mumbai",
    date: new Date(2026, 9, 6),
    status: "Delivered",
    amount: 1299,
  },
  {
    id: 1043,
    customer: "Rahul Verma",
    city: "Delhi",
    date: new Date(2026, 9, 2),
    status: "Pending",
    amount: 10500,
  },
  {
    id: 1044,
    customer: "Ananya Iyer",
    city: "Bengaluru",
    date: new Date(2026, 9, 4),
    status: "Shipped",
    amount: 89,
  },
];

const columns = [
  { key: "id", header: "Order", rowHeader: true, render: (order) => `#${order.id}` },
  { key: "customer", header: "Customer", sortable: true },
  { key: "city", header: "City" },
  { key: "date", header: "Date", sortable: true, render: (order) => order.date.getDate() },
  { key: "amount", header: "Amount", sortable: true, numeric: true },
];

// The order ids of the body rows, top to bottom.
const orderIds = () => screen.getAllByRole("rowheader").map((cell) => cell.textContent);
const header = (name) => screen.getByRole("columnheader", { name });
const sortButton = (name) => screen.getByRole("button", { name });

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("Table", () => {
  it("renders a native table with a caption, column headers and row headers", () => {
    render(<Table caption="Recent orders" columns={columns} data={orders} />);

    const table = screen.getByRole("table", { name: "Recent orders" });
    expect(table.tagName).toBe("TABLE");
    expect(
      within(table)
        .getAllByRole("columnheader")
        .map((th) => th.textContent),
    ).toEqual(["Order", "Customer", "City", "Date", "Amount"]);
    expect(header("Order")).toHaveAttribute("scope", "col");
    expect(orderIds()).toEqual(["#1042", "#1043", "#1044"]);
    expect(screen.getByRole("rowheader", { name: "#1042" })).toHaveAttribute("scope", "row");
    expect(screen.getByRole("cell", { name: "Priya Sharma" })).toBeInTheDocument();
    // Unsorted until a header is used; only sortable headers are buttons.
    for (const th of within(table).getAllByRole("columnheader")) {
      expect(th).not.toHaveAttribute("aria-sort");
    }
    expect(screen.queryByRole("button", { name: "City" })).not.toBeInTheDocument();
  });

  it("renders values with accessor, render, and as text for dates (YYYY-MM-DD) and booleans", () => {
    const date = new Date(2026, 9, 6);
    render(
      <Table
        aria-label="Products"
        columns={[
          { key: "name", header: "Product", accessor: (product) => product.name.toUpperCase() },
          { key: "addedOn", header: "Added" },
          { key: "published", header: "Published" },
          { key: "note", header: "Note" },
        ]}
        data={[{ id: 1, name: "Kurta", addedOn: date, published: true, note: null }]}
      />,
    );

    const cells = screen.getAllByRole("cell");
    expect(cells.map((cell) => cell.textContent)).toEqual([
      "KURTA",
      // The same text on the server and in any browser locale.
      "2026-10-06",
      "true",
      "",
    ]);
  });

  it("names the scrolling region after the caption and makes it focusable", () => {
    render(<Table caption="Recent orders" columns={columns} data={orders} />);

    const region = screen.getByRole("region", { name: "Recent orders" });
    expect(region).toHaveAttribute("tabindex", "0");
    expect(region).toContainElement(screen.getByRole("table"));
  });

  it("only makes the container a focusable region while its content overflows", () => {
    const observers = [];
    vi.stubGlobal(
      "ResizeObserver",
      class {
        constructor(callback) {
          this.callback = callback;
          observers.push(this);
        }
        observe() {}
        disconnect() {}
      },
    );
    const { container } = render(<Table aria-label="Orders" columns={columns} data={orders} />);
    const scroller = container.firstChild;
    const resize = (scrollWidth, clientWidth) => {
      Object.defineProperty(scroller, "scrollWidth", { value: scrollWidth, configurable: true });
      Object.defineProperty(scroller, "clientWidth", { value: clientWidth, configurable: true });
      act(() => observers.forEach((observer) => observer.callback([])));
    };

    resize(600, 600);
    expect(screen.queryByRole("region")).not.toBeInTheDocument();
    expect(scroller).not.toHaveAttribute("tabindex");

    resize(900, 320);
    expect(screen.getByRole("region", { name: "Orders" })).toHaveAttribute("tabindex", "0");
  });

  it("hides the caption visually with captionHidden and names the table with aria-label", () => {
    const { rerender } = render(
      <Table caption="Recent orders" captionHidden columns={columns} data={orders} />,
    );
    expect(screen.getByText("Recent orders")).toHaveClass("cps-visually-hidden");
    expect(screen.getByRole("table", { name: "Recent orders" })).toBeInTheDocument();

    rerender(<Table aria-label="Orders" columns={columns} data={orders} />);
    expect(screen.getByRole("table", { name: "Orders" })).toBeInTheDocument();
    expect(screen.getByRole("region", { name: "Orders" })).toBeInTheDocument();
  });

  describe("sorting", () => {
    it("cycles a column ascending → descending → unsorted and sets aria-sort", async () => {
      const user = userEvent.setup();
      const onSortChange = vi.fn();
      render(
        <Table aria-label="Orders" columns={columns} data={orders} onSortChange={onSortChange} />,
      );

      await user.click(sortButton("Amount"));
      expect(orderIds()).toEqual(["#1044", "#1042", "#1043"]);
      expect(header("Amount")).toHaveAttribute("aria-sort", "ascending");
      expect(onSortChange).toHaveBeenLastCalledWith({ key: "amount", direction: "asc" });

      await user.click(sortButton("Amount"));
      expect(orderIds()).toEqual(["#1043", "#1042", "#1044"]);
      expect(header("Amount")).toHaveAttribute("aria-sort", "descending");
      expect(onSortChange).toHaveBeenLastCalledWith({ key: "amount", direction: "desc" });

      await user.click(sortButton("Amount"));
      expect(orderIds()).toEqual(["#1042", "#1043", "#1044"]);
      expect(header("Amount")).not.toHaveAttribute("aria-sort");
      expect(onSortChange).toHaveBeenLastCalledWith(null);
    });

    it("moves aria-sort to the newly sorted column, starting ascending", async () => {
      const user = userEvent.setup();
      render(<Table aria-label="Orders" columns={columns} data={orders} />);

      await user.click(sortButton("Amount"));
      await user.click(sortButton("Customer"));
      expect(header("Customer")).toHaveAttribute("aria-sort", "ascending");
      expect(header("Amount")).not.toHaveAttribute("aria-sort");
      expect(orderIds()).toEqual(["#1044", "#1042", "#1043"]);
    });

    it("sorts dates by time and works from the keyboard", async () => {
      const user = userEvent.setup();
      render(<Table aria-label="Orders" columns={columns} data={orders} />);

      await user.tab(); // the scrolling region
      await user.tab();
      expect(sortButton("Customer")).toHaveFocus();
      await user.tab();
      expect(sortButton("Date")).toHaveFocus();

      await user.keyboard("{Enter}");
      expect(orderIds()).toEqual(["#1043", "#1044", "#1042"]);
      await user.keyboard(" ");
      expect(orderIds()).toEqual(["#1042", "#1044", "#1043"]);
    });

    it("starts from defaultSort", () => {
      render(
        <Table
          aria-label="Orders"
          columns={columns}
          data={orders}
          defaultSort={{ key: "date", direction: "desc" }}
        />,
      );
      expect(orderIds()).toEqual(["#1042", "#1044", "#1043"]);
      expect(header("Date")).toHaveAttribute("aria-sort", "descending");
    });

    it("follows a controlled sort", async () => {
      const user = userEvent.setup();
      const onSortChange = vi.fn();
      const { rerender } = render(
        <Table
          aria-label="Orders"
          columns={columns}
          data={orders}
          sort={null}
          onSortChange={onSortChange}
        />,
      );

      await user.click(sortButton("Amount"));
      expect(onSortChange).toHaveBeenCalledWith({ key: "amount", direction: "asc" });
      // The parent didn't update `sort`, so nothing moved.
      expect(orderIds()).toEqual(["#1042", "#1043", "#1044"]);

      rerender(
        <Table
          aria-label="Orders"
          columns={columns}
          data={orders}
          sort={{ key: "amount", direction: "desc" }}
          onSortChange={onSortChange}
        />,
      );
      expect(orderIds()).toEqual(["#1043", "#1042", "#1044"]);

      await user.click(sortButton("Amount"));
      expect(onSortChange).toHaveBeenLastCalledWith(null);
    });

    it("uses a column's sortFn, reversed for descending order", async () => {
      const user = userEvent.setup();
      const pipeline = ["Pending", "Shipped", "Delivered"];
      render(
        <Table
          aria-label="Orders"
          columns={[
            ...columns,
            {
              key: "status",
              header: "Status",
              sortable: true,
              sortFn: (a, b) => pipeline.indexOf(a.status) - pipeline.indexOf(b.status),
            },
          ]}
          data={orders}
        />,
      );

      await user.click(sortButton("Status"));
      expect(orderIds()).toEqual(["#1043", "#1044", "#1042"]);
      await user.click(sortButton("Status"));
      expect(orderIds()).toEqual(["#1042", "#1044", "#1043"]);
    });

    it("keeps rows without a value last in both directions", async () => {
      const user = userEvent.setup();
      render(
        <Table
          aria-label="Orders"
          columns={columns}
          data={[{ ...orders[0], amount: null }, orders[1], orders[2]]}
        />,
      );

      await user.click(sortButton("Amount"));
      expect(orderIds()).toEqual(["#1044", "#1043", "#1042"]);
      await user.click(sortButton("Amount"));
      expect(orderIds()).toEqual(["#1043", "#1044", "#1042"]);
    });

    it("leaves the order to the server with manualSort", async () => {
      const user = userEvent.setup();
      const onSortChange = vi.fn();
      render(
        <Table
          aria-label="Orders"
          columns={columns}
          data={orders}
          manualSort
          onSortChange={onSortChange}
        />,
      );

      await user.click(sortButton("Amount"));
      expect(onSortChange).toHaveBeenCalledWith({ key: "amount", direction: "asc" });
      expect(header("Amount")).toHaveAttribute("aria-sort", "ascending");
      expect(orderIds()).toEqual(["#1042", "#1043", "#1044"]);
    });
  });

  describe("selection", () => {
    it("selects rows and all rows, with a mixed state in between", async () => {
      const user = userEvent.setup();
      const onSelectionChange = vi.fn();
      render(
        <Table
          aria-label="Orders"
          columns={columns}
          data={orders}
          selectable
          getRowLabel={(order) => `Select order #${order.id}`}
          onSelectionChange={onSelectionChange}
        />,
      );

      const all = screen.getByRole("checkbox", { name: "Select all rows" });
      const first = screen.getByRole("checkbox", { name: "Select order #1042" });
      expect(all).not.toBeChecked();

      await user.click(first);
      expect(first).toBeChecked();
      expect(all).toBePartiallyChecked();
      expect(onSelectionChange).toHaveBeenLastCalledWith([1042]);
      const row = first.closest("tr");
      expect(row).toHaveClass("cps-table__row--selected");
      expect(row).toHaveAttribute("data-selected", "true");
      expect(row).not.toHaveAttribute("aria-selected");

      await user.click(all);
      expect(all).toBeChecked();
      expect(all).not.toBePartiallyChecked();
      expect(onSelectionChange).toHaveBeenLastCalledWith([1042, 1043, 1044]);

      await user.click(all);
      expect(onSelectionChange).toHaveBeenLastCalledWith([]);
      expect(first).not.toBeChecked();
      expect(row).not.toHaveClass("cps-table__row--selected");
    });

    it("toggles row checkboxes with Space", async () => {
      const user = userEvent.setup();
      render(<Table aria-label="Orders" columns={columns} data={orders} selectable />);

      const firstRow = screen.getByRole("checkbox", { name: "Select 1042" });
      firstRow.focus();
      await user.keyboard(" ");
      expect(firstRow).toBeChecked();
    });

    it("names row checkboxes after the row header's value by default", () => {
      const { rerender } = render(
        <Table
          aria-label="Customers"
          columns={[
            { key: "customer", header: "Customer", rowHeader: true },
            { key: "city", header: "City" },
          ]}
          data={orders}
          selectable
        />,
      );
      expect(screen.getAllByRole("checkbox").map((box) => box.getAttribute("aria-label"))).toEqual([
        "Select all rows",
        "Select Priya Sharma",
        "Select Rahul Verma",
        "Select Ananya Iyer",
      ]);

      // A row header whose value isn't text or a number, or no row header at all.
      rerender(
        <Table
          aria-label="Orders"
          columns={[
            { key: "date", header: "Date", rowHeader: true },
            { key: "city", header: "City" },
          ]}
          data={orders.slice(0, 1)}
          selectable
        />,
      );
      expect(screen.getByRole("checkbox", { name: "Select row" })).toBeInTheDocument();
      rerender(
        <Table
          aria-label="Orders"
          columns={[{ key: "city", header: "City" }]}
          data={orders.slice(0, 1)}
          selectable
        />,
      );
      expect(screen.getByRole("checkbox", { name: "Select row" })).toBeInTheDocument();
    });

    it("supports defaultSelectedIds and controlled selectedIds", async () => {
      const user = userEvent.setup();
      const onSelectionChange = vi.fn();
      const { rerender } = render(
        <Table
          aria-label="Orders"
          columns={columns}
          data={orders}
          selectable
          defaultSelectedIds={[1043]}
        />,
      );
      const checkboxes = () => screen.getAllByRole("checkbox").map((box) => box.checked);
      expect(checkboxes()).toEqual([false, false, true, false]);

      rerender(
        <Table
          aria-label="Orders"
          columns={columns}
          data={orders}
          selectable
          selectedIds={[1044]}
          onSelectionChange={onSelectionChange}
        />,
      );
      expect(checkboxes()).toEqual([false, false, false, true]);

      await user.click(screen.getAllByRole("checkbox")[1]);
      expect(onSelectionChange).toHaveBeenCalledWith([1044, 1042]);
      // Not updated by the parent.
      expect(checkboxes()).toEqual([false, false, false, true]);
    });

    it("keeps selected ids from other pages when selecting or clearing the visible rows", async () => {
      const user = userEvent.setup();
      const onSelectionChange = vi.fn();

      function Paged() {
        const [selected, setSelected] = useState([2001]);
        return (
          <Table
            aria-label="Orders"
            columns={columns}
            data={orders}
            selectable
            selectedIds={selected}
            onSelectionChange={(ids) => {
              setSelected(ids);
              onSelectionChange(ids);
            }}
          />
        );
      }
      render(<Paged />);

      const all = screen.getByRole("checkbox", { name: "Select all rows" });
      expect(all).not.toBeChecked();
      expect(all).not.toBePartiallyChecked();

      await user.click(all);
      expect(onSelectionChange).toHaveBeenLastCalledWith([2001, 1042, 1043, 1044]);
      await user.click(all);
      expect(onSelectionChange).toHaveBeenLastCalledWith([2001]);
    });

    it("disables rows rejected by isRowSelectable and leaves them out of select all", async () => {
      const user = userEvent.setup();
      const onSelectionChange = vi.fn();
      render(
        <Table
          aria-label="Orders"
          columns={columns}
          data={orders}
          selectable
          isRowSelectable={(order) => order.status !== "Delivered"}
          getRowLabel={(order) => `Select order #${order.id}`}
          onSelectionChange={onSelectionChange}
        />,
      );

      expect(screen.getByRole("checkbox", { name: "Select order #1042" })).toBeDisabled();
      await user.click(screen.getByRole("checkbox", { name: "Select all rows" }));
      expect(onSelectionChange).toHaveBeenLastCalledWith([1043, 1044]);
      expect(screen.getByRole("checkbox", { name: "Select all rows" })).toBeChecked();
    });

    it("uses getRowId for ids and a custom select-all label", async () => {
      const user = userEvent.setup();
      const onSelectionChange = vi.fn();
      render(
        <Table
          aria-label="Orders"
          columns={columns}
          data={orders.map(({ id, ...order }) => ({ ...order, orderNo: id }))}
          getRowId={(order) => `ORD-${order.orderNo}`}
          selectable
          selectAllLabel="Select all orders"
          onSelectionChange={onSelectionChange}
        />,
      );

      await user.click(screen.getByRole("checkbox", { name: "Select all orders" }));
      expect(onSelectionChange).toHaveBeenCalledWith(["ORD-1042", "ORD-1043", "ORD-1044"]);
    });
  });

  describe("empty and loading states", () => {
    it("shows the empty state in a row spanning every column", () => {
      const { rerender } = render(
        <Table aria-label="Orders" columns={columns} data={[]} selectable />,
      );

      const cell = screen.getByRole("cell", { name: "No data" });
      expect(cell).toHaveAttribute("colspan", "6");
      expect(screen.getByRole("checkbox", { name: "Select all rows" })).toBeDisabled();

      rerender(
        <Table aria-label="Orders" columns={columns} data={[]} emptyState="No orders yet" />,
      );
      expect(screen.getByRole("cell", { name: "No orders yet" })).toHaveAttribute("colspan", "5");
    });

    it("shows skeleton rows while loading without data, and announces it", () => {
      const { rerender } = render(<Table aria-label="Orders" columns={columns} data={[]} />);
      const status = screen.getByRole("status");
      expect(status).toBeEmptyDOMElement();

      rerender(<Table aria-label="Orders" columns={columns} data={[]} loading loadingRows={3} />);
      const table = screen.getByRole("table");
      expect(table).toHaveAttribute("aria-busy", "true");
      expect(status).toHaveTextContent("Loading…");
      // Header row + 3 placeholder rows, and no empty state.
      expect(within(table).getAllByRole("row")).toHaveLength(4);
      expect(screen.queryByText("No data")).not.toBeInTheDocument();
    });

    it("keeps the current rows while loading more data", () => {
      render(
        <Table
          aria-label="Orders"
          columns={columns}
          data={orders}
          loading
          loadingLabel="Loading orders…"
        />,
      );
      expect(orderIds()).toEqual(["#1042", "#1043", "#1044"]);
      expect(screen.getByRole("status")).toHaveTextContent("Loading orders…");
      expect(screen.getByRole("table").parentElement).toHaveClass("cps-table--loading");
    });
  });

  it("renders a footer row from the columns' footer", () => {
    render(
      <Table
        aria-label="Orders"
        columns={[
          { key: "customer", header: "Customer", footer: "Total" },
          { key: "amount", header: "Amount", numeric: true, footer: "₹11,888" },
        ]}
        data={orders}
        selectable
      />,
    );

    const rowgroups = screen.getAllByRole("rowgroup");
    expect(rowgroups).toHaveLength(3);
    const footer = rowgroups[2];
    expect(footer.tagName).toBe("TFOOT");
    expect(
      within(footer)
        .getAllByRole("cell")
        .map((cell) => cell.textContent),
    ).toEqual(["", "Total", "₹11,888"]);
  });

  it("applies column alignment, width and classes", () => {
    render(
      <Table
        aria-label="Orders"
        columns={[
          { key: "customer", header: "Customer", width: 200, className: "hide-on-mobile" },
          { key: "city", header: "City", align: "center" },
          { key: "amount", header: "Amount", numeric: true },
        ]}
        data={orders.slice(0, 1)}
      />,
    );

    expect(header("Customer")).toHaveStyle({ width: "200px" });
    expect(header("Customer")).toHaveClass("hide-on-mobile");
    expect(screen.getByRole("cell", { name: "Priya Sharma" })).toHaveClass("hide-on-mobile");
    expect(screen.getByRole("cell", { name: "Mumbai" })).toHaveClass(
      "cps-table__cell--align-center",
    );
    expect(screen.getByRole("cell", { name: "1299" })).toHaveClass(
      "cps-table__cell--numeric",
      "cps-table__cell--align-end",
    );
  });

  it("applies size and style modifiers to the container", () => {
    const { container, rerender } = render(
      <Table aria-label="Orders" columns={columns} data={orders} />,
    );
    const root = container.firstChild;
    expect(root).toHaveClass("cps-table", "cps-table--md", "cps-table--hoverable");
    expect(root).toHaveClass("cps-table--bordered");
    expect(root).not.toHaveClass("cps-table--striped");

    rerender(
      <Table
        aria-label="Orders"
        columns={columns}
        data={orders}
        size="sm"
        striped
        hoverable={false}
        bordered={false}
        stickyHeader
        maxHeight={320}
      />,
    );
    expect(root).toHaveClass("cps-table--sm", "cps-table--striped", "cps-table--sticky-header");
    expect(root).not.toHaveClass("cps-table--hoverable");
    expect(root).not.toHaveClass("cps-table--bordered");
    expect(root).toHaveStyle({ maxHeight: "320px" });
  });

  it("forwards the ref and other props to the table, and className and style to the container", () => {
    const ref = createRef();
    const { container } = render(
      <Table
        ref={ref}
        aria-label="Orders"
        aria-describedby="orders-hint"
        data-testid="orders"
        className="custom"
        style={{ marginTop: 8 }}
        columns={columns}
        data={orders}
      />,
    );

    const table = screen.getByTestId("orders");
    expect(ref.current).toBe(table);
    expect(table).toHaveAttribute("aria-describedby", "orders-hint");
    expect(table).not.toHaveClass("custom");
    expect(container.firstChild).toHaveClass("custom");
    expect(container.firstChild).toHaveStyle({ marginTop: "8px" });
  });
});
