import { useToast } from '@/hooks/use-toast';
import { GreetingFormData, EventType } from '@/types/greeting';

export interface ShareUtilsReturn {
  generateShareableURL: (greetingData: GreetingFormData, customEvent?: EventType) => string;
  copyShareLink: (url: string) => Promise<void>;
  shareToSocialMedia: (platform: string, url: string, text?: string) => void;
  shareViaWebAPI: (url: string, title?: string, text?: string) => Promise<void>;
  generateQRCode: (url: string) => string;
}

export const useShareUtils = (): ShareUtilsReturn => {
  const { toast } = useToast();

  const generateShareableURL = (greetingData: GreetingFormData, customEvent?: EventType): string => {
    const payload = buildPayloadForSharing(greetingData, customEvent);
    const params = new URLSearchParams();

    Object.entries(payload).forEach(([k, v]) => {
      if (v === undefined || v === null) return;
      if (Array.isArray(v) || typeof v === "object") {
        params.set(k, JSON.stringify(v));
      } else {
        params.set(k, String(v));
      }
    });

    return `${window.location.origin}/?${params.toString()}`;
  };

  const copyShareLink = async (url: string): Promise<void> => {
    try {
      await navigator.clipboard.writeText(url);
      toast({
        title: "Link copied!",
        description: "Shareable link has been copied to your clipboard.",
      });
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Failed to copy link to clipboard.",
        variant: "destructive",
      });
    }
  };

  const shareToSocialMedia = (platform: string, url: string, text: string = "Check out this amazing greeting!"): void => {
    let shareURL = '';
    
    switch (platform) {
      case 'whatsapp':
        shareURL = `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`;
        break;
      case 'facebook':
        shareURL = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'twitter':
        shareURL = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
        break;
      case 'telegram':
        shareURL = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
        break;
      case 'linkedin':
        shareURL = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        break;
      default:
        return;
    }
    
    window.open(shareURL, '_blank', 'width=600,height=400');
  };

  const shareViaWebAPI = async (url: string, title: string = "Amazing Greeting", text: string = "Check out this greeting!"): Promise<void> => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text,
          url
        });
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          await copyShareLink(url);
        }
      }
    } else {
      await copyShareLink(url);
    }
  };

  const generateQRCode = (url: string): string => {
    return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(url)}`;
  };

  return {
    generateShareableURL,
    copyShareLink,
    shareToSocialMedia,
    shareViaWebAPI,
    generateQRCode,
  };
};

// Helper function to build payload for sharing
const buildPayloadForSharing = (greetingData: GreetingFormData, customEvent?: EventType) => {
  return {
    ...greetingData,
    ...(customEvent ? { customEventName: customEvent.label, customEventEmoji: customEvent.emoji } : {}),
    texts: greetingData.texts || [],
    media: greetingData.media || [],
    emojis: greetingData.emojis || [],
  };
};