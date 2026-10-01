import { forwardRef } from "react";
import { CheckIcon, createIcon } from "../../icons/index.jsx";
import { cx } from "../../utils/cx.js";

// An exclamation mark, sized to sit inside the step's circle.
const ExclamationIcon = createIcon("ExclamationIcon", <path d="M12 6v7M12 17.5h.01" />);

const DEFAULT_STATUS_LABELS = {
  complete: "Completed",
  current: "Current",
  upcoming: "Not started",
  error: "Error",
};

// Where a step is in the flow: before, at or after the active step.
const getPosition = (index, activeStep) => {
  if (index < activeStep) return "complete";
  if (index === activeStep) return "current";
  return "upcoming";
};

/**
 * Shows progress through a multi-step flow, like a checkout (Address → Payment →
 * Review) or seller onboarding. It renders an ordered list: the current step has
 * `aria-current="step"`, and every step includes its status as visually hidden
 * text, so it never relies on color alone. The parent owns the flow and passes
 * `activeStep`. The `ref` and other props go to the `<ol>`.
 *
 * - `steps` (required): array of `{ id, title, description, optional, status }`.
 *   `title` is required; `id` (defaults to the index) is the React key; `optional`
 *   adds an "Optional" hint; `status: "error"` marks a step as failed.
 * - `activeStep` (required): index of the current step. Steps before it are
 *   complete; pass `steps.length` when the whole flow is done.
 * - `onStepClick`: called with a step's index. When set, completed steps become
 *   buttons, so people can go back to them.
 * - `orientation`: "horizontal" (default) or "vertical". A horizontal stepper
 *   narrower than 36rem shows only the current step's title next to the numbers;
 *   the other titles stay available to screen readers.
 * - `size`: "sm" or "md" (default) — size of the step circles and text.
 * - `label`: accessible name of the list (default "Progress").
 * - `statusLabels`: visually hidden status text, merged with the defaults
 *   `{ complete: "Completed", current: "Current", upcoming: "Not started", error: "Error" }`.
 * - `optionalLabel`: text shown for optional steps (default "Optional").
 */
export const Stepper = forwardRef(function Stepper(
  {
    steps,
    activeStep,
    onStepClick,
    orientation = "horizontal",
    size = "md",
    label = "Progress",
    statusLabels,
    optionalLabel = "Optional",
    className,
    ...rest
  },
  ref,
) {
  const labels = { ...DEFAULT_STATUS_LABELS, ...statusLabels };

  return (
    <ol
      aria-label={label}
      {...rest}
      ref={ref}
      className={cx(
        "cps-stepper",
        `cps-stepper--${orientation}`,
        `cps-stepper--${size}`,
        className,
      )}
    >
      {steps.map((step, index) => {
        const position = getPosition(index, activeStep);
        const status = step.status === "error" ? "error" : position;
        const clickable = onStepClick != null && position === "complete";
        const isLast = index === steps.length - 1;

        let indicator = index + 1;
        if (status === "complete") indicator = <CheckIcon />;
        else if (status === "error") indicator = <ExclamationIcon />;

        const content = (
          <>
            <span className="cps-stepper__indicator" aria-hidden="true">
              {indicator}
            </span>
            {/* The visually hidden commas make screen readers pause between the parts. */}
            <span className="cps-stepper__text">
              <span className="cps-stepper__title">{step.title}</span>
              {step.optional && (
                <span className="cps-stepper__optional">
                  <span className="cps-visually-hidden">,</span> {optionalLabel}
                </span>
              )}
              {step.description != null && (
                <span className="cps-stepper__description">
                  <span className="cps-visually-hidden">,</span> {step.description}
                </span>
              )}
              <span className="cps-visually-hidden">, {labels[status]}</span>
            </span>
          </>
        );

        return (
          <li
            key={step.id ?? index}
            aria-current={position === "current" ? "step" : undefined}
            className={cx(
              "cps-stepper__step",
              `cps-stepper__step--${status}`,
              position === "current" && status === "error" && "cps-stepper__step--current",
            )}
          >
            {clickable ? (
              <button
                type="button"
                className="cps-stepper__trigger cps-stepper__trigger--button"
                onClick={() => onStepClick(index)}
              >
                {content}
              </button>
            ) : (
              <span className="cps-stepper__trigger">{content}</span>
            )}
            {!isLast && (
              <span
                className={cx(
                  "cps-stepper__connector",
                  position === "complete" && "cps-stepper__connector--complete",
                )}
                aria-hidden="true"
              />
            )}
          </li>
        );
      })}
    </ol>
  );
});
