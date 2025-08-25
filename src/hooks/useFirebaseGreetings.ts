import { useState } from 'react';
import { collection, doc, setDoc, getDoc, serverTimestamp, updateDoc, increment } from 'firebase/firestore';
import { db } from '@/utils/firebase/firebase';
import { GreetingFormData } from '@/types/greeting';

export interface SavedGreeting {
  id: string;
  title: string;
  slug: string;
  eventType: string;
  eventName: string;
  eventEmoji: string;
  senderName: string;
  receiverName: string;
  createdAt: any;
  viewCount: number;
}

export function useFirebaseGreetings() {
  const [isLoading, setIsLoading] = useState(false);
  const [savedGreetings, setSavedGreetings] = useState<SavedGreeting[]>([]);

  // Generate slug for Firebase document
  const generateSlug = (senderName: string, receiverName: string, eventName: string): string => {
    const sanitize = (str: string) => str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    return `${sanitize(senderName || 'someone')}-wishes-${sanitize(receiverName || 'you')}-${sanitize(eventName)}`;
  };

  // Save greeting to Firebase
  const saveGreeting = async (greetingData: GreetingFormData, title?: string): Promise<string | null> => {
    setIsLoading(true);
    try {
      // Determine event name for slug generation
      const eventName = greetingData.eventType === 'custom' 
        ? (greetingData.customEventName || 'custom') 
        : greetingData.eventType;

      // Generate slug
      const slug = generateSlug(
        greetingData.senderName || 'someone',
        greetingData.receiverName || 'you',
        eventName
      );

      const greetingPayload = {
        id: slug,
        userId: null, // You can add Firebase Auth later
        title: title || `${greetingData.senderName || 'Someone'} wishes ${greetingData.receiverName || 'You'}`,
        slug,
        eventType: greetingData.eventType,
        eventName: eventName,
        eventEmoji: greetingData.eventType === 'custom' ? greetingData.customEventEmoji || '🎉' : '🎉',
        senderName: greetingData.senderName || '',
        receiverName: greetingData.receiverName || '',
        audioUrl: greetingData.audioUrl || '',
        theme: greetingData.theme || 'colorful',
        layout: greetingData.layout || 'grid',
        frameStyle: greetingData.frameStyle || 'classic',
        animationStyle: greetingData.animationStyle || 'fade',
        texts: greetingData.texts || [],
        media: greetingData.media || [],
        emojis: greetingData.emojis || [],
        backgroundSettings: greetingData.backgroundSettings || {},
        borderSettings: greetingData.borderSettings || {},
        isPublic: true,
        viewCount: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      // Use slug as document ID
      const greetingRef = doc(collection(db, 'greetings'), slug);
      await setDoc(greetingRef, greetingPayload);
      
      return slug;
    } catch (error) {
      console.error('Error saving greeting:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Load greeting by slug
  const loadGreeting = async (slug: string): Promise<GreetingFormData | null> => {
    setIsLoading(true);
    try {
      const greetingRef = doc(db, 'greetings', slug);
      const docSnap = await getDoc(greetingRef);

      if (!docSnap.exists()) {
        return null;
      }

      const data = docSnap.data();

      // Increment view count
      await updateDoc(greetingRef, {
        viewCount: increment(1)
      });

      return {
        eventType: data.eventType,
        customEventName: data.eventName,
        customEventEmoji: data.eventEmoji,
        senderName: data.senderName,
        receiverName: data.receiverName,
        theme: data.theme,
        layout: data.layout,
        frameStyle: data.frameStyle,
        animationStyle: data.animationStyle,
        texts: data.texts || [],
        media: data.media || [],
        emojis: data.emojis || [],
        backgroundSettings: data.backgroundSettings || {},
        borderSettings: data.borderSettings || {},
        audioUrl: data.audioUrl || '',
        videoUrl: '',
        videoPosition: { width: 400, height: 300 }
      };
    } catch (error) {
      console.error('Error loading greeting:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Get AI text suggestions (placeholder - you can implement AI integration later)
  const getAITextSuggestions = async (eventType: string): Promise<string[]> => {
    // Fallback suggestions based on event type
    const suggestions: Record<string, string[]> = {
      birthday: [
        "Wishing you joy and happiness on your special day! 🎂",
        "May this birthday bring you wonderful memories! 🎉",
        "Happy Birthday! Hope your day is as amazing as you are! 🎈"
      ],
      anniversary: [
        "Celebrating your beautiful journey together! 💕",
        "Wishing you many more years of love and happiness! 💑",
        "Happy Anniversary to an amazing couple! 🥂"
      ],
      graduation: [
        "Congratulations on your achievement! 🎓",
        "Your hard work has paid off! So proud of you! 📚",
        "The future is bright for someone as talented as you! ✨"
      ],
      default: [
        "Wishing you joy and happiness on this special day!",
        "May this moment bring you wonderful memories!",
        "Celebrating you and all the joy you bring to others!"
      ]
    };

    return suggestions[eventType] || suggestions.default;
  };

  return {
    isLoading,
    savedGreetings,
    saveGreeting,
    loadGreeting,
    getAITextSuggestions,
  };
}