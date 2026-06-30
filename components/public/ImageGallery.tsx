"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

interface ImageGalleryProps {
  images: string[];
  title: string;
}

export default function ImageGallery({ images, title }: ImageGalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  if (images.length === 0) return null;

  function prev() {
    setLightboxIndex(i => (i === null ? null : (i - 1 + images.length) % images.length));
  }
  function next() {
    setLightboxIndex(i => (i === null ? null : (i + 1) % images.length));
  }

  return (
    <>
      {/* Thumbnail strip */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {images.map((src, i) => (
          <button
            key={i}
            onClick={() => setLightboxIndex(i)}
            className="flex-shrink-0 w-24 h-16 rounded-md overflow-hidden border border-border hover:border-navy transition-colors focus:outline-none focus:ring-2 focus:ring-navy"
          >
            <Image
              src={src}
              alt={`${title} figure ${i + 1}`}
              width={96}
              height={64}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4"
            onClick={() => setLightboxIndex(null)}
          >
            <button
              className="absolute top-4 right-4 text-white/70 hover:text-white p-2"
              onClick={() => setLightboxIndex(null)}
              aria-label="Close"
            >
              <X size={24} />
            </button>

            <button
              className="absolute left-4 text-white/70 hover:text-white p-2"
              onClick={e => { e.stopPropagation(); prev(); }}
              aria-label="Previous"
            >
              <ChevronLeft size={32} />
            </button>

            <motion.div
              key={lightboxIndex}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
              className="relative max-w-4xl max-h-[80vh] w-full"
              onClick={e => e.stopPropagation()}
            >
              <Image
                src={images[lightboxIndex]}
                alt={`${title} figure ${lightboxIndex + 1}`}
                width={1200}
                height={800}
                className="w-full h-full object-contain rounded-lg"
              />
              <p className="text-center text-white/50 text-xs mt-2">
                Figure {lightboxIndex + 1} of {images.length}
              </p>
            </motion.div>

            <button
              className="absolute right-4 text-white/70 hover:text-white p-2"
              onClick={e => { e.stopPropagation(); next(); }}
              aria-label="Next"
            >
              <ChevronRight size={32} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
