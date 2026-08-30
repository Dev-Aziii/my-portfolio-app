import { useEffect, useRef } from "react";

export default function AdaptiveThemeBackground() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    let ticking = false;
    let lastScrollY = window.scrollY;

    const updateParallax = () => {
      if (el) {
        el.style.setProperty("--bg-scroll-y", `${lastScrollY}px`);
      }
      ticking = false;
    };

    const handleScroll = () => {
      lastScrollY = window.scrollY;
      if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
      }
    };

    // Initial position
    updateParallax();

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div ref={containerRef} className="adaptive-theme-background" aria-hidden="true">
      {/* ── 1. ARCHIVAL VINTAGE PARCHMENT BACKGROUND (LIGHT MODE) ── */}
      <div className="theme-background theme-background--paper">
        <svg
          className="paper-texture-svg"
          viewBox="0 0 1440 900"
          preserveAspectRatio="none"
          focusable="false"
        >
          <defs>
            {/* Rich Archival Paper Fibers & Grain Filter */}
            <filter id="archival-paper-fibers" x="0%" y="0%" width="100%" height="100%">
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.035 0.035"
                numOctaves="4"
                seed="47"
                result="noise"
              />
              <feColorMatrix
                type="matrix"
                values="0.30 0 0 0 0.42
                        0 0.25 0 0 0.35
                        0 0 0.18 0 0.26
                        0 0 0 0.28 0"
              />
            </filter>

            {/* Soft Paper Fold Crease Gradient */}
            <linearGradient id="crease-soft-h" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#634320" stopOpacity="0" />
              <stop offset="45%" stopColor="#634320" stopOpacity="0.16" />
              <stop offset="50%" stopColor="#3d240c" stopOpacity="0.25" />
              <stop offset="52%" stopColor="#ffffff" stopOpacity="0.55" />
              <stop offset="60%" stopColor="#ffffff" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
            </linearGradient>

            {/* Soft Tea / Aging Stain Wash Filter */}
            <filter id="soft-stain-blur" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="6" />
            </filter>

            {/* Aging Vignette Shadow */}
            <radialGradient id="paper-warm-vignette" cx="50%" cy="50%" r="65%">
              <stop offset="40%" stopColor="#000000" stopOpacity="0" />
              <stop offset="78%" stopColor="#805629" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#5c3814" stopOpacity="0.22" />
            </radialGradient>
          </defs>

          {/* 1. Base Archival Paper Grain Layer (Subtle Deep Background Parallax) */}
          <g className="parallax-layer-back">
            <rect width="100%" height="100%" filter="url(#archival-paper-fibers)" opacity="0.65" />
            <rect width="100%" height="100%" fill="url(#paper-warm-vignette)" />
          </g>

          {/* 2. Soft Watercolor Tea Aging Stains & Watermark Blooms (Mid Parallax) */}
          <g className="parallax-layer-mid" filter="url(#soft-stain-blur)" opacity="0.6">
            {/* Top-Right Soft Tea Stain Bloom */}
            <ellipse cx="1180" cy="160" rx="140" ry="110" fill="#8c5825" opacity="0.14" />
            <path
              d="M 1040 120 Q 1180 60 1320 140 Q 1380 260 1220 280 Q 1060 260 1040 120 Z"
              fill="#9e6933"
              opacity="0.12"
            />

            {/* Bottom-Left Soft Aged Watermark Bloom */}
            <ellipse cx="220" cy="720" rx="120" ry="90" fill="#8c5825" opacity="0.15" />
            <path
              d="M 100 660 Q 240 600 340 680 Q 380 800 240 840 Q 120 800 100 660 Z"
              fill="#9e6933"
              opacity="0.12"
            />

            {/* Subtle Edge Patina Clouds */}
            <ellipse cx="60" cy="380" rx="90" ry="140" fill="#825224" opacity="0.10" />
            <ellipse cx="1400" cy="520" rx="90" ry="150" fill="#825224" opacity="0.10" />
          </g>

          {/* 3. Subtle Tactile Paper Fold Crease (Horizontal Centerfold Only) */}
          <g className="parallax-layer-crease">
            <path
              d="M -30 470 Q 420 445 780 480 T 1480 460"
              fill="none"
              stroke="url(#crease-soft-h)"
              strokeWidth="20"
              opacity="0.75"
            />
          </g>

          {/* 4. Delicate Foxing Dots & Editorial Corner Registration Marks (Foreground Parallax) */}
          <g className="parallax-layer-fore">
            <g fill="#5c3815" opacity="0.35">
              <circle cx="280" cy="160" r="2.2" />
              <circle cx="292" cy="170" r="1.4" />
              <circle cx="820" cy="90" r="2.0" />
              <circle cx="980" cy="420" r="2.4" />
              <circle cx="440" cy="760" r="1.8" />
              <circle cx="1320" cy="280" r="2.0" />
              <circle cx="110" cy="520" r="2.2" />
            </g>

            <g stroke="#7d5830" strokeWidth="0.8" opacity="0.4">
              {/* Top-Left Crosshair */}
              <line x1="36" y1="24" x2="36" y2="48" />
              <line x1="24" y1="36" x2="48" y2="36" />
              <circle cx="36" cy="36" r="6" fill="none" />

              {/* Top-Right Crosshair */}
              <line x1="1404" y1="24" x2="1404" y2="48" />
              <line x1="1392" y1="36" x2="1416" y2="36" />
              <circle cx="1404" cy="36" r="6" fill="none" />

              {/* Bottom-Left Crosshair */}
              <line x1="36" y1="852" x2="36" y2="876" />
              <line x1="24" y1="864" x2="48" y2="864" />
              <circle cx="36" cy="864" r="6" fill="none" />

              {/* Bottom-Right Crosshair */}
              <line x1="1404" y1="852" x2="1404" y2="876" />
              <line x1="1392" y1="864" x2="1416" y2="864" />
              <circle cx="1404" cy="864" r="6" fill="none" />

              {/* Subtle Architectural Margin Lines */}
              <line x1="36" y1="64" x2="36" y2="836" strokeDasharray="3 6" opacity="0.3" />
              <line x1="1404" y1="64" x2="1404" y2="836" strokeDasharray="3 6" opacity="0.3" />
            </g>
          </g>
        </svg>
      </div>

      {/* ── 2. HIGH-TECH SCI-FI CYBER HUD BACKGROUND (DARK MODE) ── */}
      <div className="theme-background theme-background--tech">
        <svg
          className="tech-circuit-svg"
          viewBox="0 0 1440 900"
          preserveAspectRatio="none"
          focusable="false"
        >
          <defs>
            {/* Glowing Cyan Trace Gradient */}
            <linearGradient id="tech-cyan-glow-line" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#00f0ff" stopOpacity="0.6" />
              <stop offset="50%" stopColor="#38bdf8" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#6366f1" stopOpacity="0.08" />
            </linearGradient>

            {/* Neon Glow Filter */}
            <filter id="tech-neon-bloom" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="2" result="blur1" />
              <feGaussianBlur stdDeviation="5" result="blur2" />
              <feMerge>
                <feMergeNode in="blur2" />
                <feMergeNode in="blur1" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Micro Grid Dot Matrix (Deep Back Parallax) */}
          <g className="parallax-layer-back" fill="#00f0ff" opacity="0.12">
            {Array.from({ length: 15 }).map((_, i) =>
              Array.from({ length: 9 }).map((_, j) => (
                <circle key={`${i}-${j}`} cx={60 + i * 95} cy={50 + j * 95} r="1" />
              ))
            )}
          </g>

          {/* Main Circuit Board Highway Traces (Mid Parallax) */}
          <g className="parallax-layer-mid" fill="none" stroke="url(#tech-cyan-glow-line)" strokeWidth="1.1" opacity="0.55">
            {/* Top Left Circuit Highway */}
            <path d="M -40 120 H 180 L 220 160 H 420 L 450 130 H 680" />
            <path d="M 120 -20 V 60 L 160 100 V 220 L 190 250 H 340" strokeWidth="0.8" opacity="0.4" />

            {/* Top Right Circuit Highway */}
            <path d="M 820 90 H 1080 L 1120 130 H 1340 L 1370 100 H 1480" />
            <path d="M 1260 -20 V 50 L 1220 90 V 240 L 1190 270 H 1040" strokeWidth="0.8" opacity="0.4" />

            {/* Bottom Circuit Highways */}
            <path d="M -40 760 H 260 L 300 720 H 520 L 560 760 H 780" />
            <path d="M 720 780 H 940 L 980 740 H 1220 L 1260 780 H 1480" />
          </g>

          {/* Glowing Neon Solder Vias & Active Data Nodes (Node Parallax) */}
          <g className="parallax-layer-crease" filter="url(#tech-neon-bloom)">
            <circle cx="220" cy="160" r="2.8" fill="#00f0ff" />
            <circle cx="220" cy="160" r="5.5" fill="none" stroke="#00f0ff" strokeWidth="1" opacity="0.5" />

            <circle cx="450" cy="130" r="2.2" fill="#38bdf8" />
            <circle cx="1120" cy="130" r="3" fill="#00f0ff" className="animate-pulse" />
            <circle cx="1120" cy="130" r="6" fill="none" stroke="#00f0ff" strokeWidth="1" opacity="0.6" />

            <circle cx="1370" cy="100" r="2.2" fill="#00f0ff" />
            <circle cx="300" cy="720" r="2.5" fill="#00f0ff" />
            <circle cx="980" cy="740" r="2.5" fill="#00f0ff" />
          </g>

          {/* Corner Registration Marks (Fore Parallax) */}
          <g className="parallax-layer-fore" stroke="#00f0ff" strokeWidth="0.8" opacity="0.3">
            <line x1="36" y1="24" x2="36" y2="48" />
            <line x1="24" y1="36" x2="48" y2="36" />
            <line x1="1404" y1="24" x2="1404" y2="48" />
            <line x1="1392" y1="36" x2="1416" y2="36" />
            <line x1="36" y1="852" x2="36" y2="876" />
            <line x1="24" y1="864" x2="48" y2="864" />
            <line x1="1404" y1="852" x2="1404" y2="876" />
            <line x1="1392" y1="864" x2="1416" y2="864" />
          </g>
        </svg>
      </div>
    </div>
  );
}
