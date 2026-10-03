import { useEffect, useRef, useState } from "react";
import { profileAscii } from "@/data";

const DISSOLVE_DURATION_MS = 1300;
const LEADING_DELAY_MS = 90;
const GLITCH_ROWS = 3.2;

const TARGET_LINES = profileAscii.split("\n");
const LINE_COUNT = TARGET_LINES.length;
const LINE_WIDTH = TARGET_LINES[0]?.length ?? 72;
const BLANK_LINE = " ".repeat(LINE_WIDTH);

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function easeInOutCubic(value: number): number {
  return value < 0.5 ? 4 * value * value * value : 1 - Math.pow(-2 * value + 2, 3) / 2;
}

function scrambleLine(targetLine: string): string {
  let result = "";
  for (let i = 0; i < targetLine.length; i++) {
    const char = targetLine[i];
    if (char === " ") {
      result += " ";
    } else {
      result += Math.random() < 0.5 ? "0" : "1";
    }
  }
  return result;
}

interface ProfileAsciiPortraitProps {
  revealed: boolean;
}

export default function ProfileAsciiPortrait({ revealed }: ProfileAsciiPortraitProps) {
  const [displayText, setDisplayText] = useState(() => (revealed ? BLANK_LINE : profileAscii));
  const frameRef = useRef<number | null>(null);
  const targetRevealedRef = useRef(revealed);
  const isMountedRef = useRef(false);

  useEffect(() => {
    targetRevealedRef.current = revealed;
    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    if (frameRef.current !== null) {
      cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    }

    if (reducedMotionQuery.matches) {
      setDisplayText(revealed ? BLANK_LINE : profileAscii);
      return;
    }

    const startedAt = performance.now();
    const duration = DISSOLVE_DURATION_MS;
    const activeWindow = Math.max(1, duration - LEADING_DELAY_MS);

    const animate = (now: number) => {
      if (targetRevealedRef.current !== revealed) return;

      const elapsed = now - startedAt;
      const progress = clamp((elapsed - LEADING_DELAY_MS) / activeWindow, 0, 1);
      const eased = easeInOutCubic(progress);

      const nextLines: string[] = new Array(LINE_COUNT);

      if (!revealed) {
        // Cascading top-to-bottom decode (revealing ASCII)
        const waveRow = eased * (LINE_COUNT - 1);

        for (let r = 0; r < LINE_COUNT; r++) {
          if (r > waveRow) {
            // Unreached: blank line with preserved spacing
            nextLines[r] = BLANK_LINE;
          } else if (r <= waveRow - GLITCH_ROWS) {
            // Wave passed: settled target line
            nextLines[r] = TARGET_LINES[r];
          } else {
            // Active wavefront: subtle binary scramble flicker
            nextLines[r] = scrambleLine(TARGET_LINES[r]);
          }
        }
      } else {
        // Inverted bottom-to-top erase (hiding ASCII as photo fragments assemble from bottom)
        const waveRow = (LINE_COUNT - 1) - eased * (LINE_COUNT - 1);

        for (let r = 0; r < LINE_COUNT; r++) {
          if (r > waveRow) {
            // Erased: blank line
            nextLines[r] = BLANK_LINE;
          } else if (r < waveRow - GLITCH_ROWS) {
            // Wave hasn't reached from bottom yet: still visible target line
            nextLines[r] = TARGET_LINES[r];
          } else {
            // Active wavefront: subtle binary scramble flicker before disappearing
            nextLines[r] = scrambleLine(TARGET_LINES[r]);
          }
        }
      }

      setDisplayText(nextLines.join("\n"));

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      } else {
        frameRef.current = null;
        if (!revealed) {
          setDisplayText(profileAscii);
        } else {
          setDisplayText(Array.from({ length: LINE_COUNT }, () => BLANK_LINE).join("\n"));
        }
      }
    };

    frameRef.current = requestAnimationFrame(animate);
    isMountedRef.current = true;

    return () => {
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
    };
  }, [revealed]);

  return (
    <pre
      className="dashboard-profile-art__portrait"
      data-profile-ascii
      aria-hidden="true"
    >
      {displayText}
    </pre>
  );
}
