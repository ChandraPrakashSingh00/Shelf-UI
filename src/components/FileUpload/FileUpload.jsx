import { forwardRef, useEffect, useId, useMemo, useRef, useState } from "react";
import { useControllableState } from "../../hooks/useControllableState.js";
import { CloseIcon, FileIcon, UploadIcon } from "../../icons/index.jsx";
import { IconButton } from "../../primitives/IconButton.jsx";
import { composeEventHandlers } from "../../utils/composeEventHandlers.js";
import { cx } from "../../utils/cx.js";
import { formatFileSize, isImageFile, validateFiles } from "../../utils/files.js";
import { mergeRefs } from "../../utils/mergeRefs.js";

const NO_FILES = [];

const toFileArray = (files) =>
  Array.isArray(files) ? files : files ? Array.from(files) : NO_FILES;

const defaultRemoveLabel = (file) => `Remove ${file.name}`;

/*
 * Keys for the list items. Files have no id and the same File may be listed twice,
 * so keys are carried over from the previous list: a File keeps the key it had
 * (the first unused one, when it's listed twice), and a new one gets a new number.
 * Removing an item passes the remaining keys along, so the right duplicate goes.
 */
const NO_KEYS = { files: NO_FILES, keys: [], count: 0 };

function carryFileKeys(files, previous) {
  const unused = previous.files.map((file, index) => ({ file, key: previous.keys[index] }));
  let count = previous.count;
  const keys = files.map((file) => {
    const index = unused.findIndex((entry) => entry.file === file);
    if (index !== -1) return unused.splice(index, 1)[0].key;
    count += 1;
    return `file-${count}`;
  });
  return { files, keys, count };
}

const isSameList = (a, b) => a.length === b.length && a.every((item, index) => item === b[index]);

const canCreateObjectUrls = () =>
  typeof URL !== "undefined" && typeof URL.createObjectURL === "function";

/**
 * Keeps the native input's files in step with the component's, so a plain form
 * submission sends exactly the accepted files. Browsers without `DataTransfer`
 * can only empty the input.
 */
function syncNativeFiles(input, files) {
  if (!input) return;
  if (typeof DataTransfer === "function") {
    try {
      const transfer = new DataTransfer();
      for (const file of files) transfer.items.add(file);
      input.files = transfer.files;
      return;
    } catch {
      // Fall through: some browsers can't build a FileList.
    }
  }
  if (files.length === 0) input.value = "";
}

// Dragging text or a link over the page isn't a file drop.
const hasFiles = (event) => Array.from(event.dataTransfer?.types ?? []).includes("Files");

function describeChange(accepted, rejected) {
  const parts = [];
  if (accepted.length === 1) parts.push(`${accepted[0].name} added.`);
  else if (accepted.length > 1) parts.push(`${accepted.length} files added.`);
  if (rejected.length === 1) {
    const [{ file, errors }] = rejected;
    parts.push(`${file.name} couldn't be added. ${errors.map((e) => e.message).join(" ")}`);
  } else if (rejected.length > 1) {
    parts.push(`${rejected.length} files couldn't be added.`);
  }
  return parts.join(" ");
}

/**
 * A file icon, covered by a thumbnail for image files once it has loaded. The
 * thumbnail is an object URL, revoked when the file is removed. Where object URLs
 * aren't available, or the image can't be decoded (e.g. HEIC), the icon stays.
 */
function FileThumbnail({ file, preview }) {
  const imageRef = useRef(null);
  const [loaded, setLoaded] = useState(false);
  const showImage = preview && isImageFile(file) && canCreateObjectUrls();

  useEffect(() => {
    const image = imageRef.current;
    if (!showImage || !image) return;
    let url;
    try {
      url = URL.createObjectURL(file);
    } catch {
      return;
    }
    image.src = url;
    return () => URL.revokeObjectURL(url);
  }, [showImage, file]);

  return (
    <span className="cps-file-upload__thumbnail">
      <FileIcon />
      {showImage && (
        <img
          ref={imageRef}
          alt=""
          decoding="async"
          hidden={!loaded}
          className="cps-file-upload__image"
          onLoad={() => setLoaded(true)}
          onError={() => setLoaded(false)}
        />
      )}
    </span>
  );
}

