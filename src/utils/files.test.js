import { describe, expect, it } from "vitest";
import { acceptsFile, formatFileSize, isImageFile, validateFiles } from "./files.js";

const MB = 1024 * 1024;

function makeFile(name, type, size = 1000) {
  const file = new File(["x"], name, { type });
  Object.defineProperty(file, "size", { value: size });
  return file;
}

describe("formatFileSize", () => {
  it("formats bytes with binary units", () => {
    expect(formatFileSize(0)).toBe("0 B");
    expect(formatFileSize(512)).toBe("512 B");
    expect(formatFileSize(1024)).toBe("1 KB");
    expect(formatFileSize(1536)).toBe("1.5 KB");
    expect(formatFileSize(1.2 * MB)).toBe("1.2 MB");
    expect(formatFileSize(5 * MB)).toBe("5 MB");
    expect(formatFileSize(24.6 * MB)).toBe("25 MB");
    expect(formatFileSize(3 * 1024 * MB)).toBe("3 GB");
  });

  it("rolls over to the next unit instead of showing 1024", () => {
    expect(formatFileSize(1023.96 * 1024)).toBe("1 MB");
    expect(formatFileSize(1023)).toBe("1023 B");
  });

  it("returns an empty string for invalid sizes", () => {
    expect(formatFileSize(-1)).toBe("");
    expect(formatFileSize(Number.NaN)).toBe("");
    expect(formatFileSize(undefined)).toBe("");
  });
});

describe("acceptsFile", () => {
  const photo = makeFile("Photo.JPG", "image/jpeg");
  const invoice = makeFile("invoice-1042.pdf", "application/pdf");
  const unknown = makeFile("products.csv", "");

  it("accepts every file without an accept string", () => {
    expect(acceptsFile(photo)).toBe(true);
    expect(acceptsFile(photo, "")).toBe(true);
    expect(acceptsFile(photo, " , ")).toBe(true);
  });

  it("matches MIME types, wildcards and extensions, ignoring case", () => {
    expect(acceptsFile(photo, "image/*")).toBe(true);
    expect(acceptsFile(photo, "image/png, image/jpeg")).toBe(true);
    expect(acceptsFile(photo, "image/png")).toBe(false);
    expect(acceptsFile(photo, ".jpg")).toBe(true);
    expect(acceptsFile(invoice, "image/*,.pdf")).toBe(true);
    expect(acceptsFile(invoice, "IMAGE/*")).toBe(false);
    expect(acceptsFile(invoice, "*/*")).toBe(true);
  });

  it("falls back to the extension when the browser doesn't know the type", () => {
    expect(acceptsFile(unknown, ".csv")).toBe(true);
    expect(acceptsFile(unknown, "text/csv")).toBe(false);
  });

  it("ignores MIME type parameters", () => {
    expect(acceptsFile(makeFile("a.txt", "text/plain;charset=utf-8"), "text/plain")).toBe(true);
  });
});

describe("isImageFile", () => {
  it("checks the MIME type", () => {
    expect(isImageFile(makeFile("a.webp", "image/webp"))).toBe(true);
    expect(isImageFile(makeFile("a.pdf", "application/pdf"))).toBe(false);
    expect(isImageFile(makeFile("a.png", ""))).toBe(false);
  });
});

describe("validateFiles", () => {
  it("rejects files of the wrong type or too large, with every reason", () => {
    const ok = makeFile("front.png", "image/png", 2 * MB);
    const big = makeFile("back.png", "image/png", 6 * MB);
    const wrong = makeFile("specs.gif", "image/gif", 8 * MB);

    const { accepted, rejected } = validateFiles([ok, big, wrong], {
      accept: "image/png,image/jpeg",
      maxSize: 5 * MB,
    });

    expect(accepted).toEqual([ok]);
    expect(rejected).toEqual([
      { file: big, errors: [{ code: "file-too-large", message: "File is larger than 5 MB." }] },
      {
        file: wrong,
        errors: [
          { code: "file-invalid-type", message: "File type not accepted." },
          { code: "file-too-large", message: "File is larger than 5 MB." },
        ],
      },
    ]);
  });

  it("limits the total number of files, counting the ones already added", () => {
    const files = ["a", "b", "c"].map((name) => makeFile(`${name}.png`, "image/png"));
    const { accepted, rejected } = validateFiles(files, { maxFiles: 4, currentCount: 2 });

    expect(accepted).toEqual(files.slice(0, 2));
    expect(rejected).toEqual([
      {
        file: files[2],
        errors: [{ code: "too-many-files", message: "You can add up to 4 files." }],
      },
    ]);
  });

  it("allows a single file without multiple, whatever maxFiles says", () => {
    const files = [makeFile("a.pdf", "application/pdf"), makeFile("b.pdf", "application/pdf")];
    const { accepted, rejected } = validateFiles(files, {
      multiple: false,
      maxFiles: 10,
      currentCount: 1,
    });

    expect(accepted).toEqual([files[0]]);
    expect(rejected[0].errors[0]).toEqual({
      code: "too-many-files",
      message: "Only one file can be added.",
    });
  });

  it("does not count invalid files towards the limit", () => {
    const wrong = makeFile("a.exe", "application/octet-stream");
    const ok = makeFile("b.png", "image/png");
    const { accepted, rejected } = validateFiles([wrong, ok], { accept: "image/*", maxFiles: 1 });

    expect(accepted).toEqual([ok]);
    expect(rejected.map((rejection) => rejection.errors[0].code)).toEqual(["file-invalid-type"]);
  });

  it("uses the singular for a limit of one file", () => {
    const files = [makeFile("a.png", "image/png"), makeFile("b.png", "image/png")];
    const { rejected } = validateFiles(files, { maxFiles: 1 });
    expect(rejected[0].errors[0].message).toBe("You can add up to 1 file.");
  });
});
