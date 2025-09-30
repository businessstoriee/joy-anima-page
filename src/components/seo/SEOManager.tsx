import { useEffect } from 'react';
import { useLanguageTranslation } from '@/components/language/useLanguageTranslation';
import { generateAdvancedSEO, updateAdvancedPageSEO } from '@/utils/seoEnhanced';

interface SEOManagerProps { 
  title?: string;
  description?: string;
  eventType?: string;
  customEventName?: string;
  isPreview?: boolean;
}


const SEOManager = ({ 
  title,
  description,
  eventType = 'greeting', 
  customEventName, 
  isPreview = false 
}: SEOManagerProps) => {
  const { currentLanguage } = useLanguageTranslation();

  useEffect(() => {
    // Use the passed title/description if they exist
    const finalTitle = title || `${customEventName || eventType} Greeting Cards | Create & Share Free`;
    const finalDescription = description || `Create beautiful ${customEventName || eventType} greeting cards with animations, music, and custom messages.`;

    const seoEventType = eventType === 'custom' && customEventName 
      ? customEventName.toLowerCase().replace(/\s+/g, '-')
      : eventType;

    //const seoData = generateAdvancedSEO(seoEventType, currentLanguage);
    const seoData = generateAdvancedSEO(seoEventType, currentLanguage.code);

    // Override with custom title/description if provided
    if (title) seoData.title = title;
    if (description) seoData.description = description;

    if (eventType === 'custom' && customEventName) {
      seoData.title = finalTitle;
      seoData.description = finalDescription;
      seoData.ogTitle = `${customEventName} Greeting Cards - Free & Personalized`;
      seoData.ogDescription = `Create and share stunning ${customEventName} greeting cards with custom animations, music, and messages.`;
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
  }, [eventType, customEventName, currentLanguage, isPreview, title, description]);

  return null;
};


export default SEOManager;