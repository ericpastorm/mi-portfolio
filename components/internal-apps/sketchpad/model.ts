export const SKETCHPAD_DOCUMENT_VERSION = 1 as const;
export const DEFAULT_GRID_SIZE = 16;
export const MIN_GRID_SIZE = 1;
export const MAX_GRID_SIZE = 100;
export const MIN_BRUSH_SIZE = 1;
export const MAX_BRUSH_SIZE = 10;
export const WHITE = "#ffffff";

export const SKETCHPAD_PALETTE = [
  WHITE,
  "#808080",
  "#2f3542",
  "#f4a460",
  "#8b4513",
  "#dc2626",
  "#ef4444",
  "#f97316",
  "#f59e0b",
  "#fbd04a",
  "#84cc16",
  "#22c55e",
  "#059669",
  "#14b8a6",
  "#06b6d4",
  "#3b82f6",
  "#7c3aed",
  "#8b5cf6",
  "#d946ef",
] as const;

export type SketchpadColor = string;

export interface SketchpadPoint {
  readonly row: number;
  readonly column: number;
}

export interface SketchpadDocument {
  readonly version: typeof SKETCHPAD_DOCUMENT_VERSION;
  readonly size: number;
  readonly pixels: readonly SketchpadColor[];
}

export type SketchpadPaint = SketchpadColor | (() => SketchpadColor);

export function isValidGridSize(value: number): boolean {
  return (
    Number.isInteger(value) &&
    value >= MIN_GRID_SIZE &&
    value <= MAX_GRID_SIZE
  );
}

export function parseGridSize(value: string): number | null {
  const parsed = Number(value.trim());
  return isValidGridSize(parsed) ? parsed : null;
}

export function isValidBrushSize(value: number): boolean {
  return (
    Number.isInteger(value) &&
    value >= MIN_BRUSH_SIZE &&
    value <= MAX_BRUSH_SIZE
  );
}

export function isValidSketchpadColor(value: unknown): value is SketchpadColor {
  return typeof value === "string" && /^#[0-9a-f]{6}$/i.test(value);
}

export function createSketchpadDocument(
  size = DEFAULT_GRID_SIZE,
): SketchpadDocument {
  if (!isValidGridSize(size)) {
    throw new RangeError(
      `Sketchpad grid size must be an integer from ${MIN_GRID_SIZE} to ${MAX_GRID_SIZE}.`,
    );
  }

  return {
    version: SKETCHPAD_DOCUMENT_VERSION,
    size,
    pixels: Array.from({ length: size * size }, () => WHITE),
  };
}

/** Resizing intentionally starts a new, blank document. */
export function resizeSketchpadDocument(size: number): SketchpadDocument {
  return createSketchpadDocument(size);
}

export function clearSketchpadDocument(
  document: SketchpadDocument,
): SketchpadDocument {
  return createSketchpadDocument(document.size);
}

/** Whole-canvas fill resolves the paint once, including random paint. */
export function fillSketchpadDocument(
  document: SketchpadDocument,
  paint: SketchpadPaint,
): SketchpadDocument {
  const color = resolvePaint(paint);

  if (document.pixels.every((pixel) => pixel === color)) {
    return document;
  }

  return {
    ...document,
    pixels: Array.from({ length: document.size * document.size }, () => color),
  };
}

/**
 * Paints an interpolated path with a square brush. Target cells are clipped to
 * the document and resolved once per cell, so random mode does not leave gaps.
 */
