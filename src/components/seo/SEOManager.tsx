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
    const receiverName = greetingData?.receiverName || "You";
    const eventEmoji = greetingData?.emojis || "🎉";
    const eventDisplay = customEventName || eventType;

    // --- Build Title ---
    let finalTitle = title 
      || `${eventEmoji} ${eventDisplay} Greeting${senderName !== "Someone" ? ` from ${senderName}` : ''}${receiverName !== "You" ? ` to ${receiverName}` : ''}`;

    // --- Build Description ---
    let finalDescription = description 
      || (firstText 
          ? firstText.length > 155 
            ? `${firstText.substring(0, 152)}...`
            : firstText
          : `${senderName !== "Someone" ? senderName : 'Someone'} sent you a beautiful ${eventDisplay} greeting${greetingData?.media?.length ? ` with ${greetingData.media.length} ${greetingData.media.length === 1 ? 'photo' : 'photos'}` : ''}, animations, and heartfelt wishes.`);

    const seoEventType = eventType === 'custom' && customEventName 
      ? customEventName.toLowerCase().replace(/\s+/g, '-')
      : eventType;

    // Generate base SEO
    const seoData = generateAdvancedSEO(seoEventType, currentLanguage.code);

    // Override with our custom values
    seoData.title = finalTitle;
    seoData.description = finalDescription;

    // Open Graph / Twitter cards - Enhanced with all greeting details
    seoData.ogTitle = finalTitle;
    seoData.ogDescription = finalDescription;
    seoData.ogType = 'article';
    seoData.twitterCard = 'summary_large_image';
    
    // Use first image from media for social preview (CRITICAL for WhatsApp, Facebook, Twitter)
    if (firstImage) {
      seoData.ogImage = firstImage;
      seoData.twitterImage = firstImage;
      seoData.ogImageAlt = `${eventDisplay} greeting ${firstText ? 'with message' : ''}`;
    }
    
    // Add structured data for rich social previews
    seoData.structuredData = {
      "@context": "https://schema.org",
      "@type": "Message",
      "name": finalTitle,
      "description": finalDescription,
      "sender": {
        "@type": "Person",
        "name": senderName
      },
      "recipient": {
        "@type": "Person",
        "name": greetingData?.receiverName || "You"
      },
      "about": eventDisplay,
      ...(firstImage && {
        "image": firstImage
      }),
      "datePublished": new Date().toISOString(),
      "text": firstText || "",
      "keywords": [eventDisplay, "greeting card", "personalized message", senderName].join(", ")
    };

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