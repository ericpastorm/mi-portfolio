"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
} from "react";
import {
  Dice5,
  Download,
  Eraser,
  Grid3X3,
  PaintBucket,
  Pencil,
  Sparkles,
  Trash2,
} from "lucide-react";

import {
  DEFAULT_GRID_SIZE,
  MAX_BRUSH_SIZE,
  MAX_GRID_SIZE,
  MIN_BRUSH_SIZE,
  MIN_GRID_SIZE,
  SKETCHPAD_PALETTE,
  WHITE,
  clearSketchpadDocument,
  createRandomSketchpadColor,
  createSketchpadDocument,
  deserializeSketchpadDocument,
  fillSketchpadDocument,
  isValidBrushSize,
  paintSketchpadPath,
  parseGridSize,
  resizeSketchpadDocument,
  serializeSketchpadDocument,
  type SketchpadColor,
  type SketchpadDocument,
  type SketchpadPoint,
} from "./model";

export const DEFAULT_SKETCHPAD_STORAGE_KEY = "portfolio:sketchpad:v1";
export const SKETCHPAD_EXPORT_SIZE = 1024;
export const SKETCHPAD_EXPORT_FILENAME = "my-draw-sketchpad.png";

export interface SketchpadCopy {
  title: string;
  description: string;
  canvasLabel: string;
  canvasInstructions: string;
  canvasFallback: string;
  toolsLegend: string;
  pencilTool: string;
  eraserTool: string;
  fillTool: string;
  colorsLegend: string;
  selectColorLabel: string;
  randomColorLabel: string;
  brushSizeLabel: string;
  showGridLines: string;
  hideGridLines: string;
  gridSizeLabel: string;
  gridSizeHint: string;
  applyGridSize: string;
  invalidGridSize: string;
  clearCanvas: string;
  clearDialogTitle: string;
  clearDialogDescription: string;
  cancelClear: string;
  confirmClear: string;
  exportPng: string;
  exportingStatus: string;
  exportSuccessStatus: string;
  exportErrorStatus: string;
  drawingRestoredStatus: string;
  gridResizedStatus: string;
  canvasClearedStatus: string;
  storageErrorStatus: string;
}

export interface SketchpadAppProps {
  copy: SketchpadCopy;
  storageKey?: string;
}

type SketchpadTool = "pencil" | "eraser" | "fill";
type PaletteColor = (typeof SKETCHPAD_PALETTE)[number];
type SelectedColor = PaletteColor | "random";
type StatusKind =
  | "idle"
  | "restored"
  | "resized"
  | "cleared"
  | "exporting"
  | "exported"
  | "error";

interface SketchpadStatus {
  readonly kind: StatusKind;
  readonly message: string;
}

interface CanvasPointSource {
  readonly clientX: number;
  readonly clientY: number;
}

const TOOL_OPTIONS: readonly SketchpadTool[] = ["pencil", "eraser", "fill"];
const GRID_LINE_COLOR = "#e2e8f0";

