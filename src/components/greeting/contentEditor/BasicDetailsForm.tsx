import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import CustomEventSelector from './CustomEventSelector';
import { useLanguageTranslation } from '@/components/language/useLanguageTranslation';
import AudioPlayerInput from '@/components/greeting/contentEditor/AudioPlayerInput/AudioPlayerInput';
import { useState, useCallback } from "react";
import { Music } from "lucide-react";
import HeaderTextCustomizer from '../customization/HeaderTextCustomizer';
import EventNameCustomizer from '../customization/EventNameCustomizer';
import EventEmojiCustomizer from '../customization/EventEmojiCustomizer';
import { TextContent, EventEmojiSettings, EventType } from '@/types/greeting';


interface BasicDetailsFormProps {
  eventType: string;
  receiverName: string;
  senderName: string;
  audioUrl?: string;
  customEvent: EventType | null;
  onEventChange: (value: string) => void;
  onInputChange: (field: string, value: any) => void;
  onCustomEventCreate: (event: EventType) => void;
    // New props for customization
  selectedEvent: EventType | null;
  headerText?: TextContent;
  eventNameStyle?: TextContent;
  eventEmojiSettings?: EventEmojiSettings;
  onHeaderTextChange?: (headerText: TextContent) => void;
  onEventNameStyleChange?: (eventNameStyle: TextContent) => void;
  onEventEmojiSettingsChange?: (settings: EventEmojiSettings) => void;
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
  selectedEvent,
  headerText,
  eventNameStyle,
  eventEmojiSettings,
  onHeaderTextChange,
  onEventNameStyleChange,
  onEventEmojiSettingsChange,
}) => {
  const handleAudioUrlChange = useCallback((newUrl: string) => {
    onInputChange('audioUrl', newUrl);
  }, [onInputChange]);

  const { translate } = useLanguageTranslation();
  return (
    <>

     {/* Event Header Customization */}
      {eventType && (
        <div className="space-y-4 border-t pt-4">
          
              <HeaderTextCustomizer
            headerText={headerText!}
            onChange={onHeaderTextChange || (() => {})}
          />
          </div>
          )}

<Separator />

      {/* Custom Event Selector */}
      <CustomEventSelector
        selectedEvent={eventType}
        customEvent={customEvent}
        onEventChange={onEventChange}
        onCustomEventCreate={onCustomEventCreate}
      />

 {/* Event Header Customization */}
      {eventType && (
        <div className="space-y-4 border-t pt-4">
          
          <EventNameCustomizer
            eventNameStyle={eventNameStyle!}
            selectedEvent={selectedEvent}
            onChange={onEventNameStyleChange || (() => {})}
          />
          
          <EventEmojiCustomizer
            eventEmojiSettings={eventEmojiSettings!}
            selectedEvent={selectedEvent}
            onChange={onEventEmojiSettingsChange || (() => {})}
          />
        </div>
      )}
      
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
                Background Music URL <span  className="text-gray-500">(Optional)</span>
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