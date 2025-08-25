import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { layoutStyles, animationStyles } from '@/types/eventTypes';
import { frameStyles } from '@/components/preview/MediaFrames';
import { mediaAnimations, getAnimationsByCategory } from '@/components/preview/MediaAnimations';
import { Palette, Sparkles, Camera, Play, ChevronDown, ChevronUp, Zap, Layout, ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface LayoutSelectorProps {
  layout: string;
  animationStyle: string;
  frameStyle?: string;
  mediaAnimation?: string;
  onLayoutChange: (layout: string) => void;
  onAnimationChange: (animation: string) => void;
  onFrameStyleChange?: (frame: string) => void;
  onMediaAnimationChange?: (animation: string) => void;
}

const LayoutSelector = ({ 
  layout, 
  animationStyle,
  frameStyle,
  mediaAnimation = 'fade',
  onLayoutChange, 
  onAnimationChange,
  onFrameStyleChange,
  onMediaAnimationChange
}: LayoutSelectorProps) => {
  const [expandedSections, setExpandedSections] = useState({
    layout: false,
    frames: false,
    mediaAnimations: false,
    globalAnimation: false
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const layoutDescriptions = {
    grid: 'Organized in a clean grid pattern',
    masonry: 'Pinterest-style staggered layout',
    carousel: 'Horizontal scrolling showcase',
    slideshow: 'Sequential image display',
    polaroid: 'Vintage photo style',
    gallery: 'Museum-style presentation',
    hexagon: 'Honeycomb pattern',
    circular: 'Radial arrangement',
    spiral: 'Swirling pattern',
    wave: 'Flowing arrangement'
  };

  const animationCategories = getAnimationsByCategory();

  return (
    <Card className="border border-blue-300 shadow-xl bg-gradient-to-br from-white to-gray-50/50 overflow-hidden">
      
      <CardContent className="p-5 space-y-4">
        {/* Layout Selection */}
        <motion.div 
          initial={false}
          animate={{ height: 'auto' }}
          className="rounded-lg border border-gray-200 bg-white overflow-hidden"
        >
          <button
            onClick={() => toggleSection('layout')}
            className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Layout className="h-4 w-4 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Photo Layout Design</h3>
                <small className="text-gray-500">Choose how your photos are arranged</small>
              </div>
            </div>
            {expandedSections.layout ? (
              <ChevronUp className="h-4 w-4 text-gray-500" />
            ) : (
              <ChevronDown className="h-4 w-4 text-gray-500" />
            )}
          </button>
          
          <AnimatePresence initial={false}>
            {expandedSections.layout && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="px-4 pb-4"
              >
                <Select value={layout} onValueChange={onLayoutChange}>
                  <SelectTrigger className="w-full border-blue-300 ">
                    <SelectValue placeholder="Choose layout style" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px]">
                    {layoutStyles.map((style) => (
                      <SelectItem key={style.value} value={style.value}>
                        <div>
                          <div className="font-medium">{style.label}</div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {layoutDescriptions[style.value as keyof typeof layoutDescriptions]}
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <div className="mt-3 grid grid-cols-3 gap-2">
                  {layoutStyles.slice(0, 6).map((style) => (
                    <div
                      key={style.value}
                      className={cn(
                        "p-2 rounded-md text-xs text-center cursor-pointer transition-all border",
                        layout === style.value
                          ? "bg-blue-100 text-blue-700 border-blue-300 shadow-sm"
                          : "bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200"
                      )}
                      onClick={() => onLayoutChange(style.value)}
                    >
                      {style.label}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>




        {/* Global Animation */}
        <motion.div 
          initial={false}
          animate={{ height: 'auto' }}
          className="rounded-lg border border-gray-200 bg-white overflow-hidden"
        >
          <button
            onClick={() => toggleSection('globalAnimation')}
            className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Zap className="h-4 w-4 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Global Animation Style</h3>
                <small className="text-gray-500">Set the overall animation theme</small>
              </div>
            </div>
            {expandedSections.globalAnimation ? (
              <ChevronUp className="h-4 w-4 text-gray-500" />
            ) : (
              <ChevronDown className="h-4 w-4 text-gray-500" />
            )}
          </button>
          
          <AnimatePresence initial={false}>
            {expandedSections.globalAnimation && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="px-4 pb-4"
              >
                <Select value={animationStyle} onValueChange={onAnimationChange}>
                  <SelectTrigger className="w-full border-green-200">
                    <SelectValue placeholder="Choose global animation" />
                  </SelectTrigger>
                  <SelectContent>
                    {animationStyles.map((style) => (
                      <SelectItem key={style.value} value={style.value}>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-green-500 rounded-full" />
                          <span>{style.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <div className="mt-3 flex flex-wrap gap-2">
                  {animationStyles.slice(0, 4).map((style) => (
                    <div
                      key={style.value}
                      className={cn(
                        "px-3 py-1.5 rounded-full text-xs cursor-pointer transition-all border",
                        animationStyle === style.value
                          ? "bg-green-100 text-green-700 border-green-300 shadow-sm"
                          : "bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200"
                      )}
                      onClick={() => onAnimationChange(style.value)}
                    >
                      {style.label}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </CardContent>
    </Card>
  );
};

export default LayoutSelector;