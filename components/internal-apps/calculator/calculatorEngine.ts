export const DIGITS = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"] as const;

export type Digit = (typeof DIGITS)[number];
export type CalculatorOperator = "+" | "-" | "*" | "/";
export type CalculatorError = "division-by-zero" | "numeric-overflow";

export const OPERATOR_SYMBOLS: Record<CalculatorOperator, string> = {
  "+": "+",
  "-": "−",
  "*": "×",
  "/": "÷",
};

interface RepeatOperation {
  operator: CalculatorOperator;
  operand: number;
}

export interface CalculatorState {
  display: string;
  accumulator: number | null;
  pendingOperator: CalculatorOperator | null;
  waitingForOperand: boolean;
  latestOperation: string;
  lastOperation: RepeatOperation | null;
  error: CalculatorError | null;
}

export type CalculatorAction =
  | { type: "digit"; digit: Digit }
  | { type: "decimal" }
  | { type: "operator"; operator: CalculatorOperator }
  | { type: "equals" }
  | { type: "clear" }
  | { type: "delete" }
  | { type: "toggle-sign" }
  | { type: "percent" };

export type CalculationResult =
  | { ok: true; value: number }
  | { ok: false; error: CalculatorError };

const MAX_INPUT_DIGITS = 16;
const CALCULATION_PRECISION = 15;

export function createInitialCalculatorState(): CalculatorState {
  return {
    display: "0",
    accumulator: null,
    pendingOperator: null,
    waitingForOperand: false,
    latestOperation: "",
    lastOperation: null,
    error: null,
  };
}

export const calculatorActions = {
  digit: (digit: Digit): CalculatorAction => ({ type: "digit", digit }),
  decimal: (): CalculatorAction => ({ type: "decimal" }),
  operator: (operator: CalculatorOperator): CalculatorAction => ({ type: "operator", operator }),
  equals: (): CalculatorAction => ({ type: "equals" }),
  clear: (): CalculatorAction => ({ type: "clear" }),
  delete: (): CalculatorAction => ({ type: "delete" }),
  toggleSign: (): CalculatorAction => ({ type: "toggle-sign" }),
  percent: (): CalculatorAction => ({ type: "percent" }),
};

export function isDigit(value: string): value is Digit {
  return DIGITS.includes(value as Digit);
}

export function isCalculatorOperator(value: string): value is CalculatorOperator {
  return value === "+" || value === "-" || value === "*" || value === "/";
}

/** Removes normal IEEE-754 display noise while retaining useful precision. */
export function normalizeNumber(value: number): number | null {
  if (!Number.isFinite(value)) return null;
  if (Object.is(value, -0) || value === 0) return 0;

  const normalized = Number.parseFloat(value.toPrecision(CALCULATION_PRECISION));
  return Number.isFinite(normalized) ? normalized : null;
}

export function formatNumber(value: number): string {
  const normalized = normalizeNumber(value);
  return normalized === null ? "Error" : String(normalized);
}

/** Pure arithmetic entry point; no eval or expression parsing is used. */
export function calculate(
  left: number,
  operator: CalculatorOperator,
  right: number,
): CalculationResult {
  if (!Number.isFinite(left) || !Number.isFinite(right)) {
    return { ok: false, error: "numeric-overflow" };
  }

  if (operator === "/" && right === 0) {
    return { ok: false, error: "division-by-zero" };
  }

  let rawResult: number;
  switch (operator) {
    case "+":
      rawResult = left + right;
      break;
    case "-":
      rawResult = left - right;
      break;
    case "*":
      rawResult = left * right;
      break;
    case "/":
      rawResult = left / right;
      break;
  }

  const value = normalizeNumber(rawResult);
  return value === null
    ? { ok: false, error: "numeric-overflow" }
    : { ok: true, value };
}

function parseDisplay(display: string): number | null {
  const parsed = Number(display);
  return Number.isFinite(parsed) ? parsed : null;
}

function formatOperation(
  left: number,
  operator: CalculatorOperator,
  right: number,
  result: number | "Error",
): string {
  const formattedResult = result === "Error" ? result : formatNumber(result);
  return `${formatNumber(left)} ${OPERATOR_SYMBOLS[operator]} ${formatNumber(right)} = ${formattedResult}`;
}

function toErrorState(
  state: CalculatorState,
  error: CalculatorError,
  left: number,
  operator: CalculatorOperator,
  right: number,
): CalculatorState {
  return {
    ...state,
    display: "Error",
    accumulator: null,
    pendingOperator: null,
    waitingForOperand: true,
    latestOperation: formatOperation(left, operator, right, "Error"),
    lastOperation: null,
    error,
  };
}

