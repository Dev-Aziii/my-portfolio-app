import { useEffect, useId, useRef, useState } from "react";
import {
  ERA_TRANSITION_COMPLETE,
  ERA_TRANSITION_START,
  REDUCED_MOTION_DURATION,
  calculateMaxRadius,
  getRadialClipPath,
  getTransitionTiming,
  resolveMotionMode,
  resolveSweepEdge,
  type EraDirection,
  type EraTransitionDetail,
} from "@/lib/themeTransition";

interface ViewTransitionHandle {
  ready: Promise<void>;
  finished: Promise<void>;
  skipTransition: () => void;
  updateCallbackDone?: Promise<void>;
  types?: unknown;
}

type ViewTransitionDocument = {
  startViewTransition: (callback: () => void) => ViewTransitionHandle;
};

let nextTransitionRunId = 0;
let activeTransitionRunId = 0;

const wait = (duration: number, signal?: AbortSignal) =>
  new Promise<void>((resolve, reject) => {
    const timer = window.setTimeout(() => {
      signal?.removeEventListener("abort", handleAbort);
      resolve();
    }, duration);

    const handleAbort = () => {
      window.clearTimeout(timer);
      signal?.removeEventListener("abort", handleAbort);
      reject(new DOMException("Theme transition interrupted", "AbortError"));
    };

    if (signal?.aborted) {
      handleAbort();
      return;
    }

    signal?.addEventListener("abort", handleAbort, { once: true });
  });

function dispatchEraEvent(name: string, detail: EraTransitionDetail) {
  window.dispatchEvent(new CustomEvent(name, { detail }));
}

