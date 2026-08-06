import { useEffect, useCallback } from "react";
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
  if (currentIndex === null || currentIndex < 0 || currentIndex >= images.length) {
    return null;
  }

  const currentItem = images[currentIndex];
  const src = typeof currentItem === "string" ? currentItem : currentItem.src;
  const alt = typeof currentItem === "string" ? `Image ${currentIndex + 1}` : (currentItem.alt || `Image ${currentIndex + 1}`);

  const handlePrev = useCallback(
    (e?: React.MouseEvent) => {
      e?.stopPropagation();
      if (currentIndex > 0 && onNavigate) {
        onNavigate(currentIndex - 1);
      }
    },
    [currentIndex, onNavigate]
  );

  const handleNext = useCallback(
    (e?: React.MouseEvent) => {
      e?.stopPropagation();
      if (currentIndex < images.length - 1 && onNavigate) {
        onNavigate(currentIndex + 1);
      }
    },
    [currentIndex, images.length, onNavigate]
  );

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKey);
    };
  }, [onClose, handlePrev, handleNext]);

  return createPortal(
    <div
      className="fixed inset-0 z-9999 flex items-center justify-center bg-gray-800/60 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-10 cursor-pointer"
        aria-label="Close"
      >
        <X className="size-6 text-white" />
      </button>

      {/* Prev arrow */}
      {currentIndex > 0 && onNavigate && (
        <button
          onClick={handlePrev}
          className="absolute left-6 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-10 cursor-pointer"
          aria-label="Previous image"
        >
          <ChevronLeft className="size-6 text-white" />
        </button>
      )}

      {/* Image */}
      <img
        src={src}
        alt={alt}
        className="relative z-20 max-h-[85vh] max-w-[90vw] object-contain rounded-lg shadow-2xl ring-1 ring-white/10"
        onClick={(e) => e.stopPropagation()}
      />

      {/* Next arrow */}
      {currentIndex < images.length - 1 && onNavigate && (
        <button
          onClick={handleNext}
          className="absolute right-6 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-10 cursor-pointer"
          aria-label="Next image"
        >
          <ChevronRight className="size-6 text-white" />
        </button>
      )}

      {/* Image counter */}
      <div className="absolute bottom-6 text-white/60 text-sm font-medium">
        {currentIndex + 1} / {images.length}
      </div>
    </div>,
    document.body
  );
}
