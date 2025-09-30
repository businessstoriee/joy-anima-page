export interface AdvancedSEOData {
  title: string;
  description: string;
  keywords: string[];
  ogTitle: string;
  ogDescription: string;
  ogImage?: string;
  canonical?: string;
  lang: string;
  structuredData?: any;
  hrefLang?: Record<string, string>;
  robots?: string;
}

// Comprehensive SEO data for all languages and countries
export const languageSEOMap: Record<string, Record<string, AdvancedSEOData>> = {
  // English variants
  birthday: {
    en: {
      title: 'Beautiful Birthday Greeting Cards | Create & Share Free Online',
      description: 'Create stunning personalized birthday greeting cards with animations, music, and custom messages. Share beautiful birthday wishes with friends and family worldwide.',
      keywords: ['birthday cards', 'birthday greetings', 'personalized cards', 'free birthday cards', 'online greeting cards', 'birthday wishes', 'custom birthday cards'],
      ogTitle: 'Beautiful Birthday Greeting Cards - Free & Personalized',
      ogDescription: 'Create and share stunning birthday greeting cards with custom animations, music, and messages.',
      lang: 'en',
      structuredData: {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": "Birthday Greeting Cards",
        "description": "Create beautiful birthday greeting cards online",
        "url": window.location.origin,
        "applicationCategory": "Entertainment",
        "operatingSystem": "Web Browser"
      }
    },
    'en-US': {
      title: 'Beautiful Birthday Greeting Cards | Create & Share Free - USA',
      description: 'Create stunning personalized birthday greeting cards with animations, music, and custom messages. Share beautiful birthday wishes across America.',
      keywords: ['birthday cards USA', 'American birthday greetings', 'personalized cards', 'free birthday cards'],
      ogTitle: 'Beautiful Birthday Greeting Cards - Free & Personalized in USA',
      ogDescription: 'Create and share stunning birthday greeting cards with custom animations, music, and messages across America.',
      lang: 'en-US'
    },
    'en-GB': {
      title: 'Beautiful Birthday Greeting Cards | Create & Share Free - UK',
      description: 'Create stunning personalised birthday greeting cards with animations, music, and custom messages. Share beautiful birthday wishes across Britain.',
      keywords: ['birthday cards UK', 'British birthday greetings', 'personalised cards', 'free birthday cards'],
      ogTitle: 'Beautiful Birthday Greeting Cards - Free & Personalised in UK',
      ogDescription: 'Create and share stunning birthday greeting cards with custom animations, music, and messages across Britain.',
      lang: 'en-GB'
    }
  },

  // Hindi (India)
  birthday_hi: {
    hi: {
      title: 'सुंदर जन्मदिन की शुभकामना कार्ड | मुफ्त ऑनलाइन बनाएं और साझा करें',
      description: 'एनीमेशन, संगीत और कस्टम संदेशों के साथ शानदार व्यक्तिगत जन्मदिन ग्रीटिंग कार्ड बनाएं। दोस्तों और परिवार के साथ सुंदर जन्मदिन की शुभकामनाएं साझा करें।',
      keywords: ['जन्मदिन कार्ड', 'जन्मदिन की शुभकामनाएं', 'व्यक्तिगत कार्ड', 'मुफ्त जन्मदिन कार्ड', 'ऑनलाइन ग्रीटिंग कार्ड'],
      ogTitle: 'सुंदर जन्मदिन ग्रीटिंग कार्ड - मुफ्त और व्यक्तिगत',
      ogDescription: 'कस्टम एनीमेशन, संगीत और संदेशों के साथ शानदार जन्मदिन ग्रीटिंग कार्ड बनाएं और साझा करें।',
      lang: 'hi',
      structuredData: {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": "जन्मदिन ग्रीटिंग कार्ड",
        "description": "ऑनलाइन सुंदर जन्मदिन ग्रीटिंग कार्ड बनाएं",
        "url": window.location.origin,
        "applicationCategory": "मनोरंजन",
        "operatingSystem": "वेब ब्राउज़र",
        "inLanguage": "hi"
      }
    }
  },

  // Spanish
  birthday_es: {
    es: {
      title: 'Hermosas Tarjetas de Felicitación de Cumpleaños | Crear y Compartir Gratis',
      description: 'Crea tarjetas de felicitación de cumpleaños personalizadas con animaciones, música y mensajes personalizados. Comparte hermosos deseos de cumpleaños.',
      keywords: ['tarjetas de cumpleaños', 'felicitaciones de cumpleaños', 'tarjetas personalizadas', 'tarjetas gratis'],
      ogTitle: 'Hermosas Tarjetas de Cumpleaños - Gratis y Personalizadas',
      ogDescription: 'Crea y comparte hermosas tarjetas de felicitación de cumpleaños con animaciones, música y mensajes personalizados.',
      lang: 'es'
    }
  },

  // French
  birthday_fr: {
    fr: {
      title: 'Belles Cartes d\'Anniversaire | Créer et Partager Gratuitement',
      description: 'Créez de superbes cartes de vœux d\'anniversaire personnalisées avec des animations, de la musique et des messages personnalisés.',
      keywords: ['cartes d\'anniversaire', 'vœux d\'anniversaire', 'cartes personnalisées', 'cartes gratuites'],
      ogTitle: 'Belles Cartes d\'Anniversaire - Gratuites et Personnalisées',
      ogDescription: 'Créez et partagez de superbes cartes de vœux d\'anniversaire avec des animations, de la musique et des messages personnalisés.',
      lang: 'fr'
    }
  },

  // German
  birthday_de: {
    de: {
      title: 'Schöne Geburtstagskarten | Kostenlos Erstellen und Teilen',
      description: 'Erstellen Sie wunderschöne personalisierte Geburtstagskarten mit Animationen, Musik und benutzerdefinierten Nachrichten.',
      keywords: ['Geburtstagskarten', 'Geburtstagsgrüße', 'personalisierte Karten', 'kostenlose Karten'],
      ogTitle: 'Schöne Geburtstagskarten - Kostenlos und Personalisiert',
      ogDescription: 'Erstellen und teilen Sie wunderschöne Geburtstagskarten mit Animationen, Musik und benutzerdefinierten Nachrichten.',
      lang: 'de'
    }
  },

  // Diwali - Hindi
  diwali_hi: {
    hi: {
      title: 'दिवाली ग्रीटिंग कार्ड | रोशनी के त्योहार की शुभकामनाएं',
      description: 'पारंपरिक डिजाइन, एनीमेशन और व्यक्तिगत संदेशों के साथ सुंदर दिवाली ग्रीटिंग कार्ड बनाएं। रोशनी के त्योहार की खुशी साझा करें।',
      keywords: ['दिवाली कार्ड', 'दिवाली की शुभकामनाएं', 'रोशनी का त्योहार', 'हिंदू त्योहार', 'त्योहारी कार्ड'],
      ogTitle: 'दिवाली ग्रीटिंग कार्ड - रोशनी का त्योहार',
      ogDescription: 'पारंपरिक डिजाइन और एनीमेशन के साथ सुंदर, व्यक्तिगत दिवाली ग्रीटिंग कार्ड के साथ दिवाली मनाएं।',
      lang: 'hi',
      structuredData: {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": "दिवाली ग्रीटिंग कार्ड",
        "description": "दिवाली के लिए सुंदर ग्रीटिंग कार्ड बनाएं",
        "url": window.location.origin,
        "applicationCategory": "त्योहार",
        "inLanguage": "hi"
      }
    }
  },

  // Christmas
  christmas: {
    en: {
      title: 'Christmas Greeting Cards | Holiday Wishes & Festive Joy',
      description: 'Create magical Christmas greeting cards with festive animations, holiday music, and warm personalized messages. Spread Christmas joy worldwide.',
      keywords: ['christmas cards', 'holiday greetings', 'christmas wishes', 'festive cards', 'holiday cards', 'xmas cards'],
      ogTitle: 'Christmas Greeting Cards - Holiday Magic',
      ogDescription: 'Spread Christmas joy with beautiful, personalized greeting cards featuring festive animations and music.',
      lang: 'en',
      structuredData: {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": "Christmas Greeting Cards",
        "description": "Create beautiful Christmas greeting cards online",
        "url": window.location.origin,
        "applicationCategory": "Entertainment",
        "seasonality": "Christmas"
      }
    }
  },

   'sweet-sixteen': {
    en: {
      title: 'Sweet Sixteen Birthday Cards | Celebrate in Style',
      description: 'Design glamorous Sweet Sixteen birthday cards with animations, music, and heartfelt wishes.',
      keywords: ['sweet sixteen cards', '16th birthday wishes', 'milestone birthday cards'],
      ogTitle: 'Sweet Sixteen - Free & Personalized Cards',
      ogDescription: 'Celebrate Sweet Sixteen with stunning personalized cards featuring music and animations.',
      lang: 'en',
      structuredData: {
        "@context": "https://schema.org",
        "@type": "Event",
        "name": "Sweet Sixteen Celebration",
        "eventStatus": "https://schema.org/EventScheduled",
        "eventAttendanceMode": "https://schema.org/OnlineEventAttendanceMode",
        "description": "Create and share Sweet Sixteen birthday cards online",
        "inLanguage": "en",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        }
      }
    },
    hi: {
      title: 'स्वीट सिक्सटीन जन्मदिन कार्ड | स्टाइल में जश्न मनाएं',
      description: 'एनिमेशन, म्यूजिक और प्यारे संदेशों के साथ स्वीट सिक्सटीन कार्ड डिज़ाइन करें।',
      keywords: ['स्वीट सिक्सटीन कार्ड', '16वां जन्मदिन शुभकामनाएं', 'माइलस्टोन जन्मदिन'],
      ogTitle: 'स्वीट सिक्सटीन - मुफ्त और पर्सनलाइज्ड कार्ड',
      ogDescription: 'संगीत और एनिमेशन के साथ शानदार स्वीट सिक्सटीन कार्ड बनाएं और भेजें।',
      lang: 'hi'
    }
    // ... other languages
  },

  'milestone-birthday': {
    en: {
      title: 'Milestone Birthday Cards | Celebrate Big Moments',
      description: 'Send milestone birthday greetings for 18th, 21st, 30th, 50th birthdays and more.',
      keywords: ['milestone birthday cards', 'big birthday celebrations', 'birthday wishes online'],
      ogTitle: 'Milestone Birthdays - Celebrate Big Moments',
      ogDescription: 'Mark life’s milestones with beautiful birthday cards online.',
      lang: 'en',
      structuredData: {
        "@context": "https://schema.org",
        "@type": "Event",
        "name": "Milestone Birthday Celebration",
        "eventStatus": "https://schema.org/EventScheduled",
        "eventAttendanceMode": "https://schema.org/OnlineEventAttendanceMode",
        "description": "Create and share milestone birthday cards online",
        "inLanguage": "en",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        }
      }
    }
    // ... translations
  },

  'holi': {
    en: {
      title: 'Holi Cards | Festival of Colors Greetings',
      description: 'Send colorful animated Holi cards with music and vibrant designs.',
      keywords: ['holi greetings', 'festival of colors cards', 'happy holi online'],
      ogTitle: 'Happy Holi - Free & Colorful Cards',
      ogDescription: 'Celebrate Holi with free animated greeting cards online.',
      lang: 'en',
      structuredData: {
        "@context": "https://schema.org",
        "@type": "Festival",
        "name": "Holi Festival",
        "eventStatus": "https://schema.org/EventScheduled",
        "description": "Celebrate Holi with animated greeting cards online",
        "inLanguage": "en",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        }
      }
    }
    // ... translations
  },
  
  // Eid (Arabic)
  eid_ar: {
    ar: {
      title: 'بطاقات تهنئة العيد | أجمل التهاني والأماني',
      description: 'أنشئ بطاقات تهنئة العيد الجميلة مع الرسوم المتحركة والموسيقى والرسائل الشخصية. شارك فرحة العيد مع الأحباء.',
      keywords: ['بطاقات العيد', 'تهاني العيد', 'بطاقات شخصية', 'العيد مبارك'],
      ogTitle: 'بطاقات تهنئة العيد - جميلة وشخصية',
      ogDescription: 'أنشئ وشارك بطاقات تهنئة العيد الجميلة مع الرسوم المتحركة والموسيقى والرسائل الشخصية.',
      lang: 'ar'
    }
  }
};