export function SketchpadApp({
  copy,
  storageKey = DEFAULT_SKETCHPAD_STORAGE_KEY,
}: SketchpadAppProps) {
  const titleId = useId();
  const descriptionId = useId();
  const canvasInstructionsId = useId();
  const brushSizeId = useId();
  const gridSizeId = useId();
  const gridSizeHintId = useId();
  const gridSizeErrorId = useId();
  const clearDialogTitleId = useId();
  const clearDialogDescriptionId = useId();

  const [sketchpadDocument, setSketchpadDocument] =
    useState<SketchpadDocument>(() => createSketchpadDocument());
  const [selectedTool, setSelectedTool] = useState<SketchpadTool>("pencil");
  const [selectedColor, setSelectedColor] =
    useState<SelectedColor>("#2f3542");
  const [brushSize, setBrushSize] = useState(MIN_BRUSH_SIZE);
  const [showGrid, setShowGrid] = useState(true);
  const [gridSizeInput, setGridSizeInput] = useState(
    String(DEFAULT_GRID_SIZE),
  );
  const [gridSizeError, setGridSizeError] = useState("");
  const [clearDialogOpen, setClearDialogOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [status, setStatus] = useState<SketchpadStatus>({
    kind: "idle",
    message: "",
  });

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const clearDialogRef = useRef<HTMLDialogElement>(null);
  const clearButtonRef = useRef<HTMLButtonElement>(null);
  const cancelClearButtonRef = useRef<HTMLButtonElement>(null);
  const sketchpadDocumentRef = useRef(sketchpadDocument);
  const showGridRef = useRef(showGrid);
  const activePointerIdRef = useRef<number | null>(null);
  const lastPaintedPointRef = useRef<SketchpadPoint | null>(null);
  const strokeChangedRef = useRef(false);
  const clearDialogWasOpenedRef = useRef(false);
  const mountedRef = useRef(false);
  const objectUrlsRef = useRef(new Set<string>());
  const objectUrlTimeoutsRef = useRef(new Set<number>());

  sketchpadDocumentRef.current = sketchpadDocument;
  showGridRef.current = showGrid;

  const drawVisibleCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const bounds = canvas.getBoundingClientRect();
    if (bounds.width <= 0) return;

    const devicePixelRatio = Math.max(1, window.devicePixelRatio || 1);
    const backingSize = Math.max(
      1,
      Math.round(bounds.width * devicePixelRatio),
    );

    if (canvas.width !== backingSize || canvas.height !== backingSize) {
      canvas.width = backingSize;
      canvas.height = backingSize;
    }

    renderSketchpadCanvas(
      canvas,
      sketchpadDocumentRef.current,
      showGridRef.current,
    );
  }, []);

  const persistDocument = useCallback(
    (documentToPersist: SketchpadDocument) => {
      try {
        window.localStorage.setItem(
          storageKey,
          serializeSketchpadDocument(documentToPersist),
        );
      } catch {
        setStatus({ kind: "error", message: copy.storageErrorStatus });
      }
    },
    [copy.storageErrorStatus, storageKey],
  );

  const commitDocument = useCallback(
    (nextDocument: SketchpadDocument, persist: boolean) => {
      sketchpadDocumentRef.current = nextDocument;
      setSketchpadDocument(nextDocument);
      if (persist) persistDocument(nextDocument);
    },
    [persistDocument],
  );

  useEffect(() => {
    mountedRef.current = true;
    const objectUrls = objectUrlsRef.current;
    const objectUrlTimeouts = objectUrlTimeoutsRef.current;

    return () => {
      mountedRef.current = false;
      for (const timeoutId of objectUrlTimeouts) {
        window.clearTimeout(timeoutId);
      }
      objectUrlTimeouts.clear();
      for (const objectUrl of objectUrls) {
        URL.revokeObjectURL(objectUrl);
      }
      objectUrls.clear();
    };
  }, []);

  useEffect(() => {
    try {
      const serializedDocument = window.localStorage.getItem(storageKey);
      if (serializedDocument === null) return;

      const restoredDocument =
        deserializeSketchpadDocument(serializedDocument);
      if (!restoredDocument) {
        setStatus({ kind: "error", message: copy.storageErrorStatus });
        return;
      }

      sketchpadDocumentRef.current = restoredDocument;
      setSketchpadDocument(restoredDocument);
      setGridSizeInput(String(restoredDocument.size));
      setGridSizeError("");
      setStatus({
        kind: "restored",
        message: copy.drawingRestoredStatus,
      });
    } catch {
      setStatus({ kind: "error", message: copy.storageErrorStatus });
    }
  }, [copy.drawingRestoredStatus, copy.storageErrorStatus, storageKey]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    drawVisibleCanvas();

    if (typeof ResizeObserver === "undefined") return;
    const resizeObserver = new ResizeObserver(() => drawVisibleCanvas());
    resizeObserver.observe(canvas);

    return () => resizeObserver.disconnect();
  }, [drawVisibleCanvas]);

  useEffect(() => {
    drawVisibleCanvas();
  }, [drawVisibleCanvas, showGrid, sketchpadDocument]);

  useEffect(() => {
    const dialog = clearDialogRef.current;
    if (!dialog) return;

    let focusFrame: number | null = null;

    if (clearDialogOpen) {
      clearDialogWasOpenedRef.current = true;
      if (!dialog.open) dialog.showModal();
      focusFrame = window.requestAnimationFrame(() => {
        cancelClearButtonRef.current?.focus();
      });
    } else if (clearDialogWasOpenedRef.current) {
      if (dialog.open) dialog.close();
      clearDialogWasOpenedRef.current = false;
      focusFrame = window.requestAnimationFrame(() => {
        clearButtonRef.current?.focus();
      });
    }

    return () => {
      if (focusFrame !== null) window.cancelAnimationFrame(focusFrame);
    };
  }, [clearDialogOpen]);

  const paintPoints = useCallback(
    (points: readonly SketchpadPoint[]) => {
      const currentDocument = sketchpadDocumentRef.current;
      const paint: SketchpadColor | (() => SketchpadColor) =
        selectedTool === "eraser"
          ? WHITE
          : selectedColor === "random"
            ? createRandomSketchpadColor
            : selectedColor;
      const nextDocument = paintSketchpadPath(
        currentDocument,
        points,
        brushSize,
        paint,
      );

      if (nextDocument === currentDocument) return;
      strokeChangedRef.current = true;
      commitDocument(nextDocument, false);
    },
    [brushSize, commitDocument, selectedColor, selectedTool],
  );

  const continuePointerStroke = useCallback(
    (event: ReactPointerEvent<HTMLCanvasElement>) => {
      if (activePointerIdRef.current !== event.pointerId) return;

      const previousPoint = lastPaintedPointRef.current;
      if (!previousPoint) return;

      const nativeEvent = event.nativeEvent;
      const coalescedEvents = nativeEvent.getCoalescedEvents?.() ?? [];
      const samples: readonly CanvasPointSource[] =
        coalescedEvents.length > 0 ? coalescedEvents : [nativeEvent];
      const points: SketchpadPoint[] = [previousPoint];

      for (const sample of samples) {
        const point = getLogicalPoint(
          event.currentTarget,
          sketchpadDocumentRef.current.size,
          sample,
          true,
        );
        if (!point) continue;
        const lastPoint = points[points.length - 1];
        if (
          lastPoint.row !== point.row ||
          lastPoint.column !== point.column
        ) {
          points.push(point);
        }
      }

      if (points.length === 1) return;
      paintPoints(points);
      lastPaintedPointRef.current = points[points.length - 1];
    },
    [paintPoints],
  );

  const finishPointerStroke = useCallback(
    (canvas: HTMLCanvasElement, pointerId: number, releaseCapture: boolean) => {
      if (activePointerIdRef.current !== pointerId) return;

      activePointerIdRef.current = null;
      lastPaintedPointRef.current = null;

      if (releaseCapture && canvas.hasPointerCapture(pointerId)) {
        canvas.releasePointerCapture(pointerId);
      }

      if (strokeChangedRef.current) {
        persistDocument(sketchpadDocumentRef.current);
      }
      strokeChangedRef.current = false;
    },
    [persistDocument],
  );

  const handlePointerDown = (
    event: ReactPointerEvent<HTMLCanvasElement>,
  ) => {
    if (!event.isPrimary || event.button !== 0) return;
    if (activePointerIdRef.current !== null) return;

    event.preventDefault();
    const point = getLogicalPoint(
      event.currentTarget,
      sketchpadDocumentRef.current.size,
      event.nativeEvent,
      false,
    );
    if (!point) return;

    if (selectedTool === "fill") {
      const fillColor =
        selectedColor === "random"
          ? createRandomSketchpadColor()
          : selectedColor;
      const nextDocument = fillSketchpadDocument(
        sketchpadDocumentRef.current,
        fillColor,
      );
      commitDocument(nextDocument, true);
      return;
    }

    activePointerIdRef.current = event.pointerId;
    lastPaintedPointRef.current = point;
    strokeChangedRef.current = false;
    event.currentTarget.setPointerCapture(event.pointerId);
    paintPoints([point]);
  };

  const handlePointerMove = (
    event: ReactPointerEvent<HTMLCanvasElement>,
  ) => {
    if (activePointerIdRef.current !== event.pointerId) return;
    event.preventDefault();
    continuePointerStroke(event);
  };

  const handlePointerUp = (event: ReactPointerEvent<HTMLCanvasElement>) => {
    if (activePointerIdRef.current !== event.pointerId) return;
    event.preventDefault();
    continuePointerStroke(event);
    finishPointerStroke(event.currentTarget, event.pointerId, true);
  };

  const handlePointerCancel = (
    event: ReactPointerEvent<HTMLCanvasElement>,
  ) => {
    if (activePointerIdRef.current !== event.pointerId) return;
    event.preventDefault();
    finishPointerStroke(event.currentTarget, event.pointerId, true);
  };

  const handleGridSizeSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextSize = parseGridSize(gridSizeInput);
    if (nextSize === null) {
      setGridSizeError(copy.invalidGridSize);
      return;
    }

    const blankDocument = resizeSketchpadDocument(nextSize);
    setGridSizeInput(String(nextSize));
    setGridSizeError("");
    setStatus({ kind: "resized", message: copy.gridResizedStatus });
    commitDocument(blankDocument, true);
  };

  const handleConfirmClear = () => {
    const blankDocument = clearSketchpadDocument(
      sketchpadDocumentRef.current,
    );
    setClearDialogOpen(false);
    setStatus({ kind: "cleared", message: copy.canvasClearedStatus });
    commitDocument(blankDocument, true);
  };

  const handleExport = async () => {
    if (isExporting) return;
    setIsExporting(true);
    setStatus({ kind: "exporting", message: copy.exportingStatus });

    try {
      const exportCanvas = window.document.createElement("canvas");
      exportCanvas.width = SKETCHPAD_EXPORT_SIZE;
      exportCanvas.height = SKETCHPAD_EXPORT_SIZE;
      renderSketchpadCanvas(
        exportCanvas,
        sketchpadDocumentRef.current,
        showGridRef.current,
      );

      const blob = await canvasToPngBlob(exportCanvas);
      if (!mountedRef.current) return;

      const objectUrl = URL.createObjectURL(blob);
      objectUrlsRef.current.add(objectUrl);

      const downloadLink = window.document.createElement("a");
      downloadLink.href = objectUrl;
      downloadLink.download = SKETCHPAD_EXPORT_FILENAME;
      window.document.body.appendChild(downloadLink);
      downloadLink.click();
      downloadLink.remove();

      const timeoutId = window.setTimeout(() => {
        URL.revokeObjectURL(objectUrl);
        objectUrlsRef.current.delete(objectUrl);
        objectUrlTimeoutsRef.current.delete(timeoutId);
      }, 1_000);
      objectUrlTimeoutsRef.current.add(timeoutId);

      setStatus({ kind: "exported", message: copy.exportSuccessStatus });
    } catch {
      if (mountedRef.current) {
        setStatus({ kind: "error", message: copy.exportErrorStatus });
      }
    } finally {
      if (mountedRef.current) setIsExporting(false);
    }
  };

  const toolLabels: Record<SketchpadTool, string> = {
    pencil: copy.pencilTool,
    eraser: copy.eraserTool,
    fill: copy.fillTool,
  };
  const toolIcons = {
    pencil: Pencil,
    eraser: Eraser,
    fill: PaintBucket,
  };

  return (
    <section
      className="sketchpad-app"
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      data-sketchpad-selected-tool={selectedTool}
      data-sketchpad-selected-color={selectedColor}
      data-sketchpad-grid-size={sketchpadDocument.size}
    >
      <header className="sketchpad-app__header">
        <div className="sketchpad-app__brand-mark" aria-hidden="true">
          <Sparkles />
        </div>
        <div className="sketchpad-app__heading">
          <h2 className="sketchpad-app__title" id={titleId}>
            {copy.title}
          </h2>
          <p className="sketchpad-app__description" id={descriptionId}>
            {copy.description}
          </p>
        </div>
        <p
          className="sketchpad-app__status"
          role="status"
          aria-live={status.kind === "error" ? "assertive" : "polite"}
          aria-atomic="true"
          data-sketchpad-status={status.kind}
        >
          <span className="sketchpad-app__status-light" aria-hidden="true" />
          <span>
            {status.message || `${sketchpadDocument.size} × ${sketchpadDocument.size} · ${brushSize}px`}
          </span>
        </p>
      </header>

      <div className="sketchpad-app__workspace">
        <div className="sketchpad-app__canvas-region">
          <div className="sketchpad-app__canvas-bar">
            <span>{copy.canvasLabel}</span>
            <span className="sketchpad-app__canvas-readout">
              {sketchpadDocument.size} × {sketchpadDocument.size}
            </span>
          </div>
          <div className="sketchpad-app__canvas-frame">
            <canvas
              ref={canvasRef}
              className="sketchpad-app__canvas sketchpad-app__canvas--touch-action-none"
              role="img"
              aria-label={copy.canvasLabel}
              aria-describedby={canvasInstructionsId}
              data-sketchpad-canvas="true"
              data-sketchpad-grid-size={sketchpadDocument.size}
              data-sketchpad-grid-lines={showGrid ? "visible" : "hidden"}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerCancel}
              onLostPointerCapture={(event) =>
                finishPointerStroke(
                  event.currentTarget,
                  event.pointerId,
                  false,
                )
              }
              onContextMenu={(event) => event.preventDefault()}
              onDragStart={(event) => event.preventDefault()}
              style={{
                aspectRatio: "1 / 1",
                display: "block",
                height: "auto",
                touchAction: "none",
                width: "100%",
              }}
            >
              {copy.canvasFallback}
            </canvas>
          </div>
          <p
            className="sketchpad-app__canvas-instructions"
            id={canvasInstructionsId}
          >
            {copy.canvasInstructions}
          </p>
        </div>

        <aside className="sketchpad-app__controls">
          <fieldset className="sketchpad-app__control-group sketchpad-app__tools">
            <legend className="sketchpad-app__legend">
              {copy.toolsLegend}
            </legend>
            <div className="sketchpad-app__tool-list">
              {TOOL_OPTIONS.map((tool) => {
                const selected = selectedTool === tool;
                const ToolIcon = toolIcons[tool];
                return (
                  <button
                    key={tool}
                    type="button"
                    className={`sketchpad-app__control sketchpad-app__tool${
                      selected ? " sketchpad-app__tool--selected" : ""
                    }`}
                    aria-pressed={selected}
                    data-sketchpad-tool={tool}
                    data-sketchpad-selected={selected ? "true" : "false"}
                    onClick={() => setSelectedTool(tool)}
                  >
                    <ToolIcon aria-hidden="true" />
                    <span>{toolLabels[tool]}</span>
                  </button>
                );
              })}
              <button
                type="button"
                className="sketchpad-app__control sketchpad-app__tool sketchpad-app__grid-toggle"
                aria-pressed={showGrid}
                data-sketchpad-grid-lines={showGrid ? "visible" : "hidden"}
                onClick={() => setShowGrid((currentlyShown) => !currentlyShown)}
              >
                <Grid3X3 aria-hidden="true" />
                <span>{showGrid ? copy.hideGridLines : copy.showGridLines}</span>
              </button>
              <button
                ref={clearButtonRef}
                type="button"
                className="sketchpad-app__control sketchpad-app__tool sketchpad-app__clear"
                onClick={() => setClearDialogOpen(true)}
              >
                <Trash2 aria-hidden="true" />
                <span>{copy.clearCanvas}</span>
              </button>
              <button
                type="button"
                className="sketchpad-app__control sketchpad-app__tool sketchpad-app__export"
                disabled={isExporting}
                data-sketchpad-export-size={SKETCHPAD_EXPORT_SIZE}
                onClick={handleExport}
              >
                <Download aria-hidden="true" />
                <span>{copy.exportPng}</span>
              </button>
            </div>
          </fieldset>

          <fieldset className="sketchpad-app__control-group sketchpad-app__colors">
            <legend className="sketchpad-app__legend">
              {copy.colorsLegend}
            </legend>
            <div className="sketchpad-app__color-list">
              {SKETCHPAD_PALETTE.map((color) => {
                const selected = selectedColor === color;
                return (
                  <button
                    key={color}
                    type="button"
                    className={`sketchpad-app__control sketchpad-app__color${
                      selected ? " sketchpad-app__color--selected" : ""
                    }`}
                    aria-label={`${copy.selectColorLabel}: ${color}`}
                    aria-pressed={selected}
                    data-sketchpad-color={color}
                    data-sketchpad-selected={selected ? "true" : "false"}
                    style={
                      { "--sketchpad-swatch": color } as CSSProperties
                    }
                    onClick={() => setSelectedColor(color)}
                  >
                    <span className="sr-only">{color}</span>
                  </button>
                );
              })}
              <button
                type="button"
                className={`sketchpad-app__control sketchpad-app__color sketchpad-app__color--random${
                  selectedColor === "random"
                    ? " sketchpad-app__color--selected"
                    : ""
                }`}
                aria-pressed={selectedColor === "random"}
                data-sketchpad-color="random"
                data-sketchpad-selected={
                  selectedColor === "random" ? "true" : "false"
                }
                onClick={() => setSelectedColor("random")}
              >
                <Dice5 aria-hidden="true" />
                <span>{copy.randomColorLabel}</span>
              </button>
            </div>
          </fieldset>

          <div className="sketchpad-app__settings-deck">
            <div className="sketchpad-app__control-group sketchpad-app__brush-size">
              <div className="sketchpad-app__setting-heading">
                <label className="sketchpad-app__label" htmlFor={brushSizeId}>
                  {copy.brushSizeLabel}
                </label>
                <output
                  className="sketchpad-app__brush-size-value"
                  htmlFor={brushSizeId}
                  data-sketchpad-brush-size-value={brushSize}
                >
                  {brushSize}px
                </output>
              </div>
              <input
                className="sketchpad-app__control sketchpad-app__range"
                id={brushSizeId}
                type="range"
                min={MIN_BRUSH_SIZE}
                max={MAX_BRUSH_SIZE}
                step={1}
                value={brushSize}
                data-sketchpad-brush-size={brushSize}
                onChange={(event) => {
                  const nextBrushSize = Number(event.currentTarget.value);
                  if (isValidBrushSize(nextBrushSize)) {
                    setBrushSize(nextBrushSize);
                  }
                }}
              />
            </div>

            <form
              className="sketchpad-app__control-group sketchpad-app__grid-size-form"
              onSubmit={handleGridSizeSubmit}
              noValidate
            >
              <div className="sketchpad-app__setting-heading">
                <label className="sketchpad-app__label" htmlFor={gridSizeId}>
                  {copy.gridSizeLabel}
                </label>
                <span className="sketchpad-app__grid-unit" aria-hidden="true">
                  {gridSizeInput || "—"}²
                </span>
              </div>
              <p className="sketchpad-app__hint" id={gridSizeHintId}>
                {copy.gridSizeHint}
              </p>
              <div className="sketchpad-app__grid-size-fields">
                <input
                  className="sketchpad-app__control sketchpad-app__number-input"
                  id={gridSizeId}
                  type="number"
                  inputMode="numeric"
                  min={MIN_GRID_SIZE}
                  max={MAX_GRID_SIZE}
                  step={1}
                  value={gridSizeInput}
                  aria-invalid={gridSizeError ? true : undefined}
                  aria-describedby={`${gridSizeHintId}${
                    gridSizeError ? ` ${gridSizeErrorId}` : ""
                  }`}
                  data-sketchpad-grid-size-input={gridSizeInput}
                  onChange={(event) => {
                    const nextValue = event.currentTarget.value;
                    setGridSizeInput(nextValue);
                    if (gridSizeError && parseGridSize(nextValue) !== null) {
                      setGridSizeError("");
                    }
                  }}
                />
                <button
                  type="submit"
                  className="sketchpad-app__control sketchpad-app__apply-grid-size"
                >
                  {copy.applyGridSize}
                </button>
              </div>
              {gridSizeError ? (
                <p
                  className="sketchpad-app__error"
                  id={gridSizeErrorId}
                  role="alert"
                  data-sketchpad-grid-size-error="true"
                >
                  {gridSizeError}
                </p>
              ) : null}
            </form>
          </div>
        </aside>
      </div>

      <dialog
        ref={clearDialogRef}
        className="sketchpad-app__dialog"
        aria-labelledby={clearDialogTitleId}
        aria-describedby={clearDialogDescriptionId}
        onCancel={(event) => {
          event.preventDefault();
          event.stopPropagation();
          setClearDialogOpen(false);
        }}
        onClose={() => setClearDialogOpen(false)}
        onClick={(event) => {
          if (event.target === event.currentTarget) {
            setClearDialogOpen(false);
          }
        }}
        onKeyDownCapture={(event) => {
          if (event.key !== "Escape") return;
          event.preventDefault();
          event.stopPropagation();
          setClearDialogOpen(false);
        }}
      >
        <div className="sketchpad-app__dialog-content">
          <h3 className="sketchpad-app__dialog-title" id={clearDialogTitleId}>
            {copy.clearDialogTitle}
          </h3>
          <p
            className="sketchpad-app__dialog-description"
            id={clearDialogDescriptionId}
          >
            {copy.clearDialogDescription}
          </p>
          <div className="sketchpad-app__dialog-actions">
            <button
              ref={cancelClearButtonRef}
              type="button"
              className="sketchpad-app__control sketchpad-app__dialog-cancel"
              onClick={() => setClearDialogOpen(false)}
            >
              {copy.cancelClear}
            </button>
            <button
              type="button"
              className="sketchpad-app__control sketchpad-app__dialog-confirm"
              onClick={handleConfirmClear}
            >
              {copy.confirmClear}
            </button>
          </div>
        </div>
      </dialog>
    </section>
  );
}

