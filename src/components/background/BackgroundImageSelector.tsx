import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Image, Upload, Link, Palette, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface BackgroundImageSelectorProps {
  backgroundImage?: string;
  onBackgroundImageChange: (image?: string) => void;
  className?: string;
}

const BackgroundImageSelector: React.FC<BackgroundImageSelectorProps> = ({
  backgroundImage,
  onBackgroundImageChange,
  className
}) => {
  const [imageUrl, setImageUrl] = useState(backgroundImage || '');
  const [isLoading, setIsLoading] = useState(false);

  // Predefined background patterns/images
  const presetBackgrounds = [
    {
      id: 'gradient-sunset',
      name: 'Sunset',
      url: 'linear-gradient(135deg, #ff6b6b, #ffd93d, #6bcf7f)',
      type: 'gradient'
    },
    {
      id: 'gradient-ocean',
      name: 'Ocean',
      url: 'linear-gradient(135deg, #667eea, #764ba2)',
      type: 'gradient'
    },
    {
      id: 'gradient-forest',
      name: 'Forest',
      url: 'linear-gradient(135deg, #134e5e, #71b280)',
      type: 'gradient'
    },
    {
      id: 'gradient-cosmic',
      name: 'Cosmic',
      url: 'linear-gradient(135deg, #667db6, #0082c8, #0082c8, #667db6)',
      type: 'gradient'
    },
    {
      id: 'pattern-dots',
      name: 'Dots',
      url: 'radial-gradient(circle, #ddd 1px, transparent 1px)',
      type: 'pattern'
    },
    {
      id: 'pattern-lines',
      name: 'Lines',
      url: 'repeating-linear-gradient(45deg, transparent, transparent 2px, #ddd 2px, #ddd 4px)',
      type: 'pattern'
    }
  ];

  const handleUrlSubmit = () => {
    if (imageUrl.trim()) {
      setIsLoading(true);
      // Test if the image loads
      const img = document.createElement('img');
      img.onload = () => {
        onBackgroundImageChange(imageUrl.trim());
        setIsLoading(false);
      };
      img.onerror = () => {
        setIsLoading(false);
        // Still set it, let the user see if it works
        onBackgroundImageChange(imageUrl.trim());
      };
      img.src = imageUrl.trim();
    }
  };

  const handlePresetSelect = (preset: typeof presetBackgrounds[0]) => {
    if (preset.type === 'gradient' || preset.type === 'pattern') {
      onBackgroundImageChange(preset.url);
      setImageUrl(preset.url);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        onBackgroundImageChange(dataUrl);
        setImageUrl(dataUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveBackground = () => {
    onBackgroundImageChange(undefined);
    setImageUrl('');
  };

  return (
    <Card className={`w-full ${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Image className="h-5 w-5 text-primary" />
          Background Image
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="url" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="url" className="text-xs">
              <Link className="h-3 w-3 mr-1" />
              URL
            </TabsTrigger>
            <TabsTrigger value="upload" className="text-xs">
              <Upload className="h-3 w-3 mr-1" />
              Upload
            </TabsTrigger>
            <TabsTrigger value="presets" className="text-xs">
              <Palette className="h-3 w-3 mr-1" />
              Presets
            </TabsTrigger>
          </TabsList>

          <TabsContent value="url" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="bg-url" className="text-sm font-medium">
                Image URL
              </Label>
              <div className="flex gap-2">
                <Input
                  id="bg-url"
                  type="url"
                  placeholder="Enter image URL..."
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="flex-1"
                />
                <Button
                  onClick={handleUrlSubmit}
                  variant="outline"
                  size="sm"
                  disabled={isLoading || !imageUrl.trim()}
                  className="px-3"
                >
                  {isLoading ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                  ) : (
                    'Apply'
                  )}
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="upload" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="bg-upload" className="text-sm font-medium">
                Upload Image
              </Label>
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
                <input
                  id="bg-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <label htmlFor="bg-upload" className="cursor-pointer">
                  <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Click to upload an image
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Supports JPG, PNG, GIF
                  </p>
                </label>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="presets" className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-2">
              {presetBackgrounds.map((preset) => (
                <Button
                  key={preset.id}
                  variant="outline"
                  className="h-16 p-2 relative overflow-hidden hover:scale-105 transition-transform"
                  onClick={() => handlePresetSelect(preset)}
                >
                  <div
                    className="absolute inset-1 rounded opacity-80"
                    style={{
                      background: preset.url,
                      backgroundSize: preset.type === 'pattern' ? '20px 20px' : 'cover'
                    }}
                  />
                  <span className="relative z-10 text-xs font-medium bg-white/90 px-2 py-1 rounded">
                    {preset.name}
                  </span>
                </Button>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <Separator className="my-4" />

        {/* Current Background Preview */}
        {backgroundImage && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Current Background</Label>
              <Button
                onClick={handleRemoveBackground}
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-destructive hover:text-destructive"
              >
                <Trash2 className="h-3 w-3 mr-1" />
                Remove
              </Button>
            </div>
            <div className="w-full h-20 rounded-lg border overflow-hidden">
              <div
                className="w-full h-full"
                style={{
                  background: backgroundImage.startsWith('linear-gradient') || backgroundImage.startsWith('radial-gradient') || backgroundImage.startsWith('repeating-linear-gradient')
                    ? backgroundImage
                    : `url(${backgroundImage})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BackgroundImageSelector;