export const generateAdvancedSEO = (
  eventType: string, 
  lang: string = 'en', 
  country?: string
): AdvancedSEOData => {
  const key = `${eventType}_${lang}`;
  const countryKey = country ? `${lang}-${country.toUpperCase()}` : lang;
  
  // Try to find specific language/country combination first
  const seoData = languageSEOMap[key]?.[countryKey] || 
                  languageSEOMap[key]?.[lang] ||
                  languageSEOMap[eventType]?.[countryKey] ||
                  languageSEOMap[eventType]?.[lang];

  if (seoData) {
    return {
      ...seoData,
      canonical: `${window.location.origin}/${lang}/${eventType}`,
      hrefLang: generateHrefLangAlternates(eventType),
      robots: 'index, follow, max-image-preview:large'
    };
  }

  // Default fallback
  return {
    title: `Beautiful ${eventType.charAt(0).toUpperCase() + eventType.slice(1)} Greeting Cards | Create & Share Free`,
    description: `Create stunning personalized ${eventType} greeting cards with animations, music, and custom messages. Share beautiful wishes worldwide.`,
    keywords: [`${eventType} cards`, `${eventType} greetings`, 'personalized cards', 'free greeting cards'],
    ogTitle: `Beautiful ${eventType.charAt(0).toUpperCase() + eventType.slice(1)} Greeting Cards - Free & Personalized`,
    ogDescription: `Create and share stunning ${eventType} greeting cards with custom animations, music, and messages.`,
    lang: lang,
    canonical: `${window.location.origin}/${lang}/${eventType}`,
    robots: 'index, follow'
  };
};

