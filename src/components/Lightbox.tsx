import { useEffect, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

export interface LightboxImage {
  src: string;
  alt?: string;
}

interface LightboxProps {
  images: (string | LightboxImage)[];
  currentIndex: number | null;
  onClose: () => void;
  onNavigate?: (index: number) => void;
}

export default function Lightbox({
  images,
  currentIndex,
  onClose,
  onNavigate,
}: LightboxProps) {
  const isOpen =
    currentIndex !== null &&
    currentIndex >= 0 &&
    currentIndex < images.length;

  const lastWheelTimeRef = useRef<number>(0);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  const handlePrev = useCallback(
    (e?: React.MouseEvent) => {
      e?.stopPropagation();
      if (currentIndex !== null && currentIndex > 0 && onNavigate) {
        onNavigate(currentIndex - 1);
      }
    },
    [currentIndex, onNavigate]
  );

  const handleNext = useCallback(
    (e?: React.MouseEvent) => {
      e?.stopPropagation();
      if (
        currentIndex !== null &&
        currentIndex < images.length - 1 &&
        onNavigate
      ) {
        onNavigate(currentIndex + 1);
      }
    },
    [currentIndex, images.length, onNavigate]
  );

  // Prevent background scroll and compensate for scrollbar width to avoid layout shift
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    const originalPaddingRight = document.body.style.paddingRight;

    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.paddingRight = originalPaddingRight;
    };
  }, [isOpen]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };

    window.addEventListener("keydown", handleKey);
    return () => {
      window.removeEventListener("keydown", handleKey);
    };
  }, [isOpen, onClose, handlePrev, handleNext]);

  // Mouse wheel scroll navigation inside expanded image view
  const handleWheel = (e: React.WheelEvent) => {
    e.stopPropagation();
    const now = Date.now();
    if (now - lastWheelTimeRef.current < 250) return;

    if (e.deltaY > 20) {
      if (currentIndex !== null && currentIndex < images.length - 1) {
        handleNext();
        lastWheelTimeRef.current = now;
      }
    } else if (e.deltaY < -20) {
      if (currentIndex !== null && currentIndex > 0) {
        handlePrev();
        lastWheelTimeRef.current = now;
      }
    }
  };

  // Touch swipe support (left/right to navigate, up/down to close)
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartRef.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current) return;
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    const deltaX = touchEndX - touchStartRef.current.x;
    const deltaY = touchEndY - touchStartRef.current.y;
    touchStartRef.current = null;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX < -40) handleNext();
      else if (deltaX > 40) handlePrev();
    } else {
      if (Math.abs(deltaY) > 70) onClose();
    }
  };

  if (!isOpen || currentIndex === null) {
    return null;
  }

  const currentItem = images[currentIndex];
  const src = typeof currentItem === "string" ? currentItem : currentItem.src;
  const alt =
    typeof currentItem === "string"
      ? `Image ${currentIndex + 1}`
      : currentItem.alt || `Image ${currentIndex + 1}`;

  return createPortal(
    <div
      className="fixed inset-0 z-9999 flex items-center justify-center bg-black/80 backdrop-blur-md select-none touch-none"
      onClick={onClose}
      onWheel={handleWheel}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 p-2.5 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 transition-all z-30 cursor-pointer"
        aria-label="Close"
      >
        <X className="size-6 text-white" />
      </button>

      {/* Prev arrow */}
      {currentIndex > 0 && onNavigate && (
        <button
          onClick={handlePrev}
          className="absolute left-6 p-3 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 transition-all z-30 cursor-pointer"
          aria-label="Previous image"
        >
          <ChevronLeft className="size-6 text-white" />
        </button>
      )}

      {/* Image Container */}
      <div
        className="relative z-20 max-h-[85vh] max-w-[90vw] flex items-center justify-center p-2"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={src}
          alt={alt}
          className="max-h-[80vh] max-w-[85vw] object-contain rounded-lg shadow-2xl ring-1 ring-white/10 transition-all duration-200"
        />
      </div>

      {/* Next arrow */}
      {currentIndex < images.length - 1 && onNavigate && (
        <button
          onClick={handleNext}
          className="absolute right-6 p-3 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 transition-all z-30 cursor-pointer"
          aria-label="Next image"
        >
          <ChevronRight className="size-6 text-white" />
        </button>
      )}

      {/* Image counter */}
      <div className="absolute bottom-6 px-4 py-1.5 rounded-full bg-black/50 backdrop-blur-sm text-white/80 text-sm font-medium z-30">
        {currentIndex + 1} / {images.length}
      </div>
    </div>,
    document.body
  );
}
