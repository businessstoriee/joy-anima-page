// src/components/background/BackgroundImageUploader.tsx
import React, { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Link, Image as ImageIcon, X, Download, Palette, Sparkles, Upload } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { uploadMediaToSupabase } from "@/utils/supabase/uploadMedia";

interface BackgroundImageUploaderProps {
  currentImageUrl?: string | null;
  opacity?: number;
  onImageChange: (imageUrl: string | null) => void;
  onOpacityChange: (opacity: number) => void;
  className?: string;
}

const BackgroundImageUploader: React.FC<BackgroundImageUploaderProps> = ({
  currentImageUrl,
  opacity = 100,
  onImageChange,
  onOpacityChange,
  className = "",
}) => {
  const [imageUrl, setImageUrl] = useState<string>(currentImageUrl || "");
  const [isLoading, setIsLoading] = useState(false);
  const [inputMode, setInputMode] = useState<'url' | 'file'>('url');
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    setImageUrl(currentImageUrl || "");
  }, [currentImageUrl]);

  // Suggested background images (kept small)
  const suggestedImages = [
    {
      url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80",
      name: "Mountain Sunset",
      category: "Nature",
    },
    {
      url: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=1200&q=80",
      name: "Ocean Waves",
      category: "Nature",
    },
    {
      url: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200&q=80",
      name: "Gradient Abstract",
      category: "Abstract",
    },
  ];

  const handleUrlApply = (url: string) => {
    const trimmed = url?.trim();
    if (!trimmed) return;
    setImageUrl(trimmed);
    // parent will disable gradient (mutual exclusivity) — handled in BackgroundCustomizer
    onImageChange(trimmed);
    toast({
      title: "Background updated!",
      description: "Background image URL has been set.",
    });
  };

  const handleSuggestedImage = (url: string) => {
    setImageUrl(url);
    onImageChange(url);
    toast({
      title: "Background applied!",
      description: "Selected background image has been applied.",
    });
  };

  const handleRemoveImage = () => {
    setImageUrl("");
    onImageChange(null);
    toast({
      title: "Background removed",
      description: "Background image has been removed.",
    });
  };

  const handleOpacityChange = (value: number[]) => {
    onOpacityChange(value[0]);
  };

  // Handle file upload
  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    toast({
      title: "Uploading...",
      description: "Uploading background image to cloud storage..."
    });

    try {
      const result = await uploadMediaToSupabase(file, 'image');

      if (result.success && result.url) {
        setImageUrl(result.url);
        onImageChange(result.url);
        toast({
          title: "Upload successful!",
          description: "Background image has been uploaded."
        });
      } else {
        toast({
          title: "Upload failed",
          description: result.error || "Failed to upload background image.",
          variant: "destructive"
        });
      }
    } catch (error: any) {
      toast({
        title: "Upload error",
        description: error.message || "An error occurred during upload.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
      event.target.value = '';
    }
  };

  return (
    <div className={`w-full ${className}`}>

      <div className="space-y-2">
        {/* Animated preview + controls */}
        {/* <AnimatePresence initial={false}>
          {imageUrl ? (
            <motion.div
              key="preview"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.18 }}
              className="relative group"
            >
              <div className="relative overflow-hidden rounded-lg border-2 border-primary/20">
                <img
                  src={imageUrl}
                  alt="Background preview"
                  className="w-full h-32 object-cover"
                  style={{ opacity: (opacity ?? 100) / 100 }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-2 left-2 text-white text-sm font-medium">Current Background</div>

                <div className="absolute top-2 right-2 flex gap-2">
                  <Button
                    size="sm"
                    variant="destructive"
                    className="h-8 w-8 p-0 opacity-90"
                    onClick={handleRemoveImage}
                    aria-label="Remove background image"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence> */}

        {/* Opacity Control */}
        {imageUrl && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Opacity</Label>
              <Badge variant="outline">{opacity}%</Badge>
            </div>
            <Slider value={[opacity]} onValueChange={handleOpacityChange} max={100} min={10} step={5} className="w-full" />
          </div>
        )}

        {/* Mode Toggle */}
        <div className="flex gap-2 mb-2">
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
        </div>

        {/* URL Input Mode */}
        {inputMode === 'url' && (
          <div className="space-y-2">
            <Label className="text-sm font-medium">Enter Image URL</Label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Link className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input type="url" placeholder="https://example.com/image.jpg" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} className="pl-10" />
              </div>
              <Button onClick={() => handleUrlApply(imageUrl)} disabled={!imageUrl.trim() || isLoading} size="sm">
                Apply
              </Button>
            </div>
          </div>
        )}

        {/* File Upload Mode */}
        {inputMode === 'file' && (
          <div className="space-y-2">
            <Label className="text-sm font-medium">Upload Background Image</Label>
            <div className="relative">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                disabled={isLoading}
              />
              <div className={`flex items-center justify-center gap-2 p-4 border-2 border-dashed rounded-lg transition-all ${
                imageUrl 
                  ? 'border-primary bg-primary/5' 
                  : 'border-muted-foreground/25 bg-muted/20 hover:border-primary/50 hover:bg-primary/5'
              } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                <Upload className="h-5 w-5 text-muted-foreground" />
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">
                    {isLoading ? 'Uploading...' : imageUrl 
                      ? 'Background uploaded'
                      : 'Drop image or click to browse'
                    }
                  </p>
                  <p className="text-xs text-muted-foreground/70">
                    All image formats supported
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Suggested Images */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Label className="text-sm font-medium">Example Image Backgrounds</Label>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {suggestedImages.map((image) => (
              <motion.div
                key={image.url}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.12 }}
                className="relative group cursor-pointer overflow-hidden rounded-lg border-2 border-border hover:border-primary/50 transition-colors"
                onClick={() => handleSuggestedImage(image.url)}
              >
                <img src={image.url} alt={image.name} className="w-full h-20 object-cover group-hover:scale-105 transition-transform duration-200" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute bottom-1 left-1 right-1 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="font-medium truncate">{image.name}</div>
                  <Badge variant="secondary" className="text-xs mt-1">
                    {image.category}
                  </Badge>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BackgroundImageUploader;