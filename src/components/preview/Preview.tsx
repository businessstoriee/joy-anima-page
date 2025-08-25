import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { GreetingFormData, EventType } from '@/types/greeting';
import { useLanguageTranslation } from '@/components/language/useLanguageTranslation';
import { cn } from '@/lib/utils';
import ShareActions from '@/components/share/ShareActions';
import BackgroundWrapper from './BackgroundWrapper';
import BorderContainer from './BorderContainer';
import EmojisLayer from './EmojisLayer';
import EventHeader from './EventHeader';
import GreetingTexts from './GreetingTexts';
import EnhancedMediaGallery from './EnhancedMediaGallery';
import SenderSection from './SenderSection';
import EnhancedInteractivePreview from './EnhancedInteractivePreview';


interface PreviewProps {
  greetingData: GreetingFormData;
  selectedEvent: EventType | null;
  frameStyle?: string;
  mediaAnimation?: string;
  className?: string;
  onDataChange?: (data: GreetingFormData) => void;
}

const Preview = ({ greetingData, selectedEvent, frameStyle, mediaAnimation, className, onDataChange }: PreviewProps) => {
  const navigate = useNavigate();
  const greetingRef = useRef<HTMLDivElement>(null);
  const { translate } = useLanguageTranslation();

  // Use enhanced interactive preview when onDataChange is provided
  if (onDataChange) {
    return (
      <div className="relative">       
        <EnhancedInteractivePreview
          greetingData={greetingData}
          selectedEvent={selectedEvent}
          onDataChange={onDataChange}
          className={className}
        />
      </div>
    );
  }

  return (
    <BackgroundWrapper greetingData={greetingData} className={className}>
      <div className="max-w-4xl mx-auto relative" ref={greetingRef}>
        
        <BorderContainer greetingData={greetingData} selectedEvent={selectedEvent}>
          <div className="space-y-8">
            <EventHeader greetingData={greetingData} selectedEvent={selectedEvent} />
            <GreetingTexts greetingData={greetingData} />
              <EnhancedMediaGallery 
                greetingData={greetingData} 
                frameStyle={frameStyle || greetingData.frameStyle}
                mediaAnimation={mediaAnimation || greetingData.mediaAnimation}
              />
            <SenderSection greetingData={greetingData} /> 
            <ShareActions greetingData={greetingData} greetingRef={greetingRef} selectedEvent={selectedEvent} />
          </div>
        </BorderContainer>

        <EmojisLayer emojis={greetingData.emojis} />
      </div>
    </BackgroundWrapper>
  );
};

export default React.memo(Preview);