/**
 * File picker with a drag-and-drop zone and a list of the chosen files, e.g. for
 * product images. Files are validated against `accept`, `maxSize` and `maxFiles`
 * whether they're picked or dropped; rejected files are reported to `onReject`,
 * listed under the field and announced to screen readers. A real, visually hidden
 * `<input type="file">` keeps keyboard access (Enter or Space opens the picker) and
 * native form submission. `className` and `style` apply to the field wrapper; every
 * other native attribute (and the `ref`) goes to the `<input>`.
 *
 * - `label`: visible label, linked to the input. Without it, pass `aria-label`.
 * - `helperText`: hint below the drop zone (e.g. "PNG or JPG, up to 5 MB"), exposed
 *   as the input's accessible description.
 * - `error`: error message; replaces `helperText` (and the list of rejected files)
 *   and marks the input `aria-invalid`. Pass `true` to mark the field invalid
 *   without a message.
 * - `value` / `defaultValue` / `onValueChange`: controlled or uncontrolled array of
 *   `File` objects (default `[]`).
 * - `onReject`: called with the rejected files, as `[{ file, errors: [{ code,
 *   message }] }]` with the codes "file-invalid-type", "file-too-large" and
 *   "too-many-files".
 * - `accept`: accepted types, like the native attribute: MIME types, wildcards and
 *   extensions, e.g. "image/png,image/jpeg" or "image/*,.pdf".
 * - `multiple`: allows several files (default `false`: a new file replaces the old one).
 * - `maxSize`: largest file size in bytes, e.g. `5 * 1024 * 1024`.
 * - `maxFiles`: most files in total, with `multiple`.
 * - `showPreview`: shows thumbnails of image files (default `true`).
 * - `browseText` / `dropText`: drop zone texts (default "Choose files" or "Choose a
 *   file", and "or drag and drop here").
 * - `getRemoveLabel`: function(file) returning the accessible name of a file's
 *   remove button (default "Remove photo.jpg").
 * - `name`: form field name of the native input. Resetting the form restores
 *   `defaultValue` (and clears the input).
 * - `required`, `disabled`: native states.
 */
