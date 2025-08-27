import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useFirebaseGreetings } from '@/hooks/useFirebaseGreetings';
import { GreetingFormData, EventType } from '@/types/greeting';
import { useToast } from '@/hooks/use-toast';
import { Share2, Loader2 } from 'lucide-react';
import { useLanguageTranslation } from '@/components/language/useLanguageTranslation';

interface FirebaseShareButtonProps {
  greetingData: GreetingFormData;
  selectedEvent?: EventType | null;
  onSuccess?: (slug: string) => void;
  variant?: "default" | "outline" | "secondary" | "ghost" | "destructive";
  size?: "default" | "sm" | "lg" | "icon";
}

const FirebaseShareButton: React.FC<FirebaseShareButtonProps> = ({
  greetingData,
  selectedEvent,
  onSuccess,
  variant = "default",
  size = "lg"
}) => {
  const [isSaving, setIsSaving] = useState(false);
  const { saveGreeting, isSaving: hookIsSaving } = useFirebaseGreetings();
  const { toast } = useToast();
  const { translate } = useLanguageTranslation();

  const handleSaveAndShare = async () => {
    console.log('🎯 FirebaseShareButton clicked!');
    console.log('📊 Greeting data to save:', JSON.stringify(greetingData, null, 2));
    
    // Validation
    if (!greetingData.eventType) {
      toast({
        title: "Missing Event Type",
        description: "Please select or create an event type first.",
        variant: "destructive",
      });
      return;
    }

     if (!greetingData.receiverName && !greetingData.senderName) {
      toast({
        title: "Missing Sender Name or Receiver Name",
        description: "Please enter Sender Name or Receiver Name.",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    
    try {
      // Generate title
      const title = `${greetingData.senderName || 'Someone'} wishes ${greetingData.receiverName || 'You'}`;
      
      console.log('💾 Saving to Firebase with title:', title);
      
      // Save to Firebase
      const slug = await saveGreeting(greetingData, title);
      
      console.log('✅ Firebase save completed, received slug:', slug);
      
      if (slug) {
        // Generate shareable URL
        const shareableURL = `${window.location.origin}/${slug}`;
        
        // Copy to clipboard
        await navigator.clipboard.writeText(shareableURL);
        
        toast({
          title: "Link Generated! 🎉",
          description: "Your greeting has been saved and the link copied to clipboard.",
        });
        
        console.log('🔗 Shareable URL:', shareableURL);
        
        if (onSuccess) {
          onSuccess(slug);
        }
      } else {
        throw new Error('Failed to save greeting');
      }
    } catch (error) {
      console.error('❌ Error saving greeting:', error);
      toast({
        title: "Save Failed",
        description: "There was an error saving your greeting. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const isFormValid = greetingData.eventType && 
                      (greetingData.senderName || greetingData.receiverName);

  const isLoading = isSaving || hookIsSaving;

  return (
    // {/* <ShareActions greetingData={greetingData} selectedEvent={selectedEvent} /> */}
    <Button
      variant={variant}
      size={size}
      onClick={handleSaveAndShare}
      disabled={!isFormValid || isLoading}
      className="relative overflow-hidden group animate-zoom-in shadow-2xl hover:shadow-primary/30 transition-all duration-500 bg-gradient-to-r from-pink-500 to-violet-500 hover:bg-gradient-to-l gap-2"
    >
      {isLoading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Saving...
        </>
      ) : (
        <> 
          <Share2 className="h-4 w-4 group-hover:animate-spin" />
          <span>{translate('Generate Share Link')}</span>  
          <span className="text-2xl group-hover:animate-spin">✨</span>

          {/* Button shine effect */}
          <span className="absolute top-0 left-1/2 w-20 h-full bg-white/30 -skew-x-12 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 group-hover:animate-shine transition-opacity duration-700"></span>
          
          {/* Border elements */}
          <span className="absolute inset-0 border-2 border-transparent group-hover:border-white/30 rounded-lg 
                          group-hover:rounded-none transition-all duration-300 ease-[cubic-bezier(0.65,0,0.35,1)]" />
          
          {/* Lightning border animation */}
          <span className="absolute inset-0 border-2 border-transparent 
                          group-hover:border-[length:400%_400%] group-hover:bg-[length:400%_400%]
                          group-hover:animate-lightning-rounding" />
        </>
      )}
    </Button>
  );
};

export default FirebaseShareButton;