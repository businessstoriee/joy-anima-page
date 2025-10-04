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
    if (!currentLanguage) return;

    // Extract relevant info from greetingData
    const firstImage = greetingData?.media?.find(item => item.type === 'image')?.url;
    const firstText = greetingData?.texts?.[0]?.content;
    const senderName = greetingData?.senderName || "Someone";
    const eventEmoji = greetingData?.emojis || "🎉";
    const eventDisplay = customEventName || eventType;

    // --- Build Title ---
    let finalTitle = title 
      || `${eventEmoji} Sending you ${eventDisplay} Greetings from ${senderName}`;

    // --- Build Description ---
    let finalDescription = description 
      || (firstText 
          ? firstText.length > 160 
            ? `${firstText.substring(0, 157)}...`
            : firstText
          : `Create beautiful ${eventDisplay} greetings with animations, music & custom messages.`);

    const seoEventType = eventType === 'custom' && customEventName 
      ? customEventName.toLowerCase().replace(/\s+/g, '-')
      : eventType;

    // Generate base SEO
    const seoData = generateAdvancedSEO(seoEventType, currentLanguage.code);

    // Override with our custom values
    seoData.title = finalTitle;
    seoData.description = finalDescription;

    // Open Graph / Twitter cards
    seoData.ogTitle = finalTitle;
    seoData.ogDescription = finalDescription;
    if (firstImage) {
      seoData.ogImage = firstImage;
      seoData.twitterImage = firstImage;
    }

    // Add event-specific keywords
    if (customEventName) {
      seoData.keywords = [
        ...seoData.keywords,
        customEventName.toLowerCase(),
        `${customEventName.toLowerCase()} cards`,
        `${customEventName.toLowerCase()} greetings`
      ];
    }

    // Preview Mode
    if (isPreview) {
      seoData.title = `Preview: ${seoData.title}`;
      seoData.robots = 'noindex, nofollow';
    }

    updateAdvancedPageSEO(seoData);
  }, [eventType, customEventName, currentLanguage, isPreview, title, description, greetingData]);

  return null;
};

export default SEOManager;
