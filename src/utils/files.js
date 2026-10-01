/**
 * File helpers for FileUpload: human-readable sizes, `accept` matching and
 * validation of picked or dropped files.
 */

const SIZE_UNITS = ["B", "KB", "MB", "GB", "TB"];

/**
 * Formats a size in bytes with binary units, the way file managers show it:
 * "512 B", "1.5 KB", "1.2 MB", "24 MB". One decimal below 10, none above.
 */
export function formatFileSize(bytes) {
  const size = Number(bytes);
  if (!Number.isFinite(size) || size < 0) return "";
  let value = size;
  let unit = 0;
  while (value >= 1024 && unit < SIZE_UNITS.length - 1) {
    value /= 1024;
    unit += 1;
  }
  const rounded = unit > 0 && value < 10 ? Math.round(value * 10) / 10 : Math.round(value);
  // 1023.96 KB rounds up to 1024 KB: that's 1 MB.
  if (rounded >= 1024 && unit < SIZE_UNITS.length - 1) return `1 ${SIZE_UNITS[unit + 1]}`;
  return `${rounded} ${SIZE_UNITS[unit]}`;
}

/**
 * Whether a file matches an `accept` string like the native file input's:
 * comma-separated MIME types ("image/png"), wildcards ("image/*") and file
 * extensions (".pdf"), case-insensitive. An empty `accept` accepts every file.
 */
export function acceptsFile(file, accept) {
  const tokens = String(accept ?? "")
    .split(",")
    .map((token) => token.trim().toLowerCase())
    .filter(Boolean);
  if (tokens.length === 0) return true;

  const fileName = String(file?.name ?? "").toLowerCase();
  const fileType = String(file?.type ?? "")
    .toLowerCase()
    .split(";")[0]
    .trim();

  return tokens.some((token) => {
    if (token === "*" || token === "*/*") return true;
    if (token.startsWith(".")) return fileName.endsWith(token);
    if (token.endsWith("/*")) return fileType.startsWith(token.slice(0, -1));
    return fileType === token;
  });
}

/** Whether the file is an image a browser can usually show (by MIME type). */
export function isImageFile(file) {
  return /^image\//i.test(String(file?.type ?? ""));
}

/**
 * Splits files into accepted ones and rejections. Each rejection is
 * `{ file, errors: [{ code, message }] }` with the codes "file-invalid-type",
 * "file-too-large" and "too-many-files".
 *
 * - `accept`: `accept` string, checked with `acceptsFile`.
 * - `maxSize`: largest allowed size in bytes.
 * - `maxFiles`: most files allowed in total, counting `currentCount` files already
 *   added. Ignored when `multiple` is `false`, which allows a single file.
 */
export function validateFiles(
  files,
  { accept, maxSize, maxFiles, multiple = true, currentCount = 0 } = {},
) {
  const limit = !multiple ? 1 : maxFiles != null ? Math.max(0, maxFiles - currentCount) : Infinity;
  const accepted = [];
  const rejected = [];

  for (const file of Array.from(files ?? [])) {
    const errors = [];
    if (!acceptsFile(file, accept)) {
      errors.push({ code: "file-invalid-type", message: "File type not accepted." });
    }
    if (maxSize != null && file.size > maxSize) {
      errors.push({
        code: "file-too-large",
        message: `File is larger than ${formatFileSize(maxSize)}.`,
      });
    }
    // Only valid files count towards the limit.
    if (errors.length === 0 && accepted.length >= limit) {
      errors.push({
        code: "too-many-files",
        message: !multiple
          ? "Only one file can be added."
          : `You can add up to ${maxFiles} ${maxFiles === 1 ? "file" : "files"}.`,
      });
    }
    if (errors.length > 0) rejected.push({ file, errors });
    else accepted.push(file);
  }

  return { accepted, rejected };
}
