import type { GalleryImage } from "@/data/types";

interface GalleryProps {
  images: GalleryImage[];
}

export default function Gallery({ images }: GalleryProps) {
  return (
    <section>
      <h2 className="text-2xl font-bold text-text-light dark:text-white mb-8">
        Gallery
      </h2>
      {images.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-text-muted-light dark:text-text-muted-dark">No gallery images yet.</p>
        </div>
      ) : (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {images.map((image) => (
          <div
            key={image.alt}
            className="relative group aspect-square rounded-xl overflow-hidden cursor-pointer"
          >
            <img
              alt={image.alt}
              className="object-cover w-full h-full transform group-hover:scale-110 transition-transform duration-500"
              src={image.src}
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />
          </div>
        ))}
      </div>
      )}
    </section>
  );
}
