import React from "react";
import { MediaItem } from "@/types/greeting";
import { validateUrl, getEmbedCode } from "./mediaUtils";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { animationVariants } from "@/types/animations";
import MediaFrame from "@/components/preview/MediaFrames";
import { useIsMobile } from "@/hooks/use-mobile";

interface MediaPreviewProps {
  item: MediaItem;
  width?: number | string;
  height?: number | string;
  frameStyle?: string;
  animation?: string;
}

const MAX_WIDTH = 500;
const MAX_HEIGHT = 400;

const numericToPx = (v: number | string | undefined, max?: number) => {
  if (v === undefined) return undefined;
  if (typeof v === "number") return `${max ? Math.min(v, max) : v}px`;
  const num = parseInt(v, 10);
  if (!isNaN(num) && max) return `${Math.min(num, max)}px`;
  return v;
};

const MediaPreview: React.FC<MediaPreviewProps> = ({
  item,
  width,
  height,
  frameStyle,
  animation,
}) => {
  const isMobile = useIsMobile(); // ✅ detect mobile

  // ✅ Use item properties directly, with props as fallback for explicit overrides
  const finalWidth = width ?? item.position?.width;
  const finalHeight = height ?? item.position?.height;
  const w = isMobile ? "100%" : numericToPx(finalWidth, MAX_WIDTH);
  const h = numericToPx(finalHeight, MAX_HEIGHT); // ✅ Always apply height, even on mobile

  // Get frame style from props, item, or default
  const currentFrameStyle = frameStyle || (item as any).frameStyle || 'classic';

  // Animation - use item animation first, then props, then default
  const animationKey = (item.animation || animation || 'fadeIn') as keyof typeof animationVariants;
  const resolvedAnimation = animationVariants[animationKey] || animationVariants.fadeIn;

  if (!item.url) {
    return (
      <motion.div
        initial="initial"
        animate="animate"
        variants={resolvedAnimation}
        style={{
          width: w,
          height: h,
          maxWidth: isMobile ? "100%" : `${MAX_WIDTH}px`,
          maxHeight: `${MAX_HEIGHT}px`, // ✅ Always apply max height constraint
          minHeight: h || "200px", // ✅ Ensure minimum height is maintained
        }}
      >
        <MediaFrame frameType={currentFrameStyle} index={0}>
          <Card className="p-3 bg-gray-50 text-gray-400 text-sm w-full h-full flex items-center justify-center">
            No {item.type} URL entered yet
          </Card>
        </MediaFrame>
      </motion.div>
    );
  }

  const valid = validateUrl(item.url);
  if (!valid) {
    return (
      <motion.div
        initial="initial"
        animate="animate"
        variants={resolvedAnimation}
        style={{
          width: w,
          height: h,
          maxWidth: isMobile ? "100%" : `${MAX_WIDTH}px`,
          maxHeight: `${MAX_HEIGHT}px`,
          minHeight: h || "200px",
        }}
      >
        <MediaFrame frameType={currentFrameStyle} index={0}>
          <Card className="p-3 bg-red-50 text-red-500 text-sm w-full h-full flex items-center justify-center">
            Invalid URL
          </Card>
        </MediaFrame>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={resolvedAnimation}
      style={{
        width: w,
        height: h,
        maxWidth: isMobile ? "100%" : `${MAX_WIDTH}px`,
        maxHeight: `${MAX_HEIGHT}px`,
        minHeight: h || "200px",
      }}
    >
      <MediaFrame frameType={currentFrameStyle} index={0}>
        {(item.type === "image" || item.type === "gif") && (
          <img
            src={item.url}
            alt="Preview"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        )}

        {item.type === "video" && item.url.includes("youtube") && (
          <div
            dangerouslySetInnerHTML={{ __html: getEmbedCode(item.url) }}
            className="w-full h-full"
            style={{ minHeight: h ?? undefined }}
          />
        )}

        {item.type === "video" && !item.url.includes("youtube") && (
          <video
            src={item.url}
            controls
            className="w-full h-full"
            style={{ objectFit: "cover" }}
          />
        )}
      </MediaFrame>
    </motion.div>
  );
};

export default MediaPreview;