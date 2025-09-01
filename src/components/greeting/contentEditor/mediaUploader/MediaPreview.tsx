import React, { useMemo, useState, memo } from "react";
import { MediaItem } from "@/types/greeting";
import { validateUrl } from "./mediaUtils";
import { motion } from "framer-motion";
import { getAnimation } from "@/types/animations";
import MediaFrame from "@/components/preview/MediaFrames";
import { useIsMobile } from "@/hooks/use-mobile";

/** Props */
interface MediaPreviewProps {
  item: MediaItem;
  width?: number | string;
  height?: number | string;
  frameStyle?: string;
  animation?: string;
  objectFit?: "cover" | "contain" | "fill" | "none" | "scale-down";
}

/** Constants - unified responsive sizing */
const MAX_WIDTH_MOBILE = 250;
const MAX_HEIGHT_MOBILE = 200;
const MIN_WIDTH = 100;
const MIN_HEIGHT = 100;
const MAX_WIDTH_DESKTOP = 400;
const MAX_HEIGHT_DESKTOP = 350;
const DEFAULT_WIDTH = 300;
const DEFAULT_HEIGHT = 200;

/** Helpers */
const numericToPx = (
  v: number | string | undefined,
  max?: number,
  min?: number
) => {
  if (v == null) return undefined;
  if (typeof v === "number") {
    let value = v;
    if (max != null) value = Math.min(value, max);
    if (min != null) value = Math.max(value, min);
    return `${value}px`;
  }
  const num = parseInt(v, 10);
  if (!Number.isNaN(num)) {
    let value = num;
    if (max != null) value = Math.min(value, max);
    if (min != null) value = Math.max(value, min);
    return `${value}px`;
  }
  return v;
};

/** Video provider detection */
type Provider = "youtube" | "vimeo" | "dailymotion" | "direct" | "unknown";

const getVideoProvider = (url: string): Provider => {
  try {
    const u = new URL(url);
    const host = u.hostname.replace("www.", "").toLowerCase();

    if (host.includes("youtube.com") || host.includes("youtu.be")) return "youtube";
    if (host.includes("vimeo.com")) return "vimeo";
    if (host.includes("dailymotion.com") || host.includes("dai.ly")) return "dailymotion";

    // naive check for direct file extensions
    if (/\.(mp4|webm|ogg|ogv|mov|m4v)$/i.test(u.pathname)) return "direct";

    return "unknown";
  } catch {
    return "unknown";
  }
};

/** Build safe embed src for iframe providers */
const buildEmbedSrc = (url: string): string | null => {
  const provider = getVideoProvider(url);
  try {
    const u = new URL(url);

    if (provider === "youtube") {
      // support both youtube.com/watch?v= and youtu.be/<id>
      let id = "";
      if (u.hostname.includes("youtu.be")) {
        id = u.pathname.slice(1); // /VIDEO_ID
      } else {
        id = u.searchParams.get("v") || "";
        // also handle /shorts/ or /embed/ already
        if (!id && u.pathname.includes("/shorts/")) {
          id = u.pathname.split("/shorts/")[1];
        }
        if (!id && u.pathname.includes("/embed/")) {
          id = u.pathname.split("/embed/")[1];
        }
      }
      if (!id) return null;
      return `https://www.youtube.com/embed/${encodeURIComponent(id)}`;
    }

    if (provider === "vimeo") {
      // vimeo.com/<id>
      const parts = u.pathname.split("/").filter(Boolean);
      const id = parts[0];
      if (!id) return null;
      return `https://player.vimeo.com/video/${encodeURIComponent(id)}`;
    }

    if (provider === "dailymotion") {
      // dailymotion.com/video/<id> or dai.ly/<id>
      let id = "";
      if (u.hostname.includes("dai.ly")) {
        id = u.pathname.slice(1);
      } else {
        const parts = u.pathname.split("/").filter(Boolean);
        const idx = parts.indexOf("video");
        if (idx >= 0 && parts[idx + 1]) id = parts[idx + 1];
      }
      if (!id) return null;
      return `https://www.dailymotion.com/embed/video/${encodeURIComponent(id)}`;
    }

    return null;
  } catch {
    return null;
  }
};

