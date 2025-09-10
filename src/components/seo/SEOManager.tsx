import { useEffect } from 'react';
import { useLanguageTranslation } from '@/components/language/useLanguageTranslation';
import { generateAdvancedSEO, updateAdvancedPageSEO } from '@/utils/seoEnhanced';
import { GreetingFormData } from '@/types/greeting';

interface SEOManagerProps { 
  title?: string;
  description?: string;
  eventType?: string;
  customEventName?: string;
  isPreview?: boolean;
  greetingData?: GreetingFormData;
}


const SEOManager = ({ 
  title,
  description,
  eventType = 'greeting', 
  customEventName, 
  isPreview = false,
  greetingData 
}: SEOManagerProps) => {
  const { currentLanguage } = useLanguageTranslation();

  useEffect(() => {
    // Extract first image and text from greeting data for social sharing
    const firstImage = greetingData?.media?.find(item => item.type === 'image')?.url;
    const firstText = greetingData?.texts?.[0]?.content;

    // Use the passed title/description if they exist
    let finalTitle = title || `${customEventName || eventType} Greeting Cards | Create & Share Free`;
    let finalDescription = description || `Create beautiful ${customEventName || eventType} greeting cards with animations, music, and custom messages.`;
    
    // If we have greeting data, use the first text for more personalized sharing
    if (firstText && !title) {
      finalTitle = `${firstText} - ${customEventName || eventType} Greeting`;
    }
    
    if (firstText && !description) {
      finalDescription = firstText.length > 160 
        ? `${firstText.substring(0, 157)}...` 
        : firstText;
    }

    const seoEventType = eventType === 'custom' && customEventName 
      ? customEventName.toLowerCase().replace(/\s+/g, '-')
      : eventType;

    //const seoData = generateAdvancedSEO(seoEventType, currentLanguage);
    const seoData = generateAdvancedSEO(seoEventType, currentLanguage.code);

    // Override with custom title/description
    seoData.title = finalTitle;
    seoData.description = finalDescription;
    
    // Enhanced OG tags for social sharing
    seoData.ogTitle = finalTitle;
    seoData.ogDescription = finalDescription;
    
    // Add first image for social sharing if available
    if (firstImage) {
      seoData.ogImage = firstImage;
      seoData.twitterImage = firstImage;
    }

    if (eventType === 'custom' && customEventName) {
      seoData.keywords = [
        ...seoData.keywords,
        customEventName.toLowerCase(),
        `${customEventName.toLowerCase()} cards`,
        `${customEventName.toLowerCase()} greetings`
      ];
    }

    if (isPreview) {
      seoData.title = `Preview: ${seoData.title}`;
      seoData.robots = 'noindex, nofollow';
    }

    updateAdvancedPageSEO(seoData);
  }, [eventType, customEventName, currentLanguage, isPreview, title, description, greetingData]);

  return null;
};


export default SEOManager;