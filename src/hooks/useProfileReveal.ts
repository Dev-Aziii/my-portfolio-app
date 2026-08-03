import { useEffect, useState, useRef, useCallback } from "react";

const LONG_PRESS_MS = 500;
const LONG_PRESS_CANCEL_DISTANCE = 12;

/**
 * Encapsulates the interactive spotlight-reveal logic for the Hero profile image.
 *
 * Handles:
 * - Mouse hover tracking (cursor-following radial mask)
 * - Touch long-press reveal (with cancel-on-drag)
 * - Cleanup of timers on unmount
 */
export function useProfileReveal() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const imageContainerRef = useRef<HTMLDivElement>(null);

  const [isTouchRevealed, setIsTouchRevealed] = useState(false);
  const [touchPoint, setTouchPoint] = useState({ x: 80, y: 80 });
  const longPressTimerRef = useRef<number | null>(null);
  const touchStartRef = useRef({ x: 0, y: 0 });
  const longPressFiredRef = useRef(false);

  const isTouchEvent = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) =>
      (e.nativeEvent as PointerEvent).pointerType === "touch",
    [],
  );

  const clearLongPressTimer = useCallback(() => {
    if (longPressTimerRef.current !== null) {
      window.clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  }, []);

  const endLongPress = useCallback(() => {
    clearLongPressTimer();
    if (longPressFiredRef.current) {
      longPressFiredRef.current = false;
      setIsTouchRevealed(false);
    }
  }, [clearLongPressTimer]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (isTouchEvent(e)) return;
      if (!imageContainerRef.current) return;
      const rect = imageContainerRef.current.getBoundingClientRect();
      setMousePos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    },
    [isTouchEvent],
  );

  const handleMouseEnter = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (isTouchEvent(e)) return;
      if (imageContainerRef.current) {
        const rect = imageContainerRef.current.getBoundingClientRect();
        setMousePos({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
      }
      setIsHovered(true);
    },
    [isTouchEvent],
  );

  const handleMouseLeave = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (isTouchEvent(e)) return;
      setIsHovered(false);
    },
    [isTouchEvent],
  );

  const handleTouchStart = useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      const touch = e.touches[0];
      if (!touch) return;
      const rect = e.currentTarget.getBoundingClientRect();
      setTouchPoint({
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top,
      });
      touchStartRef.current = { x: touch.clientX, y: touch.clientY };
      longPressFiredRef.current = false;
      clearLongPressTimer();
      longPressTimerRef.current = window.setTimeout(() => {
        longPressFiredRef.current = true;
        setIsTouchRevealed(true);
      }, LONG_PRESS_MS);
    },
    [clearLongPressTimer],
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      const touch = e.touches[0];
      if (!touch) return;
      const dx = touch.clientX - touchStartRef.current.x;
      const dy = touch.clientY - touchStartRef.current.y;
      if (Math.hypot(dx, dy) > LONG_PRESS_CANCEL_DISTANCE) {
        endLongPress();
      }
    },
    [endLongPress],
  );

  const handleContextMenu = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if ((e.nativeEvent as PointerEvent).pointerType === "touch") {
        e.preventDefault();
      }
    },
    [],
  );

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (longPressTimerRef.current !== null) {
        window.clearTimeout(longPressTimerRef.current);
      }
    };
  }, []);

  /**
   * Build the inline mask style for the second profile image.
   */
  const getMaskStyle = useCallback(
    (): React.CSSProperties => {
      const hoveredGradient = `radial-gradient(circle 32px at ${mousePos.x}px ${mousePos.y}px, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 50%, rgba(0,0,0,0.7) 70%, rgba(0,0,0,0.2) 88%, rgba(0,0,0,0) 100%)`;
      const hiddenGradient = `radial-gradient(circle 0px at ${mousePos.x}px ${mousePos.y}px, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)`;
      const gradient = isHovered ? hoveredGradient : hiddenGradient;

      return {
        maskImage: gradient,
        WebkitMaskImage: gradient,
        opacity: isHovered ? 1 : 0,
        "--x": `${touchPoint.x}px`,
        "--y": `${touchPoint.y}px`,
      } as React.CSSProperties;
    },
    [mousePos, isHovered, touchPoint],
  );

  return {
    imageContainerRef,
    isTouchRevealed,
    isHovered,
    mousePos,
    touchPoint,
    getMaskStyle,
    handlers: {
      onMouseMove: handleMouseMove,
      onMouseEnter: handleMouseEnter,
      onMouseLeave: handleMouseLeave,
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: endLongPress,
      onTouchCancel: endLongPress,
      onContextMenu: handleContextMenu,
    },
  };
}