const generateHrefLangAlternates = (eventType: string): Record<string, string> => {
  const baseUrl = window.location.origin;
  return {
    'en': `${baseUrl}/en/${eventType}`,
    'hi': `${baseUrl}/hi/${eventType}`,
    'es': `${baseUrl}/es/${eventType}`,
    'fr': `${baseUrl}/fr/${eventType}`,
    'de': `${baseUrl}/de/${eventType}`,
    'ar': `${baseUrl}/ar/${eventType}`,
    'x-default': `${baseUrl}/${eventType}`
  };
};

export const updateAdvancedPageSEO = (seoData: AdvancedSEOData) => {
  // Update document title
  document.title = seoData.title;

  // Update or create meta tags
  const updateMeta = (property: string, content: string, isProperty = false) => {
    const selector = isProperty ? `meta[property="${property}"]` : `meta[name="${property}"]`;
    let meta = document.querySelector(selector);
    
    if (!meta) {
      meta = document.createElement('meta');
      if (isProperty) {
        meta.setAttribute('property', property);
      } else {
        meta.setAttribute('name', property);
      }
      document.head.appendChild(meta);
    }
    
    meta.setAttribute('content', content);
  };

  // Basic meta tags
  updateMeta('description', seoData.description);
  updateMeta('keywords', seoData.keywords.join(', '));
  updateMeta('robots', seoData.robots || 'index, follow');
  updateMeta('viewport', 'width=device-width, initial-scale=1');
  updateMeta('author', 'Greeting Cards Creator');

  // Open Graph tags
  updateMeta('og:type', 'website', true);
  updateMeta('og:title', seoData.ogTitle, true);
  updateMeta('og:description', seoData.ogDescription, true);
  updateMeta('og:url', window.location.href, true);
  updateMeta('og:site_name', 'Beautiful Greeting Cards', true);
  updateMeta('og:locale', seoData.lang, true);
  
  if (seoData.ogImage) {
    updateMeta('og:image', seoData.ogImage, true);
    updateMeta('og:image:alt', seoData.ogTitle, true);
  }

  // Twitter Card tags
  updateMeta('twitter:card', 'summary_large_image');
  updateMeta('twitter:title', seoData.ogTitle);
  updateMeta('twitter:description', seoData.ogDescription);
  if (seoData.ogImage) {
    updateMeta('twitter:image', seoData.ogImage);
  }

  // Language and direction
  document.documentElement.lang = seoData.lang;
  if (seoData.lang === 'ar' || seoData.lang === 'he') {
    document.documentElement.dir = 'rtl';
  } else {
    document.documentElement.dir = 'ltr';
  }

  // Canonical URL
  if (seoData.canonical) {
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', seoData.canonical);
  }

  // Hreflang alternates
  if (seoData.hrefLang) {
    // Remove existing hreflang tags
    document.querySelectorAll('link[rel="alternate"]').forEach(link => link.remove());
    
    Object.entries(seoData.hrefLang).forEach(([lang, url]) => {
      const link = document.createElement('link');
      link.setAttribute('rel', 'alternate');
      link.setAttribute('hreflang', lang);
      link.setAttribute('href', url);
      document.head.appendChild(link);
    });
  }

  // Structured Data
  if (seoData.structuredData) {
    let structuredDataScript = document.querySelector('script[type="application/ld+json"]') as HTMLScriptElement;
    if (!structuredDataScript) {
      structuredDataScript = document.createElement('script');
      structuredDataScript.type = 'application/ld+json';
      document.head.appendChild(structuredDataScript);
    }
    structuredDataScript.textContent = JSON.stringify(seoData.structuredData);
  }

  // Additional mobile optimization
  updateMeta('format-detection', 'telephone=no');
  updateMeta('mobile-web-app-capable', 'yes');
  updateMeta('apple-mobile-web-app-capable', 'yes');
  updateMeta('apple-mobile-web-app-status-bar-style', 'default');
};