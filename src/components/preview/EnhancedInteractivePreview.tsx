import React, { useState } from 'react';
import { GreetingFormData, EventType, MediaItem, TextContent } from '@/types/greeting';
import { Button } from '@/components/ui/button';
import { Edit, Eye } from 'lucide-react';
import { motion } from 'framer-motion';
import InteractiveElement from './InteractiveElement';
import MediaFrame from './MediaFrames';
import { mediaAnimations } from './MediaAnimations';
import BackgroundWrapper from './BackgroundWrapper';
import BorderContainer from './BorderContainer';
import EmojisLayer from './EmojisLayer';
import EventHeader from './EventHeader';
import SenderSection from './SenderSection';

interface Props {
  greetingData: GreetingFormData;
  selectedEvent: EventType | null;
  onDataChange?: (data: GreetingFormData) => void;
  className?: string;
}

const EnhancedInteractivePreview: React.FC<Props> = ({
  greetingData,
  selectedEvent,
  onDataChange,
  className
}) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleMediaPositionChange = (id: string, position: { x: number; y: number }) => {
    if (!onDataChange) return;
    
    const updatedMedia = greetingData.media.map(item =>
      item.id === id ? { ...item, position: { ...item.position, x: position.x, y: position.y } } : item
    );
    onDataChange({ ...greetingData, media: updatedMedia });
  };

  const handleMediaSizeChange = (id: string, size: { width: number; height: number }) => {
    if (!onDataChange) return;
    
    const updatedMedia = greetingData.media.map(item =>
      item.id === id ? { ...item, position: { ...item.position, ...size } } : item
    );
    onDataChange({ ...greetingData, media: updatedMedia });
  };

  const handleTextPositionChange = (id: string, position: { x: number; y: number }) => {
    if (!onDataChange) return;
    
    const updatedTexts = greetingData.texts.map(text =>
      text.id === id ? { ...text, position } : text
    );
    onDataChange({ ...greetingData, texts: updatedTexts });
  };

  const handleEmojiPositionChange = (id: string, position: { x: number; y: number }) => {
    if (!onDataChange) return;
    
    const updatedEmojis = greetingData.emojis.map(emoji =>
      emoji.id === id ? { ...emoji, position } : emoji
    );
    onDataChange({ ...greetingData, emojis: updatedEmojis });
  };

  const handleDeleteMedia = (id: string) => {
    if (!onDataChange) return;
    
    const updatedMedia = greetingData.media.filter(item => item.id !== id);
    onDataChange({ ...greetingData, media: updatedMedia });
  };

  const handleDeleteText = (id: string) => {
    if (!onDataChange) return;
    
    const updatedTexts = greetingData.texts.filter(text => text.id !== id);
    onDataChange({ ...greetingData, texts: updatedTexts });
  };

  const handleDeleteEmoji = (id: string) => {
    if (!onDataChange) return;
    
    const updatedEmojis = greetingData.emojis.filter(emoji => emoji.id !== id);
    onDataChange({ ...greetingData, emojis: updatedEmojis });
  };

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
                  <InteractiveElement
                    key={text.id}
                    id={text.id}
                    position={text.position || { x: 0, y: index * 60 }}
                    isEditing={isEditing}
                    onPositionChange={handleTextPositionChange}
                    onDelete={handleDeleteText}
                    className="max-w-md"
                  >
                    <motion.div
                      className="p-4 bg-white/80 backdrop-blur-sm rounded-lg shadow-lg"
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
                  </InteractiveElement>
                ))}
              </div>

              {/* Interactive Media Gallery */}
              <div className="relative min-h-[400px]">
                {greetingData.media.map((mediaItem, index) => (
                  <InteractiveElement
                    key={mediaItem.id}
                    id={mediaItem.id}
                    position={{ 
                      x: mediaItem.position?.x || (index % 3) * 250, 
                      y: mediaItem.position?.y || Math.floor(index / 3) * 200 
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
                                  <div class="flex items-center justify-center h-full bg-gray-100 text-gray-500">
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
                                  <div class="flex items-center justify-center h-full bg-gray-100 text-gray-500">
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
                  </InteractiveElement>
                ))}
              </div>

              {/* Sender Section */}
              <SenderSection greetingData={greetingData} />
            </div>
          </BorderContainer>

          {/* Interactive Emojis */}
          <div className="absolute inset-0 pointer-events-none">
            {greetingData.emojis.map((emoji) => (
              <InteractiveElement
                key={emoji.id}
                id={emoji.id}
                position={emoji.position}
                isEditing={isEditing}
                onPositionChange={handleEmojiPositionChange}
                onDelete={handleDeleteEmoji}
                className="pointer-events-auto"
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
              </InteractiveElement>
            ))}
          </div>

          {/* Edit Mode Overlay */}
          {isEditing && (
            <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
              Edit Mode - Drag elements to reposition
            </div>
          )}
        </div>
      </BackgroundWrapper>
    </div>
  );
};

export default EnhancedInteractivePreview;