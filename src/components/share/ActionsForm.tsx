import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { GreetingFormData } from '@/types/greeting';
import ShareActions from './ShareActions';
import { useLanguageTranslation } from '@/components/language/useLanguageTranslation';
import { EventType } from '@/types/greeting';

interface ActionsFormProps {
  greetingData: GreetingFormData;
  onGenerateLink: () => void;
  selectedEvent?: EventType | null;
}
const ActionsForm = ({ greetingData, onGenerateLink, selectedEvent }: ActionsFormProps) => {

  const { translate } = useLanguageTranslation();

  const generateAdvancedShareURL = () => {
    const params = new URLSearchParams();
    
    // Add all form data with proper encoding
    Object.entries(greetingData).forEach(([key, value]) => {
      if (key === 'texts' && Array.isArray(value)) {
        params.append('texts', JSON.stringify(value));
      } else if (key === 'media' && Array.isArray(value)) {
        params.append('media', JSON.stringify(value));
      } else if (key === 'emojis' && Array.isArray(value)) {
        params.append('emojis', JSON.stringify(value));
      } else if (key === 'backgroundSettings') {
        params.append('backgroundSettings', JSON.stringify(value));
      } else if (key === 'borderSettings') {
        params.append('borderSettings', JSON.stringify(value));
      } else if (key === 'videoPosition') {
        params.append('videoPosition', JSON.stringify(value));
      } else if (value && typeof value === 'string') {
        params.append(key, value);
      }
    });

   // Always include custom event fields when present (supports cases where eventType might not be 'custom')
    if (greetingData.customEventName) {
      params.set('customEventName', String(greetingData.customEventName));
      if (greetingData.customEventEmoji) {
        params.set('customEventEmoji', String(greetingData.customEventEmoji));
      }
    }


    const shareableURL = `${window.location.origin}/?${params.toString()}`;
    navigator.clipboard.writeText(shareableURL);
    
    console.log('Generated URL params:', params.toString()); // Debug log
  };

  return (
    <>
      {/* <Separator />
       */}
      <div className="flex flex-col items-center mt-4 gap-4">
        {/* <ShareActions greetingData={greetingData} selectedEvent={selectedEvent} /> */}

            
        <Button
          size="lg" 
          onClick={() => {
            generateAdvancedShareURL();
            onGenerateLink();
          }}
          className="relative overflow-hidden group animate-zoom-in shadow-2xl hover:shadow-primary/30 transition-all duration-500 bg-gradient-to-r from-pink-500 to-violet-500 hover:bg-gradient-to-l"
        >
          <span className="relative z-10 flex items-center">
            <span className="mr-3 text-2xl group-hover:animate-spin">✨</span>
            <span>{translate('Generate Share Link')}</span>
          </span>
          {/* Button shine effect */}
          <span className="absolute top-0 left-1/2 w-20 h-full bg-white/30 -skew-x-12 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 group-hover:animate-shine transition-opacity duration-700"></span>
          
          {/* Border elements */}
          <span className="absolute inset-0 border-2 border-transparent group-hover:border-white/30 rounded-lg 
                          group-hover:rounded-none transition-all duration-300 ease-[cubic-bezier(0.65,0,0.35,1)]" />
          
          {/* Lightning border animation */}
          <span className="absolute inset-0 border-2 border-transparent 
                          group-hover:border-[length:400%_400%] group-hover:bg-[length:400%_400%]
                          group-hover:animate-lightning-rounding" />
        </Button>
      </div>
    </>
  );
};

export default ActionsForm;