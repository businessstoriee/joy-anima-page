import React from 'react';
import { MediaItem } from '@/types/greeting';
import { motion } from 'framer-motion';

interface MediaLayoutRendererProps {
  media: MediaItem[];
  layout: string;
  isEditing?: boolean;
  onMediaChange?: (media: MediaItem[]) => void;
  className?: string;
}

const MediaLayoutRenderer = ({
  media,
  layout,
  isEditing = false,
  onMediaChange,
  className = ''
}: MediaLayoutRendererProps) => {
  const handleTextOverlaysChange = (mediaId: string, overlays: any[]) => {
    if (!onMediaChange) return;
    
    const updatedMedia = media.map(item =>
      item.id === mediaId ? { ...item, textOverlays: overlays } : item
    );
    onMediaChange(updatedMedia);
  };

  const getLayoutClasses = () => {
    const baseClasses = 'gap-4 p-4';
    switch (layout) {
      case 'grid': return `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 ${baseClasses}`;
      case 'masonry': return `columns-1 sm:columns-2 lg:columns-3 space-y-4 ${baseClasses}`;
      case 'carousel': return `flex overflow-x-auto snap-x snap-mandatory space-x-4 pb-4 ${baseClasses}`;
      case 'stack': return `grid grid-cols-1 ${baseClasses}`;
      case 'collage': return `relative min-h-[500px] ${baseClasses}`;
      case 'mosaic': return `grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 ${baseClasses}`;
      case 'slideshow': return `relative overflow-hidden h-96 ${baseClasses}`;
      case 'polaroid': return `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-8 ${baseClasses}`;
      case 'magazine': return `grid grid-cols-12 gap-4 ${baseClasses}`;
      case 'gallery': return `grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 ${baseClasses}`;
      case 'timeline': return `flex flex-col space-y-8 ${baseClasses}`;
      case 'hexagon': return `flex flex-wrap gap-4 justify-center ${baseClasses}`;
      case 'circular': return `relative w-full h-96 ${baseClasses}`;
      case 'spiral': return `relative w-full h-[500px] ${baseClasses}`;
      case 'wave': return `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ${baseClasses}`;
      default: return `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 ${baseClasses}`;
    }
  };

  const getMediaItemStyles = (item: MediaItem, index: number) => {
    const baseStyles = { width: item.position?.width || 300, height: item.position?.height || 200 };
    
    switch (layout) {
      case 'collage':
        return {
          position: 'absolute' as const,
          left: `${(index * 15) % 70}%`,
          top: `${(index * 20) % 60}%`,
          zIndex: item.priority || index,
          transform: `rotate(${(index % 2 === 0 ? 1 : -1) * (Math.random() * 10 - 5)}deg)`,
          ...baseStyles
        };
      
      case 'polaroid':
        return {
          width: '100%',
          maxWidth: '280px',
          aspectRatio: '4/3',
          padding: '16px 16px 40px 16px',
          backgroundColor: 'white',
          boxShadow: '0 8px 16px rgba(0,0,0,0.15)',
          transform: `rotate(${(index % 2 === 0 ? 1 : -1) * (Math.random() * 8 - 4)}deg)`,
          borderRadius: '4px'
        };
      
      case 'magazine':
        const columnSpans = [4, 6, 8, 5, 7];
        return {
          gridColumn: `span ${columnSpans[index % columnSpans.length]}`,
          width: '100%',
          aspectRatio: index % 3 === 0 ? '16/9' : '4/3'
        };
      
      case 'hexagon':
        return {
          width: '200px',
          height: '200px',
          clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
          objectFit: 'cover' as const
        };
      
      case 'circular':
        const angle = (index * (360 / media.length)) * (Math.PI / 180);
        const radius = 150;
        return {
          position: 'absolute' as const,
          left: `calc(50% + ${Math.cos(angle) * radius}px - 75px)`,
          top: `calc(50% + ${Math.sin(angle) * radius}px - 75px)`,
          width: '150px',
          height: '150px',
          borderRadius: '50%',
          objectFit: 'cover' as const
        };
      
      case 'spiral':
        const spiralAngle = index * 0.5;
        const spiralRadius = index * 15 + 50;
        return {
          position: 'absolute' as const,
          left: `calc(50% + ${Math.cos(spiralAngle) * spiralRadius}px - 60px)`,
          top: `calc(50% + ${Math.sin(spiralAngle) * spiralRadius}px - 60px)`,
          width: '120px',
          height: '120px',
          borderRadius: '8px',
          transform: `rotate(${spiralAngle * 57.3}deg)`
        };
      
      case 'timeline':
        return {
          width: '100%',
          maxWidth: '400px',
          aspectRatio: '16/9',
          marginLeft: index % 2 === 0 ? '0' : 'auto',
          marginRight: index % 2 === 0 ? 'auto' : '0'
        };
      
      case 'wave':
        return {
          width: '100%',
          aspectRatio: '4/3',
          transform: `translateY(${Math.sin(index * 0.5) * 20}px)`
        };
      
      default:
        return {
          width: '100%',
          aspectRatio: '16/9',
          objectFit: 'cover' as const
        };
    }
  };

  const renderMediaItem = (item: MediaItem, index: number) => {
    const itemStyles = getMediaItemStyles(item, index);
    
    return (
      <motion.div
        key={item.id}
        className="relative group overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
        style={itemStyles}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: index * 0.1 }}
        whileHover={{ scale: 1.02 }}
      >
       
      </motion.div>
    );
  };

  return (
    <div className={`${getLayoutClasses()} ${className}`}>
      {media.map((item, index) => renderMediaItem(item, index))}
    </div>
  );
};

export default MediaLayoutRenderer;