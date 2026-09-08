import { useEffect, useRef, useState } from "react";

const SOURCE_WIDTH = 806;
const SOURCE_HEIGHT = 1080;
const GRID_COLUMNS = 24;
const GRID_ROWS = 36;
const DISSOLVE_DURATION_MS = 1300;

type DissolveState = "closed" | "revealing" | "open" | "hiding";

interface ProfilePortraitDissolveProps {
  src: string;
  revealed: boolean;
}

interface PortraitFragment {
  sourceX: number;
  sourceY: number;
  sourceWidth: number;
  sourceHeight: number;
  delay: number;
  duration: number;
  driftX: number;
  driftY: number;
  initialScale: number;
}

function createSeededRandom(seed: number) {
  let value = seed >>> 0;

  return () => {
    value = (value * 1664525 + 1013904223) >>> 0;
    return value / 4294967296;
  };
}

function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(Math.max(value, minimum), maximum);
}

function easeInOutCubic(value: number) {
  return value < 0.5 ? 4 * value * value * value : 1 - Math.pow(-2 * value + 2, 3) / 2;
}

function easeOutCubic(value: number) {
  return 1 - Math.pow(1 - value, 3);
}

function createFragments() {
  const random = createSeededRandom(0x7a11c0de);

  return Array.from({ length: GRID_COLUMNS * GRID_ROWS }, (_, index): PortraitFragment => {
    const column = index % GRID_COLUMNS;
    const row = Math.floor(index / GRID_COLUMNS);
    const sourceX = Math.floor(column * SOURCE_WIDTH / GRID_COLUMNS);
    const sourceY = Math.floor(row * SOURCE_HEIGHT / GRID_ROWS);
    const nextSourceX = Math.floor((column + 1) * SOURCE_WIDTH / GRID_COLUMNS);
    const nextSourceY = Math.floor((row + 1) * SOURCE_HEIGHT / GRID_ROWS);
    const bottomBias = 1 - row / (GRID_ROWS - 1);
    const jitter = (random() - 0.5) * 0.12;
    const delay = clamp(bottomBias * 0.68 + jitter, 0, 0.74);

    return {
      sourceX,
      sourceY,
      sourceWidth: nextSourceX - sourceX,
      sourceHeight: nextSourceY - sourceY,
      delay,
      duration: Math.min(0.26 + random() * 0.08, 1 - delay),
      driftX: (random() - 0.5) * 8,
      driftY: (random() - 0.5) * 10,
      initialScale: 0.78 + random() * 0.12,
    };
  });
}

const fragments = createFragments();

