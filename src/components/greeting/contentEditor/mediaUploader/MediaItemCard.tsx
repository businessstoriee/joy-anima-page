// src/components/media/MediaItemCard.tsx
import React, { useMemo, useRef, useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Settings, Trash2, ArrowUp, ArrowDown } from "lucide-react";
import MediaPreview from "./MediaPreview";
import MediaSettings from "./MediaSettings";
import { MediaItem } from "@/types/greeting";
import { frameStyles as globalFrameStyles } from "@/components/preview/MediaFrames";
import { motion } from "framer-motion";

interface MediaItemCardProps {
  item: MediaItem;
  index: number;
  media: MediaItem[];
  active: boolean;
  setActive: (index: number | null) => void;
  updateMedia: (index: number, field: keyof MediaItem, value: any) => void;
  removeMedia: (index: number) => void;
  moveMediaPriority: (index: number, direction: "up" | "down") => void;
  handleDragStart: (index: number) => void;
  handleDragOver: (e: React.DragEvent<HTMLDivElement>, index: number) => void;
  handleDragEnd: () => void;
  isDragging: boolean;
  dragIndex: number | null;
  frameStyleKey?: string;
  highlight?: boolean; // new: show replace animation
}

const MediaItemCard: React.FC<MediaItemCardProps> = ({
  item,
  index,
  active,
  media,
  setActive,
  updateMedia,
  removeMedia,
  moveMediaPriority,
  handleDragStart,
  handleDragOver,
  handleDragEnd,
  isDragging,
  dragIndex,
  frameStyleKey,
  highlight = false,
}) => {
  const [showSettings, setShowSettings] = React.useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isAutofocus, setIsAutofocus] = useState(false);

  // compute frame class from key if provided
  const frameClass = useMemo(() => {
    if (frameStyleKey && (globalFrameStyles as any)[frameStyleKey]) {
      return (globalFrameStyles as any)[frameStyleKey].className;
    }
    return "";
  }, [frameStyleKey]);

  // autofocus when this media item becomes active
  useEffect(() => {
    if (active) {
      setTimeout(() => {
        inputRef.current?.focus();
        // show subtle ring + pulse on focus
        setIsAutofocus(true);
        setTimeout(() => setIsAutofocus(false), 900);
      }, 80);
    }
  }, [active]);

  // replace animation variants
  const replaceVariants = {
    idle: { scale: 1, boxShadow: "none" },
    highlight: {
      scale: [1, 1.03, 1],
      boxShadow: ["0 0 0 rgba(0,0,0,0)", "0 10px 30px -10px rgba(219,39,119,0.25)", "0 0 0 rgba(0,0,0,0)"],
      transition: { duration: 0.7 },
    },
  };

  return (
    <motion.div
      variants={replaceVariants}
      initial="idle"
      animate={highlight ? "highlight" : "idle"}
      className={`w-full`}
    >
      <Card
        id={`media-item-${index}`}
        className={`p-3 relative transition-all border ${active ? "border-pink-500 shadow-md" : "border-pink-200 hover:border-pink-300"} ${isDragging && dragIndex === index ? "opacity-50" : ""}`}
        draggable
        onDragStart={() => handleDragStart(index)}
        onDragOver={(e) => handleDragOver(e, index)}
        onDragEnd={handleDragEnd}
      >
        {/* Toolbar */}
        <div className="absolute bg-white/90 right-3 flex gap-0 sm:gap-1 z-10 rounded-xl shadow-xl">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  className="p-2"
                  onClick={() => moveMediaPriority(index, "up")}
                  disabled={item.priority === 1}
                  aria-label="Move up"
                >
                  <ArrowUp className="w-4 h-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent>Move Up</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="p-2" onClick={() => moveMediaPriority(index, "down")} aria-label="Move down">
                  <ArrowDown className="w-4 h-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent>Move Down</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="p-2" onClick={() => setShowSettings((s) => !s)} aria-label="Settings">
                  <Settings className="w-4 h-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent>Settings</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="p-2 text-red-500" onClick={() => removeMedia(index)} aria-label="Delete">
                  <Trash2 className="w-4 h-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent>Delete</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {/* URL Input */}
        <Input
          ref={inputRef}
          type="url"
          placeholder={`Enter ${item.type} URL`}
          value={item.url}
          onChange={(e) => updateMedia(index, "url", e.target.value)}
          onFocus={() => setActive(index)}
          className={`text-sm break-all overflow-hidden text-ellipsis whitespace-nowrap ${isAutofocus ? "ring-2 ring-pink-400/40 animate-pulse" : ""}`}
        />

        <div className="mt-3 flex justify-center">
          {/* Pass explicit width/height and frameClass to MediaPreview */}
          <MediaPreview
            item={item}
            width={item.position?.width}
            height={item.position?.height}
            frameClass={frameClass}
          />
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <div className="mt-3">
            <MediaSettings item={item} index={index} updateMedia={updateMedia} />
          </div>
        )}
      </Card>
    </motion.div>
  );
};

export default MediaItemCard;
