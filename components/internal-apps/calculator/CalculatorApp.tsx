"use client";

import {
  useEffect,
  useReducer,
  useRef,
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
} from "react";
import {
  DIGITS,
  OPERATOR_SYMBOLS,
  calculatorActions,
  calculatorReducer,
  createInitialCalculatorState,
  createInitialPracticeState,
  createPracticeProblem,
  isCalculatorOperator,
  isDigit,
  practiceActions,
  practiceReducer,
  type CalculatorOperator,
} from "./calculatorEngine";

export interface CalculatorCopy {
  title: string;
  calculatorMode: string;
  practiceMode: string;
  displayLabel: string;
  latestOperationLabel: string;
  clearLabel: string;
  deleteLabel: string;
  toggleSignLabel: string;
  percentLabel: string;
  decimalLabel: string;
  equalsLabel: string;
  addLabel: string;
  subtractLabel: string;
  multiplyLabel: string;
  divideLabel: string;
  practiceStartLabel: string;
  practiceStopLabel: string;
  scoreLabel: string;
  answerLabel: string;
  correctFeedback: string;
  incorrectFeedback: string;
  expectedAnswerLabel: string;
  divisionByZeroError: string;
  numericOverflowError: string;
}

export interface CalculatorAppProps {
  copy: CalculatorCopy;
  active: boolean;
  maximized?: boolean;
  random?: () => number;
}

interface CalculatorButtonProps {
  action: string;
  label: string;
  kind: "number" | "operator" | "utility" | "equals" | "mode";
  children: ReactNode;
  onClick: () => void;
  disabled?: boolean;
  pressed?: boolean;
  value?: string;
}

const PRACTICE_ADVANCE_DELAY_MS = 500;

function CalculatorButton({
  action,
  label,
  kind,
  children,
  onClick,
  disabled = false,
  pressed,
  value,
}: CalculatorButtonProps) {
  return (
    <button
      type="button"
      className={`calculator-app__button calculator-app__button--${kind}${
        pressed ? " calculator-app__button--pressed" : ""
      }`}
      aria-label={label}
      aria-pressed={pressed}
      data-calculator-action={action}
      data-calculator-value={value}
      data-calculator-pressed={pressed ? "true" : "false"}
      disabled={disabled}
      onClick={onClick}
    >
      <span className="calculator-app__key-face">{children}</span>
    </button>
  );
}

function displaySizing(value: string): CSSProperties {
  let fontSize = "3rem";
  if (value.length > 16) fontSize = "1.5rem";
  else if (value.length > 10) fontSize = "2.25rem";

  return {
    display: "block",
    maxWidth: "100%",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    fontSize,
  };
}

