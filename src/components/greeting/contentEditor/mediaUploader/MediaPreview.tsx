import React from "react";
import { MediaItem } from "@/types/greeting";
import { validateUrl, getEmbedCode } from "./mediaUtils";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { frameStyles, animationVariants } from "@/types/styles";
import { useIsMobile } from "@/hooks/use-mobile"; // ✅ import hook

interface MediaPreviewProps {
  item: MediaItem;
  width?: number | string;
  height?: number | string;
  frameClass?: string;
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
  frameClass,
  animation,
}) => {
  const isMobile = useIsMobile(); // ✅ detect mobile

  // ✅ If mobile → fixed width/height (ignore dynamic sizing)
  const w = isMobile ? "100%" : numericToPx(width ?? item.position?.width, MAX_WIDTH);
  const h = isMobile ? "auto" : numericToPx(height ?? item.position?.height, MAX_HEIGHT);

  const Wrapper = motion.div;

  // Frame style
  const resolvedFrame =
    frameClass ||
    ((item as any).frameStyle &&
      frameStyles[(item as any).frameStyle as keyof typeof frameStyles]) ||
    "";

  // Animation
  const resolvedAnimation =
    animationVariants[item.animation as keyof typeof animationVariants] ||
    animationVariants[animation as keyof typeof animationVariants] ||
    animationVariants.fadeIn;

  if (!item.url) {
    return (
      <Wrapper
        initial="initial"
        animate="animate"
        variants={resolvedAnimation}
        style={{
          width: w,
          height: h,
          maxWidth: isMobile ? "100%" : `${MAX_WIDTH}px`,
          maxHeight: isMobile ? "none" : `${MAX_HEIGHT}px`,
        }}
        className={`${resolvedFrame} rounded-md overflow-hidden`}
      >
        <Card className="p-3 bg-gray-50 text-gray-400 text-sm w-full h-full flex items-center justify-center">
          No {item.type} URL entered yet
        </Card>
      </Wrapper>
    );
  }

  const valid = validateUrl(item.url);
  if (!valid) {
    return (
      <Wrapper
        initial="initial"
        animate="animate"
        variants={resolvedAnimation}
        style={{
          width: w,
          height: h,
          maxWidth: isMobile ? "100%" : `${MAX_WIDTH}px`,
          maxHeight: isMobile ? "none" : `${MAX_HEIGHT}px`,
        }}
        className={`${resolvedFrame} rounded-md overflow-hidden`}
      >
        <Card className="p-3 bg-red-50 text-red-500 text-sm w-full h-full flex items-center justify-center">
          Invalid URL
        </Card>
      </Wrapper>
    );
  }

  return (
    <Wrapper
      initial="initial"
      animate="animate"
      variants={resolvedAnimation}
      style={{
        width: w,
        height: h,
        maxWidth: isMobile ? "100%" : `${MAX_WIDTH}px`,
        maxHeight: isMobile ? "none" : `${MAX_HEIGHT}px`,
      }}
      className={`${resolvedFrame} rounded-md overflow-hidden`}
    >
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
    </Wrapper>
  );
};

export default MediaPreview;
