import { useState, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { GalleryImage } from "@/data/types";
import Lightbox from "./Lightbox";

interface GalleryProps {
  images: GalleryImage[];
}

export default function Gallery({ images }: GalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    const itemWidth = container.firstElementChild
      ? (container.firstElementChild as HTMLElement).offsetWidth + 16
      : 200;
    container.scrollBy({
      left: direction === "left" ? -itemWidth : itemWidth,
      behavior: "smooth",
    });
  };

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);

  return (
    <section>
      <h2 className="text-2xl font-bold text-text-light dark:text-white mb-6">
        Gallery
      </h2>

      {images.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-text-muted-light dark:text-text-muted-dark">No gallery images yet.</p>
        </div>
      ) : (
        <div className="relative group/gallery">
          {/* Left nav */}
          <button
            onClick={() => scroll("left")}
            className="absolute left-2 sm:-left-5 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark shadow-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all opacity-100 sm:opacity-0 sm:group-hover/gallery:opacity-100 cursor-pointer"
            aria-label="Scroll left"
          >
            <ChevronLeft className="size-4 text-text-light dark:text-white" />
          </button>

          {/* Scrollable image row */}
          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {images.map((image, i) => (
              <button
                key={i}
                onClick={() => openLightbox(i)}
                className="relative group shrink-0 w-full sm:w-[calc(50%-8px)] lg:w-[calc(25%-12px)] aspect-square rounded-xl overflow-hidden cursor-pointer snap-center focus:outline-none focus:ring-2 focus:ring-text-light dark:focus:ring-white focus:ring-offset-2"
              >
                <img
                  alt={image.alt}
                  className="object-cover w-full h-full transform group-hover:scale-110 transition-transform duration-500"
                  src={image.src}
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />
              </button>
            ))}
          </div>

          {/* Right nav */}
          <button
            onClick={() => scroll("right")}
            className="absolute right-2 sm:-right-5 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark shadow-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all opacity-100 sm:opacity-0 sm:group-hover/gallery:opacity-100 cursor-pointer"
            aria-label="Scroll right"
          >
            <ChevronRight className="size-4 text-text-light dark:text-white" />
          </button>
        </div>
      )}

      {/* Lightbox */}
      <Lightbox
        images={images}
        currentIndex={lightboxIndex}
        onClose={closeLightbox}
        onNavigate={(idx) => setLightboxIndex(idx)}
      />
    </section>
  );
}