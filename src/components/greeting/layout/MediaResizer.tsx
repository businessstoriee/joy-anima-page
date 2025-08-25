import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Settings, RotateCcw, Maximize2, Minimize2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface MediaResizerProps {
  mediaId: string;
  width: number;
  height: number;
  onResize: (mediaId: string, width: number, height: number) => void;
  className?: string;
}

const MediaResizer = ({ mediaId, width, height, onResize, className }: MediaResizerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [tempWidth, setTempWidth] = useState(width);
  const [tempHeight, setTempHeight] = useState(height);

  const presetSizes = [
    { label: 'Small', width: 200, height: 150 },
    { label: 'Medium', width: 300, height: 200 },
    { label: 'Large', width: 400, height: 300 },
    { label: 'XL', width: 500, height: 375 },
    { label: 'Square S', width: 200, height: 200 },
    { label: 'Square M', width: 300, height: 300 },
    { label: 'Wide', width: 400, height: 225 },
    { label: 'Portrait', width: 225, height: 400 }
  ];

  const handleResize = () => {
    onResize(mediaId, tempWidth, tempHeight);
  };

  const handlePresetSize = (presetWidth: number, presetHeight: number) => {
    setTempWidth(presetWidth);
    setTempHeight(presetHeight);
    onResize(mediaId, presetWidth, presetHeight);
  };

  const resetToDefault = () => {
    const defaultWidth = 300;
    const defaultHeight = 200;
    setTempWidth(defaultWidth);
    setTempHeight(defaultHeight);
    onResize(mediaId, defaultWidth, defaultHeight);
  };

  const maintainAspectRatio = (newWidth: number) => {
    const aspectRatio = width / height;
    const newHeight = Math.round(newWidth / aspectRatio);
    setTempHeight(newHeight);
  };

  return (
    <div className={`relative ${className}`}>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="h-8 w-8 p-0 bg-background/80 backdrop-blur border-border/50 hover:bg-primary/10"
      >
        <Settings className="h-3 w-3" />
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-10 right-0 z-50"
          >
            <Card className="w-80 shadow-xl border-border/50 bg-background/95 backdrop-blur">
              <CardContent className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold flex items-center gap-2">
                    <Maximize2 className="h-4 w-4 text-primary" />
                    Resize Media
                  </h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={resetToDefault}
                    className="h-7 px-2 text-xs"
                  >
                    <RotateCcw className="h-3 w-3 mr-1" />
                    Reset
                  </Button>
                </div>

                <Separator />

                {/* Manual Size Controls */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Width (px)</Label>
                    <Input
                      type="number"
                      value={tempWidth}
                      onChange={(e) => {
                        const newWidth = parseInt(e.target.value) || 0;
                        setTempWidth(newWidth);
                        maintainAspectRatio(newWidth);
                      }}
                      onBlur={handleResize}
                      min={50}
                      max={800}
                      className="h-8 text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Height (px)</Label>
                    <Input
                      type="number"
                      value={tempHeight}
                      onChange={(e) => {
                        setTempHeight(parseInt(e.target.value) || 0);
                      }}
                      onBlur={handleResize}
                      min={50}
                      max={600}
                      className="h-8 text-xs"
                    />
                  </div>
                </div>

                <Separator />

                {/* Preset Sizes */}
                <div>
                  <Label className="text-xs text-muted-foreground mb-2 block">Quick Sizes</Label>
                  <div className="grid grid-cols-4 gap-1">
                    {presetSizes.map((preset) => (
                      <Button
                        key={preset.label}
                        variant="outline"
                        size="sm"
                        onClick={() => handlePresetSize(preset.width, preset.height)}
                        className="h-8 px-2 text-xs hover:bg-primary/10"
                        title={`${preset.width}x${preset.height}`}
                      >
                        {preset.label}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Current Info */}
                <div className="text-xs text-muted-foreground bg-muted/30 p-2 rounded text-center">
                  Current: {width}x{height}px
                  <br />
                  Ratio: {(width/height).toFixed(2)}:1
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MediaResizer;