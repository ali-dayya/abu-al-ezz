"use client";
import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, ZoomIn, X, Package } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function ImageGallery({ mainImage, images = [], alt }) {
  const { lang } = useLanguage();
  const allImages = [mainImage, ...images.map((i) => i.image_url)].filter(Boolean);
  const [current, setCurrent] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  if (allImages.length === 0) {
    return (
      <div
        className="relative aspect-square rounded-3xl overflow-hidden flex items-center justify-center"
        style={{ background: "#f9f7f2", border: "1px solid #f0ece4" }}
      >
        <Package size={80} style={{ color: "#e5dfc8" }} />
      </div>
    );
  }

  return (
    <>
      <div className="space-y-3">
        {/* Main image */}
        <div
          className="relative aspect-square rounded-3xl overflow-hidden group cursor-zoom-in"
          style={{ background: "#f9f7f2", border: "1px solid #f0ece4", boxShadow: "0 8px 40px rgba(0,0,0,0.06)" }}
          onClick={() => setLightbox(true)}
          role="button"
          aria-label={lang === "ar" ? "تكبير الصورة" : "Zoom image"}
        >
          <Image
            src={allImages[current]}
            alt={alt}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e) => { e.currentTarget.style.display = "none"; }}
          />
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <Package size={80} style={{ color: "#e5dfc8", opacity: 0.5 }} />
          </div>
          <div className="absolute bottom-4 right-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            style={{ background: "rgba(13,13,13,0.65)", backdropFilter: "blur(8px)", color: "#fff", fontSize: "12px", fontWeight: 600 }}>
            <ZoomIn size={13} />
            {lang === "ar" ? "تكبير" : "Zoom"}
          </div>

          {allImages.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); setCurrent((p) => (p - 1 + allImages.length) % allImages.length); }}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ background: "rgba(255,255,255,0.9)", color: "#1a1a1a" }}
                aria-label="Previous image"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); setCurrent((p) => (p + 1) % allImages.length); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ background: "rgba(255,255,255,0.9)", color: "#1a1a1a" }}
                aria-label="Next image"
              >
                <ChevronRight size={18} />
              </button>
            </>
          )}
        </div>

        {/* Thumbnails */}
        {allImages.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-1">
            {allImages.map((img, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 transition-all"
                style={{
                  border: i === current ? "2px solid #C9A84C" : "2px solid #f0ece4",
                  opacity: i === current ? 1 : 0.6,
                }}
              >
                <Image src={img} alt={`${alt} ${i + 1}`} fill sizes="64px" className="object-cover"
                  onError={(e) => { e.currentTarget.style.display = "none"; }} />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.92)" }}
          onClick={() => setLightbox(false)}
        >
          <button
            onClick={() => setLightbox(false)}
            aria-label="Close"
            className="absolute top-5 right-5 w-10 h-10 rounded-full flex items-center justify-center"
            style={{ background: "rgba(255,255,255,0.1)", color: "#fff" }}
          >
            <X size={20} />
          </button>

          {allImages.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); setCurrent((p) => (p - 1 + allImages.length) % allImages.length); }}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full flex items-center justify-center"
                style={{ background: "rgba(255,255,255,0.1)", color: "#fff" }}
              >
                <ChevronLeft size={24} />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); setCurrent((p) => (p + 1) % allImages.length); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full flex items-center justify-center"
                style={{ background: "rgba(255,255,255,0.1)", color: "#fff" }}
              >
                <ChevronRight size={24} />
              </button>
            </>
          )}

          <div className="relative w-full max-w-3xl aspect-square rounded-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <Image src={allImages[current]} alt={alt} fill sizes="(max-width: 768px) 100vw, 768px" className="object-contain"
              onError={(e) => { e.currentTarget.style.display = "none"; }} />
          </div>

          {allImages.length > 1 && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
              {allImages.map((_, i) => (
                <button
                  key={i}
                  onClick={(e) => { e.stopPropagation(); setCurrent(i); }}
                  className="w-2.5 h-2.5 rounded-full transition-all"
                  style={{ background: i === current ? "#C9A84C" : "rgba(255,255,255,0.3)" }}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}
