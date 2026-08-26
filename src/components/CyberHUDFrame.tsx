import { useEffect, useState } from "react";

export default function CyberHUDFrame() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const checkDark = () => {
      setIsDark(document.documentElement.classList.contains("dark"));
    };

    checkDark();
    const observer = new MutationObserver(checkDark);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  if (!isDark) return null;

  return (
    <div
      className="fixed inset-0 pointer-events-none z-30 select-none overflow-hidden"
      aria-hidden="true"
    >
      {/* Top-Left Corner HUD Bracket */}
      <div className="absolute top-3 left-3 sm:top-5 sm:left-5 size-8 sm:size-12">
        <svg viewBox="0 0 48 48" className="w-full h-full text-cyan-400/60 drop-shadow-[0_0_6px_rgba(0,240,255,0.4)]">
          <path
            d="M2 18 V6 A4 4 0 0 1 6 2 H18"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <circle cx="2" cy="22" r="1.5" fill="currentColor" />
          <circle cx="22" cy="2" r="1.5" fill="currentColor" />
          <path d="M7 7 L12 12" stroke="currentColor" strokeWidth="1" strokeOpacity="0.4" />
        </svg>
      </div>

      {/* Top-Right Corner HUD Bracket */}
      <div className="absolute top-3 right-3 sm:top-5 sm:right-5 size-8 sm:size-12">
        <svg viewBox="0 0 48 48" className="w-full h-full text-cyan-400/60 drop-shadow-[0_0_6px_rgba(0,240,255,0.4)]">
          <path
            d="M46 18 V6 A4 4 0 0 0 42 2 H30"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <circle cx="46" cy="22" r="1.5" fill="currentColor" />
          <circle cx="26" cy="2" r="1.5" fill="currentColor" />
          <path d="M41 7 L36 12" stroke="currentColor" strokeWidth="1" strokeOpacity="0.4" />
        </svg>
      </div>

      {/* Bottom-Left Corner HUD Bracket */}
      <div className="absolute bottom-3 left-3 sm:bottom-5 sm:left-5 size-8 sm:size-12">
        <svg viewBox="0 0 48 48" className="w-full h-full text-cyan-400/60 drop-shadow-[0_0_6px_rgba(0,240,255,0.4)]">
          <path
            d="M2 30 V42 A4 4 0 0 0 6 46 H18"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <circle cx="2" cy="26" r="1.5" fill="currentColor" />
          <circle cx="22" cy="46" r="1.5" fill="currentColor" />
          <path d="M7 41 L12 36" stroke="currentColor" strokeWidth="1" strokeOpacity="0.4" />
        </svg>
      </div>

      {/* Bottom-Right Corner HUD Bracket */}
      <div className="absolute bottom-3 right-3 sm:bottom-5 sm:right-5 size-8 sm:size-12">
        <svg viewBox="0 0 48 48" className="w-full h-full text-cyan-400/60 drop-shadow-[0_0_6px_rgba(0,240,255,0.4)]">
          <path
            d="M46 30 V42 A4 4 0 0 1 42 46 H30"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <circle cx="46" cy="26" r="1.5" fill="currentColor" />
          <circle cx="26" cy="46" r="1.5" fill="currentColor" />
          <path d="M41 41 L36 36" stroke="currentColor" strokeWidth="1" strokeOpacity="0.4" />
        </svg>
      </div>

      {/* Left Circuit Board Trace (Desktop Only) */}
      <div className="hidden xl:block absolute left-2 top-1/4 bottom-1/4 w-12 opacity-35">
        <svg className="w-full h-full text-cyan-500/50" viewBox="0 0 48 500" fill="none" preserveAspectRatio="none">
          <path
            d="M6 0 V120 L24 150 V280 L6 310 V500"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeDasharray="4 2"
          />
          <path
            d="M18 60 V130 L32 155 V240 L18 265 V420"
            stroke="currentColor"
            strokeWidth="1"
            strokeOpacity="0.6"
          />
          <circle cx="24" cy="150" r="3" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="24" cy="150" r="1.5" fill="#00f0ff" />
          <circle cx="24" cy="280" r="3" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="24" cy="280" r="1.5" fill="#00f0ff" />
          <circle cx="32" cy="195" r="2" fill="#00f0ff" />
        </svg>
      </div>

      {/* Right Circuit Board Trace (Desktop Only) */}
      <div className="hidden xl:block absolute right-2 top-1/4 bottom-1/4 w-12 opacity-35">
        <svg className="w-full h-full text-cyan-500/50" viewBox="0 0 48 500" fill="none" preserveAspectRatio="none">
          <path
            d="M42 0 V120 L24 150 V280 L42 310 V500"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeDasharray="4 2"
          />
          <path
            d="M30 60 V130 L16 155 V240 L30 265 V420"
            stroke="currentColor"
            strokeWidth="1"
            strokeOpacity="0.6"
          />
          <circle cx="24" cy="150" r="3" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="24" cy="150" r="1.5" fill="#00f0ff" />
          <circle cx="24" cy="280" r="3" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="24" cy="280" r="1.5" fill="#00f0ff" />
          <circle cx="16" cy="195" r="2" fill="#00f0ff" />
        </svg>
      </div>

      {/* Ambient Top Subtle Cyan Radial Glow */}
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[280px] bg-gradient-to-b from-cyan-500/10 via-blue-600/5 to-transparent blur-3xl pointer-events-none opacity-60" />
    </div>
  );
}
