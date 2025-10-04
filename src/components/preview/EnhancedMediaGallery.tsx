// src/components/preview/EnhancedMediaGallery.tsx
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
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
import MediaFrame from "./MediaFrames";
import { getAnimation } from "@/types/animations";
import { useIsMobile } from "@/hooks/use-mobile";
import type { GreetingFormData, MediaItem } from "@/types/greeting";

/* ---------- configuration ---------- */
const MAX_RETRIES = 3;
const MAX_WIDTH_MOBILE = 250;
const MAX_HEIGHT_MOBILE = 200;
const MIN_WIDTH = 100;
const MIN_HEIGHT = 100;
const MAX_WIDTH_DESKTOP = 400;
const MAX_HEIGHT_DESKTOP = 350;
const DEFAULT_WIDTH = 300;
const DEFAULT_HEIGHT = 200;

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

const EnhancedMediaGallery: React.FC<Props> = ({ 
  greetingData, 
  isEditing = false, 
  onMediaChange,
  frameStyle,
  mediaAnimation 
}) => {
  const media = greetingData.media || [];
  const isMobile = useIsMobile();

  const [loaded, setLoaded] = useState<Record<string, boolean>>({});
  const [errored, setErrored] = useState<Record<string, boolean>>({});
  const [retries, setRetries] = useState<Record<string, number>>({});
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [slideshowIndexes, setSlideshowIndexes] = useState<Record<string, number>>({});

  // Group media by individual layout settings
  const mediaGroups = useMemo(() => {
    const groups: Record<string, MediaItem[]> = {};
    media.forEach(item => {
      const itemLayout = item.layout || greetingData.layout || 'grid';
      if (!groups[itemLayout]) {
        groups[itemLayout] = [];
      }
      groups[itemLayout].push(item);
    });
    return groups;
  }, [media, greetingData.layout]);

  // Get ordered layout groups
  const orderedLayoutGroups = useMemo(() => {
    const availableLayouts = Object.keys(mediaGroups);
    const order = greetingData.layoutGroupOrder || [];
    
    // Return layouts in specified order, then any remaining layouts
    return [
      ...order.filter(layout => availableLayouts.includes(layout)),
      ...availableLayouts.filter(layout => !order.includes(layout))
    ];
  }, [mediaGroups, greetingData.layoutGroupOrder]);

  const [muted, setMuted] = useState(true);
  const userInteractedRef = useRef(false);

  // slideshow autoplay for each group
  useEffect(() => {
    const intervals: NodeJS.Timeout[] = [];
    
    Object.entries(mediaGroups).forEach(([layoutKey, groupMedia]) => {
      if (layoutKey === "slideshow" && groupMedia.length > 0) {
        const interval = setInterval(() => {
          setSlideshowIndexes(prev => ({
            ...prev,
            [layoutKey]: ((prev[layoutKey] || 0) + 1) % groupMedia.length
          }));
        }, 3500);
        intervals.push(interval);
      }
    });
    
    return () => {
      intervals.forEach(clearInterval);
    };
  }, [mediaGroups]);

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

  // Render single item with frame and animation
  const renderMediaItem = (m: MediaItem, index: number, groupLayout: string) => {
    const attempt = retries[m.id] || 0;
    const type = detectType(m.url);
    const src = cacheBusted(m.url, attempt);
    const mediaClass = ["grid", "carousel", "collage", "slideshow", "polaroid"].includes(groupLayout)
      ? "object-cover w-full h-full"
      : "object-contain w-full h-full";

    // Get animation variant for this media item - use centralized animation system
    const itemAnimation = m.animation || mediaAnimation || greetingData.mediaAnimation || greetingData.animationStyle || 'fadeIn';
    const animationVariant = getAnimation(itemAnimation, 'fadeIn');

    // Get frame style - use real-time settings
    const itemFrameStyle = m.frameStyle || frameStyle || greetingData.frameStyle || 'classic';

    // ✅ Apply responsive sizing constraints with defaults
    const maxWidth = isMobile ? MAX_WIDTH_MOBILE : MAX_WIDTH_DESKTOP;
    const maxHeight = isMobile ? MAX_HEIGHT_MOBILE : MAX_HEIGHT_DESKTOP;
    
    const constrainedWidth = m.position?.width 
      ? Math.min(Math.max(Number(m.position.width) || DEFAULT_WIDTH, MIN_WIDTH), maxWidth)
      : isMobile ? Math.min(maxWidth, DEFAULT_WIDTH) : DEFAULT_WIDTH;
    
    const constrainedHeight = m.position?.height 
      ? Math.min(Math.max(Number(m.position.height) || DEFAULT_HEIGHT, MIN_HEIGHT), maxHeight)
      : isMobile ? Math.min(maxHeight, DEFAULT_HEIGHT) : DEFAULT_HEIGHT;

    // fallback UI when final error
    if (errored[m.id]) {
      return (
        <MediaFrame 
          key={m.id} 
          frameType={itemFrameStyle} 
          index={index}
          className="gallery-item relative"
        >
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
        </MediaFrame>
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
        <motion.div
          key={`${m.id}-${itemAnimation}-${itemFrameStyle}-${constrainedWidth}-${constrainedHeight}`}
          initial="hidden"
          animate="visible"
          variants={animationVariant}
          custom={index}
          whileHover={{ scale: 1.02 }}
          transition={{ delay: index * 0.1 }}
        >
          <MediaFrame 
            frameType={itemFrameStyle} 
            index={index}
            className="gallery-item relative cursor-pointer overflow-hidden"
          >
            <div
              onClick={() => setLightboxIndex(index)}
              onKeyDown={(e) => e.key === "Enter" && setLightboxIndex(index)}
              role="button"
              tabIndex={0}
              aria-label={`Open image ${index + 1}`}
              className="relative w-full h-full"
            >
              {loadingOverlay}
              <img
                src={src}
                alt={m.alt || `image-${index + 1}`}
                loading="lazy"
                onLoad={() => markLoaded(m.id)}
                onError={() => {
                  const current = retries[m.id] || 0;
                  if (current < MAX_RETRIES && isHttpUrl(m.url)) {
                    setTimeout(() => attemptRetry(m.id), current * 1000);
                  } else {
                    markError(m.id);
                  }
                }}
                className={`${mediaClass} block`}
                style={{ 
                  display: "block",
                  width: isMobile ? "100%" : `${constrainedWidth}px`,
                  height: `${constrainedHeight}px`,
                  objectFit: "cover",
                  maxWidth: `${maxWidth}px`,
                  maxHeight: `${maxHeight}px`
                }}
              />
              <div className="absolute top-2 right-2 opacity-95">
                <div className="bg-white/85 rounded-full p-1.5">
                  <ImageIcon className="w-4 h-4" />
                </div>
              </div>
            </div>
          </MediaFrame>
        </motion.div>
      );
    }

    // DIRECT VIDEO FILE
    if (type === "video") {
      return (
        <motion.div
          key={`${m.id}-${itemAnimation}-${itemFrameStyle}-${constrainedWidth}-${constrainedHeight}`}
          initial="hidden"
          animate="visible"
          variants={animationVariant}
          custom={index}
          whileHover={{ scale: 1.02 }}
          transition={{ delay: index * 0.1 }}
        >
          <MediaFrame 
            frameType={itemFrameStyle} 
            index={index}
            className="gallery-item relative cursor-pointer bg-black"
          >
            <div
              onClick={() => setLightboxIndex(index)}
              onKeyDown={(e) => e.key === "Enter" && setLightboxIndex(index)}
              role="button"
              tabIndex={0}
              aria-label={`Open video ${index + 1}`}
              className="relative w-full h-full"
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
                style={{ 
                  display: "block",
                  width: isMobile ? "100%" : `${constrainedWidth}px`,
                  height: `${constrainedHeight}px`,
                  objectFit: "cover",
                  maxWidth: `${maxWidth}px`,
                  maxHeight: `${maxHeight}px`
                }}
              />
              <div className="absolute top-2 right-2 opacity-95">
                <div className="bg-white/85 rounded-full p-1.5">
                  <VideoIcon className="w-4 h-4" />
                </div>
              </div>
            </div>
          </MediaFrame>
        </motion.div>
      );
    }

    // EMBEDS: YouTube / Vimeo / Dailymotion / Twitch / Facebook - use iframe
    if (["youtube", "vimeo", "dailymotion", "twitch", "facebook"].includes(type)) {
      const embed = makeEmbedSrc(m);
      if (!embed) {
        return (
          <MediaFrame 
            key={m.id} 
            frameType={itemFrameStyle} 
            index={index}
            className="gallery-item relative p-6 h-40 text-center"
          >
            <AlertCircle className="w-8 h-8 text-red-500 mx-auto" />
            <p className="text-sm text-red-600 mt-2">Invalid embed link</p>
          </MediaFrame>
        );
      }
      return (
        <motion.div
          key={`${m.id}-${itemAnimation}-${itemFrameStyle}-${constrainedWidth}-${constrainedHeight}`}
          initial="hidden"
          animate="visible"
          variants={animationVariant}
          custom={index}
          whileHover={{ scale: 1.02 }}
          transition={{ delay: index * 0.1 }}
        >
          <MediaFrame 
            frameType={itemFrameStyle} 
            index={index}
            className="gallery-item relative cursor-pointer bg-black"
          >
            <div
              onClick={() => setLightboxIndex(index)}
              onKeyDown={(e) => e.key === "Enter" && setLightboxIndex(index)}
              role="button"
              tabIndex={0}
              aria-label={`Open embedded media ${index + 1}`}
              className="relative w-full h-full"
            >
              {loadingOverlay}
              <div className="w-full h-full">
                <iframe
                  src={embed}
                  title={m.alt || `embedded-${index}`}
                  allow="autoplay; encrypted-media; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full rounded-lg border-0"
                  style={{ 
                    width: isMobile ? "100%" : `${constrainedWidth}px`,
                    height: `${constrainedHeight}px`,
                    maxWidth: `${maxWidth}px`,
                    maxHeight: `${maxHeight}px`
                  }}
                  onLoad={() => markLoaded(m.id)}
                />
              </div>
              <div className="absolute top-2 right-2 opacity-95">
                <div className="bg-white/85 rounded-full p-1.5">
                  <VideoIcon className="w-4 h-4" />
                </div>
              </div>
            </div>
          </MediaFrame>
        </motion.div>
      );
    }

    return null;
  };

  // Render layout group
  const renderLayoutGroup = (layoutKey: string, groupMedia: MediaItem[]) => {
    const cssLayoutClass = layoutClassMap[layoutKey as keyof typeof layoutClassMap] || layoutClassMap.grid;
    
    // Special handling for slideshow layout
    if (layoutKey === "slideshow") {
      const currentIndex = slideshowIndexes[layoutKey] || 0;
      const currentItem = groupMedia[currentIndex];
      
      if (!currentItem) return null;
      
      return (
        <div key={layoutKey} className="mb-8">
          <motion.div 
            className="slideshow-container relative w-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {renderMediaItem(currentItem, media.findIndex(m => m.id === currentItem.id), layoutKey)}
            
            {/* Slideshow indicators */}
            {groupMedia.length > 1 && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {groupMedia.map((_, idx) => (
                  <button
                    key={idx}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      idx === currentIndex ? 'bg-white' : 'bg-white/50'
                    }`}
                    onClick={() => setSlideshowIndexes(prev => ({ ...prev, [layoutKey]: idx }))}
                  />
                ))}
              </div>
            )}
          </motion.div>
        </div>
      );
    }
    
    return (
      <div key={layoutKey} className="mb-8">
        <div className={`media-gallery ${cssLayoutClass}`}>
          {groupMedia.map((item) => {
            const globalIndex = media.findIndex(m => m.id === item.id);
            return renderMediaItem(item, globalIndex, layoutKey);
          })}
        </div>
      </div>
    );
  };

  // Render lightbox modal
  const renderLightbox = () => {
    if (lightboxIndex === null || !media[lightboxIndex]) return null;
    const m = media[lightboxIndex];
    const type = detectType(m.url);
    const src = cacheBusted(m.url, retries[m.id] || 0);

    const renderMediaContent = () => {
      if (type === "image") {
        return (
          <img
            src={src}
            alt={m.alt || `lightbox-${lightboxIndex}`}
            className="max-w-full max-h-full object-contain rounded-lg"
          />
        );
      }
      if (type === "video") {
        return (
          <video 
            src={src} 
            controls 
            autoPlay 
            muted={muted} 
            className="max-w-full max-h-full object-contain rounded-lg" 
          />
        );
      }
      if (["youtube", "vimeo", "dailymotion", "twitch", "facebook"].includes(type)) {
        const embed = makeEmbedSrc(m);
        if (!embed) return <div className="p-8 text-white">Invalid embed link</div>;
        return (
          <iframe 
            src={embed + "&autoplay=1"} 
            allow="autoplay; encrypted-media; picture-in-picture" 
            allowFullScreen
            title={m.alt || "Embedded media"} 
            className="w-full h-[70vh] max-w-4xl rounded-lg border-0" 
          />
        );
      }
      return <div className="p-8 text-white">Unsupported media type</div>;
    };

    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          onClick={() => setLightboxIndex(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] w-full flex items-center justify-center">
            <button
              onClick={() => setLightboxIndex(null)}
              className="absolute top-2 right-2 z-10 bg-white/40 hover:bg-white/60 
                        hover:shadow-lg hover:shadow-cyan-300 
                        rounded-full p-2 transition-all duration-300"
            >
              <XIcon className="w-6 h-6 text-white" />
            </button>

            {media.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setLightboxIndex((i) => (i === null ? null : (i - 1 + media.length) % media.length));
                  }}
                  className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white/10 hover:bg-white/50 hover:shadow-lg hover:shadow-cyan-300 rounded-full p-2 transition-colors"
                >
                  <ChevronLeft className="w-6 h-6 text-white" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setLightboxIndex((i) => (i === null ? null : (i + 1) % media.length));
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white/10 hover:bg-white/50 hover:shadow-lg hover:shadow-cyan-300 rounded-full p-2 transition-colors"
                >
                  <ChevronRight className="w-6 h-6 text-white" />
                </button>
              </>
            )}

            <div
              onClick={(e) => e.stopPropagation()}
              className="w-full h-full flex items-center justify-center"
            >
              {renderMediaContent()}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    );
  };

  // editing empty state
  if (isEditing && media.length === 0) {
    return (
      <div className="flex items-center justify-center h-40 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
        <div className="text-center">
          <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-500">No media items added yet</p>
          <p className="text-sm text-gray-400">Add images, videos, or GIFs to get started</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full relative">
      <MediaGalleryStyles />
      
      {/* Render each layout group in specified order */}
      {orderedLayoutGroups.map(layoutKey => (
        mediaGroups[layoutKey] && mediaGroups[layoutKey].length > 0 && 
        renderLayoutGroup(layoutKey, mediaGroups[layoutKey])
      ))}

      {renderLightbox()}
    </div>
  );
};

export default EnhancedMediaGallery;