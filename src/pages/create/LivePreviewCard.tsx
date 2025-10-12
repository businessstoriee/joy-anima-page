import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GreetingFormData, EventType } from '@/types/greeting';
import Preview from '@/components/preview/Preview';
import FirebaseShareButton from '@/components/share/GenerateShareLink';
import { useLanguageTranslation } from '@/components/language/useLanguageTranslation';
import AudioAutoPlay from '@/components/preview/AudioAutoPlay';

interface LivePreviewCardProps {
  formData: GreetingFormData;
  selectedEvent: EventType | null;
  onOpenPreview: () => void;
  onDataChange: (data: GreetingFormData) => void;
  onClearAutoSave?: () => void;
}

const LivePreviewCard: React.FC<LivePreviewCardProps> = ({
  formData,
  selectedEvent,
  onOpenPreview,
  onDataChange,
  onClearAutoSave,
}) => {

  const { translate } = useLanguageTranslation();

  return (
    <Card
      className={`animate-zoom-in shadow-xl ${selectedEvent?.theme || ""} transition-all duration-300 hover:shadow-2xl hover:scale-[1.01] dark:border-border/50`}
    >
      <CardHeader className="relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-r from-pink-200 to-violet-200 hover:bg-gradient-to-l text-white opacity-0 group-hover:opacity-100 transition-opacity duration-500 dark:from-pink-300/30 dark:to-violet-300/30" />

        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="absolute text-xl opacity-0 group-hover:opacity-100 group-hover:animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.2}s`,
            }}
          >
            ✨
          </div>
        ))}

        <CardTitle onClick={onOpenPreview} className="cursor-pointer flex items-center gap-2 relative z-10 dark:text-foreground">
          <span className="inline-block group-hover:animate-bounce">👀 {translate('Live Preview')}  (Click to Expand)</span>
        </CardTitle>
      </CardHeader>

      <CardContent>
        {formData.eventType ? ( 
          <div className="space-y-4">
            <Preview 
              greetingData={formData} 
              selectedEvent={selectedEvent} 
            />

            <div className="flex justify-center">
              <FirebaseShareButton
                greetingData={formData}
                selectedEvent={selectedEvent}
                onClearAutoSave={onClearAutoSave}
              />
            </div>

            {/* Auto-playing audio */}
            <AudioAutoPlay 
              audioUrl={formData.audioUrl} 
              autoPlay={true}
            />
          </div>
        ) : (
          <div className="text-center text-muted-foreground py-12">
            <div className="text-4xl mb-4">🎨</div>
            <p>Select an event type to see your greeting preview</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LivePreviewCard;