export default function ProfilePortraitDissolve({ src, revealed }: ProfilePortraitDissolveProps) {
  const imageRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number | null>(null);
  const progressRef = useRef(revealed ? 1 : 0);
  const targetRef = useRef(revealed ? 1 : 0);
  const reducedMotionRef = useRef(false);
  const imageReadyRef = useRef(false);
  const drawRef = useRef<(progress: number) => void>(() => undefined);
  const [dissolveState, setDissolveState] = useState<DissolveState>(revealed ? "open" : "closed");

  useEffect(() => {
    const image = imageRef.current;
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!image || !canvas || !context) return;

    const configureCanvas = () => {
      const devicePixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      const width = Math.round(SOURCE_WIDTH * devicePixelRatio);
      const height = Math.round(SOURCE_HEIGHT * devicePixelRatio);

      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }

      return devicePixelRatio;
    };

    const clearCanvas = () => {
      context.setTransform(1, 0, 0, 1, 0, 0);
      context.clearRect(0, 0, canvas.width, canvas.height);
    };

    const draw = (progress: number) => {
      if (!imageReadyRef.current) {
        clearCanvas();
        return;
      }

      const devicePixelRatio = configureCanvas();
      context.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
      context.clearRect(0, 0, SOURCE_WIDTH, SOURCE_HEIGHT);

      for (const fragment of fragments) {
        const localProgress = clamp((progress - fragment.delay) / fragment.duration, 0, 1);
        if (localProgress <= 0) continue;

        const easedProgress = easeOutCubic(localProgress);
        const scale = fragment.initialScale + (1 - fragment.initialScale) * easedProgress;
        const offsetX = fragment.driftX * (1 - easedProgress);
        const offsetY = fragment.driftY * (1 - easedProgress);
        const centerX = fragment.sourceX + fragment.sourceWidth / 2;
        const centerY = fragment.sourceY + fragment.sourceHeight / 2;

        context.save();
        context.globalAlpha = easedProgress;
        context.translate(centerX + offsetX, centerY + offsetY);
        context.scale(scale, scale);
        context.translate(-centerX, -centerY);
        context.beginPath();
        context.rect(fragment.sourceX, fragment.sourceY, fragment.sourceWidth, fragment.sourceHeight);
        context.clip();
        context.drawImage(image, 0, 0, SOURCE_WIDTH, SOURCE_HEIGHT);
        context.restore();
      }
    };

    drawRef.current = draw;

    const handleImageLoad = () => {
      imageReadyRef.current = true;
      draw(progressRef.current);
    };

    const handleImageError = () => {
      imageReadyRef.current = false;
      clearCanvas();
    };

    const handleResize = () => drawRef.current(progressRef.current);

    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handleReducedMotionChange = () => {
      reducedMotionRef.current = reducedMotionQuery.matches;
      if (!reducedMotionRef.current) return;

      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
      progressRef.current = targetRef.current;
      drawRef.current(progressRef.current);
      setDissolveState(targetRef.current === 1 ? "open" : "closed");
    };

    image.addEventListener("load", handleImageLoad);
    image.addEventListener("error", handleImageError);
    reducedMotionRef.current = reducedMotionQuery.matches;
    reducedMotionQuery.addEventListener("change", handleReducedMotionChange);
    window.addEventListener("resize", handleResize);

    if (image.complete && image.naturalWidth > 0) handleImageLoad();

    return () => {
      image.removeEventListener("load", handleImageLoad);
      image.removeEventListener("error", handleImageError);
      reducedMotionQuery.removeEventListener("change", handleReducedMotionChange);
      window.removeEventListener("resize", handleResize);
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
      drawRef.current = () => undefined;
    };
  }, []);

  useEffect(() => {
    const target = revealed ? 1 : 0;
    targetRef.current = target;

    if (!imageReadyRef.current) {
      progressRef.current = target;
      setDissolveState(target === 1 ? "open" : "closed");
      return;
    }

    if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    frameRef.current = null;

    if (reducedMotionRef.current || Math.abs(progressRef.current - target) < 0.001) {
      progressRef.current = target;
      drawRef.current(progressRef.current);
      setDissolveState(target === 1 ? "open" : "closed");
      return;
    }

    setDissolveState(target === 1 ? "revealing" : "hiding");
    const start = progressRef.current;
    const startedAt = performance.now();
    const duration = Math.max(1, DISSOLVE_DURATION_MS * Math.abs(target - start));

    const animate = (now: number) => {
      if (targetRef.current !== target) return;

      const elapsed = clamp((now - startedAt) / duration, 0, 1);
      const easedElapsed = easeInOutCubic(elapsed);
      progressRef.current = start + (target - start) * easedElapsed;
      drawRef.current(progressRef.current);

      if (elapsed < 1) {
        frameRef.current = requestAnimationFrame(animate);
        return;
      }

      frameRef.current = null;
      progressRef.current = target;
      drawRef.current(target);
      setDissolveState(target === 1 ? "open" : "closed");
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    };
  }, [revealed]);

  return (
    <>
      <div
        className="dashboard-profile-art__dissolve"
        data-profile-dissolve
        data-profile-dissolve-state={dissolveState}
        aria-hidden="true"
      >
        <canvas
          ref={canvasRef}
          width={SOURCE_WIDTH}
          height={SOURCE_HEIGHT}
          data-profile-dissolve-grid={`${GRID_COLUMNS}x${GRID_ROWS}`}
          aria-hidden="true"
        />
      </div>
      <img
        ref={imageRef}
        className="dashboard-profile-art__image"
        data-profile-image
        src={src}
        alt=""
        draggable="false"
      />
    </>
  );
}