export const FileUpload = forwardRef(function FileUpload(
  {
    label,
    helperText,
    error,
    value,
    defaultValue = NO_FILES,
    onValueChange,
    onReject,
    accept,
    multiple = false,
    maxSize,
    maxFiles,
    showPreview = true,
    browseText,
    dropText = "or drag and drop here",
    getRemoveLabel = defaultRemoveLabel,
    id,
    required = false,
    disabled = false,
    className,
    style,
    onChange,
    "aria-label": ariaLabel,
    "aria-labelledby": ariaLabelledBy,
    "aria-describedby": ariaDescribedBy,
    ...rest
  },
  forwardedRef,
) {
  const generatedId = useId();
  const inputId = id ?? `cps-file-upload-${generatedId}`;
  const labelId = `${inputId}-label`;
  const browseId = `${inputId}-browse`;
  const messageId = `${inputId}-message`;
  const rejectionsId = `${inputId}-rejections`;

  const inputRef = useRef(null);
  const listRef = useRef(null);
  const ref = useMemo(() => mergeRefs(inputRef, forwardedRef), [forwardedRef]);

  const [currentFiles, setFiles] = useControllableState({
    value: value === undefined ? undefined : toFileArray(value),
    defaultValue: toFileArray(defaultValue),
    onChange: onValueChange,
  });
  const files = toFileArray(currentFiles);

  // Follows `files` during render; a list with the same files keeps its keys.
  const [keyState, setKeyState] = useState(() => carryFileKeys(files, NO_KEYS));
  let fileKeys = keyState.keys;
  if (keyState.files !== files && !isSameList(keyState.files, files)) {
    const carried = carryFileKeys(files, keyState);
    setKeyState(carried);
    fileKeys = carried.keys;
  }

  const [rejections, setRejections] = useState(NO_FILES);
  const [announcement, setAnnouncement] = useState("");
  const [dragging, setDragging] = useState(false);
  const dragDepth = useRef(0);

  const hasError = error != null && error !== false && error !== "";
  const message = hasError && error !== true ? error : helperText;
  const showRejections = !hasError && rejections.length > 0;
  const describedBy = [
    ariaDescribedBy,
    message != null ? messageId : null,
    showRejections ? rejectionsId : null,
  ]
    .filter(Boolean)
    .join(" ");

  const addFiles = (fileList) => {
    const incoming = Array.from(fileList ?? []);
    if (disabled || incoming.length === 0) return;
    const { accepted, rejected } = validateFiles(incoming, {
      accept,
      maxSize,
      maxFiles,
      multiple,
      currentCount: files.length,
    });
    if (accepted.length > 0) setFiles(multiple ? [...files, ...accepted] : accepted);
    setRejections(rejected);
    setAnnouncement(describeChange(accepted, rejected));
    if (rejected.length > 0) onReject?.(rejected);
  };

  const removeFile = (index) => {
    const file = files[index];
    // Focus moves to the next file's remove button, the previous one, or the input.
    const buttons = listRef.current?.querySelectorAll(".cps-file-upload__remove") ?? [];
    const nextFocus = buttons[index + 1] ?? buttons[index - 1] ?? inputRef.current;
    const keep = (_, itemIndex) => itemIndex !== index;
    const nextFiles = files.filter(keep);
    // The other items keep their keys (and elements), even when the same file is listed twice.
    setKeyState({ ...keyState, files: nextFiles, keys: fileKeys.filter(keep) });
    setFiles(nextFiles);
    setRejections(NO_FILES);
    setAnnouncement(`${file.name} removed.`);
    nextFocus?.focus();
  };

  // After every change (including a pick whose files were all rejected), the
  // native input holds exactly the accepted files.
  useEffect(() => {
    syncNativeFiles(inputRef.current, files);
  }, [files, rejections]);

  // Resetting the form clears the native input: go back to the default files when
  // an uncontrolled field's form resets. The browser clears the input after the
  // "reset" event, so the input is synced afterwards.
  const isControlled = value !== undefined;
  const resetFiles = toFileArray(defaultValue);
  const filesRef = useRef(files);
  useEffect(() => {
    filesRef.current = files;
  });
  useEffect(() => {
    const input = inputRef.current;
    const formElement = input?.form;
    if (!formElement) return;
    let timeout;
    const handleReset = () => {
      if (!isControlled) setFiles(resetFiles);
      setRejections(NO_FILES);
      setAnnouncement("");
      timeout = setTimeout(() => syncNativeFiles(input, filesRef.current));
    };
    formElement.addEventListener("reset", handleReset);
    return () => {
      formElement.removeEventListener("reset", handleReset);
      clearTimeout(timeout);
    };
  }, [isControlled, resetFiles, setFiles]);

  const handleInputChange = composeEventHandlers(onChange, (event) => {
    addFiles(event.target.files);
  });

  const handleDragEnter = (event) => {
    if (!hasFiles(event)) return;
    event.preventDefault();
    dragDepth.current += 1;
    if (!disabled) setDragging(true);
  };

  const handleDragOver = (event) => {
    if (!hasFiles(event)) return;
    // Allows the drop (and stops the browser from opening the file instead).
    event.preventDefault();
    if (event.dataTransfer) event.dataTransfer.dropEffect = disabled ? "none" : "copy";
  };

  const handleDragLeave = (event) => {
    if (!hasFiles(event)) return;
    dragDepth.current = Math.max(0, dragDepth.current - 1);
    if (dragDepth.current === 0) setDragging(false);
  };

  const handleDrop = (event) => {
    if (!hasFiles(event)) return;
    event.preventDefault();
    dragDepth.current = 0;
    setDragging(false);
    addFiles(event.dataTransfer.files);
  };

  // A click anywhere on the drop zone opens the picker; keyboard users reach the
  // (visually hidden) input itself.
  const handleZoneClick = () => {
    if (!disabled) inputRef.current?.click();
  };

  const inputLabelledBy =
    ariaLabelledBy ??
    (label != null ? `${labelId} ${browseId}` : ariaLabel != null ? undefined : browseId);

  return (
    <div
      className={cx(
        "cps-field",
        "cps-file-upload",
        dragging && "cps-file-upload--dragging",
        hasError && "cps-field--invalid",
        disabled && "cps-field--disabled",
        className,
      )}
      style={style}
    >
      {label != null && (
        <label id={labelId} className="cps-field__label" htmlFor={inputId}>
          {label}
          {required && (
            <span className="cps-field__required" aria-hidden="true">
              *
            </span>
          )}
        </label>
      )}

      <div className="cps-file-upload__area">
        <input
          {...rest}
          ref={ref}
          type="file"
          id={inputId}
          accept={accept}
          multiple={multiple}
          required={required}
          disabled={disabled}
          aria-label={ariaLabel}
          aria-labelledby={inputLabelledBy}
          aria-describedby={describedBy || undefined}
          aria-invalid={hasError || undefined}
          className="cps-file-upload__input cps-visually-hidden"
          onChange={handleInputChange}
        />
        <div
          className="cps-file-upload__dropzone"
          onClick={handleZoneClick}
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <span className="cps-file-upload__icon" aria-hidden="true">
            <UploadIcon />
          </span>
          <span className="cps-file-upload__text">
            <span id={browseId} className="cps-file-upload__browse">
              {browseText ?? (multiple ? "Choose files" : "Choose a file")}
            </span>{" "}
            {dropText}
          </span>
        </div>
      </div>

      {message != null && (
        <p id={messageId} className="cps-field__message">
          {message}
        </p>
      )}

      {showRejections && (
        <ul id={rejectionsId} className="cps-file-upload__rejections">
          {rejections.map(({ file, errors }, index) => (
            <li key={`${file.name}-${index}`}>
              <span className="cps-file-upload__rejected-name">{file.name}</span>:{" "}
              {errors.map((rejectionError) => rejectionError.message).join(" ")}
            </li>
          ))}
        </ul>
      )}

      {files.length > 0 && (
        <ul ref={listRef} className="cps-file-upload__list">
          {files.map((file, index) => (
            <li key={fileKeys[index]} className="cps-file-upload__item">
              <FileThumbnail file={file} preview={showPreview} />
              <span className="cps-file-upload__details">
                <span className="cps-file-upload__name" title={file.name}>
                  {file.name}
                </span>
                <span className="cps-file-upload__size">{formatFileSize(file.size)}</span>
              </span>
              <IconButton
                label={getRemoveLabel(file)}
                className="cps-file-upload__remove"
                disabled={disabled}
                onClick={() => removeFile(index)}
              >
                <CloseIcon />
              </IconButton>
            </li>
          ))}
        </ul>
      )}

      <div className="cps-visually-hidden" aria-live="polite">
        {announcement}
      </div>
    </div>
  );
});