const MediaPreviewComponent: React.FC<MediaPreviewProps> = ({
  item,
  width,
  height,
  frameStyle,
  animation,
  objectFit = "cover",
}) => {
  const isMobile = useIsMobile();

  // Prefer explicit width/height props, fallback to item.position, then defaults
  const finalWidth = width ?? item.position?.width ?? DEFAULT_WIDTH;
  const finalHeight = height ?? item.position?.height ?? DEFAULT_HEIGHT;

  const maxWidth = isMobile ? MAX_WIDTH_MOBILE : MAX_WIDTH_DESKTOP;
  const maxHeight = isMobile ? MAX_HEIGHT_MOBILE : MAX_HEIGHT_DESKTOP;

  // Apply responsive constraints properly
  const constrainedWidth = Math.min(Math.max(Number(finalWidth) || DEFAULT_WIDTH, MIN_WIDTH), maxWidth);
  const constrainedHeight = Math.min(Math.max(Number(finalHeight) || DEFAULT_HEIGHT, MIN_HEIGHT), maxHeight);

  const w = isMobile ? "100%" : `${constrainedWidth}px`;
  const h = `${constrainedHeight}px`;

  const commonStyle = useMemo<React.CSSProperties>(
    () => ({
      width: w,
      height: h,
      maxWidth: isMobile ? "100%" : `${maxWidth}px`,
      maxHeight: `${maxHeight}px`,
      minWidth: isMobile ? "100px" : `${MIN_WIDTH}px`,
      minHeight: `${MIN_HEIGHT}px`,
    }),
    [w, h, isMobile, maxWidth, maxHeight]
  );

  // Frame style resolution
  const currentFrameStyle = frameStyle || item.frameStyle || "classic";

  // Animation resolution - use centralized animation system
  const animationKey = item.animation || animation || "fadeIn";
  const resolvedAnimation = getAnimation(animationKey, "fadeIn");

  // Fit (object-fit) resolution
  const fit = objectFit || (item as any).objectFit || "cover";

  // Loading & error states
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [videoError, setVideoError] = useState(false);

  // Accessibility alt text
  const altText = (item as any).alt || `${item.type} preview`;

  // Video provider detection
  const videoProvider = item.type === "video" ? getVideoProvider(item.url) : null;
  const embedSrc = item.type === "video" ? buildEmbedSrc(item.url) : null;

  // Early no-URL state
  if (!item.url) {
    return (
      <motion.div initial="initial" animate="animate" 
        key={`${item.url}-${animationKey}-${currentFrameStyle}-${constrainedWidth}-${constrainedHeight}`}
        variants={resolvedAnimation} 
        style={commonStyle}>
        <MediaFrame frameType={currentFrameStyle} index={0}>
          <div className="p-3 bg-gray-50 text-gray-400 text-sm w-full h-full flex items-center justify-center rounded">
            No {item.type} URL entered yet
          </div>
        </MediaFrame>
      </motion.div>
    );
  }

  // Validate URL format
  const isValidUrl = validateUrl(item.url);
  if (!isValidUrl) {
    return (
      <motion.div initial="initial" animate="animate" 
        key={`${item.url}-${animationKey}-${currentFrameStyle}-${constrainedWidth}-${constrainedHeight}`}
        variants={resolvedAnimation} 
        style={commonStyle}>
        <MediaFrame frameType={currentFrameStyle} index={0}>
          <div className="p-3 bg-red-50 text-red-500 text-sm w-full h-full flex items-center justify-center rounded">
            Invalid URL
          </div>
        </MediaFrame>
      </motion.div>
    );
  }

  /** IMAGES / GIFS */
  if (item.type === "image" || item.type === "gif") {
    return (
      <motion.div initial="initial" animate="animate" 
        key={`${item.url}-${animationKey}-${currentFrameStyle}-${constrainedWidth}-${constrainedHeight}`}
        variants={resolvedAnimation} 
        style={commonStyle}>
        <MediaFrame frameType={currentFrameStyle} index={0}>
          <div className="w-full h-full relative">
            {!imgLoaded && !imgError && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-xs text-muted-foreground">
                Loading image…
              </div>
            )}
            {imgError && (
              <div className="absolute inset-0 flex items-center justify-center bg-red-50 text-red-500 text-sm">
                Failed to load image
              </div>
            )}
            {!imgError && (
              <img
                src={item.url}
                alt={altText}
                onLoad={() => setImgLoaded(true)}
                onError={() => setImgError(true)}
                style={{
                  width: w,
                  height: h,
                  objectFit: fit,
                  display: 'block'
                }}
                className={imgLoaded ? 'opacity-100' : 'opacity-0'}
              />
            )}
          </div>
        </MediaFrame>
      </motion.div>
    );
  }

  /** VIDEOS */
  if (item.type === "video") {
    // Iframe providers (safe embed with constructed src)
    if (videoProvider === "youtube" || videoProvider === "vimeo" || videoProvider === "dailymotion") {
      if (!embedSrc) {
        return (
        <motion.div initial="initial" animate="animate" 
          key={`${item.url}-${animationKey}-${currentFrameStyle}-${constrainedWidth}-${constrainedHeight}`}
          variants={resolvedAnimation} 
          style={commonStyle}>
          <MediaFrame frameType={currentFrameStyle} index={0}>
            <div className="p-3 bg-red-50 text-red-500 text-sm w-full h-full flex items-center justify-center rounded">
              Unsupported or invalid video URL
            </div>
          </MediaFrame>
        </motion.div>
        );
      }

      return (
        <motion.div initial="initial" animate="animate" 
          key={`${item.url}-${animationKey}-${currentFrameStyle}-${constrainedWidth}-${constrainedHeight}`}
          variants={resolvedAnimation} 
          style={commonStyle}>
          <MediaFrame frameType={currentFrameStyle} index={0}>
            <div className="w-full h-full">
              <iframe
                title={altText}
                src={embedSrc}
                  style={{
                    width: w,
                    height: h,
                    border: 0,
                    display: 'block'
                  }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </MediaFrame>
        </motion.div>
      );
    }

    // Direct video files
    if (videoProvider === "direct" || videoProvider === "unknown") {
      return (
        <motion.div initial="initial" animate="animate" 
          key={`${item.url}-${animationKey}-${currentFrameStyle}-${constrainedWidth}-${constrainedHeight}`}
          variants={resolvedAnimation} 
          style={commonStyle}>
          <MediaFrame frameType={currentFrameStyle} index={0}>
            <div className="w-full h-full relative">
              {videoError ? (
                <div className="absolute inset-0 flex items-center justify-center bg-red-50 text-red-500 text-sm">
                  Failed to load video
                </div>
              ) : (
                <video
                  src={item.url}
                  controls
                  style={{
                    width: w,
                    height: h,
                    objectFit: fit,
                    display: 'block'
                  }}
                  onError={() => setVideoError(true)}
                  preload="metadata"
                />
              )}
            </div>
          </MediaFrame>
        </motion.div>
      );
    }
  }

  /** Fallback */
  return (
      <motion.div initial="initial" animate="animate" 
        key={`${item.url}-${animationKey}-${currentFrameStyle}-${constrainedWidth}-${constrainedHeight}`}
        variants={resolvedAnimation} 
        style={commonStyle}>
        <MediaFrame frameType={currentFrameStyle} index={0}>
          <div className="p-3 bg-gray-50 text-gray-500 text-sm w-full h-full flex items-center justify-center rounded">
            Unsupported media type
          </div>
        </MediaFrame>
      </motion.div>
  );
};

export default memo(MediaPreviewComponent);