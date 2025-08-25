// src/components/media/MediaList.tsx
import { AnimatePresence, motion } from "framer-motion";
import { MediaItem } from "@/types/greeting";
import MediaItemCard from "./MediaItemCard";

interface MediaListProps {
  media: MediaItem[];
  activeMediaIndex: number | null;
  setActiveMediaIndex: (index: number | null) => void;
  removeMedia: (index: number) => void;
  updateMedia: (index: number, field: keyof MediaItem, value: any) => void;
  moveMediaPriority: (index: number, direction: "up" | "down") => void;
  handleDragStart: (index: number) => void;
  handleDragOver: (e: React.DragEvent<HTMLDivElement>, index: number) => void;
  handleDragEnd: () => void;
  dragIndex: number | null;
  isDragging: boolean;
  highlightIndex?: number | null; // new: index to highlight (replace animation)
}

const MediaList = ({
  media,
  activeMediaIndex,
  setActiveMediaIndex,
  removeMedia,
  updateMedia,
  moveMediaPriority,
  handleDragStart,
  handleDragOver,
  handleDragEnd,
  dragIndex,
  isDragging,
  highlightIndex = null,
}: MediaListProps) => {
  return (
    <AnimatePresence>
      {media.map((item, index) => (
        <motion.div
          key={item.id}
          layout
          initial={{ opacity: 0, y: -10 }}
          animate={{
            opacity: 1,
            y: 0,
            scale: dragIndex === index ? 1.02 : 1,
            boxShadow:
              dragIndex === index
                ? "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
                : "none",
          }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          draggable
          onDragStart={() => handleDragStart(index)}
          onDragOver={(e) => handleDragOver(e, index)}
          onDragEnd={handleDragEnd}
          className={`relative ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
        >
          <MediaItemCard
            item={item}
            index={index}
            media={media}
            active={activeMediaIndex === index}
            setActive={(i) => setActiveMediaIndex(i)}
            removeMedia={removeMedia}
            updateMedia={updateMedia}
            moveMediaPriority={moveMediaPriority}
            handleDragStart={handleDragStart}
            handleDragOver={handleDragOver}
            handleDragEnd={handleDragEnd}
            isDragging={isDragging}
            dragIndex={dragIndex}
            highlight={highlightIndex === index} // new prop
          />
        </motion.div>
      ))}
    </AnimatePresence>
  );
};

export default MediaList;