function getLogicalPoint(
  canvas: HTMLCanvasElement,
  gridSize: number,
  pointSource: CanvasPointSource,
  clampToCanvas: boolean,
): SketchpadPoint | null {
  const bounds = canvas.getBoundingClientRect();
  if (bounds.width <= 0 || bounds.height <= 0) return null;

  let relativeX = pointSource.clientX - bounds.left;
  let relativeY = pointSource.clientY - bounds.top;
  const outsideCanvas =
    relativeX < 0 ||
    relativeY < 0 ||
    relativeX >= bounds.width ||
    relativeY >= bounds.height;

  if (outsideCanvas && !clampToCanvas) return null;
  relativeX = Math.min(bounds.width - Number.EPSILON, Math.max(0, relativeX));
  relativeY = Math.min(
    bounds.height - Number.EPSILON,
    Math.max(0, relativeY),
  );

  return {
    column: Math.min(
      gridSize - 1,
      Math.floor((relativeX / bounds.width) * gridSize),
    ),
    row: Math.min(
      gridSize - 1,
      Math.floor((relativeY / bounds.height) * gridSize),
    ),
  };
}

function renderSketchpadCanvas(
  canvas: HTMLCanvasElement,
  documentToRender: SketchpadDocument,
  showGrid: boolean,
): void {
  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("The browser could not create a 2D canvas context.");
  }

  const width = canvas.width;
  const height = canvas.height;
  context.save();
  context.setTransform(1, 0, 0, 1, 0, 0);
  context.globalAlpha = 1;
  context.globalCompositeOperation = "source-over";
  context.imageSmoothingEnabled = false;
  context.fillStyle = WHITE;
  context.fillRect(0, 0, width, height);

  for (let row = 0; row < documentToRender.size; row += 1) {
    const top = Math.floor((row * height) / documentToRender.size);
    const bottom = Math.floor(((row + 1) * height) / documentToRender.size);

    for (let column = 0; column < documentToRender.size; column += 1) {
      const left = Math.floor((column * width) / documentToRender.size);
      const right = Math.floor(
        ((column + 1) * width) / documentToRender.size,
      );
      context.fillStyle =
        documentToRender.pixels[row * documentToRender.size + column] ?? WHITE;
      context.fillRect(left, top, right - left, bottom - top);
    }
  }

  if (showGrid) {
    const lineWidth = Math.max(1, Math.round(width / SKETCHPAD_EXPORT_SIZE));
    const lineOffset = lineWidth % 2 === 1 ? 0.5 : 0;
    context.beginPath();

    for (let index = 0; index <= documentToRender.size; index += 1) {
      const x = Math.min(
        width,
        Math.round((index * width) / documentToRender.size),
      );
      const y = Math.min(
        height,
        Math.round((index * height) / documentToRender.size),
      );
      context.moveTo(x + lineOffset, 0);
      context.lineTo(x + lineOffset, height);
      context.moveTo(0, y + lineOffset);
      context.lineTo(width, y + lineOffset);
    }

    context.lineWidth = lineWidth;
    context.strokeStyle = GRID_LINE_COLOR;
    context.stroke();
  }

  context.restore();
}

function canvasToPngBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob);
      } else {
        reject(new Error("The canvas could not be encoded as PNG."));
      }
    }, "image/png");
  });
}
