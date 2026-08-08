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
    <section className="py-4 border-b border-border">
      <div className="flex items-center justify-between border-b border-border pb-2 mb-4">
        <h3 className="font-mono text-xs uppercase tracking-widest text-muted-foreground font-bold">
          [ SECTION 06 // PHOTOGRAPHIC ARCHIVE ]
        </h3>
        <div className="flex items-center gap-2">
          <button
            onClick={() => scroll("left")}
            className="p-1 border border-border hover:border-foreground text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            aria-label="Scroll left"
          >
            <ChevronLeft className="size-3.5" />
          </button>
          <button
            onClick={() => scroll("right")}
            className="p-1 border border-border hover:border-foreground text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            aria-label="Scroll right"
          >
            <ChevronRight className="size-3.5" />
          </button>
        </div>
      </div>

      {images.length === 0 ? (
        <div className="text-center py-8 font-mono text-xs text-muted-foreground">
          NO GALLERY IMAGES RECORDED.
        </div>
      ) : (
        <div className="relative">
          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory py-1"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {images.map((image, i) => (
              <button
                key={i}
                onClick={() => openLightbox(i)}
                className="relative group shrink-0 w-60 aspect-square border border-border bg-card overflow-hidden cursor-pointer snap-center focus:outline-none focus:border-foreground"
              >
                <img
                  alt={image.alt}
                  className="object-cover w-full h-full newspaper-photo"
                  src={image.src}
                />
                <div className="absolute inset-x-0 bottom-0 bg-background/90 border-t border-border p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="font-mono text-[10px] text-foreground truncate uppercase text-left">
                    FIG {i + 1}: {image.alt}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Lightbox Modal Preserved */}
      <Lightbox
        images={images}
        currentIndex={lightboxIndex}
        onClose={closeLightbox}
        onNavigate={(idx) => setLightboxIndex(idx)}
      />
    </section>
  );
}