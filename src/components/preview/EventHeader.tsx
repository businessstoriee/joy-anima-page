import React, { useMemo } from 'react';
import { GreetingFormData, EventType } from '@/types/greeting';
import { eventTypes } from '@/types/eventTypes';
import { useLanguageTranslation } from '@/components/language/useLanguageTranslation';
import { motion } from 'framer-motion';
import { getAnimation, getAnimationWithSpeed } from '@/types/animations';
import HoverAnimations from './HoverAnimations';

interface Props {
  greetingData: GreetingFormData;
  selectedEvent: EventType | null;
}

const EventHeader: React.FC<Props> = ({ greetingData, selectedEvent }) => {
  const { translate } = useLanguageTranslation();

  // Remove outdated animation definitions - using centralized system now
  const currentEvent = useMemo(() => {
    if (selectedEvent) return selectedEvent;
    const predefinedEvent = eventTypes.find(e => e.value === greetingData.eventType);
    return predefinedEvent || {
      value: 'fallback',
      emoji: '🎉',
      label: translate('Celebration'),
      defaultMessage: translate('Wishing you a wonderful celebration!'),
      theme: '',
      category: 'custom'
    };
  }, [selectedEvent, greetingData.eventType, translate]);

  // Custom emoji settings
  const displayEmoji = greetingData.eventEmojiSettings?.emoji || currentEvent.emoji;
  const emojiSize = greetingData.eventEmojiSettings?.size || 64;
  const emojiAnimation = greetingData.eventEmojiSettings?.animation || 'bounce';
  const rotateSpeed = greetingData.eventEmojiSettings?.rotateSpeed || 2;

  return (
    <div className="text-center space-y-4">
      {/* Header Text */}
      {greetingData.headerText?.content && (
        <motion.div
          key={`${greetingData.headerText.id}-${greetingData.headerText.animation}-${greetingData.headerText.content}-${greetingData.headerText.continuousAnimation}-${Date.now()}`}
          initial="initial"
          animate="animate"
          variants={getAnimation(greetingData.headerText.animation, 'fadeIn')}
          transition={{ 
            duration: 0.8,
            ...(greetingData.headerText.continuousAnimation && {
              repeat: Infinity,
              repeatDelay: 0.5
            })
          }}
          style={{
            fontSize: greetingData.headerText.style.fontSize,
            fontWeight: greetingData.headerText.style.fontWeight,
            color: greetingData.headerText.style.color,
            textAlign: greetingData.headerText.style.textAlign,
            fontFamily: greetingData.headerText.style.fontFamily || 'inherit'
          }}
          className="mb-2"
        >
          {greetingData.headerText.content}
        </motion.div>
      )}

      {/* Event Name */}
      <motion.div
        key={`${greetingData.eventNameStyle?.id}-${greetingData.eventNameStyle?.animation}-${greetingData.eventNameStyle?.content}-${greetingData.eventNameStyle?.continuousAnimation}-${Date.now()}`}
        initial="initial"
        animate="animate"
        variants={getAnimation(greetingData.eventNameStyle?.animation || 'fadeIn', 'fadeIn')}
        transition={{ 
          duration: 0.6, 
          delay: 0.2,
          ...(greetingData.eventNameStyle?.continuousAnimation && {
            repeat: Infinity,
            repeatDelay: 0.5
          })
        }}
        style={{
          fontSize: greetingData.eventNameStyle?.style?.fontSize || '28px',
          fontWeight: greetingData.eventNameStyle?.style?.fontWeight || 'bold',
          color: greetingData.eventNameStyle?.style?.color || 'hsl(var(--foreground))',
          textAlign: greetingData.eventNameStyle?.style?.textAlign || greetingData.eventEmojiSettings?.textAlign || 'center',
          fontFamily: greetingData.eventNameStyle?.style?.fontFamily || 'inherit'
        }}
        className="mb-4 hover:animate-pulse"
      >
        {greetingData.eventNameStyle?.content || `Happy ${currentEvent.label}`}
      </motion.div>

      {/* Event Emoji with centralized animation system */}
      <HoverAnimations animation="bounce">
        <motion.div
          key={`emoji-${emojiAnimation}-${displayEmoji}-${emojiSize}`}
          className="mb-4"
          initial="initial"
          animate="animate"
          variants={getAnimationWithSpeed(emojiAnimation, 1/rotateSpeed, 'bounceIn')}
          style={{
            fontSize: `${emojiSize}px`,
            filter: greetingData.eventEmojiSettings?.effects?.glow
              ? `drop-shadow(0 0 15px ${greetingData.eventEmojiSettings?.effects?.glowColor || '#ffffff'})`
              : 'none',
            textAlign: greetingData.eventEmojiSettings?.textAlign || 'center',
            width: '100%'
          }}
        >
          {displayEmoji}
        </motion.div>
      </HoverAnimations>

      {/* Receiver Name */}
      {greetingData.receiverName && (
        <HoverAnimations animation="pulse">
          <motion.p 
            className="text-xl md:text-2xl font-bold text-primary"
            initial="initial"
            animate="animate"
            variants={getAnimation(greetingData.receiverNameStyle?.animation || 'fadeIn', 'fadeIn')}
            transition={{ 
              duration: 0.6,
              delay: 0.3,
              ...(greetingData.receiverNameStyle?.continuousAnimation && {
                repeat: Infinity,
                repeatDelay: 1
              })
            }}
            style={greetingData.receiverNameStyle ? {
              fontSize: greetingData.receiverNameStyle.style.fontSize,
              fontWeight: greetingData.receiverNameStyle.style.fontWeight,
              color: greetingData.receiverNameStyle.style.color,
              textAlign: greetingData.receiverNameStyle.style.textAlign,
              fontFamily: greetingData.receiverNameStyle.style.fontFamily,
              fontStyle: greetingData.receiverNameStyle.style.fontStyle,
              textTransform: greetingData.receiverNameStyle.style.textTransform,
              letterSpacing: greetingData.receiverNameStyle.style.letterSpacing,
              lineHeight: greetingData.receiverNameStyle.style.lineHeight
            } : undefined}
          >
            {greetingData.receiverName}
          </motion.p>
        </HoverAnimations>
      )}
    </div>
  );
};

export default EventHeader;