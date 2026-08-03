import { useEffect, useState, useRef } from "react";
import { BadgeCheck, MapPin, Mail, FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/ThemeToggle";
import type { HeroData } from "@/data/types";

interface HeroProps {
  data: HeroData;
}

const LONG_PRESS_MS = 500;
const LONG_PRESS_CANCEL_DISTANCE = 12;

export default function Hero({ data }: HeroProps) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const imageContainerRef = useRef<HTMLDivElement>(null);

  const [isTouchRevealed, setIsTouchRevealed] = useState(false);
  const [touchPoint, setTouchPoint] = useState({ x: 80, y: 80 });
  const longPressTimerRef = useRef<number | null>(null);
  const touchStartRef = useRef({ x: 0, y: 0 });
  const longPressFiredRef = useRef(false);

  const isTouchEvent = (e: React.MouseEvent<HTMLDivElement>) =>
    (e.nativeEvent as PointerEvent).pointerType === "touch";

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isTouchEvent(e)) return;
    if (!imageContainerRef.current) return;
    const rect = imageContainerRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isTouchEvent(e)) return;
    if (imageContainerRef.current) {
      const rect = imageContainerRef.current.getBoundingClientRect();
      setMousePos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
    setIsHovered(true);
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isTouchEvent(e)) return;
    setIsHovered(false);
  };

  const clearLongPressTimer = () => {
    if (longPressTimerRef.current !== null) {
      window.clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
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
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    const touch = e.touches[0];
    if (!touch) return;
    const dx = touch.clientX - touchStartRef.current.x;
    const dy = touch.clientY - touchStartRef.current.y;
    if (Math.hypot(dx, dy) > LONG_PRESS_CANCEL_DISTANCE) {
      endLongPress();
    }
  };

  const endLongPress = () => {
    clearLongPressTimer();
    if (longPressFiredRef.current) {
      longPressFiredRef.current = false;
      setIsTouchRevealed(false);
    }
  };

  useEffect(() => {
    return () => {
      if (longPressTimerRef.current !== null) {
        window.clearTimeout(longPressTimerRef.current);
      }
    };
  }, []);

  return (
    <section className="relative flex flex-col md:flex-row gap-8 items-start md:items-center animate-fade-in-up">
      {/* Theme Toggle — fixed top-right on mobile, inline on md+ */}
      <div className="fixed top-4 right-4 z-50 md:absolute md:top-0 md:right-0">
        <ThemeToggle />
      </div>

      {/* Profile Image */}
      <div
        className={`relative group profile-reveal${isTouchRevealed ? " touch-revealed" : ""}`}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={endLongPress}
        onTouchCancel={endLongPress}
        onContextMenu={(e) => {
          if ((e.nativeEvent as PointerEvent).pointerType === "touch") {
            e.preventDefault();
          }
        }}
      >
        <div className="absolute -inset-1 bg-linear-to-b from-gray-800 to-gray-400 dark:from-gray-300 dark:to-gray-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200 profile-glow" />

        <div
          ref={imageContainerRef}
          onMouseMove={handleMouseMove}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className="relative w-32 h-32 md:w-40 md:h-40 rounded-2xl overflow-hidden border-4 border-surface-light dark:border-surface-dark shadow-lg select-none"
        >
          {/* Base Image */}
          <img
            alt={`Profile of ${data.name}`}
            className="w-full h-full object-cover"
            src={data.profileImage}
          />

          {/* Masked 2nd Image with soft fading edges based on cursor position */}
          <img
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover pointer-events-none transition-opacity duration-200 profile-back"
            src={data.profileImage2}
            style={{
              maskImage: isHovered
                ? `radial-gradient(circle 32px at ${mousePos.x}px ${mousePos.y}px, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 50%, rgba(0,0,0,0.7) 70%, rgba(0,0,0,0.2) 88%, rgba(0,0,0,0) 100%)`
                : `radial-gradient(circle 0px at ${mousePos.x}px ${mousePos.y}px, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)`,
              WebkitMaskImage: isHovered
                ? `radial-gradient(circle 32px at ${mousePos.x}px ${mousePos.y}px, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 50%, rgba(0,0,0,0.7) 70%, rgba(0,0,0,0.2) 88%, rgba(0,0,0,0) 100%)`
                : `radial-gradient(circle 0px at ${mousePos.x}px ${mousePos.y}px, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)`,
              opacity: isHovered ? 1 : 0,
              "--x": `${touchPoint.x}px`,
              "--y": `${touchPoint.y}px`,
            } as React.CSSProperties}
          />
        </div>
      </div>

      {/* Info */}
      <div className="flex-1 space-y-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-3xl md:text-4xl font-bold text-text-light dark:text-white">
              {data.name}
            </h1>
            <BadgeCheck className="size-5 text-text-light dark:text-white" />
          </div>
          <div className="flex items-center text-text-muted-light dark:text-text-muted-dark text-sm">
            <MapPin className="size-4 mr-1" />
            {data.location}
          </div>
        </div>

        <p className="text-lg text-text-light dark:text-gray-300 font-medium">
          {data.title}
        </p>

        <div className="flex flex-wrap gap-3 pt-2">
          <Button variant="outline" asChild>
            <a href={`mailto:${data.email}`}>
              <Mail className="size-4" />
              Send Email
            </a>
          </Button>
          <Button variant="default" asChild>
            <a href={data.cvUrl} target="_blank" rel="noopener noreferrer">
              <FileDown className="size-4" />
              Download CV
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