export default function ThemeToggle() {
  const rawId = useId();
  const id = rawId.replace(/[:]/g, ""); // Safe SVG ID without special characters
  const mountedRef = useRef(true);
  const abortTransitionRef = useRef<(() => void) | null>(null);

  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof document !== "undefined") {
      return document.documentElement.classList.contains("dark");
    }
    return false;
  });
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);

  useEffect(() => {
    const html = document.documentElement;
    mountedRef.current = true;

    const syncState = () => {
      setIsDark(html.classList.contains("dark"));
    };

    syncState();

    const handleThemeChange = () => syncState();
    window.addEventListener("theme-change", handleThemeChange);

    const handleTransitionStart = () => setIsTransitioning(true);
    const handleTransitionEnd = () => setIsTransitioning(false);

    window.addEventListener(ERA_TRANSITION_START, handleTransitionStart);
    window.addEventListener(ERA_TRANSITION_COMPLETE, handleTransitionEnd);

    const observer = new MutationObserver(() => syncState());
    observer.observe(html, { attributes: true, attributeFilter: ["class"] });

    return () => {
      window.removeEventListener("theme-change", handleThemeChange);
      window.removeEventListener(ERA_TRANSITION_START, handleTransitionStart);
      window.removeEventListener(ERA_TRANSITION_COMPLETE, handleTransitionEnd);
      observer.disconnect();
      mountedRef.current = false;
      abortTransitionRef.current?.();
      abortTransitionRef.current = null;
    };
  }, []);

  const toggleTheme = async (e: React.MouseEvent<HTMLButtonElement>) => {
    const html = document.documentElement;

    if (isTransitioning || html.dataset.eraTransition) {
      return;
    }

    const runId = ++nextTransitionRunId;
    activeTransitionRunId = runId;
    setIsTransitioning(true);

    const isCurrentlyDark = html.classList.contains("dark");
    const targetDark = !isCurrentlyDark;
    const direction: EraDirection = targetDark ? "to-future" : "to-past";
    const timing = getTransitionTiming(direction);

    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.round(rect.left + rect.width / 2);
    const y = Math.round(rect.top + rect.height / 2);
    const edge = resolveSweepEdge(x, window.innerWidth);
    const maxRadius = calculateMaxRadius(x, y, window.innerWidth, window.innerHeight);
    const motionMode = resolveMotionMode(
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    );
    const supportsViewTransitions =
      typeof (document as Partial<ViewTransitionDocument>).startViewTransition ===
      "function";

    const initialClip = getRadialClipPath(0, x, y);
    const finalClip = getRadialClipPath(maxRadius, x, y);

    if (motionMode === "cinematic") {
      html.style.setProperty("--era-origin-x", `${x}px`);
      html.style.setProperty("--era-origin-y", `${y}px`);
      html.style.setProperty("--era-max-radius", `${maxRadius}px`);
      html.style.setProperty("--era-initial-clip", initialClip);
      html.style.setProperty("--era-material-duration", `${timing.sweep}ms`);
    }

    const initialDetail: EraTransitionDetail = {
      id: runId,
      direction,
      edge,
      origin: { x, y },
      maxRadius,
      duration: timing.sweep,
      startedAt: performance.now(),
    };

    html.dataset.eraTransition = direction;
    html.dataset.eraTransitionRun = String(runId);
    html.dataset.eraMotion = motionMode;
    dispatchEraEvent(ERA_TRANSITION_START, initialDetail);

    let committed = false;
    const updateDOM = () => {
      if (committed) return;

      try {
        localStorage.setItem("theme", targetDark ? "dark" : "light");
      } catch {
        // Storage can be unavailable in privacy-restricted contexts. The live
        // theme must still change even when persistence is denied.
      }

      committed = true;

      if (targetDark) {
        html.classList.add("dark");
        if (mountedRef.current) setIsDark(true);
      } else {
        html.classList.remove("dark");
        if (mountedRef.current) setIsDark(false);
      }
      window.dispatchEvent(new CustomEvent("theme-change"));
    };

    const complete = () => {
      if (activeTransitionRunId !== runId) return;

      delete html.dataset.eraTransition;
      delete html.dataset.eraTransitionRun;
      html.style.removeProperty("--era-initial-clip");
      html.style.removeProperty("--era-origin-x");
      html.style.removeProperty("--era-origin-y");
      html.style.removeProperty("--era-max-radius");
      html.style.removeProperty("--era-material-duration");
      delete html.dataset.eraTransitionFallback;
      delete html.dataset.eraMaterialCapture;
      delete html.dataset.eraMotion;
      dispatchEraEvent(ERA_TRANSITION_COMPLETE, {
        ...initialDetail,
        startedAt: performance.now(),
      });
      activeTransitionRunId = 0;
      if (mountedRef.current) setIsTransitioning(false);
    };

    const abortController = new AbortController();
    let currentViewTransition: ViewTransitionHandle | null = null;
    const transitionAnimations: Animation[] = [];
    let safetyTimer: number | null = null;

    const abortRun = () => {
      if (abortController.signal.aborted) return;

      abortController.abort();
      transitionAnimations.forEach((animation) => {
        try {
          animation.cancel();
        } catch {
          // The browser may already have discarded an interrupted snapshot.
        }
      });
      currentViewTransition?.skipTransition();
      updateDOM();
      complete();
    };

    abortTransitionRef.current = abortRun;
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") abortRun();
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    safetyTimer = window.setTimeout(abortRun, timing.total + 100);

    try {
      if (motionMode === "reduced") {
        if (!supportsViewTransitions) {
          updateDOM();
          await wait(REDUCED_MOTION_DURATION, abortController.signal);
          return;
        }

        const transition = (
          document as unknown as ViewTransitionDocument
        ).startViewTransition(updateDOM);
        currentViewTransition = transition;
        await transition.ready;
        if (activeTransitionRunId !== runId) return;

        const oldAnimation = html.animate(
          [{ opacity: 1 }, { opacity: 0 }],
          {
            duration: REDUCED_MOTION_DURATION,
            easing: "ease-out",
            fill: "both",
            pseudoElement: "::view-transition-old(root)",
          },
        );
        const newAnimation = html.animate(
          [{ opacity: 0 }, { opacity: 1 }],
          {
            duration: REDUCED_MOTION_DURATION,
            easing: "ease-out",
            fill: "both",
            pseudoElement: "::view-transition-new(root)",
          },
        );
        transitionAnimations.push(oldAnimation, newAnimation);

        await wait(REDUCED_MOTION_DURATION, abortController.signal);
        oldAnimation.finish();
        newAnimation.finish();
        transition.skipTransition();
        await transition.finished;
        return;
      }

      await wait(timing.charge, abortController.signal);
      if (activeTransitionRunId !== runId) return;
      html.dataset.eraMaterialCapture = "true";

      if (!supportsViewTransitions) {
        html.dataset.eraTransitionFallback = "true";
        dispatchEraEvent(ERA_TRANSITION_START, initialDetail);
        await wait(timing.sweep * 0.5, abortController.signal);
        if (activeTransitionRunId !== runId) return;
        updateDOM();
        await wait(timing.sweep * 0.5 + timing.settle, abortController.signal);
        return;
      }

      const transition = (
        document as unknown as ViewTransitionDocument
      ).startViewTransition(updateDOM);
      currentViewTransition = transition;
      await transition.ready;
      if (activeTransitionRunId !== runId) return;

      dispatchEraEvent(ERA_TRANSITION_START, initialDetail);

      const revealAnimation = html.animate(
        [
          { clipPath: initialClip },
          { clipPath: finalClip },
        ],
        {
          duration: timing.sweep,
          easing: "cubic-bezier(0.25, 1, 0.35, 1)",
          fill: "both",
          pseudoElement: "::view-transition-new(root)",
        },
      );

      transitionAnimations.push(revealAnimation);

      await wait(timing.sweep + timing.settle, abortController.signal);
      revealAnimation.finish();
      transition.skipTransition();
      await transition.finished;
    } catch {
      currentViewTransition?.skipTransition();
      updateDOM();
    } finally {
      if (safetyTimer !== null) window.clearTimeout(safetyTimer);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      if (abortTransitionRef.current === abortRun) {
        abortTransitionRef.current = null;
      }
      complete();
    }
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-disabled={isTransitioning ? "true" : "false"}
      aria-busy={isTransitioning ? "true" : "false"}
      aria-label={
        isDark
          ? "Time Machine: Future Active. Click to travel back to the Past."
          : "Time Machine: Past Active. Click to travel forward to the Future."
      }
      title={
        isTransitioning
          ? "Time Travel in Progress..."
          : isDark
          ? "Time Machine: FUTURE Active (Click to travel to PAST)"
          : "Time Machine: PAST Active (Click to travel to FUTURE)"
      }
      className={`group/timemachine relative inline-flex size-9 sm:size-10 items-center justify-center rounded-full p-0 select-none transition-all duration-300 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-foreground dark:focus-visible:ring-cyan-400 ${
        isTransitioning ? "cursor-not-allowed opacity-85 pointer-events-none" : "cursor-pointer"
      } ${
        isDark
          ? "shadow-[0_0_12px_rgba(0,240,255,0.4)] hover:shadow-[0_0_20px_rgba(0,240,255,0.7)]"
          : "shadow-xs hover:shadow-[0_0_10px_rgba(197,168,128,0.4)]"
      }`}
    >
      {/* SVG Time Machine Split Dial */}
      <svg
        viewBox="0 0 100 100"
        className="size-full"
        aria-hidden="true"
      >
        <defs>
          {/* Unique Instance-Specific Outer Bezel Gradients */}
          <linearGradient id={`${id}-bezel`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={isDark ? "#1d3a5f" : "#dfcbb5"} />
            <stop offset="50%" stopColor={isDark ? "#0c1f36" : "#b0957a"} />
            <stop offset="100%" stopColor={isDark ? "#00f0ff" : "#8c6f52"} />
          </linearGradient>

          {/* Past Parchment Gradient */}
          <radialGradient id={`${id}-parchment`} cx="35%" cy="50%" r="60%">
            <stop offset="0%" stopColor="#faf6ef" />
            <stop offset="70%" stopColor="#ece2cf" />
            <stop offset="100%" stopColor="#dacdb5" />
          </radialGradient>

          {/* Future Cyber HUD Gradient */}
          <radialGradient id={`${id}-cyber`} cx="65%" cy="50%" r="60%">
            <stop offset="0%" stopColor="#081a30" />
            <stop offset="70%" stopColor="#040d1a" />
            <stop offset="100%" stopColor="#02060d" />
          </radialGradient>
        </defs>

        {/* Outer Heavy Bezel Ring */}
        <circle
          cx="50"
          cy="50"
          r="41"
          fill="none"
          stroke={`url(#${id}-bezel)`}
          strokeWidth="3.5"
          className="transition-colors duration-500"
        />

        {/* Bezel Accent Inner Rim */}
        <circle
          cx="50"
          cy="50"
          r="38"
          fill="#060b13"
          stroke={isDark ? "rgba(0, 240, 255, 0.6)" : "rgba(140, 111, 82, 0.6)"}
          strokeWidth="1.2"
        />

        {/* ── LEFT HEMISPHERE: PAST (Vintage Clock / Compass) ── */}
        <g>
          {/* Semicircular Dial Path */}
          <path
            d="M 50,12 A 38,38 0 0,0 50,88 Z"
            fill={`url(#${id}-parchment)`}
          />

          {/* Vintage Clock Dial Arc */}
          <circle
            cx="50"
            cy="50"
            r="30"
            fill="none"
            stroke="#8c7355"
            strokeWidth="0.8"
            strokeDasharray="2, 3"
            opacity="0.75"
          />

          {/* Vintage Dial Hour Tick Marks */}
          <line x1="19" y1="50" x2="25" y2="50" stroke="#4a3728" strokeWidth="1.8" strokeLinecap="round" />
          <line x1="24" y1="35" x2="29" y2="38" stroke="#4a3728" strokeWidth="1.2" strokeLinecap="round" />
          <line x1="24" y1="65" x2="29" y2="62" stroke="#4a3728" strokeWidth="1.2" strokeLinecap="round" />
          <line x1="35" y1="24" x2="38" y2="29" stroke="#8c7355" strokeWidth="1" strokeLinecap="round" />
          <line x1="35" y1="76" x2="38" y2="71" stroke="#8c7355" strokeWidth="1" strokeLinecap="round" />

          {/* Vintage Chronometer 'C' Arc Motif at 9 o'clock */}
          <path
            d="M 31,46 A 5,5 0 1,0 31,54"
            fill="none"
            stroke="#4a3728"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
        </g>

        {/* ── RIGHT HEMISPHERE: FUTURE (Cyber Radar / HUD) ── */}
        <g>
          {/* Semicircular Dial Path */}
          <path
            d="M 50,12 A 38,38 0 0,1 50,88 Z"
            fill={`url(#${id}-cyber)`}
          />

          {/* Concentric Cyber Radar Rings */}
          <circle
            cx="50"
            cy="50"
            r="31"
            fill="none"
            stroke="#00f0ff"
            strokeWidth="0.8"
            strokeDasharray="3, 3"
            opacity={isDark ? "0.6" : "0.3"}
          />
          <circle
            cx="50"
            cy="50"
            r="22"
            fill="none"
            stroke="#00f0ff"
            strokeWidth="0.6"
            opacity={isDark ? "0.5" : "0.2"}
          />
          <circle
            cx="50"
            cy="50"
            r="14"
            fill="none"
            stroke="#00f0ff"
            strokeWidth="0.5"
            strokeDasharray="1.5, 2"
            opacity={isDark ? "0.7" : "0.25"}
          />

          {/* Futuristic Cyber Status Sunburst Node at 3 o'clock */}
          <g
            className={`transition-opacity duration-300 ${
              isDark ? "opacity-100" : "opacity-40"
            }`}
          >
            <circle
              cx="72"
              cy="50"
              r="3.5"
              fill="none"
              stroke="#00f0ff"
              strokeWidth="1.2"
              className={isDark ? "animate-pulse" : ""}
            />
            <circle cx="72" cy="50" r="1.3" fill="#00f0ff" />
            {/* Sunburst Rays */}
            <line x1="72" y1="43" x2="72" y2="45" stroke="#00f0ff" strokeWidth="0.9" />
            <line x1="72" y1="55" x2="72" y2="57" stroke="#00f0ff" strokeWidth="0.9" />
            <line x1="65" y1="50" x2="67" y2="50" stroke="#00f0ff" strokeWidth="0.9" />
            <line x1="77" y1="50" x2="79" y2="50" stroke="#00f0ff" strokeWidth="0.9" />
            <line x1="67" y1="45" x2="68.5" y2="46.5" stroke="#00f0ff" strokeWidth="0.7" />
            <line x1="75.5" y1="53.5" x2="77" y2="55" stroke="#00f0ff" strokeWidth="0.7" />
            <line x1="67" y1="55" x2="68.5" y2="53.5" stroke="#00f0ff" strokeWidth="0.7" />
            <line x1="75.5" y1="46.5" x2="77" y2="45" stroke="#00f0ff" strokeWidth="0.7" />
          </g>
        </g>

        {/* ── CENTRAL SPLIT SEAM & BEZEL RIVETS ── */}
        {/* Center Vertical Dividing Joint */}
        <line
          x1="50"
          y1="12"
          x2="50"
          y2="88"
          stroke={isDark ? "#00f0ff" : "#5a4533"}
          strokeWidth={isDark ? "1.5" : "1.2"}
          opacity={isDark ? "0.9" : "0.7"}
          className="transition-colors duration-300"
        />

        {/* Bezel Mechanical Rivets / Screws */}
        <circle cx="50" cy="14" r="1.6" fill={isDark ? "#00f0ff" : "#d5c2ad"} stroke="#060b13" strokeWidth="0.7" />
        <circle cx="50" cy="86" r="1.6" fill={isDark ? "#00f0ff" : "#d5c2ad"} stroke="#060b13" strokeWidth="0.7" />

        {/* ── ROTATING TIME MACHINE NEEDLE / COMPASS HAND ── */}
        <g
          className="transition-transform duration-600 ease-[cubic-bezier(0.34,1.56,0.64,1)] motion-reduce:duration-150"
          style={{
            transformOrigin: "50px 50px",
            transform: isDark ? "rotate(90deg)" : "rotate(270deg)",
          }}
        >
          {/* Needle Shadow */}
          <path
            d="M 48,50 L 50,19 L 52,50 L 50.8,58 L 49.2,58 Z"
            fill="rgba(0,0,0,0.35)"
            transform="translate(1, 1)"
          />

          {/* Needle Body (Double-Tapered Arrow) */}
          <path
            d="M 47.5,50 L 50,17 L 52.5,50 L 51,58 L 49,58 Z"
            fill={isDark ? "#091c30" : "#fff8ee"}
            stroke={isDark ? "#00f0ff" : "#4a3728"}
            strokeWidth="1.2"
          />

          {/* Needle Blade Ridge Line */}
          <line
            x1="50"
            y1="17"
            x2="50"
            y2="57"
            stroke={isDark ? "#00f0ff" : "#8c6f52"}
            strokeWidth="0.7"
          />

          {/* Needle Tip Jewel */}
          <circle
            cx="50"
            cy="19"
            r="1.8"
            fill={isDark ? "#00f0ff" : "#e6b422"}
            stroke={isDark ? "#ffffff" : "#4a3728"}
            strokeWidth="0.6"
          />
        </g>

        {/* ── CENTER BRASS / CYBER HUB RIVET ── */}
        <circle
          cx="50"
          cy="50"
          r="6"
          fill={isDark ? "#091c30" : "#d8c4ad"}
          stroke={isDark ? "#00f0ff" : "#5a4533"}
          strokeWidth="1.4"
          className="transition-colors duration-300 shadow-sm"
        />
        <circle
          cx="50"
          cy="50"
          r="2.8"
          fill={isDark ? "#00f0ff" : "#5a4533"}
          className="transition-colors duration-300"
        />
        <circle cx="50" cy="50" r="0.9" fill="#ffffff" />
      </svg>
    </button>
  );
}