// EnhancedMediaGallery.tsx
import React, { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Image as ImageIcon,
  Video as VideoIcon,
  AlertCircle,
  FileImage as GifIcon,
  ChevronLeft,
  ChevronRight,
  X as XIcon,
} from "lucide-react";

import MediaGalleryStyles, { layoutClassMap } from "./MediaGalleryStyles";
import { useIsMobile } from "@/hooks/use-mobile";
import { GreetingFormData, MediaItem } from "@/types/greeting";
      import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";


interface Props {
  greetingData: GreetingFormData;
  isEditing?: boolean;
  onMediaChange?: (media: MediaItem[]) => void;
  frameStyle?: string;
  mediaAnimation?: string;
}

const EnhancedMediaGallery: React.FC<Props> = ({
  greetingData,
  isEditing = false,
  onMediaChange,
  frameStyle,
}) => {
  const isMobile = useIsMobile();

  const [loaded, setLoaded] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [retryCount, setRetryCount] = useState<Record<string, number>>({});
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [slideshowIndex, setSlideshowIndex] = useState(0);
  const [layout, setLayout] = useState<keyof typeof layoutClassMap>(
    greetingData.layout || "grid"
  );

  const media = greetingData.media || [];
  const cssLayoutClass = layoutClassMap[layout] || layoutClassMap.grid;

  /** ---------------- Slideshow autoplay ---------------- */
  useEffect(() => {
    if (layout !== "slideshow") return;
    if (!media.length) return;
    const t = setInterval(
      () => setSlideshowIndex((s) => (s + 1) % media.length),
      3500
    );
    return () => clearInterval(t);
  }, [layout, media.length]);

  /** ---------------- Touch swipe for carousel ---------------- */
  const touchStartX = useRef(0);
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      const container = e.currentTarget;
      const scrollAmount = container.clientWidth * 0.8;
      container.scrollBy({
        left: diff > 0 ? scrollAmount : -scrollAmount,
        behavior: "smooth",
      });
    }
  };

  /** ---------------- Error & Retry ---------------- */
  const handleLoad = useCallback((id: string) => {
    setLoaded((p) => ({ ...p, [id]: true }));
  }, []);

  const handleError = useCallback((id: string) => {
    setErrors((p) => ({ ...p, [id]: true }));
  }, []);

  const handleRetry = useCallback(
    (id: string, url: string) => {
      const cur = retryCount[id] || 0;
      if (cur >= 3) return;
      setRetryCount((p) => ({ ...p, [id]: cur + 1 }));
      setErrors((p) => ({ ...p, [id]: false }));
      if (onMediaChange) {
        const updated = media.map((m) =>
          m.id === id ? { ...m, url: `${url}?t=${Date.now()}` } : m
        );
        onMediaChange(updated);
      }
    },
    [retryCount, media, onMediaChange]
  );

  /** ---------------- Lightbox controls ---------------- */
  const openLightbox = (i: number) => {
    setLightboxIndex(i);
    document.body.style.overflow = "hidden";
  };
  const closeLightbox = () => {
    setLightboxIndex(null);
    document.body.style.overflow = "auto";
  };
  const nextLightbox = (dir = 1) =>
    setLightboxIndex((i) =>
      i === null ? null : (i + dir + media.length) % media.length
    );

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") nextLightbox(1);
      if (e.key === "ArrowLeft") nextLightbox(-1);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lightboxIndex, media.length]);

  /** ---------------- Media renderer ---------------- */
  const renderMediaItem = (m: MediaItem, index: number) => {
    const isGif = m.type === "gif";
    const useCover = ["grid", "carousel", "collage", "slideshow", "polaroid"].includes(
      layout
    );
    const mediaClass = useCover
      ? "object-cover w-full h-full"
      : "object-contain w-full h-full";

    return (
      <div
        key={m.id}
        className="gallery-item relative"
        role="button"
        aria-label={`open media ${index + 1}`}
        onClick={() => openLightbox(index)}
      >
        {!loaded[m.id] && !errors[m.id] && (
          <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-gray-100 to-gray-200" />
        )}
        {errors[m.id] ? (
          <div className="flex items-center justify-center p-6 h-40 text-center">
            <div>
              <AlertCircle className="w-8 h-8 text-red-500 mx-auto" />
              <p className="text-sm text-red-600 mt-2">Failed to load</p>
              <div className="mt-3">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRetry(m.id, m.url);
                  }}
                  className="px-3 py-1 bg-white border rounded-md text-sm"
                >
                  Retry
                </button>
              </div>
            </div>
          </div>
        ) : m.type === "video" ? (
          <video
            src={m.url}
            controls
            playsInline
            muted
            preload="metadata"
            onLoadedData={() => handleLoad(m.id)}
            onError={() => handleError(m.id)}
            className={mediaClass}
            style={{ display: "block" }}
          />
        ) : (
          <img
            src={m.url}
            alt={`media-${index}`}
            loading="lazy"
            onLoad={() => handleLoad(m.id)}
            onError={() => handleError(m.id)}
            className={mediaClass}
            style={{ display: "block" }}
          />
        )}

        {/* badge */}
        <div className="absolute top-2 right-2 opacity-95">
          <div className="bg-white/85 rounded-full p-1.5">
            {isGif ? (
              <GifIcon className="w-4 h-4" />
            ) : m.type === "image" ? (
              <ImageIcon className="w-4 h-4" />
            ) : (
              <VideoIcon className="w-4 h-4" />
            )}
          </div>
        </div>
      </div>
    );
  };

  /** ---------------- Layout renderer ---------------- */
  const renderLayout = () => {
    if (layout === "slideshow") {
      return (
        <div className="slideshow-layout">
          {media.map((m, i) => (
            <div
              key={m.id}
              className={`gallery-item ${i === slideshowIndex ? "active" : ""}`}
              onClick={() => openLightbox(i)}
            >
              {renderMediaItem(m, i)}
            </div>
          ))}
        </div>
      );
    }

    if (layout === "carousel") {
      return (
        <div
          className="carousel-layout"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {media.map((m, i) => (
            <div
              key={m.id}
              style={{ minWidth: isMobile ? "85%" : 380 }}
              className="gallery-item"
            >
              {renderMediaItem(m, i)}
            </div>
          ))}
        </div>
      );
    }

    // fallback to default layout class
    return (
      <div className={cssLayoutClass}>
        {media.map((m, i) => renderMediaItem(m, i))}
      </div>
    );
  };

  /** ---------------- Render ---------------- */
  if (isEditing && media.length === 0) {
    return (
      <>
        <MediaGalleryStyles />
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-6">
            <ImageIcon className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            No media added yet
          </h3>
          <p className="text-gray-500 text-sm">
            Add some images or videos to make your greeting special
          </p>
        </div>
      </>
    );
  }

  return (
    <>
      <MediaGalleryStyles />

      {/* ✅ Layout selector UI */}

<div className="flex justify-end mb-4">
  <Select
    value={layout}
    onValueChange={(val) => {
      setLayout(val as keyof typeof layoutClassMap);
      greetingData.layout = val as keyof typeof layoutClassMap;
    }}
  >
    <SelectTrigger className="w-40 text-sm rounded-lg shadow-sm border">
      <SelectValue placeholder="Choose layout" />
    </SelectTrigger>
    <SelectContent className="max-h-60 overflow-y-auto">
      {Object.keys(layoutClassMap).map((opt) => (
        <SelectItem key={opt} value={opt} className="capitalize">
          {opt}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
</div>


      {/* Gallery */}
      <div
        className={cn("gallery-container", cssLayoutClass)}
        style={{ padding: isMobile ? 12 : 20 }}
      >
        {renderLayout()}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && media[lightboxIndex] && (
          <div
            className="lightbox-backdrop"
            onClick={closeLightbox}
            role="dialog"
            aria-modal="true"
          >
            <div
              className="lightbox-panel"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between p-3">
                <div />
                <div className="flex gap-2">
                  <button
                    onClick={() => nextLightbox(-1)}
                    className="p-2 rounded-full bg-white/90"
                  >
                    <ChevronLeft />
                  </button>
                  <button
                    onClick={() => nextLightbox(1)}
                    className="p-2 rounded-full bg-white/90"
                  >
                    <ChevronRight />
                  </button>
                  <button
                    onClick={closeLightbox}
                    className="p-2 rounded-full bg-white/90"
                  >
                    <XIcon />
                  </button>
                </div>
              </div>

              <div className="lightbox-media">
                {media[lightboxIndex].type === "video" ? (
                  <video
                    src={media[lightboxIndex].url}
                    controls
                    autoPlay
                    className="lightbox-inner-media"
                    style={{
                      maxWidth: "100%",
                      maxHeight: "80vh",
                      objectFit: "contain",
                    }}
                  />
                ) : (
                  <img
                    src={media[lightboxIndex].url}
                    alt={`lightbox-${lightboxIndex}`}
                    loading="lazy"
                    style={{
                      maxWidth: "100%",
                      maxHeight: "80vh",
                      objectFit: "contain",
                    }}
                  />
                )}
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default EnhancedMediaGallery;
