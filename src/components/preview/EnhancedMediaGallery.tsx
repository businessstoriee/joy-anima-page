// src/components/preview/EnhancedMediaGallery.tsx
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  Image as ImageIcon,
  Video as VideoIcon,
  AlertCircle,
  FileImage as GifIcon,
  ChevronLeft,
  ChevronRight,
  X as XIcon,
  Loader2,
} from "lucide-react";
import MediaGalleryStyles, { layoutClassMap } from "./MediaGalleryStyles";
import { useIsMobile } from "@/hooks/use-mobile";
import type { GreetingFormData, MediaItem } from "@/types/greeting";

/** ---------- configuration ---------- */
const MAX_RETRIES = 3;

/** ---------- helpers ---------- */
const isHttpUrl = (u?: string) => {
  if (!u) return false;
  try {
    const parsed = new URL(u);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
};
const isDataUrl = (u?: string) => !!u && u.startsWith("data:");
const isBlobUrl = (u?: string) => !!u && u.startsWith("blob:");

const detectType = (url: string) => {
  const u = (url || "").toLowerCase();

  // YouTube / Vimeo / Dailymotion / Twitch / Facebook detectors
  if (/youtu\.be\/|youtube\.com\/watch|youtube\.com\/embed|youtube-nocookie\.com/.test(u)) return "youtube";
  if (/vimeo\.com\/\d+|player.vimeo.com/.test(u)) return "vimeo";
  if (/dailymotion\.com\/video|dai\.ly\//.test(u)) return "dailymotion";
  if (/twitch\.tv\/videos\/|player.twitch.tv/.test(u)) return "twitch";
  if (/facebook\.com\/.+\/videos\/|fb.watch\//.test(u)) return "facebook";

  // direct video file extensions
  if (/\.(mp4|webm|ogg|mov|m4v|mkv)(\?.*)?$/.test(u)) return "video";

  // images / gifs
  if (/\.(jpe?g|png|gif|webp|svg)(\?.*)?$/.test(u) || isDataUrl(u) || isBlobUrl(u)) return "image";

  // fallback: if url contains 'video' or 'cdn' - treat as video
  if (/\/video\//.test(u) || u.includes("cdn")) return "video";

  return "unknown";
};

const extractYouTubeId = (url: string) => {
  try {
    // supports youtu.be/ID, youtube.com/watch?v=ID, embed etc.
    const m = url.match(/(?:youtu\.be\/|youtube(?:-nocookie)?\.com\/(?:watch\?v=|embed\/|v\/|shorts\/))([A-Za-z0-9_-]{6,})/);
    return m ? m[1] : null;
  } catch {
    return null;
  }
};

const extractVimeoId = (url: string) => {
  try {
    const m = url.match(/vimeo\.com\/(?:channels\/[\w]+\/|groups\/[^/]+\/videos\/|video\/|)(\d+)/);
    return m ? m[1] : null;
  } catch {
    return null;
  }
};

const extractDailymotionId = (url: string) => {
  try {
    const m = url.match(/(?:dailymotion\.com\/video\/|dai\.ly\/)([A-Za-z0-9]+)/);
    return m ? m[1] : null;
  } catch {
    return null;
  }
};

const extractTwitchId = (url: string) => {
  try {
    const m = url.match(/twitch\.tv\/videos\/(\d+)/);
    return m ? m[1] : null;
  } catch {
    return null;
  }
};

const cacheBusted = (url: string, attempt: number) => {
  // Important: don't touch data: or blob: urls
  if (!isHttpUrl(url)) return url;
  if (!attempt) return url;
  try {
    const u = new URL(url);
    u.searchParams.set("_r", String(attempt));
    return u.toString();
  } catch {
    return `${url}${url.includes("?") ? "&" : "?"}_r=${attempt}`;
  }
};

/* ---------- component ---------- */
interface Props {
  greetingData: GreetingFormData;
  isEditing?: boolean;
  onMediaChange?: (media: MediaItem[]) => void;
  frameStyle?: string;
  mediaAnimation?: string;
}
const EnhancedMediaGallery: React.FC<Props> = ({ greetingData, isEditing = false, onMediaChange }) => {
  const media = greetingData.media || [];
  const isMobile = useIsMobile();

  const [loaded, setLoaded] = useState<Record<string, boolean>>({});
  const [errored, setErrored] = useState<Record<string, boolean>>({});
  const [retries, setRetries] = useState<Record<string, number>>({});
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [slideshowIndex, setSlideshowIndex] = useState(0);
  const [layout, setLayout] = useState<keyof typeof layoutClassMap>(greetingData.layout || "grid");

  const [muted, setMuted] = useState(true);
  const userInteractedRef = useRef(false);

  const cssLayoutClass = layoutClassMap[layout] || layoutClassMap.grid;

  // slideshow autoplay
  useEffect(() => {
    if (layout !== "slideshow" || media.length === 0) return;
    const t = setInterval(() => setSlideshowIndex((s) => (s + 1) % media.length), 3500);
    return () => clearInterval(t);
  }, [layout, media.length]);

  // lightbox body lock
  useEffect(() => {
    if (lightboxIndex !== null) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [lightboxIndex]);

  // Unmute on user gesture (one-time)
  useEffect(() => {
    const events: Array<keyof WindowEventMap> = ["click", "scroll", "keydown", "touchstart"];
    const onFirst = () => {
      if (!userInteractedRef.current) {
        userInteractedRef.current = true;
        setMuted(false);
      }
      events.forEach((ev) => window.removeEventListener(ev, onFirst as EventListener));
    };
    events.forEach((ev) => window.addEventListener(ev, onFirst as EventListener));
    return () => events.forEach((ev) => window.removeEventListener(ev, onFirst as EventListener));
  }, []);

  // keyboard (lightbox nav)
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === "Escape") setLightboxIndex(null);
      if (e.key === "ArrowRight") setLightboxIndex((i) => (i === null ? null : (i + 1) % media.length));
      if (e.key === "ArrowLeft") setLightboxIndex((i) => (i === null ? null : (i - 1 + media.length) % media.length));
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lightboxIndex, media.length]);

  const markLoaded = useCallback((id: string) => {
    setLoaded((p) => ({ ...p, [id]: true }));
    setErrored((p) => ({ ...p, [id]: false }));
  }, []);
  const markError = useCallback((id: string) => setErrored((p) => ({ ...p, [id]: true })), []);

  const attemptRetry = useCallback((id: string) => {
    setRetries((r) => {
      const cur = r[id] || 0;
      if (cur >= MAX_RETRIES) return r;
      return { ...r, [id]: cur + 1 };
    });
  }, []);

  const handleManualRetry = useCallback(
    (m: MediaItem) => {
      const id = m.id;
      setErrored((p) => ({ ...p, [id]: false }));
      attemptRetry(id);
      if (onMediaChange && isHttpUrl(m.url)) {
        // update remote with a cache-busted url if the caller expects updates
        const updated = (greetingData.media || []).map((x) => (x.id === id ? { ...x, url: cacheBusted(m.url, (retries[id] || 0) + 1) } : x));
        onMediaChange(updated);
      }
    },
    [attemptRetry, greetingData.media, onMediaChange, retries]
  );

  // helpers for embed srcs
  const makeEmbedSrc = (m: MediaItem) => {
    const type = detectType(m.url);
    if (type === "youtube") {
      const id = extractYouTubeId(m.url);
      if (!id) return null;
      return `https://www.youtube.com/embed/${id}?rel=0&playsinline=1&autoplay=0&mute=${muted ? 1 : 0}`;
    }
    if (type === "vimeo") {
      const id = extractVimeoId(m.url);
      if (!id) return null;
      return `https://player.vimeo.com/video/${id}?autoplay=0&muted=${muted ? 1 : 0}`;
    }
    if (type === "dailymotion") {
      const id = extractDailymotionId(m.url);
      if (!id) return null;
      return `https://www.dailymotion.com/embed/video/${id}?autoplay=0&mute=${muted ? 1 : 0}`;
    }
    if (type === "twitch") {
      const id = extractTwitchId(m.url);
      if (!id) return null;
      return `https://player.twitch.tv/?video=${id}&parent=${window.location.hostname}&autoplay=false&muted=${muted ? "true" : "false"}`;
    }
    if (/facebook\.com/.test(m.url)) {
      // Facebook embeds often require SDK; we provide iframe approach (may have restrictions)
      return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(m.url)}&autoplay=false&mute=${muted ? 1 : 0}`;
    }
    return null;
  };

  // Render single item (no hooks used here)
  const renderMediaItem = (m: MediaItem, index: number) => {
    const attempt = retries[m.id] || 0;
    const type = detectType(m.url);
    const src = cacheBusted(m.url, attempt); // cache bust only affects http(s) per helper
    const mediaClass = ["grid", "carousel", "collage", "slideshow", "polaroid"].includes(layout)
      ? "object-cover w-full h-full"
      : "object-contain w-full h-full";

    // fallback UI when final error
    if (errored[m.id]) {
      return (
        <div key={m.id} className="gallery-item relative" role="button" aria-label={`Failed to open media ${index + 1}`}>
          <div className="flex items-center justify-center p-6 h-40 text-center bg-gray-50 rounded">
            <div>
              <AlertCircle className="w-8 h-8 text-red-500 mx-auto" />
              <p className="text-sm text-red-600 mt-2">Failed to load</p>
              <div className="mt-3">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleManualRetry(m);
                  }}
                  className="px-3 py-1 bg-white border rounded-md text-sm"
                >
                  Retry
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    const loadingOverlay = !loaded[m.id] && !errored[m.id] ? (
      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 animate-pulse z-10">
        <Loader2 className="h-6 w-6 text-gray-400" />
      </div>
    ) : null;

    // IMAGE (includes data: & blob: URLs, uploaded files and remote images)
    if (type === "image") {
      return (
        <div
          key={m.id}
          className="gallery-item relative cursor-pointer overflow-hidden rounded"
          onClick={() => setLightboxIndex(index)}
          onKeyDown={(e) => e.key === "Enter" && setLightboxIndex(index)}
          role="button"
          tabIndex={0}
          aria-label={`Open image ${index + 1}`}
        >
          {loadingOverlay}
          <img
            src={src}
            alt={m.alt || `image-${index + 1}`}
            loading="lazy"
            // only set crossOrigin for remote http(s) images when you need it; avoid it for data/blob
            onLoad={() => markLoaded(m.id)}
            onError={() => {
              const current = retries[m.id] || 0;
              if (current < MAX_RETRIES && isHttpUrl(m.url)) {
                setTimeout(() => attemptRetry(m.id), current * 1000); // backoff
              } else {
                markError(m.id);
              }
            }}
            className={`${mediaClass} block`}
            style={{ display: "block" }}
          />
          <div className="absolute top-2 right-2 opacity-95">
            <div className="bg-white/85 rounded-full p-1.5">
              <ImageIcon className="w-4 h-4" />
            </div>
          </div>
        </div>
      );
    }

    // DIRECT VIDEO FILE
    if (type === "video") {
      return (
        <div
          key={m.id}
          className="gallery-item relative cursor-pointer rounded overflow-hidden bg-black"
          onClick={() => setLightboxIndex(index)}
          onKeyDown={(e) => e.key === "Enter" && setLightboxIndex(index)}
          role="button"
          tabIndex={0}
          aria-label={`Open video ${index + 1}`}
        >
          {loadingOverlay}
          <video
            src={src}
            controls
            playsInline
            muted={muted}
            preload="metadata"
            onLoadedData={() => markLoaded(m.id)}
            onError={() => {
              const current = retries[m.id] || 0;
              if (current < MAX_RETRIES && isHttpUrl(m.url)) {
                attemptRetry(m.id);
              } else {
                markError(m.id);
              }
            }}
            className={`${mediaClass} block`}
            style={{ display: "block" }}
          />
          <div className="absolute top-2 right-2 opacity-95">
            <div className="bg-white/85 rounded-full p-1.5">
              <VideoIcon className="w-4 h-4" />
            </div>
          </div>
        </div>
      );
    }

    // EMBEDS: YouTube / Vimeo / Dailymotion / Twitch / Facebook - use iframe
    if (["youtube", "vimeo", "dailymotion", "twitch", "facebook"].includes(type)) {
      const embed = makeEmbedSrc(m);
      if (!embed) {
        return (
          <div key={m.id} className="gallery-item relative p-6 h-40 text-center">
            <AlertCircle className="w-8 h-8 text-red-500 mx-auto" />
            <p className="text-sm text-red-600 mt-2">Invalid embed link</p>
          </div>
        );
      }
      return (
        <div
          key={m.id}
          className="gallery-item relative cursor-pointer rounded overflow-hidden bg-black"
          onClick={() => setLightboxIndex(index)}
          onKeyDown={(e) => e.key === "Enter" && setLightboxIndex(index)}
          role="button"
          tabIndex={0}
          aria-label={`Open embedded media ${index + 1}`}
        >
          {loadingOverlay}
          <div className="w-full h-full">
            <iframe
              src={embed}
              title={m.alt || `embedded-${index}`}
              allow="autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
              className="w-full h-full block"
              onLoad={() => markLoaded(m.id)}
            />
          </div>
          <div className="absolute top-2 right-2 opacity-95">
            <div className="bg-white/85 rounded-full p-1.5">
              <VideoIcon className="w-4 h-4" />
            </div>
          </div>
        </div>
      );
    }

    // Unknown fallback -> try rendering an image first (may be remote without extension)
    return (
      <div key={m.id} className="gallery-item relative cursor-pointer" onClick={() => setLightboxIndex(index)}>
        {loadingOverlay}
        <img
          src={src}
          alt={m.alt || `media-${index + 1}`}
          loading="lazy"
          onLoad={() => markLoaded(m.id)}
          onError={() => {
            const current = retries[m.id] || 0;
            if (current < MAX_RETRIES && isHttpUrl(m.url)) attemptRetry(m.id);
            else markError(m.id);
          }}
          className={`${mediaClass} block`}
        />
        <div className="absolute top-2 right-2 opacity-95">
          <div className="bg-white/85 rounded-full p-1.5">
            <ImageIcon className="w-4 h-4" />
          </div>
        </div>
      </div>
    );
  };

  const closeLightbox = () => setLightboxIndex(null);
  const prevLightbox = () => setLightboxIndex((i) => (i === null ? null : (i - 1 + media.length) % media.length));
  const nextLightbox = () => setLightboxIndex((i) => (i === null ? null : (i + 1) % media.length));

  // layout renderer
  const renderLayout = () => {
    if (layout === "slideshow") {
      return (
        <div className="slideshow-layout">
          {media.map((m, i) => (
            <div key={m.id} className={`gallery-item ${i === slideshowIndex ? "active" : ""}`}>
              {renderMediaItem(m, i)}
            </div>
          ))}
        </div>
      );
    }
    if (layout === "carousel") {
      return (
        <div className="carousel-layout">
          {media.map((m, i) => (
            <div key={m.id} style={{ minWidth: isMobile ? "85%" : 380 }}>
              {renderMediaItem(m, i)}
            </div>
          ))}
        </div>
      );
    }
    return <div className={cssLayoutClass}>{media.map(renderMediaItem)}</div>;
  };

  // editing empty state
  if (isEditing && media.length === 0) {
    return (
      <>
        <MediaGalleryStyles />
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-6">
            <ImageIcon className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No media added yet</h3>
          <p className="text-gray-500 text-sm">Add images or videos to make your greeting special</p>
        </div>
      </>
    );
  }

  return (
    <>
      <MediaGalleryStyles />
      <div className={cn("gallery-container", cssLayoutClass)} style={{ padding: isMobile ? 12 : 20 }}>
        {renderLayout()}
      </div>

      <AnimatePresence>
        {lightboxIndex !== null && media[lightboxIndex] && (
          <div className="lightbox-backdrop" onClick={closeLightbox} role="dialog" aria-modal="true">
            <div className="lightbox-panel" onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-between p-3">
                <div />
                <div className="flex gap-2">
                  <button onClick={prevLightbox} className="p-2 rounded-full bg-white/90" aria-label="Previous">
                    <ChevronLeft />
                  </button>
                  <button onClick={nextLightbox} className="p-2 rounded-full bg-white/90" aria-label="Next">
                    <ChevronRight />
                  </button>
                  <button onClick={closeLightbox} className="p-2 rounded-full bg-white/90" aria-label="Close">
                    <XIcon />
                  </button>
                </div>
              </div>

              <div className="lightbox-media">
                {(() => {
                  const m = media[lightboxIndex!];
                  const type = detectType(m.url);
                  const attempt = retries[m.id] || 0;
                  const src = cacheBusted(m.url, attempt);

                  if (type === "image") {
                    return (
                      <img
                        src={src}
                        alt={m.alt || `lightbox-${lightboxIndex}`}
                        style={{ maxWidth: "100%", maxHeight: "80vh", objectFit: "contain" }}
                      />
                    );
                  }
                  if (type === "video") {
                    return <video src={src} controls autoPlay muted={muted} className="lightbox-inner-media" style={{ maxWidth: "100%", maxHeight: "80vh", objectFit: "contain" }} />;
                  }
                  if (type === "youtube" || type === "vimeo" || type === "dailymotion" || type === "twitch" || /facebook\.com/.test(m.url)) {
                    const embed = makeEmbedSrc(m);
                    if (!embed) return <div className="p-8">Invalid embed link</div>;
                    return <iframe src={embed + "&autoplay=1"} allow="autoplay; encrypted-media" title={m.alt || "Embedded media"} style={{ width: "100%", height: "70vh", border: 0 }} />;
                  }
                  return <div className="p-8">Unsupported media type</div>;
                })()}
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default EnhancedMediaGallery;
