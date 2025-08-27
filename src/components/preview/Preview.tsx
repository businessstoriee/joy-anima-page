import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit3, Eye } from 'lucide-react';
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
  isEditable?: boolean;
}

const Preview = ({
  greetingData,
  selectedEvent,
  frameStyle,
  mediaAnimation,
  className,
  onDataChange,
  isEditable = true,
}: PreviewProps) => {
  const navigate = useNavigate();
  const greetingRef = useRef<HTMLDivElement>(null);
  const { translate } = useLanguageTranslation();
  const [editMode, setEditMode] = useState(false);

  // Show EnhancedInteractivePreview only when in edit mode
  if (onDataChange && isEditable && editMode) {
    return (
      <div className="relative">
        {/* Toolbar */}
        <div className="flex justify-center items-center">
          <Button variant="outline" className='bg-primary/10 text-primary border-primary' onClick={() => setEditMode(false)}>
            <Eye className="mr-2 h-4 w-4" />
            {translate("View Mode")}
          </Button>
        </div>

        <EnhancedInteractivePreview
          greetingData={greetingData}
          selectedEvent={selectedEvent}
          onDataChange={onDataChange}
          className={className}
          isEditable={true}
        />
      </div>
    );
  }

  // Default view mode
  return (
    <BackgroundWrapper greetingData={greetingData} className={className}>
      <div className="max-w-4xl mx-auto relative" ref={greetingRef}>
        {/* Toolbar */}
        <div className="flex justify-center items-center mb-2">
          {onDataChange && isEditable && (
            <Button variant="default" onClick={() => setEditMode(true)}>
              <Edit3 className="mr-2 h-4 w-4" />
              {translate("Edit Mode")}
            </Button>
          )}
        </div>

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
      </div>
    </BackgroundWrapper>
  );
};

export default React.memo(Preview);
