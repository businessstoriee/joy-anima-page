import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import CustomEventSelector from '../eventName/CustomEventSelector';
import { useLanguageTranslation } from '@/components/language/useLanguageTranslation';
import AudioPlayerInput from '@/components/greeting/contentEditor/AudioPlayerInput/AudioPlayerInput';
import { useState, useCallback } from "react";
import { Music } from "lucide-react";
import HeaderTextCustomizer from '../../customization/HeaderTextCustomizer';
import { TextContent, EventEmojiSettings, EventType } from '@/types/greeting';
import { Button } from "@/components/ui/button";
import SenderNameCustomizer from './SenderNameCustomizer';
import ReceiverNameCustomizer from './ReceiverNameCustomizer';
import { TextSettings, createTextSettings } from '@/types/textSettings';

interface BasicDetailsFormProps {
  eventType: string;
  receiverName: string;
  senderName: string;
  audioUrl?: string;
  customEvent: EventType | null;
  onEventChange: (value: string) => void;
  onInputChange: (field: string, value: any) => void;
  onCustomEventCreate: (event: EventType) => void;
  selectedEvent: EventType | null;
  headerText?: TextContent;
  eventNameStyle?: TextContent;
  eventEmojiSettings?: EventEmojiSettings;
  onHeaderTextChange?: (headerText: TextContent) => void;
  onEventNameStyleChange?: (eventNameStyle: TextContent) => void;
  onEventEmojiSettingsChange?: (settings: EventEmojiSettings) => void;
  senderNameStyle?: TextSettings;
  receiverNameStyle?: TextSettings;
  onSenderNameStyleChange?: (settings: TextSettings | undefined) => void;
  onReceiverNameStyleChange?: (settings: TextSettings | undefined) => void;
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
  senderNameStyle,
  receiverNameStyle,
  onSenderNameStyleChange,
  onReceiverNameStyleChange,
}) => {
  const handleAudioUrlChange = useCallback((newUrl: string) => {
    onInputChange('audioUrl', newUrl);
  }, [onInputChange]);

  const { translate } = useLanguageTranslation();

  const [isExpandedSender, setIsExpandedSender] = useState(false);
  const toggleExpandSender = () => setIsExpandedSender(prev => !prev);

  const [isExpandedReceiver, setIsExpandedReceiver] = useState(false);
  const toggleExpandReceiver = () => setIsExpandedReceiver(prev => !prev);

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
        eventNameStyle={eventNameStyle}
        eventEmojiSettings={eventEmojiSettings}
        onEventNameStyleChange={onEventNameStyleChange}
        onEventEmojiSettingsChange={onEventEmojiSettingsChange}
      />

      <Separator />

      {/* Names Section */}
      <div className="grid md:grid-cols-2 gap-4 p-6 border border-cyan-500 dark:border-cyan-400 rounded-xl shadow-lg">
        {/* Sender Name */}
        <div className="space-y-2">
          <div className="flex items-center justify-between min-h-[24px]">
            <Label htmlFor="senderName" className="dark:text-foreground">{translate('Your Name')}</Label>
            {senderName.length > 0 && (
              <Button
                onClick={toggleExpandSender}
                size="sm"
                variant="ghost"
                className="text-[10px] h-6 px-2 py-0 border border-muted/20 hover:border-primary/40 hover:bg-primary/5 transition-all duration-200 dark:hover:bg-primary/10"
              >
                {isExpandedSender ? "Hide" : "Edit"}
              </Button>
            )}
          </div>
          <Input
            id="senderName"
            value={senderName}
            onChange={(e) => onInputChange('senderName', e.target.value)}
            placeholder={translate('Your name (optional)')}
            className="dark:bg-background/50 dark:border-muted/50"
          />

           {/* Sender Name Customizer */}
   
          <SenderNameCustomizer
            senderNameStyle={senderNameStyle}
            onChange={onSenderNameStyleChange || (() => {})}
            expanded={isExpandedSender}           
            onToggleExpanded={toggleExpandSender}   
          />

        </div>

        {/* Receiver Name */}
        <div className="space-y-2">
          <div className="flex items-center justify-between min-h-[24px]">
            <Label htmlFor="receiverName" className="dark:text-foreground">{translate("Receiver's Name")}</Label>
            {receiverName.length > 0 && (
              <Button
                onClick={toggleExpandReceiver}
                size="sm"
                variant="ghost"
                className="text-[10px] h-6 px-2 py-0 border border-muted/20 hover:border-primary/40 hover:bg-primary/5 transition-all duration-200 dark:hover:bg-primary/10"
              >
                {isExpandedReceiver ? "Hide" : "Edit"}
              </Button>
            )}
          </div>
          <Input
            id="receiverName"
            value={receiverName}
            onChange={(e) => onInputChange('receiverName', e.target.value)}
            placeholder={translate("Recipient's name (optional)")}
            className="dark:bg-background/50 dark:border-muted/50"
          />


          <ReceiverNameCustomizer
            receiverNameStyle={receiverNameStyle}
            onChange={onReceiverNameStyleChange || (() => {})}
            expanded={isExpandedReceiver}            
            onToggleExpanded={toggleExpandReceiver}  
          />

        </div>
      </div>


      {/* Background Music URL */}
      <div className="space-y-2 p-6 border border-violet-500 dark:border-primary/40 rounded-xl shadow-lg bg-gradient-to-br from-background to-primary/5 dark:from-background dark:to-primary/10">
        <Label htmlFor="audioUrl" className="flex items-center gap-2 text-sm font-medium dark:text-foreground">
          <Music className="h-4 w-4 text-primary" />
          Background Music URL
           <span className="flex items-center px-2 py-1 justify-center rounded-full bg-primary/10 text-primary text-xs">
              (Optional)
          </span>
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
