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
    
    // Enhanced structured data for Google, Google Discover, and Google News
    const currentUrl = window.location.href;
    const mediaItems = greetingData?.media || [];
    const allImages = mediaItems.filter(m => m.type === 'image').map(m => m.url);
    
    seoData.structuredData = {
      "@context": "https://schema.org",
      "@graph": [
        // Article schema for Google News & Discover
        {
          "@type": "Article",
          "@id": `${currentUrl}#article`,
          "headline": finalTitle,
          "description": finalDescription,
          "image": allImages.length > 0 ? allImages : undefined,
          "datePublished": new Date().toISOString(),
          "dateModified": new Date().toISOString(),
          "author": {
            "@type": "Person",
            "name": senderName,
            "@id": `${window.location.origin}/author/${senderName.toLowerCase().replace(/\s+/g, '-')}`
          },
          "publisher": {
            "@type": "Organization",
            "name": "Beautiful Greeting Cards",
            "logo": {
              "@type": "ImageObject",
              "url": `${window.location.origin}/logo.png`
            }
          },
          "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": currentUrl
          },
          "articleSection": eventDisplay,
          "keywords": [eventDisplay, "greeting card", "personalized message", senderName, "celebration"].join(", "),
          "inLanguage": currentLanguage.code,
          "isAccessibleForFree": true,
          "backstory": `A personalized ${eventDisplay} greeting from ${senderName}${receiverName !== "You" ? ` to ${receiverName}` : ''}`
        },
        // CreativeWork schema for better discovery
        {
          "@type": "CreativeWork",
          "@id": `${currentUrl}#creative`,
          "name": finalTitle,
          "description": finalDescription,
          "creator": {
            "@type": "Person",
            "name": senderName
          },
          "about": {
            "@type": "Thing",
            "name": eventDisplay
          },
          "text": firstText || "",
          "image": allImages.length > 0 ? allImages : undefined,
          "dateCreated": new Date().toISOString(),
          "inLanguage": currentLanguage.code
        },
        // SocialMediaPosting schema for social platforms
        {
          "@type": "SocialMediaPosting",
          "@id": `${currentUrl}#social`,
          "headline": finalTitle,
          "articleBody": finalDescription,
          "image": allImages.length > 0 ? allImages : undefined,
          "datePublished": new Date().toISOString(),
          "author": {
            "@type": "Person",
            "name": senderName
          },
          "sharedContent": {
            "@type": "WebPage",
            "url": currentUrl
          },
          "inLanguage": currentLanguage.code
        },
        // Message schema
        {
          "@type": "Message",
          "@id": `${currentUrl}#message`,
          "name": finalTitle,
          "text": firstText || finalDescription,
          "sender": {
            "@type": "Person",
            "name": senderName
          },
          "recipient": {
            "@type": "Person",
            "name": receiverName
          },
          "about": eventDisplay,
          "dateRead": new Date().toISOString(),
          "messageAttachment": allImages.length > 0 ? allImages.map(url => ({
            "@type": "ImageObject",
            "url": url,
            "contentUrl": url
          })) : undefined
        }
      ]
    };

    // Enhanced keywords for better SEO
    const enhancedKeywords = [
      ...seoData.keywords,
      `${eventDisplay} greeting`,
      `personalized ${eventDisplay}`,
      `${eventDisplay} wishes`,
      `${eventDisplay} celebration`,
      `send ${eventDisplay} card`,
      `${eventDisplay} message`,
      'animated greeting card',
      'custom greeting card',
      'free greeting card',
      'online greeting card'
    ];
    
    if (customEventName) {
      enhancedKeywords.push(
        customEventName.toLowerCase(),
        `${customEventName.toLowerCase()} cards`,
        `${customEventName.toLowerCase()} greetings`,
        `happy ${customEventName.toLowerCase()}`,
        `best ${customEventName.toLowerCase()} wishes`
      );
    }
    
    seoData.keywords = enhancedKeywords;
    
    // Add multi-language alternates
    seoData.hrefLang = {
      'en': `${window.location.origin}/en/greeting/${window.location.pathname.split('/').pop()}`,
      'hi': `${window.location.origin}/hi/greeting/${window.location.pathname.split('/').pop()}`,
      'es': `${window.location.origin}/es/greeting/${window.location.pathname.split('/').pop()}`,
      'fr': `${window.location.origin}/fr/greeting/${window.location.pathname.split('/').pop()}`,
      'de': `${window.location.origin}/de/greeting/${window.location.pathname.split('/').pop()}`,
      'ar': `${window.location.origin}/ar/greeting/${window.location.pathname.split('/').pop()}`,
      'pt': `${window.location.origin}/pt/greeting/${window.location.pathname.split('/').pop()}`,
      'ru': `${window.location.origin}/ru/greeting/${window.location.pathname.split('/').pop()}`,
      'ja': `${window.location.origin}/ja/greeting/${window.location.pathname.split('/').pop()}`,
      'zh': `${window.location.origin}/zh/greeting/${window.location.pathname.split('/').pop()}`,
      'x-default': window.location.href
    };

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