function inputDigit(state: CalculatorState, digit: Digit): CalculatorState {
  if (state.error) {
    return {
      ...createInitialCalculatorState(),
      display: digit,
    };
  }

  if (state.waitingForOperand) {
    const startsNewCalculation = state.pendingOperator === null;
    return {
      ...state,
      display: digit,
      accumulator: startsNewCalculation ? null : state.accumulator,
      waitingForOperand: false,
      latestOperation: startsNewCalculation ? "" : state.latestOperation,
      lastOperation: startsNewCalculation ? null : state.lastOperation,
    };
  }

  const digitCount = state.display.replace(/[^0-9]/g, "").length;
  if (digitCount >= MAX_INPUT_DIGITS) return state;

  const display = state.display === "0" ? digit : `${state.display}${digit}`;
  return { ...state, display };
}

function inputDecimal(state: CalculatorState): CalculatorState {
  if (state.error) {
    return {
      ...createInitialCalculatorState(),
      display: "0.",
    };
  }

  if (state.waitingForOperand) {
    const startsNewCalculation = state.pendingOperator === null;
    return {
      ...state,
      display: "0.",
      accumulator: startsNewCalculation ? null : state.accumulator,
      waitingForOperand: false,
      latestOperation: startsNewCalculation ? "" : state.latestOperation,
      lastOperation: startsNewCalculation ? null : state.lastOperation,
    };
  }

  if (state.display.includes(".") || state.display.toLowerCase().includes("e")) return state;
  return { ...state, display: `${state.display}.` };
}

function inputOperator(
  state: CalculatorState,
  nextOperator: CalculatorOperator,
): CalculatorState {
  if (state.error) return state;

  // A second operator before another operand changes intent; it must not calculate.
  if (state.pendingOperator && state.waitingForOperand) {
    return { ...state, pendingOperator: nextOperator };
  }

  const currentValue = parseDisplay(state.display);
  if (currentValue === null) return createInitialCalculatorState();

  if (state.pendingOperator && state.accumulator !== null) {
    const result = calculate(state.accumulator, state.pendingOperator, currentValue);
    if (!result.ok) {
      return toErrorState(
        state,
        result.error,
        state.accumulator,
        state.pendingOperator,
        currentValue,
      );
    }

    return {
      ...state,
      display: formatNumber(result.value),
      accumulator: result.value,
      pendingOperator: nextOperator,
      waitingForOperand: true,
      lastOperation: null,
    };
  }

  return {
    ...state,
    accumulator: currentValue,
    pendingOperator: nextOperator,
    waitingForOperand: true,
    lastOperation: null,
  };
}

function inputEquals(state: CalculatorState): CalculatorState {
  if (state.error) return state;

  const currentValue = parseDisplay(state.display);
  if (currentValue === null) return createInitialCalculatorState();

  if (state.pendingOperator) {
    const left = state.accumulator ?? currentValue;
    // `5 + =` intentionally reuses 5 as the missing right-hand operand.
    const right = state.waitingForOperand ? left : currentValue;
    const result = calculate(left, state.pendingOperator, right);

    if (!result.ok) {
      return toErrorState(state, result.error, left, state.pendingOperator, right);
    }

    return {
      ...state,
      display: formatNumber(result.value),
      accumulator: result.value,
      pendingOperator: null,
      waitingForOperand: true,
      latestOperation: formatOperation(left, state.pendingOperator, right, result.value),
      lastOperation: { operator: state.pendingOperator, operand: right },
      error: null,
    };
  }

  if (state.lastOperation) {
    const left = currentValue;
    const { operator, operand } = state.lastOperation;
    const result = calculate(left, operator, operand);

    if (!result.ok) return toErrorState(state, result.error, left, operator, operand);

    return {
      ...state,
      display: formatNumber(result.value),
      accumulator: result.value,
      waitingForOperand: true,
      latestOperation: formatOperation(left, operator, operand, result.value),
      error: null,
    };
  }

  return state;
}

function deleteLastDigit(state: CalculatorState): CalculatorState {
  if (state.error) return createInitialCalculatorState();
  if (state.waitingForOperand) return state;

  const shortened = state.display.slice(0, -1);
  const display = shortened === "" || shortened === "-" || shortened === "-0" ? "0" : shortened;
  return { ...state, display };
}

function toggleSign(state: CalculatorState): CalculatorState {
  if (state.error || (state.pendingOperator && state.waitingForOperand)) return state;
  if (state.display === "0") return state;

  const display = state.display.startsWith("-")
    ? state.display.slice(1)
    : `-${state.display}`;
  const value = parseDisplay(display);

  return {
    ...state,
    display,
    accumulator: state.pendingOperator === null && state.waitingForOperand ? value : state.accumulator,
    latestOperation: "",
    lastOperation: null,
  };
}

