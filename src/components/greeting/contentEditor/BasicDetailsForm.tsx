import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { EventType } from '@/types/greeting';
import CustomEventSelector from './CustomEventSelector';
import { useLanguageTranslation } from '@/components/language/useLanguageTranslation';
import AudioPlayerInput from '@/components/greeting/contentEditor/AudioPlayerInput/AudioPlayerInput';
import { useState, useCallback } from "react";
import { Music } from "lucide-react";

interface BasicDetailsFormProps {
  eventType: string;
  receiverName: string;
  senderName: string;
  audioUrl?: string;
  customEvent: EventType | null;
  onEventChange: (value: string) => void;
  onInputChange: (field: string, value: any) => void;
  onCustomEventCreate: (event: EventType) => void;
}

const BasicDetailsForm: React.FC<BasicDetailsFormProps> = ({
  eventType,
  receiverName,
  senderName,
  audioUrl = '',
  customEvent,
  onEventChange,
  onInputChange,
  onCustomEventCreate,
}) => {
  const handleAudioUrlChange = useCallback((newUrl: string) => {
    onInputChange('audioUrl', newUrl);
  }, [onInputChange]);

  const { translate } = useLanguageTranslation();
  return (
    <>
      {/* Custom Event Selector */}
      <CustomEventSelector
        selectedEvent={eventType}
        customEvent={customEvent}
        onEventChange={onEventChange}
        onCustomEventCreate={onCustomEventCreate}
      />

      <Separator />

      {/* Names */}
      <div className="grid md:grid-cols-2 gap-4 p-6 border border-green-300 rounded-xl shadow-lg">
        <div className="space-y-2">
          {/* ({translate('optional')}) */}
          <Label htmlFor="senderName">{translate('Your Name')}</Label>
          <Input
            id="senderName"
            value={senderName}
            onChange={(e) => onInputChange('senderName', e.target.value)}
            placeholder={translate('Your name')}
          />
        </div>
        <div className="space-y-2">
           {/* ({translate('optional')}) */}
          <Label htmlFor="receiverName">{translate('Receiver\'s Name')}</Label>
          <Input
            id="receiverName"
            value={receiverName}
            onChange={(e) => onInputChange('receiverName', e.target.value)}
            placeholder={translate('Recipient\'s name')}
          />
        </div>
      </div>


            <Separator />

            <div className="space-y-2 p-6 border border-primary/20 rounded-xl shadow-lg bg-gradient-to-br from-background to-primary/5">
              
              <Label htmlFor="audioUrl" className="flex items-center gap-2 text-sm font-medium">
                 <Music className="h-4 w-4 text-primary" />
                Background Music URL (optional)
              </Label>
              <AudioPlayerInput 
                value={audioUrl}
                onChange={handleAudioUrlChange}
                autoPlay={false}
              />
            </div>
            
    </>
  );
};

export default BasicDetailsForm;