import React from 'react';
import { GreetingFormData, EventType } from '@/types/greeting';
import { Button } from '@/components/ui/button';
import { Edit, Eye } from 'lucide-react';
import { motion } from 'framer-motion';
import DraggableElement from './ImprovedDraggableElements';
import MediaFrame from './MediaFrames';
import { mediaAnimations } from './MediaAnimations';
import BackgroundWrapper from './BackgroundWrapper';
import BorderContainer from './BorderContainer';
import EventHeader from './EventHeader';
import SenderSection from './SenderSection';
import { DragDropProvider, useDragDrop } from '@/components/shared/DragDropProvider';

interface Props {
  greetingData: GreetingFormData;
  selectedEvent: EventType | null;
  onDataChange?: (data: GreetingFormData) => void;
  className?: string;
}

const InteractivePreviewContent: React.FC<Props> = ({
  greetingData,
  selectedEvent,
  onDataChange,
  className
}) => {
  const {
    isEditing,
    setIsEditing,
    handleMediaPositionChange,
    handleMediaSizeChange,
    handleTextPositionChange,
    handleDeleteMedia,
    handleDeleteText,
    handleEmojiPositionChange,
    handleDeleteEmoji,
  } = useDragDrop();

  const getFrameType = (index: number) => {
    const frameTypes = ['classic', 'modern', 'vintage', 'polaroid', 'elegant', 'artistic', 'romantic', 'magical'];
    return frameTypes[index % frameTypes.length];
  };

  return (
    <div className={className}>
      {/* Edit Toggle */}
      {onDataChange && (
        <div className="mb-4 flex justify-center">
          <Button
            onClick={() => setIsEditing(!isEditing)}
            variant={isEditing ? "default" : "outline"}
            size="sm"
            className="gap-2"
          >
            {isEditing ? <Eye className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
            {isEditing ? 'View Mode' : 'Edit Mode'}
          </Button>
        </div>
      )}

      <BackgroundWrapper greetingData={greetingData}>
        <div className="max-w-4xl mx-auto relative min-h-[600px]">
          <BorderContainer greetingData={greetingData} selectedEvent={selectedEvent}>
            <div className="space-y-8 relative">
              {/* Event Header */}
              <EventHeader greetingData={greetingData} selectedEvent={selectedEvent} />

              {/* Interactive Texts */}
              <div className="relative min-h-[200px]">
                {greetingData.texts.map((text, index) => (
                  <DraggableElement
                    key={text.id}
                    id={text.id}
                    position={text.position || { x: 0, y: index * 70 }}
                    size={text.size}
                    isEditing={isEditing}
                    canResize={true}
                    onPositionChange={handleTextPositionChange}
                    onDelete={handleDeleteText}
                    className="max-w-md bg-background/90 backdrop-blur-sm rounded-lg shadow-lg p-4"
                    containerBounds="parent"
                    snapToGrid={true}
                    gridSize={10}
                  >
                    <motion.div
                      style={{
                        fontSize: text.style.fontSize,
                        fontWeight: text.style.fontWeight,
                        color: text.style.color,
                        textAlign: text.style.textAlign
                      }}
                      variants={mediaAnimations[text.animation] || mediaAnimations.fade}
                      initial="hidden"
                      animate="visible"
                    >
                      {text.content}
                    </motion.div>
                  </DraggableElement>
                ))}
              </div>

              {/* Interactive Media Gallery */}
              <div className="relative min-h-[400px]">
                {greetingData.media.map((mediaItem, index) => (
                  <DraggableElement
                    key={mediaItem.id}
                    id={mediaItem.id}
                    position={{ 
                      x: mediaItem.position?.x || (index % 3) * 260, 
                      y: mediaItem.position?.y || Math.floor(index / 3) * 220 
                    }}
                    size={{
                      width: mediaItem.position?.width || 300,
                      height: mediaItem.position?.height || 200
                    }}
                    isEditing={isEditing}
                    canResize={true}
                    onPositionChange={handleMediaPositionChange}
                    onSizeChange={handleMediaSizeChange}
                    onDelete={handleDeleteMedia}
                    containerBounds="parent"
                    snapToGrid={true}
                    gridSize={10}
                  >
                    <MediaFrame frameType={getFrameType(index)} index={index}>
                      <motion.div
                        variants={mediaAnimations[mediaItem.animation] || mediaAnimations.fade}
                        initial="hidden"
                        animate="visible"
                        className="w-full h-full overflow-hidden rounded-lg"
                      >
                        {mediaItem.type === 'image' ? (
                          <img
                            src={mediaItem.url}
                            alt={`Media ${index + 1}`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              const parent = target.parentElement;
                              if (parent) {
                                parent.innerHTML = `
                                  <div class="flex items-center justify-center h-full bg-muted text-muted-foreground">
                                    <div class="text-center">
                                      <div class="text-2xl mb-2">📷</div>
                                      <div class="text-sm">Loading image...</div>
                                    </div>
                                  </div>
                                `;
                              }
                            }}
                          />
                        ) : (
                          <video
                            src={mediaItem.url}
                            className="w-full h-full object-cover"
                            controls
                            muted
                            playsInline
                            onError={(e) => {
                              const target = e.target as HTMLVideoElement;
                              target.style.display = 'none';
                              const parent = target.parentElement;
                              if (parent) {
                                parent.innerHTML = `
                                  <div class="flex items-center justify-center h-full bg-muted text-muted-foreground">
                                    <div class="text-center">
                                      <div class="text-2xl mb-2">🎥</div>
                                      <div class="text-sm">Loading video...</div>
                                    </div>
                                  </div>
                                `;
                              }
                            }}
                          />
                        )}
                        
                        {/* Text Overlays */}
                        {mediaItem.textOverlays?.map((overlay) => (
                          <div
                            key={overlay.id}
                            className="absolute pointer-events-none"
                            style={{
                              left: `${overlay.position.x}%`,
                              top: `${overlay.position.y}%`,
                              ...overlay.style
                            }}
                          >
                            {overlay.content}
                          </div>
                        ))}
                      </motion.div>
                    </MediaFrame>
                  </DraggableElement>
                ))}
              </div>

              {/* Sender Section */}
              <SenderSection greetingData={greetingData} />
            </div>
          </BorderContainer>

          {/* Interactive Emojis */}
          <div className="absolute inset-0 pointer-events-none">
            {greetingData.emojis.map((emoji) => (
              <DraggableElement
                key={emoji.id}
                id={emoji.id}
                position={emoji.position}
                isEditing={isEditing}
                onPositionChange={handleEmojiPositionChange}
                onDelete={handleDeleteEmoji}
                className="pointer-events-auto"
                containerBounds="parent"
                snapToGrid={true}
                gridSize={5}
              >
                <motion.div
                  className="select-none cursor-pointer"
                  style={{ fontSize: `${emoji.size}px` }}
                  variants={mediaAnimations[emoji.animation] || mediaAnimations.float}
                  initial="hidden"
                  animate="visible"
                  whileHover={{ scale: 1.2 }}
                >
                  {emoji.emoji}
                </motion.div>
              </DraggableElement>
            ))}
          </div>

          {/* Edit Mode Overlay */}
          {isEditing && (
            <div className="absolute top-4 right-4 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm z-50">
              Edit Mode - Drag elements to reposition
            </div>
          )}
        </div>
      </BackgroundWrapper>
    </div>
  );
};

const OptimizedInteractivePreview: React.FC<Props> = (props) => {
  return (
    <DragDropProvider greetingData={props.greetingData} onDataChange={props.onDataChange}>
      <InteractivePreviewContent {...props} />
    </DragDropProvider>
  );
};

export default OptimizedInteractivePreview;