function applyPercent(state: CalculatorState): CalculatorState {
  if (state.error || (state.pendingOperator && state.waitingForOperand)) return state;

  const currentValue = parseDisplay(state.display);
  if (currentValue === null) return createInitialCalculatorState();

  const value = normalizeNumber(currentValue / 100);
  if (value === null) {
    return {
      ...createInitialCalculatorState(),
      display: "Error",
      waitingForOperand: true,
      error: "numeric-overflow",
    };
  }

  return {
    ...state,
    display: formatNumber(value),
    accumulator: state.pendingOperator === null && state.waitingForOperand ? value : state.accumulator,
    latestOperation: "",
    lastOperation: null,
  };
}

export function calculatorReducer(
  state: CalculatorState,
  action: CalculatorAction,
): CalculatorState {
  switch (action.type) {
    case "digit":
      return inputDigit(state, action.digit);
    case "decimal":
      return inputDecimal(state);
    case "operator":
      return inputOperator(state, action.operator);
    case "equals":
      return inputEquals(state);
    case "clear":
      return createInitialCalculatorState();
    case "delete":
      return deleteLastDigit(state);
    case "toggle-sign":
      return toggleSign(state);
    case "percent":
      return applyPercent(state);
  }
}

export interface PracticeProblem {
  left: number;
  right: number;
  operator: CalculatorOperator;
  answer: number;
  question: string;
}

export type PracticeFeedback = "correct" | "incorrect";

export interface PracticeState {
  active: boolean;
  problem: PracticeProblem | null;
  answer: string;
  streak: number;
  feedback: PracticeFeedback | null;
  locked: boolean;
}

export type PracticeAction =
  | { type: "start"; problem: PracticeProblem }
  | { type: "stop" }
  | { type: "digit"; digit: Digit }
  | { type: "delete" }
  | { type: "submit" }
  | { type: "next"; problem: PracticeProblem };

const MAX_PRACTICE_ANSWER_DIGITS = 12;

export function createInitialPracticeState(): PracticeState {
  return {
    active: false,
    problem: null,
    answer: "",
    streak: 0,
    feedback: null,
    locked: false,
  };
}

export const practiceActions = {
  start: (problem: PracticeProblem): PracticeAction => ({ type: "start", problem }),
  stop: (): PracticeAction => ({ type: "stop" }),
  digit: (digit: Digit): PracticeAction => ({ type: "digit", digit }),
  delete: (): PracticeAction => ({ type: "delete" }),
  submit: (): PracticeAction => ({ type: "submit" }),
  next: (problem: PracticeProblem): PracticeAction => ({ type: "next", problem }),
};

function randomInteger(random: () => number, minimum: number, maximum: number): number {
  const sampled = random();
  const safeSample = Number.isFinite(sampled) ? sampled : 0;
  const unit = Math.min(Math.max(safeSample, 0), 1 - Number.EPSILON);
  return minimum + Math.floor(unit * (maximum - minimum + 1));
}

export function createPracticeProblem(random: () => number = Math.random): PracticeProblem {
  const operators: readonly CalculatorOperator[] = ["+", "-", "*", "/"];
  const operator = operators[randomInteger(random, 0, operators.length - 1)];

  let left: number;
  let right: number;
  let answer: number;

  if (operator === "/") {
    answer = randomInteger(random, 2, 10);
    right = randomInteger(random, 2, 10);
    left = answer * right;
  } else {
    left = randomInteger(random, 1, 10);
    right = randomInteger(random, 1, 10);

    if (operator === "-" && left < right) {
      [left, right] = [right, left];
    }

    const result = calculate(left, operator, right);
    // These small integer operands cannot overflow or divide by zero.
    answer = result.ok ? result.value : 0;
  }

  return {
    left,
    right,
    operator,
    answer,
    question: `${left} ${OPERATOR_SYMBOLS[operator]} ${right} = ?`,
  };
}

export function practiceReducer(state: PracticeState, action: PracticeAction): PracticeState {
  switch (action.type) {
    case "start":
      return {
        active: true,
        problem: action.problem,
        answer: "",
        streak: 0,
        feedback: null,
        locked: false,
      };
    case "stop":
      return createInitialPracticeState();
    case "digit": {
      if (!state.active || state.locked || state.answer.length >= MAX_PRACTICE_ANSWER_DIGITS) {
        return state;
      }
      const answer = state.answer === "0" ? action.digit : `${state.answer}${action.digit}`;
      return { ...state, answer };
    }
    case "delete":
      if (!state.active || state.locked || state.answer === "") return state;
      return { ...state, answer: state.answer.slice(0, -1) };
    case "submit": {
      if (!state.active || state.locked || !state.problem || state.answer === "") return state;
      const correct = Number(state.answer) === state.problem.answer;
      return {
        ...state,
        streak: correct ? state.streak + 1 : 0,
        feedback: correct ? "correct" : "incorrect",
        locked: true,
      };
    }
    case "next":
      if (!state.active) return state;
      return {
        ...state,
        problem: action.problem,
        answer: "",
        feedback: null,
        locked: false,
      };
  }
}