export function CalculatorApp({
  copy,
  active,
  maximized = false,
  random = Math.random,
}: CalculatorAppProps) {
  const [calculator, dispatchCalculator] = useReducer(
    calculatorReducer,
    undefined,
    createInitialCalculatorState,
  );
  const [practice, dispatchPractice] = useReducer(
    practiceReducer,
    undefined,
    createInitialPracticeState,
  );
  const rootRef = useRef<HTMLElement>(null);
  const randomRef = useRef(random);

  useEffect(() => {
    randomRef.current = random;
  }, [random]);

  useEffect(() => {
    if (!active) return;
    const root = rootRef.current;
    if (root && !root.contains(document.activeElement)) {
      root.focus({ preventScroll: true });
    }
  }, [active]);

  useEffect(() => {
    if (!practice.active || !practice.locked) return;

    const timer = window.setTimeout(() => {
      dispatchPractice(practiceActions.next(createPracticeProblem(randomRef.current)));
    }, PRACTICE_ADVANCE_DELAY_MS);

    return () => window.clearTimeout(timer);
  }, [practice.active, practice.locked]);

  const operatorLabels: Record<CalculatorOperator, string> = {
    "+": copy.addLabel,
    "-": copy.subtractLabel,
    "*": copy.multiplyLabel,
    "/": copy.divideLabel,
  };

  const errorText = calculator.error === "division-by-zero"
    ? copy.divisionByZeroError
    : calculator.error === "numeric-overflow"
      ? copy.numericOverflowError
      : null;
  const displayText = practice.active ? practice.answer || "?" : errorText ?? calculator.display;
  const latestText = practice.active
    ? practice.problem?.question ?? ""
    : calculator.latestOperation;
  const feedbackText = practice.feedback === "correct"
    ? copy.correctFeedback
    : practice.feedback === "incorrect"
      ? `${copy.incorrectFeedback} ${copy.expectedAnswerLabel}: ${practice.problem?.answer ?? ""}`
      : "";
  const displaySize = displayText.length > 16
    ? "small"
    : displayText.length > 10
      ? "medium"
      : "large";

  const togglePractice = () => {
    dispatchCalculator(calculatorActions.clear());
    if (practice.active) {
      dispatchPractice(practiceActions.stop());
    } else {
      dispatchPractice(practiceActions.start(createPracticeProblem(randomRef.current)));
    }
  };

  const submitPractice = () => {
    dispatchPractice(practiceActions.submit());
  };

  const handleKeyDown = (event: ReactKeyboardEvent<HTMLElement>) => {
    if (!active) {
      if (
        event.target instanceof HTMLButtonElement
        && (event.key === "Enter" || event.key === " ")
      ) {
        event.preventDefault();
      }
      return;
    }
    if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.altKey) return;

    // Let focused buttons retain their native Enter/Space activation behavior.
    if (event.target instanceof HTMLButtonElement && (event.key === "Enter" || event.key === " ")) {
      return;
    }

    const { key } = event;
    let handled = false;

    if (practice.active) {
      if (isDigit(key)) {
        dispatchPractice(practiceActions.digit(key));
        handled = true;
      } else if (key === "Backspace") {
        dispatchPractice(practiceActions.delete());
        handled = true;
      } else if (key === "Enter" || key === "=") {
        submitPractice();
        handled = true;
      }
    } else if (isDigit(key)) {
      dispatchCalculator(calculatorActions.digit(key));
      handled = true;
    } else if (isCalculatorOperator(key)) {
      dispatchCalculator(calculatorActions.operator(key));
      handled = true;
    } else if (key === ".") {
      dispatchCalculator(calculatorActions.decimal());
      handled = true;
    } else if (key === "%") {
      dispatchCalculator(calculatorActions.percent());
      handled = true;
    } else if (key === "Backspace") {
      dispatchCalculator(calculatorActions.delete());
      handled = true;
    } else if (key === "Enter" || key === "=") {
      dispatchCalculator(calculatorActions.equals());
      handled = true;
    } else if (key === "Delete" || key.toLowerCase() === "c") {
      dispatchCalculator(calculatorActions.clear());
      handled = true;
    }

    if (handled) event.preventDefault();
  };

  const practiceInputLocked = practice.active && practice.locked;
  const practiceAnswerUnavailable = practiceInputLocked || practice.answer === "";

  return (
    <section
      ref={rootRef}
      className={`calculator-app ${
        maximized ? "calculator-app--maximized" : "calculator-app--restored"
      } ${active ? "calculator-app--active" : "calculator-app--inactive"}`}
      aria-label={copy.title}
      tabIndex={active ? 0 : -1}
      data-calculator-root="true"
      data-calculator-active={active ? "true" : "false"}
      data-calculator-active-root={active ? "true" : "false"}
      data-calculator-mode={practice.active ? "practice" : "calculator"}
      data-calculator-maximized={maximized ? "true" : "false"}
      onKeyDown={handleKeyDown}
      onClickCapture={(event) => {
        // Keyboard/synthetic activation cannot mutate an inactive calculator.
        if (!active && event.detail === 0) {
          event.preventDefault();
          event.stopPropagation();
        }
      }}
      onPointerDown={(event) => {
        if (!(event.target as HTMLElement).closest("button")) {
          rootRef.current?.focus({ preventScroll: true });
        }
      }}
    >
      <header className="calculator-app__header">
        <div className="calculator-app__brand">
          <span className="calculator-app__power-light" aria-hidden="true" />
          <h2 className="calculator-app__title">{copy.title}</h2>
        </div>
        <span className="calculator-app__mode-label" data-calculator-mode-label="true">
          {practice.active ? copy.practiceMode : copy.calculatorMode}
        </span>
      </header>

      <div className="calculator-app__screen">
        <span className="calculator-app__screen-glare" aria-hidden="true" />
        <div
          className="calculator-app__latest-operation"
          aria-label={copy.latestOperationLabel}
          aria-live="polite"
          aria-atomic="true"
          data-calculator-latest-operation={latestText}
          data-calculator-question={practice.active ? latestText : undefined}
        >
          {latestText || "\u00a0"}
        </div>
        <output
          className={`calculator-app__display calculator-app__display--${displaySize}`}
          aria-label={practice.active ? copy.answerLabel : copy.displayLabel}
          aria-live="polite"
          aria-atomic="true"
          title={displayText}
          data-calculator-display={displayText}
          data-calculator-display-size={displaySize}
          style={displaySizing(displayText)}
        >
          {displayText}
        </output>
      </div>

      <div className="calculator-app__practice-status">
        <output
          className="calculator-app__score"
          aria-label={copy.scoreLabel}
          data-calculator-score={practice.streak}
          hidden={!practice.active}
        >
          {copy.scoreLabel}: {practice.streak}
        </output>
        <p
          className="calculator-app__feedback"
          role="status"
          aria-live="polite"
          aria-atomic="true"
          data-calculator-feedback={practice.feedback ?? "none"}
        >
          {feedbackText ? (
            <>
              <span className="calculator-app__feedback-mark" aria-hidden="true">
                {practice.feedback === "correct" ? "✓" : "!"}
              </span>
              <span>{feedbackText}</span>
            </>
          ) : null}
        </p>
      </div>

      <div className="calculator-app__keypad" role="group" aria-label={copy.title}>
        <CalculatorButton
          action="clear"
          label={copy.clearLabel}
          kind="utility"
          disabled={practice.active}
          onClick={() => dispatchCalculator(calculatorActions.clear())}
        >
          C
        </CalculatorButton>
        <CalculatorButton
          action="delete"
          label={copy.deleteLabel}
          kind="utility"
          disabled={practice.active ? practiceAnswerUnavailable : false}
          onClick={() => {
            if (practice.active) dispatchPractice(practiceActions.delete());
            else dispatchCalculator(calculatorActions.delete());
          }}
        >
          ⌫
        </CalculatorButton>
        <CalculatorButton
          action="toggle-sign"
          label={copy.toggleSignLabel}
          kind="utility"
          disabled={practice.active}
          onClick={() => dispatchCalculator(calculatorActions.toggleSign())}
        >
          +/−
        </CalculatorButton>
        <CalculatorButton
          action="percent"
          label={copy.percentLabel}
          kind="operator"
          disabled={practice.active}
          onClick={() => dispatchCalculator(calculatorActions.percent())}
        >
          %
        </CalculatorButton>

        {(["7", "8", "9"] as const).map((digit) => (
          <CalculatorButton
            key={digit}
            action="digit"
            value={digit}
            label={digit}
            kind="number"
            disabled={practiceInputLocked}
            onClick={() => {
              if (practice.active) dispatchPractice(practiceActions.digit(digit));
              else dispatchCalculator(calculatorActions.digit(digit));
            }}
          >
            {digit}
          </CalculatorButton>
        ))}
        <CalculatorButton
          action="operator"
          value="/"
          label={operatorLabels["/"]}
          kind="operator"
          disabled={practice.active}
          onClick={() => dispatchCalculator(calculatorActions.operator("/"))}
        >
          {OPERATOR_SYMBOLS["/"]}
        </CalculatorButton>

        {(["4", "5", "6"] as const).map((digit) => (
          <CalculatorButton
            key={digit}
            action="digit"
            value={digit}
            label={digit}
            kind="number"
            disabled={practiceInputLocked}
            onClick={() => {
              if (practice.active) dispatchPractice(practiceActions.digit(digit));
              else dispatchCalculator(calculatorActions.digit(digit));
            }}
          >
            {digit}
          </CalculatorButton>
        ))}
        <CalculatorButton
          action="operator"
          value="*"
          label={operatorLabels["*"]}
          kind="operator"
          disabled={practice.active}
          onClick={() => dispatchCalculator(calculatorActions.operator("*"))}
        >
          {OPERATOR_SYMBOLS["*"]}
        </CalculatorButton>

        {(["1", "2", "3"] as const).map((digit) => (
          <CalculatorButton
            key={digit}
            action="digit"
            value={digit}
            label={digit}
            kind="number"
            disabled={practiceInputLocked}
            onClick={() => {
              if (practice.active) dispatchPractice(practiceActions.digit(digit));
              else dispatchCalculator(calculatorActions.digit(digit));
            }}
          >
            {digit}
          </CalculatorButton>
        ))}
        <CalculatorButton
          action="operator"
          value="-"
          label={operatorLabels["-"]}
          kind="operator"
          disabled={practice.active}
          onClick={() => dispatchCalculator(calculatorActions.operator("-"))}
        >
          {OPERATOR_SYMBOLS["-"]}
        </CalculatorButton>

        <CalculatorButton
          action="digit"
          value={DIGITS[0]}
          label={DIGITS[0]}
          kind="number"
          disabled={practiceInputLocked}
          onClick={() => {
            if (practice.active) dispatchPractice(practiceActions.digit(DIGITS[0]));
            else dispatchCalculator(calculatorActions.digit(DIGITS[0]));
          }}
        >
          {DIGITS[0]}
        </CalculatorButton>
        <CalculatorButton
          action="decimal"
          label={copy.decimalLabel}
          kind="number"
          disabled={practice.active}
          onClick={() => dispatchCalculator(calculatorActions.decimal())}
        >
          .
        </CalculatorButton>
        <CalculatorButton
          action="operator"
          value="+"
          label={operatorLabels["+"]}
          kind="operator"
          disabled={practice.active}
          onClick={() => dispatchCalculator(calculatorActions.operator("+"))}
        >
          {OPERATOR_SYMBOLS["+"]}
        </CalculatorButton>

        <CalculatorButton
          action="equals"
          label={copy.equalsLabel}
          kind="equals"
          disabled={practice.active ? practiceAnswerUnavailable : false}
          onClick={() => {
            if (practice.active) submitPractice();
            else dispatchCalculator(calculatorActions.equals());
          }}
        >
          =
        </CalculatorButton>
        <CalculatorButton
          action="practice-mode"
          label={practice.active ? copy.practiceStopLabel : copy.practiceStartLabel}
          kind="mode"
          pressed={practice.active}
          onClick={togglePractice}
        >
          {practice.active ? copy.practiceStopLabel : copy.practiceStartLabel}
        </CalculatorButton>
      </div>
    </section>
  );
}
