import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { layoutStyles, layoutDescriptions } from '@/types/layouts';
import { animationOptions } from '@/types/animations';
import { ChevronDown, ChevronUp, Zap, Layout } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import LayoutGroupManager from './LayoutGroupManager';
import { MediaItem } from '@/types/greeting';

interface LayoutSelectorProps {
  layout: string;
  animationStyle: string;
  frameStyle?: string;
  mediaAnimation?: string;
  media?: MediaItem[];
  layoutGroupOrder?: string[];
  onLayoutChange: (layout: string) => void;
  onAnimationChange: (animation: string) => void;
  onFrameStyleChange?: (frame: string) => void;
  onMediaAnimationChange?: (animation: string) => void;
  onLayoutGroupOrderChange?: (order: string[]) => void;
}

const LayoutSelector = ({ 
  layout, 
  animationStyle,
  frameStyle,
  mediaAnimation = 'fade',
  media = [],
  layoutGroupOrder = [],
  onLayoutChange, 
  onAnimationChange,
  onFrameStyleChange,
  onMediaAnimationChange,
  onLayoutGroupOrderChange
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

  return (
    <Card className="border border-blue-500 shadow-xl bg-gradient-to-br from-white to-gray-50/50 dark:from-slate-900 dark:to-slate-800 dark:border-slate-700 dark:shadow-slate-900/50 overflow-hidden">
      
      <CardContent className="p-5 space-y-4">
        {/* Layout Selection */}
        <motion.div 
          initial={false}
          animate={{ height: 'auto' }}
          className="rounded-lg border border-gray-200 bg-white dark:border-slate-700 dark:bg-slate-900 overflow-hidden"
        >
          <button
            onClick={() => toggleSection('layout')}
            className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Layout className="h-4 w-4 text-purple-600 dark:text-purple-40" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 dark:text-gray-100">Photo Layout Design</h3>
                <small className="text-gray-500 dark:text-gray-400">Choose how your photos are arranged</small>
              </div>
            </div>
            {expandedSections.layout ? (
              <ChevronUp className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            ) : (
              <ChevronDown className="h-4 w-4 text-gray-500 dark:text-gray-400" />
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
                  <SelectTrigger className="w-full border-blue-300 dark:border-blue-600">
                    <SelectValue placeholder="Choose layout style" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px] dark:bg-slate-900 dark:border-slate-700">
                    {layoutStyles.map((style) => (
                      <SelectItem key={style.value} value={style.value}>
                        <div>
                          <div className="font-medium dark:text-slate-200">{style.label}</div>
                          <div className="text-xs text-muted-foreground mt-1 dark:text-slate-400">
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
                          ? "bg-blue-100 text-blue-700 border-blue-300 shadow-sm dark:bg-blue-900/50 dark:text-blue-300 dark:border-blue-600"
                          : "bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700 dark:hover:bg-slate-700"
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
          className="rounded-lg border border-gray-200 bg-white dark:border-slate-700 dark:bg-slate-900 overflow-hidden"
        >
          <button
            onClick={() => toggleSection('globalAnimation')}
            className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/50 rounded-lg">
                <Zap className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 dark:text-gray-100">Global Animation Style</h3>
                <small className="text-gray-500 dark:text-gray-400">Set the overall animation theme</small>
              </div>
            </div>
            {expandedSections.globalAnimation ? (
              <ChevronUp className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            ) : (
              <ChevronDown className="h-4 w-4 text-gray-500 dark:text-gray-400" />
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
                  <SelectTrigger className="w-full border-green-200 dark:border-green-600">
                    <SelectValue placeholder="Choose global animation" />
                  </SelectTrigger>
                  <SelectContent className="dark:bg-slate-900 dark:border-slate-700">
                    {animationOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-green-500 rounded-full" />
                          <span className="dark:text-slate-200">{option.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <div className="mt-3 flex flex-wrap gap-2">
                  {animationOptions.slice(0, 4).map((option) => (
                    <div
                      key={option.value}
                      className={cn(
                        "px-3 py-1.5 rounded-full text-xs cursor-pointer transition-all border",
                        animationStyle === option.value
                          ? "bg-green-100 text-green-700 border-green-300 shadow-sm dark:bg-green-900/50 dark:text-green-300 dark:border-green-600"
                          : "bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700 dark:hover:bg-slate-700"
                      )}
                      onClick={() => onAnimationChange(option.value)}
                    >
                      {option.label}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Layout Group Manager */}
        {media.length > 0 && onLayoutGroupOrderChange && (
          <LayoutGroupManager
            media={media}
            layoutGroupOrder={layoutGroupOrder}
            onLayoutGroupOrderChange={onLayoutGroupOrderChange}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default LayoutSelector;