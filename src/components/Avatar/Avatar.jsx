import {
  Children,
  createContext,
  forwardRef,
  isValidElement,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { UserIcon } from "../../icons/index.jsx";
import { cx } from "../../utils/cx.js";

const AvatarGroupContext = createContext(null);

/** First letters of the first and last words: "Aditi Rao" → "AR", "Rohan" → "R". */
function getInitials(name) {
  const words = String(name).trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "";
  // Array.from splits by code point, so a letter outside the BMP stays whole.
  const firstLetter = (word) => Array.from(word)[0];
  const last = words.length > 1 ? firstLetter(words[words.length - 1]) : "";
  return `${firstLetter(words[0])}${last}`.toUpperCase();
}

/**
 * Picture of a person, team or workspace. Shows the image from `src`; without
 * one, or when it fails to load, shows `fallback`, the initials of `name`, or a
 * generic user icon. Renders a `<span>`; other props and the `ref` go to it.
 *
 * - `src`: image URL. A new `src` gets a fresh attempt after a failure.
 * - `alt`: accessible name — the image's alt text, or the fallback's label.
 *   Defaults to `name`. Pass `alt=""` when the name is visible next to the avatar,
 *   so screen readers don't read it twice.
 * - `name`: the person's name; gives the initials and the default `alt`.
 * - `fallback`: custom content shown instead of the initials when there is no image.
 * - `size`: "xs", "sm", "md" (default, or the size of the surrounding `AvatarGroup`),
 *   "lg" or "xl".
 * - `shape`: "circle" (default) or "square".
 */
export const Avatar = forwardRef(function Avatar(
  { src, alt, name, fallback, size, shape = "circle", className, ...rest },
  ref,
) {
  const group = useContext(AvatarGroupContext);
  const imageRef = useRef(null);
  // The `src` that failed to load; comparing it with `src` resets the error when `src` changes.
  const [failedSrc, setFailedSrc] = useState(null);

  // An image that already failed before hydration never fires React's `onError`.
  useEffect(() => {
    const image = imageRef.current;
    if (image && image.complete && image.naturalWidth === 0) setFailedSrc(src);
  }, [src]);

  const label = alt ?? name;
  const isDecorative = label == null || label === "";
  const showImage = src != null && src !== "" && src !== failedSrc;
  const initials = name == null ? "" : getInitials(name);

  let content;
  if (showImage) {
    content = (
      <img
        ref={imageRef}
        src={src}
        alt={isDecorative ? "" : label}
        className="cps-avatar__image"
        onError={() => setFailedSrc(src)}
      />
    );
  } else if (fallback != null && fallback !== false) {
    content = fallback;
  } else if (initials) {
    content = initials;
  } else {
    content = <UserIcon className="cps-avatar__icon" />;
  }

  // The fallback is text or an icon, so the avatar itself carries the name.
  const namesFallback = !showImage && !isDecorative;

  return (
    <span
      {...rest}
      ref={ref}
      role={namesFallback ? "img" : undefined}
      aria-label={namesFallback ? label : undefined}
      aria-hidden={isDecorative || undefined}
      className={cx(
        "cps-avatar",
        `cps-avatar--${size ?? group?.size ?? "md"}`,
        `cps-avatar--${shape}`,
        !showImage && "cps-avatar--fallback",
        className,
      )}
    >
      {content}
    </span>
  );
});

/**
 * Overlapping stack of avatars, such as the members of a project. Renders a
 * `<span role="group">`; other props and the `ref` go to it.
 *
 * - `max`: how many avatars to show. The rest are summed up by a "+N" avatar,
 *   announced as "N more".
 * - `size`: size of every avatar in the group — "xs", "sm", "md" (default), "lg"
 *   or "xl". An avatar's own `size` wins.
 * - `label`: accessible name of the group, e.g. "Project members".
 */
export const AvatarGroup = forwardRef(function AvatarGroup(
  { max, size = "md", label, className, children, "aria-label": ariaLabel, ...rest },
  ref,
) {
  const context = useMemo(() => ({ size }), [size]);
  const avatars = Children.toArray(children).filter(isValidElement);
  const visibleCount = max == null ? avatars.length : Math.max(0, Math.floor(max));
  const hiddenCount = Math.max(0, avatars.length - visibleCount);

  return (
    <AvatarGroupContext.Provider value={context}>
      <span
        {...rest}
        ref={ref}
        role="group"
        aria-label={label ?? ariaLabel}
        className={cx("cps-avatar-group", `cps-avatar-group--${size}`, className)}
      >
        {avatars.slice(0, visibleCount)}
        {hiddenCount > 0 && (
          <Avatar
            alt={`${hiddenCount} more`}
            fallback={`+${hiddenCount}`}
            className="cps-avatar-group__more"
          />
        )}
      </span>
    </AvatarGroupContext.Provider>
  );
});
