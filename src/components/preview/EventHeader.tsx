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

  return (
    <div className="text-center">
      <motion.div
        className="text-4xl md:text-6xl mb-4"
        animate={{ scale: [1, 1.1, 1], rotate: [0, 10, -10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        {currentEvent.emoji}
      </motion.div>
      <h1 className="text-2xl md:text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
       Happy {currentEvent.label}
      </h1>
      {greetingData.receiverName && (
        <p className="text-xl md:text-2xl font-bold text-primary">{greetingData.receiverName}</p>
      )}
    </div>
  );
};

export default EventHeader;
