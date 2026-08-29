import { useEffect, useId, useState } from "react";
import { TEMPORAL_TRANSITION_DURATION, type SweepDirection } from "../lib/temporalTransition";

export default function ThemeToggle() {
  const rawId = useId();
  const id = rawId.replace(/[:]/g, ""); // Safe SVG ID without special characters

  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof document !== "undefined") {
      return document.documentElement.classList.contains("dark");
    }
    return false;
  });
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);

  useEffect(() => {
    const html = document.documentElement;

    const syncState = () => {
      setIsDark(html.classList.contains("dark"));
    };

    syncState();

    const handleThemeChange = () => syncState();
    window.addEventListener("theme-change", handleThemeChange);

    const handleWarpStart = () => setIsTransitioning(true);
    const handleWarpEnd = () => setIsTransitioning(false);

    window.addEventListener("temporal-warp", handleWarpStart);
    window.addEventListener("temporal-warp-complete", handleWarpEnd);

    const observer = new MutationObserver(() => syncState());
    observer.observe(html, { attributes: true, attributeFilter: ["class"] });

    return () => {
      window.removeEventListener("theme-change", handleThemeChange);
      window.removeEventListener("temporal-warp", handleWarpStart);
      window.removeEventListener("temporal-warp-complete", handleWarpEnd);
      observer.disconnect();
    };
  }, []);

  const toggleTheme = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (isTransitioning) {
      return;
    }

    setIsTransitioning(true);

    const html = document.documentElement;
    const isCurrentlyDark = html.classList.contains("dark");
    const targetDark = !isCurrentlyDark;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;

    const updateDOM = () => {
      if (targetDark) {
        html.classList.add("dark");
        localStorage.theme = "dark";
        setIsDark(true);
      } else {
        html.classList.remove("dark");
        localStorage.theme = "light";
        setIsDark(false);
      }
      window.dispatchEvent(new CustomEvent("theme-change"));
    };

    const isReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (isReducedMotion) {
      if ("startViewTransition" in document) {
        try {
          const transition = (
            document as unknown as {
              startViewTransition: (cb: () => void) => { finished: Promise<void> };
            }
          ).startViewTransition(updateDOM);

          // The reduced-motion CSS supplies only a brief root crossfade. Keep the
          // control locked until the browser has released both root snapshots.
          transition.finished.then(
            () => setIsTransitioning(false),
            () => setIsTransitioning(false)
          );
        } catch {
          updateDOM();
          setIsTransitioning(false);
        }
      } else {
        // Browsers without View Transitions still receive the theme immediately.
        updateDOM();
        setIsTransitioning(false);
      }
      return;
    }

    const sweepDirection: SweepDirection = x >= window.innerWidth / 2
      ? "right-to-left"
      : "left-to-right";

    // Auto-release transition lock using the same clock as every transition layer.
    setTimeout(() => {
      setIsTransitioning(false);
    }, TEMPORAL_TRANSITION_DURATION);

    // Broadcast temporal warp event for time-travel animation overlay
    window.dispatchEvent(
      new CustomEvent("temporal-warp", {
        detail: {
          direction: targetDark ? "to-future" : "to-past",
          sweepDirection,
          x,
          y,
          duration: TEMPORAL_TRANSITION_DURATION,
        },
      })
    );

    // View transitions retain both root snapshots while the new era follows the seam.
    if (
      typeof document !== "undefined" &&
      "startViewTransition" in document
    ) {
      try {
          const transition = (
            document as unknown as {
              startViewTransition: (cb: () => void) => { ready: Promise<void> };
            }
          ).startViewTransition(() => {
            updateDOM();
          });

          transition.ready
            .then(() => {
              try {
                const clipPath = sweepDirection === "left-to-right"
                  ? ["inset(0 100% 0 0)", "inset(0 0 0 0)"]
                  : ["inset(0 0 0 100%)", "inset(0 0 0 0)"];

                document.documentElement.animate(
                  {
                    clipPath: clipPath,
                  },
                  {
                    duration: TEMPORAL_TRANSITION_DURATION,
                    easing: "cubic-bezier(0.22, 1, 0.36, 1)",
                    pseudoElement: "::view-transition-new(root)",
                  }
                );
              } catch {
                // Ignore animation error if already aborted
              }
            })
            .catch(() => {
              // Transition was interrupted or skipped
            });
      } catch {
        updateDOM();
      }
    } else {
      updateDOM();
    }
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      disabled={isTransitioning}
      aria-disabled={isTransitioning}
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
