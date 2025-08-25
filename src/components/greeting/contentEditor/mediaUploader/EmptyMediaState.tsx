import { Button } from "@/components/ui/button";
import { Upload, Image, Video, FileImage } from "lucide-react";
import { motion } from "framer-motion";

interface EmptyMediaStateProps {
  addMedia: (type: "image" | "video" | "gif") => void;
  openGifPicker: () => void;
}

const EmptyMediaState = ({ addMedia, openGifPicker }: EmptyMediaStateProps) => (
  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-center py-8 rounded-lg border border-dashed border-border/50 bg-muted/20">
    <Upload className="h-8 w-8 mx-auto mb-2 opacity-50" />
    <p className="text-muted-foreground">No media content added yet</p>
    <p className="text-xs text-muted-foreground/70 mt-1 mb-3">Add images, videos, or GIFs to get started</p>
    <div className="flex flex-wrap gap-2 justify-center">
      <Button onClick={() => addMedia("image")} variant="outline" size="sm" className="gap-1 bg-primary/10 text-primary">
        <Image className="h-3.5 w-3.5 " /> Add Image
      </Button>
      <Button onClick={() => addMedia("video")} variant="outline" size="sm" className="gap-1 bg-primary/10 text-primary">
        <Video className="h-3.5 w-3.5" /> Add Video
      </Button>
      <Button onClick={() => openGifPicker()} variant="outline" size="sm" className="gap-1 bg-primary/10 text-primary">
        <FileImage className="h-3.5 w-3.5" /> Add GIF
      </Button>
    </div>
  </motion.div>
);

export default EmptyMediaState;
