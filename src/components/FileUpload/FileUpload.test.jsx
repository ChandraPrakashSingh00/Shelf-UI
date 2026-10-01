import { fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef, useState } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { FileUpload } from "./FileUpload.jsx";

const MB = 1024 * 1024;

function makeFile(name, type, size = 1200) {
  const file = new File(["x"], name, { type, lastModified: 1_760_000_000_000 });
  Object.defineProperty(file, "size", { value: size });
  return file;
}

const liveRegion = () => document.querySelector('[aria-live="polite"]');
const fileNames = () =>
  Array.from(document.querySelectorAll(".cps-file-upload__name")).map((node) => node.textContent);
const dropzone = () => document.querySelector(".cps-file-upload__dropzone");
const drop = (files, types = ["Files"]) =>
  fireEvent.drop(dropzone(), { dataTransfer: { files, types } });

// The test environment's object URLs don't accept jsdom's files: stub them where a
// test needs previews.
function stubObjectUrls() {
  let count = 0;
  const create = vi
    .spyOn(URL, "createObjectURL")
    .mockImplementation(() => `blob:preview-${++count}`);
  const revoke = vi.spyOn(URL, "revokeObjectURL").mockImplementation(() => {});
  return { create, revoke };
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("FileUpload", () => {
  it("renders a labelled, visually hidden file input with a drop zone", () => {
    const { container } = render(
      <FileUpload label="Product images" multiple helperText="PNG or JPG, up to 5 MB" />,
    );

    const input = screen.getByLabelText("Product images");
    expect(input).toHaveAttribute("type", "file");
    expect(input).toHaveAttribute("multiple");
    expect(input).toHaveClass("cps-visually-hidden");
    expect(input).toHaveAccessibleName("Product images Choose files");
    expect(input).toHaveAccessibleDescription("PNG or JPG, up to 5 MB");
    expect(screen.getByText("or drag and drop here")).toBeInTheDocument();
    expect(container.firstChild).toHaveClass("cps-field", "cps-file-upload");
  });

  it("is reachable with Tab and names itself from the browse text without a label", async () => {
    const user = userEvent.setup();
    render(<FileUpload browseText="Upload invoice" dropText="or drop a PDF" />);

    await user.tab();
    const input = document.querySelector("input[type=file]");
    expect(input).toHaveFocus();
    expect(input).toHaveAccessibleName("Upload invoice");
    expect(screen.getByText("or drop a PDF", { exact: false })).toBeInTheDocument();
  });

  it("uses aria-label when there's no visible label", () => {
    render(<FileUpload aria-label="Invoice" />);
    expect(screen.getByLabelText("Invoice")).toHaveAccessibleName("Invoice");
  });

  it("lists a picked file with its size and announces it", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<FileUpload label="Invoice" onValueChange={onValueChange} />);

    const invoice = makeFile("invoice-1042.pdf", "application/pdf", 1.2 * MB);
    await user.upload(screen.getByLabelText("Invoice"), invoice);

    expect(onValueChange).toHaveBeenCalledWith([invoice]);
    expect(fileNames()).toEqual(["invoice-1042.pdf"]);
    expect(screen.getByText("1.2 MB")).toBeInTheDocument();
    expect(liveRegion()).toHaveTextContent("invoice-1042.pdf added.");
  });

  it("replaces the file when multiple is off", async () => {
    const user = userEvent.setup();
    render(<FileUpload label="Invoice" />);
    const input = screen.getByLabelText("Invoice");

    await user.upload(input, makeFile("draft.pdf", "application/pdf"));
    await user.upload(input, makeFile("final.pdf", "application/pdf"));
    expect(fileNames()).toEqual(["final.pdf"]);
  });

  it("appends files with multiple and rejects files beyond maxFiles", async () => {
    const user = userEvent.setup();
    const onReject = vi.fn();
    render(<FileUpload label="Product images" multiple maxFiles={3} onReject={onReject} />);
    const input = screen.getByLabelText("Product images");

    await user.upload(input, [
      makeFile("front.png", "image/png"),
      makeFile("back.png", "image/png"),
    ]);
    const extra = [makeFile("side.png", "image/png"), makeFile("box.png", "image/png")];
    await user.upload(input, extra);

    expect(fileNames()).toEqual(["front.png", "back.png", "side.png"]);
    expect(onReject).toHaveBeenCalledWith([
      {
        file: extra[1],
        errors: [{ code: "too-many-files", message: "You can add up to 3 files." }],
      },
    ]);
    expect(screen.getByText("box.png")).toBeInTheDocument();
    expect(input).toHaveAccessibleDescription("box.png: You can add up to 3 files.");
    expect(liveRegion()).toHaveTextContent(
      "side.png added. box.png couldn't be added. You can add up to 3 files.",
    );
  });

  it("rejects files of the wrong type or too large, and says why", async () => {
    const user = userEvent.setup({ applyAccept: false });
    const onReject = vi.fn();
    const onValueChange = vi.fn();
    render(
      <FileUpload
        label="Product images"
        multiple
        accept="image/png,image/jpeg"
        maxSize={5 * MB}
        onReject={onReject}
        onValueChange={onValueChange}
      />,
    );
    const input = screen.getByLabelText("Product images");
    expect(input).toHaveAttribute("accept", "image/png,image/jpeg");

    await user.upload(input, [
      makeFile("banner.gif", "image/gif"),
      makeFile("hero.jpg", "image/jpeg", 8 * MB),
    ]);

    expect(onValueChange).not.toHaveBeenCalled();
    expect(onReject.mock.calls[0][0].map(({ errors }) => errors[0].code)).toEqual([
      "file-invalid-type",
      "file-too-large",
    ]);
    const rejections = document.querySelector(".cps-file-upload__rejections");
    expect(rejections).toHaveTextContent("banner.gif: File type not accepted.");
    expect(rejections).toHaveTextContent("hero.jpg: File is larger than 5 MB.");
    expect(liveRegion()).toHaveTextContent("2 files couldn't be added.");
    expect(fileNames()).toEqual([]);
  });

  it("clears the rejections after the next successful pick", async () => {
    const user = userEvent.setup({ applyAccept: false });
    render(<FileUpload label="Invoice" accept=".pdf" />);
    const input = screen.getByLabelText("Invoice");

    await user.upload(input, makeFile("scan.png", "image/png"));
    expect(screen.getByText("scan.png")).toBeInTheDocument();

    await user.upload(input, makeFile("invoice.pdf", "application/pdf"));
    expect(screen.queryByText("scan.png")).not.toBeInTheDocument();
    expect(fileNames()).toEqual(["invoice.pdf"]);
  });

  it("shows the error prop instead of helper text and the rejection list", async () => {
    const user = userEvent.setup({ applyAccept: false });
    render(
      <FileUpload label="Invoice" accept=".pdf" helperText="PDF only" error="Upload the invoice" />,
    );
    const input = screen.getByLabelText("Invoice");

    await user.upload(input, makeFile("scan.png", "image/png"));
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAccessibleDescription("Upload the invoice");
    expect(screen.queryByText("PDF only")).not.toBeInTheDocument();
    expect(document.querySelector(".cps-file-upload__rejections")).not.toBeInTheDocument();
  });

  it("adds dropped files, validated like picked ones, and shows the drag state", () => {
    const onReject = vi.fn();
    const { container } = render(
      <FileUpload label="Catalogue" multiple accept=".csv,.xlsx" onReject={onReject} />,
    );

    fireEvent.dragEnter(dropzone(), { dataTransfer: { types: ["Files"] } });
    expect(container.firstChild).toHaveClass("cps-file-upload--dragging");
    fireEvent.dragLeave(dropzone(), { dataTransfer: { types: ["Files"] } });
    expect(container.firstChild).not.toHaveClass("cps-file-upload--dragging");

    fireEvent.dragEnter(dropzone(), { dataTransfer: { types: ["Files"] } });
    const sheet = makeFile("products.csv", "");
    const photo = makeFile("photo.jpg", "image/jpeg");
    drop([sheet, photo]);

    expect(container.firstChild).not.toHaveClass("cps-file-upload--dragging");
    expect(fileNames()).toEqual(["products.csv"]);
    expect(onReject.mock.calls[0][0][0].file).toBe(photo);
  });

  it("prevents the browser from opening dropped files, and ignores dragged text", () => {
    render(<FileUpload label="Catalogue" />);

    const dragOver = new Event("dragover", { bubbles: true, cancelable: true });
    Object.defineProperty(dragOver, "dataTransfer", {
      value: { types: ["Files"], dropEffect: "none" },
    });
    dropzone().dispatchEvent(dragOver);
    expect(dragOver.defaultPrevented).toBe(true);
    expect(dragOver.dataTransfer.dropEffect).toBe("copy");

    drop([makeFile("notes.txt", "text/plain")], ["text/plain"]);
    expect(fileNames()).toEqual([]);
  });

  it("opens the file picker when the drop zone is clicked", async () => {
    const user = userEvent.setup();
    render(<FileUpload label="Invoice" />);
    const input = screen.getByLabelText("Invoice");
    const click = vi.spyOn(input, "click");

    await user.click(screen.getByText("Choose a file"));
    expect(click).toHaveBeenCalledTimes(1);
  });

  it("removes a file and moves focus to the next remove button, then to the input", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    const files = [makeFile("front.png", "image/png"), makeFile("back.png", "image/png")];
    render(
      <FileUpload
        label="Product images"
        multiple
        defaultValue={files}
        onValueChange={onValueChange}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Remove front.png" }));
    expect(onValueChange).toHaveBeenLastCalledWith([files[1]]);
    expect(fileNames()).toEqual(["back.png"]);
    expect(screen.getByRole("button", { name: "Remove back.png" })).toHaveFocus();
    expect(liveRegion()).toHaveTextContent("front.png removed.");

    await user.keyboard("{Enter}");
    expect(fileNames()).toEqual([]);
    expect(screen.getByLabelText("Product images")).toHaveFocus();
    expect(screen.queryByRole("list")).not.toBeInTheDocument();
  });

  it("moves focus to the previous remove button when the last file is removed", async () => {
    const user = userEvent.setup();
    const files = [makeFile("front.png", "image/png"), makeFile("back.png", "image/png")];
    render(<FileUpload label="Product images" multiple defaultValue={files} />);

    await user.click(screen.getByRole("button", { name: "Remove back.png" }));
    expect(screen.getByRole("button", { name: "Remove front.png" })).toHaveFocus();
  });

  it("uses custom remove labels", () => {
    render(
      <FileUpload
        label="Product images"
        defaultValue={[makeFile("front.png", "image/png")]}
        getRemoveLabel={(file) => `Delete ${file.name} from the listing`}
      />,
    );
    expect(
      screen.getByRole("button", { name: "Delete front.png from the listing" }),
    ).toBeInTheDocument();
  });

  it("shows image previews once loaded and revokes their URLs on remove and unmount", async () => {
    const user = userEvent.setup();
    const { create, revoke } = stubObjectUrls();
    const photos = [makeFile("front.png", "image/png"), makeFile("back.jpg", "image/jpeg")];
    const { container, unmount } = render(
      <FileUpload
        label="Product images"
        multiple
        defaultValue={[...photos, makeFile("specs.pdf", "application/pdf")]}
      />,
    );

    // Every file shows an icon; images get a thumbnail on top.
    expect(container.querySelectorAll(".cps-file-upload__thumbnail svg")).toHaveLength(3);
    const images = container.querySelectorAll("img.cps-file-upload__image");
    expect(images).toHaveLength(2);
    expect(images[0]).toHaveAttribute("alt", "");
    expect(images[0].src).toMatch(/^blob:preview-/);
    expect(images[0]).not.toBeVisible();
    fireEvent.load(images[0]);
    expect(images[0]).toBeVisible();
    const urls = create.mock.results.map((result) => result.value);

    await user.click(screen.getByRole("button", { name: "Remove front.png" }));
    expect(revoke).toHaveBeenCalledWith(images[0].src);

    unmount();
    expect(new Set(revoke.mock.calls.map(([url]) => url))).toEqual(new Set(urls));
  });

  it("keeps the file icon when an image can't be decoded", () => {
    stubObjectUrls();
    const { container } = render(
      <FileUpload label="Product images" defaultValue={[makeFile("photo.heic", "image/heic")]} />,
    );
    const image = container.querySelector("img");
    fireEvent.load(image);
    fireEvent.error(image);
    expect(image).not.toBeVisible();
  });

  it("shows only the file icon without showPreview, or where object URLs fail", () => {
    const { create } = stubObjectUrls();
    const photo = makeFile("front.png", "image/png");
    const { container, unmount } = render(
      <FileUpload label="Product images" defaultValue={[photo]} showPreview={false} />,
    );
    expect(container.querySelector("img")).not.toBeInTheDocument();
    expect(container.querySelector(".cps-file-upload__thumbnail svg")).toBeInTheDocument();
    expect(create).not.toHaveBeenCalled();
    unmount();

    create.mockImplementation(() => {
      throw new TypeError("Not a Blob");
    });
    const { container: second, unmount: unmountSecond } = render(
      <FileUpload label="Product images" defaultValue={[photo]} />,
    );
    expect(second.querySelector("img")).not.toHaveAttribute("src");
    unmountSecond();

    vi.stubGlobal("URL", function URLWithoutObjectUrls() {});
    const { container: third } = render(
      <FileUpload label="Product images" defaultValue={[photo]} />,
    );
    expect(third.querySelector("img")).not.toBeInTheDocument();
  });

  it("does nothing when disabled", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    const photo = makeFile("front.png", "image/png");
    const { container } = render(
      <FileUpload
        label="Product images"
        disabled
        defaultValue={[photo]}
        onValueChange={onValueChange}
      />,
    );
    const input = screen.getByLabelText("Product images");
    const click = vi.spyOn(input, "click");

    expect(input).toBeDisabled();
    expect(container.firstChild).toHaveClass("cps-field--disabled");
    expect(screen.getByRole("button", { name: "Remove front.png" })).toBeDisabled();

    await user.click(dropzone());
    expect(click).not.toHaveBeenCalled();

    fireEvent.dragEnter(dropzone(), { dataTransfer: { types: ["Files"] } });
    expect(container.firstChild).not.toHaveClass("cps-file-upload--dragging");
    drop([makeFile("back.png", "image/png")]);
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it("supports controlled usage", async () => {
    const user = userEvent.setup();
    function Uploader() {
      const [files, setFiles] = useState([]);
      return (
        <>
          <FileUpload label="Product images" multiple value={files} onValueChange={setFiles} />
          <p>{files.length} selected</p>
          <button type="button" onClick={() => setFiles([])}>
            Clear all
          </button>
        </>
      );
    }
    render(<Uploader />);

    await user.upload(screen.getByLabelText("Product images"), [
      makeFile("front.png", "image/png"),
      makeFile("back.png", "image/png"),
    ]);
    expect(screen.getByText("2 selected")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Clear all" }));
    expect(fileNames()).toEqual([]);
  });

  it("keeps the same file twice as separate list items", () => {
    const photo = makeFile("front.png", "image/png");
    render(<FileUpload label="Product images" multiple defaultValue={[photo, photo]} />);
    const list = screen.getByRole("list");
    expect(within(list).getAllByRole("listitem")).toHaveLength(2);
  });

  it("removes the right one of two identical files and keeps focus on the next item", async () => {
    const user = userEvent.setup();
    const invoice = makeFile("invoice.pdf", "application/pdf");
    const receipt = makeFile("receipt.pdf", "application/pdf");
    render(
      <FileUpload
        label="Documents"
        multiple
        showPreview={false}
        defaultValue={[invoice, invoice, receipt]}
      />,
    );
    const [first, second] = screen.getAllByRole("button", { name: "Remove invoice.pdf" });
    const secondItem = second.closest("li");

    await user.click(first);
    expect(fileNames()).toEqual(["invoice.pdf", "receipt.pdf"]);
    // The second item stays in place (the same element), so focus stays on its button.
    expect(screen.getAllByRole("listitem")[0]).toBe(secondItem);
    expect(second).toHaveFocus();

    // Adding files keeps the keys (and elements) of the ones already listed.
    await user.upload(screen.getByLabelText(/^Documents/), [invoice]);
    expect(fileNames()).toEqual(["invoice.pdf", "receipt.pdf", "invoice.pdf"]);
    expect(screen.getAllByRole("listitem")[0]).toBe(secondItem);
  });

  it("submits the files with the form's native input and resets with the form", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    const { container } = render(
      <form>
        <FileUpload label="Invoice" name="invoice" required onValueChange={onValueChange} />
        <button type="reset">Reset</button>
      </form>,
    );
    const form = container.querySelector("form");
    const input = screen.getByLabelText(/^Invoice/);
    expect(input).toHaveAttribute("name", "invoice");
    expect(input).toBeRequired();

    const invoice = makeFile("invoice.pdf", "application/pdf");
    await user.upload(input, invoice);
    // (jsdom's FormData can't read uploaded files, so check the input itself.)
    expect(input.files[0]).toBe(invoice);
    expect(form.elements.namedItem("invoice")).toBe(input);

    await user.click(screen.getByRole("button", { name: "Reset" }));
    expect(fileNames()).toEqual([]);
    expect(onValueChange).toHaveBeenLastCalledWith([]);
  });

  it("keeps the native input's files in step with the list", async () => {
    const user = userEvent.setup();
    class FakeDataTransfer {
      list = [];
      items = { add: (file) => this.list.push(file) };
      get files() {
        return this.list;
      }
    }
    vi.stubGlobal("DataTransfer", FakeDataTransfer);
    const files = [makeFile("front.png", "image/png"), makeFile("back.png", "image/png")];
    render(<FileUpload label="Product images" name="images" multiple defaultValue={files} />);

    const input = screen.getByLabelText("Product images");
    let assigned = null;
    Object.defineProperty(input, "files", {
      configurable: true,
      get: () => assigned,
      set: (fileList) => {
        assigned = fileList;
      },
    });

    await user.click(screen.getByRole("button", { name: "Remove front.png" }));
    expect(assigned).toEqual([files[1]]);
  });

  it("forwards the ref and native attributes to the input, className and style to the wrapper", () => {
    const ref = createRef();
    const onChange = vi.fn();
    const { container } = render(
      <FileUpload
        ref={ref}
        id="invoice"
        label="Invoice"
        className="custom"
        style={{ maxWidth: 480 }}
        capture="environment"
        data-testid="invoice-input"
        onChange={onChange}
      />,
    );

    const input = screen.getByLabelText("Invoice");
    expect(ref.current).toBe(input);
    expect(input).toHaveAttribute("id", "invoice");
    expect(input).toHaveAttribute("capture", "environment");
    expect(input).toHaveAttribute("data-testid", "invoice-input");
    expect(container.firstChild).toHaveClass("cps-file-upload", "custom");
    expect(container.firstChild).toHaveStyle({ maxWidth: "480px" });

    fireEvent.change(input, { target: { files: [makeFile("a.pdf", "application/pdf")] } });
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(fileNames()).toEqual(["a.pdf"]);
  });
});
