// src/components/media/AdvancedMediaUploader.tsx
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { MediaItem } from "@/types/greeting";
import MediaHeader from "./MediaHeader";
import EmptyMediaState from "./EmptyMediaState";
import MediaList from "./MediaList";
import GIFSearchWidget from "./GIFSearchWidget";

interface AdvancedMediaUploaderProps {
  media: MediaItem[];
  onChange: (media: MediaItem[]) => void;
  maxItems?: number;
}

const MAX_ITEMS = 20;

const AdvancedMediaUploader = ({ media, onChange, maxItems = MAX_ITEMS }: AdvancedMediaUploaderProps) => {
  const [activeMediaIndex, setActiveMediaIndex] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [showGifPicker, setShowGifPicker] = useState(false);

  // TRACK a single blank slot (index & type). Ensures we never create duplicate blanks.
  const [blankIndex, setBlankIndex] = useState<number | null>(null);
  const [blankType, setBlankType] = useState<"image" | "video" | null>(null);

  // transient index used to trigger replace animation
  const [replacedIndex, setReplacedIndex] = useState<number | null>(null);

  useEffect(() => {
    if (activeMediaIndex !== null && activeMediaIndex >= media.length) {
      setActiveMediaIndex(null);
    }

    if (blankIndex !== null && blankIndex >= media.length) {
      setBlankIndex(null);
      setBlankType(null);
    }
  }, [media.length, activeMediaIndex, blankIndex]);

  // create a new media item (blank image/video) or add gif payload
  const createMediaItem = (type: "image" | "video" | "gif", payload?: MediaItem) => {
    if (media.length >= maxItems) return;

    // GIF payload case (from picker)
    if (type === "gif" && payload) {
      const newMedia: MediaItem = {
        ...payload,
        id: payload.id || `${Date.now()}`,
        priority: media.length + 1,
        position: payload.position || { width: 300, height: 200 },
      };
      const updated = [...media, newMedia];
      onChange(updated);
      setActiveMediaIndex(updated.length - 1);

      // IMPORTANT: do NOT clear blankIndex/blankType here — keep any existing blank slot
      // so clicking image/video afterwards will focus the existing blank input.
      setTimeout(() => {
        document.getElementById(`media-item-${updated.length - 1}`)?.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }, 100);
      return;
    }

    // For image/video blank input
    const newMedia: MediaItem = {
      id: `${Date.now()}`,
      url: "",
      type,
      position: { width: 300, height: 200 },
      animation: "fade",
      priority: media.length + 1,
    };

    const updated = [...media, newMedia];
    onChange(updated);
    setActiveMediaIndex(updated.length - 1);
    setBlankIndex(updated.length - 1);
    if (type === "image" || type === "video") setBlankType(type);

    setTimeout(() => {
      document.getElementById(`media-item-${updated.length - 1}`)?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }, 100);
  };

  // wrapper for header/empty clicks for image/video
  // enforces: single blank input at a time; same-type blank -> focus; other-type blank -> replace
  const handleAddMedia = (type: "image" | "video") => {
    // always hide GIF picker when requesting image/video
    if (showGifPicker) setShowGifPicker(false);

    if (blankIndex !== null && blankType !== null && blankIndex < media.length) {
      // same type blank exists -> focus it
      if (blankType === type) {
        setActiveMediaIndex(blankIndex);
        setTimeout(() => document.getElementById(`media-item-${blankIndex}`)?.scrollIntoView({ behavior: "smooth", block: "nearest" }), 80);
        return;
      } else {
        // different type blank exists -> replace its type (keep same slot)
        const clone = [...media];
        clone[blankIndex] = {
          ...clone[blankIndex],
          type,
          url: "", // keep blank
          animation: "fade",
        };
        onChange(clone);
        // trigger a small replace animation for that index
        setReplacedIndex(blankIndex);
        setTimeout(() => setReplacedIndex(null), 700);

        setBlankType(type);
        setActiveMediaIndex(blankIndex);
        setTimeout(() => document.getElementById(`media-item-${blankIndex}`)?.scrollIntoView({ behavior: "smooth", block: "nearest" }), 80);
        return;
      }
    }

    // no blank tracked -> create new blank
    createMediaItem(type);
  };

  // Remove media and adjust blankIndex if needed
  const removeMedia = (index: number) => {
    const newMedia = media.filter((_, i) => i !== index);
    onChange(newMedia);

    if (activeMediaIndex === index) setActiveMediaIndex(null);
    else if (activeMediaIndex !== null && activeMediaIndex > index) setActiveMediaIndex(activeMediaIndex - 1);

    if (blankIndex !== null) {
      if (blankIndex === index) {
        setBlankIndex(null);
        setBlankType(null);
      } else if (blankIndex > index) {
        setBlankIndex(blankIndex - 1);
      }
    }
  };

  // updateMedia: if URL gets filled, clear blank tracking for that index
  const updateMedia = (index: number, field: keyof MediaItem, value: any) => {
    const newMedia = [...media];
    if (field === "position") newMedia[index] = { ...newMedia[index], position: { ...newMedia[index].position, ...value } };
    else newMedia[index] = { ...newMedia[index], [field]: value };

    onChange(newMedia);

    // If user filled the previously blank input -> clear blank tracking
    if (field === "url" && typeof value === "string" && value.trim() !== "" && blankIndex === index) {
      setBlankIndex(null);
      setBlankType(null);
    }
  };

  const moveMediaPriority = (index: number, direction: "up" | "down") => {
    const newMedia = [...media];
    const currentPriority = newMedia[index].priority;
    const targetPriority = direction === "up" ? currentPriority - 1 : currentPriority + 1;
    const targetIndex = newMedia.findIndex(m => m.priority === targetPriority);
    if (targetIndex !== -1) {
      newMedia[index].priority = targetPriority;
      newMedia[targetIndex].priority = currentPriority;
      newMedia.sort((a, b) => a.priority - b.priority);
      onChange(newMedia);
    }
  };

  const handleDragStart = (index: number) => { setIsDragging(true); setDragIndex(index); };
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault();
    if (dragIndex === null || dragIndex === index) return;
    const newMedia = [...media];
    const draggedItem = newMedia[dragIndex];
    newMedia.splice(dragIndex, 1);
    newMedia.splice(index, 0, draggedItem);
    newMedia.forEach((item, idx) => (item.priority = idx + 1));
    onChange(newMedia);
    setDragIndex(index);
  };
  const handleDragEnd = () => { setIsDragging(false); setDragIndex(null); };

  const usagePercentage = Math.round((media.length / maxItems) * 100);

  // Called when GIF selected from widget
  const onGifSelected = (payload: MediaItem) => {
    createMediaItem("gif", payload);
    setShowGifPicker(false);
  };

  return (
    <Card className="border border-pink-300 shadow-lg">
      <MediaHeader
        media={media}
        maxItems={maxItems}
        addMedia={(t) => handleAddMedia(t)}
        onGifClick={() => setShowGifPicker(true)}
        usagePercentage={usagePercentage}
        blankType={blankType} // so header can reflect blank presence
      />

      <CardContent className="space-y-3">
        {showGifPicker && media.length < maxItems && (
          <div className="pt-2">
            <GIFSearchWidget onGIFSelect={onGifSelected} />
          </div>
        )}

        {media.length === 0 ? (
          <EmptyMediaState addMedia={(t) => handleAddMedia(t)} openGifPicker={() => setShowGifPicker(true)} />
        ) : (
          <MediaList
            media={media}
            activeMediaIndex={activeMediaIndex}
            setActiveMediaIndex={setActiveMediaIndex}
            removeMedia={removeMedia}
            updateMedia={updateMedia}
            moveMediaPriority={moveMediaPriority}
            handleDragStart={handleDragStart}
            handleDragOver={handleDragOver}
            handleDragEnd={handleDragEnd}
            dragIndex={dragIndex}
            isDragging={isDragging}
            highlightIndex={replacedIndex} // used for replace animation
          />
        )}
      </CardContent>
    </Card>
  );
};

export default AdvancedMediaUploader;
