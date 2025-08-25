import React, { useState, useCallback } from 'react';
import { GreetingFormData, MediaItem } from '@/types/greeting';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import Draggable from 'react-draggable';
import { ResizableBox } from 'react-resizable';
import { Grip, X, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { frameStyles } from './MediaFrames';
import 'react-resizable/css/styles.css';

interface Props {
  greetingData: GreetingFormData;
  isEditing?: boolean;
  onMediaChange?: (media: MediaItem[]) => void;
}

const DraggableMediaGallery: React.FC<Props> = ({ 
  greetingData, 
  isEditing = false, 
  onMediaChange 
}) => {
  const [selectedMedia, setSelectedMedia] = useState<string | null>(null);

  const handleDrag = useCallback((id: string, data: { x: number; y: number }) => {
    if (!onMediaChange) return;
    
    const updatedMedia = greetingData.media.map(item =>
      item.id === id 
        ? { ...item, position: { ...item.position, x: data.x, y: data.y } }
        : item
    );
    onMediaChange(updatedMedia);
  }, [greetingData.media, onMediaChange]);

  const handleResize = useCallback((id: string, size: { width: number; height: number }) => {
    if (!onMediaChange) return;
    
    const updatedMedia = greetingData.media.map(item =>
      item.id === id 
        ? { ...item, position: { ...item.position, width: size.width, height: size.height } }
        : item
    );
    onMediaChange(updatedMedia);
  }, [greetingData.media, onMediaChange]);

  const handleDelete = useCallback((id: string) => {
    if (!onMediaChange) return;
    
    const updatedMedia = greetingData.media.filter(item => item.id !== id);
    onMediaChange(updatedMedia);
  }, [greetingData.media, onMediaChange]);

  const resetPosition = useCallback((id: string) => {
    if (!onMediaChange) return;
    
    const updatedMedia = greetingData.media.map(item =>
      item.id === id 
        ? { ...item, position: { ...item.position, x: 0, y: 0 } }
        : item
    );
    onMediaChange(updatedMedia);
  }, [greetingData.media, onMediaChange]);

  if (!greetingData.media.length) {
    return (
      <div className="flex items-center justify-center py-20 text-center">
        <div className="text-muted-foreground">
          <div className="text-6xl mb-4">📷</div>
          <p>No media added yet</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[600px] bg-gradient-to-br from-gray-50 to-white rounded-lg overflow-hidden border-2 border-dashed border-gray-200">
      {isEditing && (
        <div className="absolute top-4 left-4 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm z-50">
          Edit Mode - Drag & Resize
        </div>
      )}

      {greetingData.media.map((mediaItem, index) => {
        const frameStyle = frameStyles[(mediaItem as any).frameStyle as keyof typeof frameStyles] || frameStyles.classic;
        const isSelected = selectedMedia === mediaItem.id;

        const MediaContent = () => (
          <div className={cn("w-full h-full rounded-lg overflow-hidden", frameStyle.className)}>
            {frameStyle.decorative}
            {mediaItem.type === 'image' ? (
              <img
                src={mediaItem.url}
                alt={`Media ${index + 1}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIEVycm9yPC90ZXh0Pjwvc3ZnPg==';
                }}
              />
            ) : (
              <video
                src={mediaItem.url}
                className="w-full h-full object-cover"
                controls
                muted
                playsInline
              />
            )}
            {frameStyle.overlay}
          </div>
        );

        if (!isEditing) {
          return (
            <motion.div
              key={mediaItem.id}
              className="absolute"
              style={{
                left: mediaItem.position?.x || 0,
                top: mediaItem.position?.y || 0,
                width: mediaItem.position?.width || 300,
                height: mediaItem.position?.height || 200,
              }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <MediaContent />
            </motion.div>
          );
        }

        return (
          <Draggable
            key={mediaItem.id}
            position={{ 
              x: mediaItem.position?.x || 0, 
              y: mediaItem.position?.y || 0 
            }}
            onDrag={(e, data) => handleDrag(mediaItem.id, data)}
            handle=".drag-handle"
            bounds="parent"
          >
            <div className="absolute">
              <div
                onClick={() => setSelectedMedia(mediaItem.id)}
                className={cn(
                  "border-2 border-transparent transition-all duration-200",
                  isSelected && "border-primary shadow-lg"
                )}
              >
                <ResizableBox
                  width={mediaItem.position?.width || 300}
                  height={mediaItem.position?.height || 200}
                  minConstraints={[100, 100]}
                  maxConstraints={[600, 400]}
                  onResize={(e, { size }) => handleResize(mediaItem.id, size)}
                >
                <div className="relative w-full h-full group">
                  <MediaContent />
                  
                  {/* Controls */}
                  <div className="absolute top-2 left-2 right-2 flex justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <div className="drag-handle cursor-move bg-black/50 text-white p-1 rounded">
                      <Grip className="h-4 w-4" />
                    </div>
                    
                    <div className="flex gap-1">
                      <Button
                        onClick={() => resetPosition(mediaItem.id)}
                        size="sm"
                        variant="secondary"
                        className="h-6 w-6 p-0 bg-black/50 hover:bg-black/70 text-white border-none"
                      >
                        <RotateCcw className="h-3 w-3" />
                      </Button>
                      <Button
                        onClick={() => handleDelete(mediaItem.id)}
                        size="sm"
                        variant="destructive"
                        className="h-6 w-6 p-0 bg-red-500/80 hover:bg-red-600 border-none"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>

                  {/* Position indicator */}
                  <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    {Math.round(mediaItem.position?.x || 0)}, {Math.round(mediaItem.position?.y || 0)}
                  </div>
                </div>
                </ResizableBox>
              </div>
            </div>
          </Draggable>
        );
      })}
    </div>
  );
};

export default DraggableMediaGallery;