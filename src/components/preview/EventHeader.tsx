import React, { useMemo } from 'react';
import { GreetingFormData, EventType } from '@/types/greeting';
import { eventTypes } from '@/types/eventTypes';
import { useLanguageTranslation } from '@/components/language/useLanguageTranslation';
import { motion } from 'framer-motion';

interface Props {
  greetingData: GreetingFormData;
  selectedEvent: EventType | null;
}

const EventHeader: React.FC<Props> = ({ greetingData, selectedEvent }) => {
  const { translate } = useLanguageTranslation();

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

  // Animation definitions
  const getEmojiAnimation = (animationType: string) => {
    switch (animationType) {
      case 'bounce':
        return { y: [0, -20, 0] };
      case 'float':
        return { y: [0, -15, 0] };
      case 'pulse':
        return { scale: [1, 1.2, 1] };
      case 'shake':
        return { x: [0, -10, 10, -10, 0] };
      case 'rotate':
        return { rotate: [0, 360] };
      default:
        return { scale: [1, 1.1, 1] };
    }
  };

  return (
    <div className="text-center space-y-4">
      {/* Header Text */}
      {greetingData.headerText?.content && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4"
          style={{
            fontSize: greetingData.headerText.style.fontSize,
            fontWeight: greetingData.headerText.style.fontWeight,
            color: greetingData.headerText.style.color,
            textAlign: greetingData.headerText.style.textAlign,
            fontFamily: greetingData.headerText.style.fontFamily || 'inherit',
          }}
        >
          {greetingData.headerText.content}
        </motion.div>
      )}

      {/* Event Emoji with looping animation */}
      <motion.div
        className="mb-4 inline-block"
        animate={getEmojiAnimation(emojiAnimation)}
        transition={{
          duration: rotateSpeed,
          repeat: Infinity,
          repeatType: emojiAnimation === 'rotate' ? 'loop' : 'mirror',
          ease: 'easeInOut'
        }}
        style={{
          fontSize: `${emojiSize}px`,
          filter: greetingData.eventEmojiSettings?.effects?.glow
            ? 'drop-shadow(0 0 10px currentColor)'
            : 'none'
        }}
      >
        {displayEmoji}
      </motion.div>

      {/* Event Name */}
      <h1
        className="font-bold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
        style={{
          fontSize: greetingData.eventNameStyle?.style.fontSize || '28px',
          fontWeight: greetingData.eventNameStyle?.style.fontWeight || 'bold',
          color: greetingData.eventNameStyle?.style.color || 'hsl(var(--foreground))',
          textAlign: greetingData.eventNameStyle?.style.textAlign || 'center',
          fontFamily: greetingData.eventNameStyle?.style.fontFamily || 'inherit',
        }}
      >
        {greetingData.eventNameStyle?.content || `Happy ${currentEvent.label}`}
      </h1>

      {/* Receiver Name */}
      {greetingData.receiverName && (
        <p className="text-xl md:text-2xl font-bold text-primary">
          {greetingData.receiverName}
        </p>
      )}
    </div>
  );
};

export default EventHeader;
