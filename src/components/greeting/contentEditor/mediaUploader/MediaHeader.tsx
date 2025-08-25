// src/components/media/MediaHeader.tsx
import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Image, Video, FileImage } from "lucide-react";
import { MediaItem } from "@/types/greeting";
import { cn } from '@/lib/utils';

interface MediaHeaderProps {
  media: MediaItem[];
  maxItems: number;
  addMedia: (type: "image" | "video") => void;
  onGifClick: () => void;
  usagePercentage: number;
  blankType?: "image" | "video" | null;
}

const MediaHeader = ({ media, maxItems, addMedia, onGifClick, usagePercentage, blankType = null }: MediaHeaderProps) => {
  const limitReached = media.length >= maxItems;

  // per-type "entered" status (has at least one item of that type with a non-empty url)
  const hasEnteredImage = media.some(m => m.type === 'image' && typeof m.url === 'string' && m.url.trim() !== '');
  const hasEnteredVideo = media.some(m => m.type === 'video' && typeof m.url === 'string' && m.url.trim() !== '');
  const hasEnteredGif = media.some(m => m.type === 'gif' && typeof m.url === 'string' && m.url.trim() !== '');

  // treat a blank slot of that type as "active" for header visual
  const imageActive = hasEnteredImage || blankType === "image";
  const videoActive = hasEnteredVideo || blankType === "video";
  const gifActive = hasEnteredGif; // gifs don't have blank "url" behaviour here

  const classFor = (active: boolean) =>
    active ? "h-8 px-3 bg-primary/10 text-primary border-primary" : "h-8 px-3 bg-transparent text-muted-foreground border-border";

  return (
    <div className="p-6 space-y-4">
      <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-2 xs:gap-4">
        <div className="flex items-center justify-between ">
        <div className="flex items-center gap-2 min-w-0">
          <div className="relative shrink-0">
            <Image className="h-4 w-4 text-purple-500" />
            <Video className="h-3 w-3 absolute -bottom-1 -right-1 bg-background rounded-full p-0.5" />
          </div>
          <span className="text-sm font-medium truncate">Media Content</span>
          <Badge className={`shrink-0 ml-1 ${limitReached ? "bg-destructive/10 text-destructive" : "bg-primary/10 text-primary"}`}>
            {media.length}/{maxItems}
          </Badge>
        </div>
<div className="block md:hidden">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={() => { if (!limitReached) onGifClick(); }}
                  disabled={limitReached}
                  size="sm"
                  variant={
                    media.length >= maxItems ? "outline" : 
                    media.length === 0 ? "default" : "outline"
                  }
                  // className={cn(
                  //   "gap-1 min-w-[100px] transition-all duration-300 font-medium",
                  //   media.length === 0 ? "h-8 w-8 p-0" : classFor(gifActive)
                  // )}
                   className={cn(
                          "gap-1 min-w-[100px] transition-all duration-300 font-medium animate",
                          media.length === 0 ? "" : media.length >= maxItems ? "bg-destructive/10 text-destructive border-destructive" : "bg-primary/10 text-primary border-primary"
                        )}
                >
                  <FileImage className="h-3.5 w-3.5" />
                  <span className="truncate">{gifActive ? "Add More GIF" : "Add GIF"}</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">{limitReached ? "Maximum media limit reached" : gifActive ? "Add another GIF" : "Add first GIF"}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          </div>
</div>
        <div className="flex gap-2 justify-end xs:justify-normal">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={() => addMedia("image")}
                  disabled={limitReached}
                  size="sm"
                  variant={
                    media.length >= maxItems ? "outline" : 
                    media.length === 0 ? "default" : "outline"
                  }
                  
                   className={cn(
                          "gap-1 min-w-[100px] transition-all duration-300 font-medium animate",
                          media.length === 0 ? "" : media.length >= maxItems ? "bg-destructive/10 text-destructive border-destructive" : "bg-primary/10 text-primary border-primary"
                        )}
                >
                  <Image className="h-3.5 w-3.5" />
                  <span className="truncate">{imageActive ? "Add More Image" : "Add Image"}</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">{limitReached ? "Maximum media limit reached" : imageActive ? "Add another image" : "Add first image"}</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={() => addMedia("video")}
                  disabled={limitReached}
                  size="sm"
                 variant={
                    media.length >= maxItems ? "outline" : 
                    media.length === 0 ? "default" : "outline"
                  }
                  className={cn(
                          "gap-1 min-w-[100px] transition-all duration-300 font-medium animate",
                          media.length === 0 ? "" : media.length >= maxItems ? "bg-destructive/10 text-destructive border-destructive" : "bg-primary/10 text-primary border-primary"
                        )}
                >
                  <Video className="h-3.5 w-3.5" />
                  <span className="truncate">{videoActive ? "Add More Video" : "Add Video"}</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">{limitReached ? "Maximum media limit reached" : videoActive ? "Add another video" : "Add first video"}</TooltipContent>
            </Tooltip>
          </TooltipProvider>

<div className="hidden md:block">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={() => { if (!limitReached) onGifClick(); }}
                  disabled={limitReached}
                  size="sm"
                  variant={
                    media.length >= maxItems ? "outline" : 
                    media.length === 0 ? "default" : "outline"
                  }
                  // className={cn(
                  //   "gap-1 min-w-[100px] transition-all duration-300 font-medium",
                  //   media.length === 0 ? "h-8 w-8 p-0" : classFor(gifActive)
                  // )}
                   className={cn(
                          "gap-1 min-w-[100px] transition-all duration-300 font-medium animate",
                          media.length === 0 ? "" : media.length >= maxItems ? "bg-destructive/10 text-destructive border-destructive" : "bg-primary/10 text-primary border-primary"
                        )}
                >
                  <FileImage className="h-3.5 w-3.5" />
                  <span className="truncate">{gifActive ? "Add More GIF" : "Add GIF"}</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">{limitReached ? "Maximum media limit reached" : gifActive ? "Add another GIF" : "Add first GIF"}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          </div>
        </div>
      </div>

      <div>
        <Progress value={usagePercentage} className="h-2" />
        <div className="flex justify-between text-xs text-muted-foreground mt-1">
          <span>{media.length > 0 ? `${media.length} item${media.length !== 1 ? "s" : ""} added` : "No media added yet"}</span>
          {limitReached && <span className="text-destructive">Limit reached</span>}
        </div>
      </div>
    </div>
  );
};

export default MediaHeader;