export function paintSketchpadPath(
  document: SketchpadDocument,
  points: readonly SketchpadPoint[],
  brushSize: number,
  paint: SketchpadPaint,
): SketchpadDocument {
  if (!isValidBrushSize(brushSize)) {
    throw new RangeError(
      `Sketchpad brush size must be an integer from ${MIN_BRUSH_SIZE} to ${MAX_BRUSH_SIZE}.`,
    );
  }

  const validPoints = points.filter(
    (point) =>
      Number.isInteger(point.row) &&
      Number.isInteger(point.column) &&
      point.row >= 0 &&
      point.row < document.size &&
      point.column >= 0 &&
      point.column < document.size,
  );

  if (validPoints.length === 0) return document;

  const pathCells: SketchpadPoint[] = [];
  if (validPoints.length === 1) {
    pathCells.push(validPoints[0]);
  } else {
    for (let index = 1; index < validPoints.length; index += 1) {
      pathCells.push(
        ...interpolateSketchpadCells(validPoints[index - 1], validPoints[index]),
      );
    }
  }

  const targetIndices = new Set<number>();
  const brushOffset = Math.floor(brushSize / 2);

  for (const point of pathCells) {
    for (
      let row = point.row - brushOffset;
      row < point.row + brushSize - brushOffset;
      row += 1
    ) {
      if (row < 0 || row >= document.size) continue;

      for (
        let column = point.column - brushOffset;
        column < point.column + brushSize - brushOffset;
        column += 1
      ) {
        if (column < 0 || column >= document.size) continue;
        targetIndices.add(row * document.size + column);
      }
    }
  }

  let nextPixels: SketchpadColor[] | null = null;

  for (const index of targetIndices) {
    const color = resolvePaint(paint);
    if (document.pixels[index] === color) continue;
    nextPixels ??= [...document.pixels];
    nextPixels[index] = color;
  }

  if (!nextPixels) return document;
  return { ...document, pixels: nextPixels };
}

/** Bresenham interpolation between two logical cells, including both ends. */
export function interpolateSketchpadCells(
  start: SketchpadPoint,
  end: SketchpadPoint,
): SketchpadPoint[] {
  const cells: SketchpadPoint[] = [];
  let column = start.column;
  let row = start.row;
  const columnDistance = Math.abs(end.column - start.column);
  const rowDistance = Math.abs(end.row - start.row);
  const columnStep = start.column < end.column ? 1 : -1;
  const rowStep = start.row < end.row ? 1 : -1;
  let error = columnDistance - rowDistance;

  while (true) {
    cells.push({ row, column });
    if (column === end.column && row === end.row) break;

    const doubledError = error * 2;
    if (doubledError > -rowDistance) {
      error -= rowDistance;
      column += columnStep;
    }
    if (doubledError < columnDistance) {
      error += columnDistance;
      row += rowStep;
    }
  }

  return cells;
}

export function createRandomSketchpadColor(
  random: () => number = Math.random,
): SketchpadColor {
  const channel = () => {
    const sample = random();
    const boundedSample = Number.isFinite(sample)
      ? Math.min(1, Math.max(0, sample))
      : 0;
    return Math.min(255, Math.floor(boundedSample * 256));
  };

  return `#${[channel(), channel(), channel()]
    .map((value) => value.toString(16).padStart(2, "0"))
    .join("")}`;
}

export function serializeSketchpadDocument(
  document: SketchpadDocument,
): string {
  return JSON.stringify(document);
}

export function deserializeSketchpadDocument(
  serialized: string,
): SketchpadDocument | null {
  try {
    const value: unknown = JSON.parse(serialized);
    if (!isRecord(value)) return null;
    if (value.version !== SKETCHPAD_DOCUMENT_VERSION) return null;
    if (typeof value.size !== "number" || !isValidGridSize(value.size)) {
      return null;
    }
    if (!Array.isArray(value.pixels)) return null;
    if (value.pixels.length !== value.size * value.size) return null;
    if (!value.pixels.every(isValidSketchpadColor)) return null;

    return {
      version: SKETCHPAD_DOCUMENT_VERSION,
      size: value.size,
      pixels: value.pixels.map((color) => color.toLowerCase()),
    };
  } catch {
    return null;
  }
}

function resolvePaint(paint: SketchpadPaint): SketchpadColor {
  const color = typeof paint === "function" ? paint() : paint;
  if (!isValidSketchpadColor(color)) {
    throw new TypeError("Sketchpad paint must be a six-digit hexadecimal color.");
  }
  return color.toLowerCase();
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}
