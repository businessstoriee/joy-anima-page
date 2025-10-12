// src/components/media/MediaItemCard.tsx
import React, { useMemo, useRef, useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Settings, Trash2, ArrowUp, ArrowDown, Upload, Link, X } from "lucide-react";
import MediaPreview from "./MediaPreview";
import MediaSettings from "./MediaSettings";
import { MediaItem } from "@/types/greeting";
import { frameStyles as globalFrameStyles } from "@/components/preview/MediaFrames";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { uploadMediaToSupabase } from "@/utils/supabase/uploadMedia";

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
  const [inputMode, setInputMode] = useState<'url' | 'file'>('url');
  const inputRef = useRef<HTMLInputElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isAutofocus, setIsAutofocus] = useState(false);
  const [lastBlobUrl, setLastBlobUrl] = useState<string | null>(null);
  const { toast } = useToast();

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
        if (inputMode === 'url') {
          inputRef.current?.focus();
        }
        // show subtle ring + pulse on focus
        setIsAutofocus(true);
        setTimeout(() => setIsAutofocus(false), 900);
      }, 80);
    }
  }, [active, inputMode]);

  // cleanup blob URL when component unmounts or URL changes
  useEffect(() => {
    return () => {
      if (lastBlobUrl) {
        URL.revokeObjectURL(lastBlobUrl);
      }
    };
  }, [lastBlobUrl]);

  // handle file selection and upload to Supabase
  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    // Process all selected files
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      await processFileUpload(file, i);
    }
  };

  const processFileUpload = async (file: File, fileIndex: number) => {

    console.log('📁 File selected:', { name: file.name, type: file.type, size: file.size });

    // validate file type
    const isValidImage = item.type === 'image' && file.type.startsWith('image/');
    const isValidVideo = item.type === 'video' && file.type.startsWith('video/');
    
    if (!isValidImage && !isValidVideo) {
      toast({
        title: "Invalid file type",
        description: `Please select a ${item.type} file. Supported formats: ${item.type === 'image' ? 'JPG, PNG, GIF, WebP, HEIC, BMP' : 'MP4, WebM, MOV, AVI'}`,
        variant: "destructive"
      });
      return;
    }

    // Show loading toast
    toast({
      title: "Uploading...",
      description: `Uploading ${item.type} to cloud storage...`
    });

    // cleanup previous blob URL
    if (lastBlobUrl) {
      URL.revokeObjectURL(lastBlobUrl);
      setLastBlobUrl(null);
    }

    try {
      // Determine upload type (treat GIF as image)
      const uploadType = (item.type === 'gif' || item.type === 'image') ? 'image' : 'video';
      console.log('🎯 Upload type determined:', uploadType);
      
      // Upload to Supabase Storage immediately - no blob URL
      console.log('🚀 Starting Supabase upload...');
      const result = await uploadMediaToSupabase(file, uploadType);
      console.log('📊 Upload result:', result);

      if (result.success && result.url) {
        console.log('✅ Setting media URL:', result.url);
        // Set permanent Supabase URL
        updateMedia(index, "url", result.url);

        toast({
          title: "Upload successful!",
          description: `${item.type === 'image' ? 'Image' : 'Video'} has been uploaded: ${file.name}`
        });
      } else {
        console.error('❌ Upload failed:', result.error);
        // Upload failed - show error and don't set any URL
        toast({
          title: "Upload failed",
          description: result.error || "Failed to upload to cloud storage. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error: any) {
      console.error('❌ Upload exception:', error);
      toast({
        title: "Upload error",
        description: error.message || "An error occurred during upload. Please try again.",
        variant: "destructive"
      });
    }
  };

  // handle URL input change
  const handleUrlChange = (url: string) => {
    // cleanup blob URL if switching from file to URL
    if (lastBlobUrl && url !== lastBlobUrl) {
      URL.revokeObjectURL(lastBlobUrl);
      setLastBlobUrl(null);
    }
    updateMedia(index, "url", url);
  };

  // clear current media
  const handleClearMedia = () => {
    if (lastBlobUrl) {
      URL.revokeObjectURL(lastBlobUrl);
      setLastBlobUrl(null);
    }
    updateMedia(index, "url", "");
    setInputMode('url');
    toast({
      title: "Media cleared",
      description: "Media has been removed from this slot."
    });
  };

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
      

        {/* Input Mode Toggle & Controls */}
        <div className="space-y-3">
          {/* Mode Toggle Buttons */}
          <div className="flex gap-2">
            <Button
              size="sm"
              variant={inputMode === 'url' ? 'default' : 'outline'}
              onClick={() => setInputMode('url')}
              className="flex-1 gap-2 h-8"
            >
              <Link className="h-3.5 w-3.5" />
              <span className="text-xs">URL</span>
            </Button>
            <Button
              size="sm"
              variant={inputMode === 'file' ? 'default' : 'outline'}
              onClick={() => setInputMode('file')}
              className="flex-1 gap-2 h-8"
            >
              <Upload className="h-3.5 w-3.5" />
              <span className="text-xs">Upload</span>
            </Button>
            {item.url && (
               <div>
              <Button
                size="sm"
                variant="outline"
                onClick={handleClearMedia}
                className="h-8 px-2"
              >
                <X className="h-3.5 w-3.5" />
              </Button>

  <div className="absolute bg-white/50 right-3 flex gap-0 sm:gap-1 z-10 rounded-xl shadow-xl">
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
</div>
          
        </div> 
            )}
            <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button className="text-red-500 flex-1 gap-2 h-8" variant='outline' onClick={() => removeMedia(index)} aria-label="Delete">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Delete</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          </div>

          {/* URL Input Mode */}
          {inputMode === 'url' && (
            <div className="space-y-2">
              <Input
                ref={inputRef}
                type="url"
                placeholder={`Enter ${item.type} URL`}
                value={item.url}
                onChange={(e) => handleUrlChange(e.target.value)}
                onFocus={() => setActive(index)}
                className={`text-sm break-all overflow-hidden text-ellipsis whitespace-nowrap ${isAutofocus ? "ring-2 ring-pink-400/40 animate-pulse" : ""}`}
              />
              {item.url && (
                <Badge variant="outline" className="text-xs">
                  URL: {item.url.length > 30 ? `${item.url.slice(0, 30)}...` : item.url}
                </Badge>
              )}
            </div>
          )}

          {/* File Upload Mode */}
          {inputMode === 'file' && (
            <div className="space-y-2">
              <div className="relative">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept={item.type === 'image' ? 'image/*' : 'video/*'}
                  multiple
                  onChange={handleFileSelect}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  onClick={() => setActive(index)}
                />
                <div className={`flex items-center justify-center gap-2 p-4 border-2 border-dashed rounded-lg transition-all ${
                  item.url 
                    ? 'border-primary bg-primary/5' 
                    : 'border-muted-foreground/25 bg-muted/20 hover:border-primary/50 hover:bg-primary/5'
                } ${isAutofocus ? "border-pink-400 bg-pink-50" : ""}`}>
                  <Upload className="h-5 w-5 text-muted-foreground" />
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">
                      {item.url 
                        ? `${item.type === 'image' ? 'Image' : 'Video'} uploaded`
                        : `Drop ${item.type} or click to browse`
                      }
                    </p>
                    <p className="text-xs text-muted-foreground/70">
                      {item.type === 'image' 
                        ? 'All image formats supported' 
                        : 'All video formats (max 30s)'}
                    </p>
                  </div>
                </div>
              </div>
              {item.url && lastBlobUrl && (
                <Badge variant="outline" className="text-xs">
                  File: Uploaded from device
                </Badge>
              )}
            </div>
          )}
        </div>

        <div className="mt-3 flex justify-center">
          {/* MediaPreview will use the current item state automatically */}
          <MediaPreview
            item={item}
            frameStyle={(item as any).frameStyle}
            animation={item.animation}
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