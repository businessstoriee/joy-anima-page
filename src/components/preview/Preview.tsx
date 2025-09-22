import React, { useRef, useState } from 'react';
import { GreetingFormData, EventType } from '@/types/greeting';
import { useLanguageTranslation } from '@/components/language/useLanguageTranslation';
import BackgroundWrapper from './BackgroundWrapper';
import BorderContainer from './BorderContainer';
import EmojisLayer from './EmojisLayer';
import EventHeader from './EventHeader';
import GreetingTexts from './GreetingTexts';
import EnhancedMediaGallery from './EnhancedMediaGallery';
import SenderSection from './SenderSection';
import AudioAutoPlay from './AudioAutoPlay';

interface PreviewProps {
  greetingData: GreetingFormData;
  selectedEvent: EventType | null;
  frameStyle?: string;
  mediaAnimation?: string;
  className?: string;
}

const Preview = ({
  greetingData,
  selectedEvent,
  frameStyle,
  mediaAnimation,
  className,
}: PreviewProps) => {
  const { translate } = useLanguageTranslation();


  // Default view mode
  return (
    <BackgroundWrapper greetingData={greetingData} className={className}>
        <BorderContainer
          greetingData={greetingData}
          selectedEvent={selectedEvent}
        >
          <div className="space-y-8">
            <EventHeader
              greetingData={greetingData}
              selectedEvent={selectedEvent}
            />
            <GreetingTexts greetingData={greetingData} />
            <EnhancedMediaGallery
              greetingData={greetingData}
              frameStyle={frameStyle || greetingData.frameStyle}
              mediaAnimation={mediaAnimation || greetingData.mediaAnimation}
            />
            <SenderSection greetingData={greetingData} />
            {/* <ShareActions
              greetingData={greetingData}
              greetingRef={greetingRef}
              selectedEvent={selectedEvent}
            /> */}
          </div>
        </BorderContainer>

        <EmojisLayer emojis={greetingData.emojis} />

        {/* Auto-playing audio for shared greetings */}
        <AudioAutoPlay 
          audioUrl={greetingData.audioUrl} 
          autoPlay={true}
        />
    </BackgroundWrapper>
  );
};

export default React.memo(Preview);
