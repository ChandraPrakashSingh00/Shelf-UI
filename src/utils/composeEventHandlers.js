/**
 * Runs the consumer's handler first, then the library's handler unless the
 * consumer called `event.preventDefault()`.
 */
export function composeEventHandlers(theirs, ours) {
  return (event) => {
    theirs?.(event);
    if (!event.defaultPrevented) ours(event);
  };
}
