// hooks/useFirebaseGreetings.ts
import { useState, useCallback, useEffect } from 'react';
import { collection, doc, setDoc, getDoc, serverTimestamp, updateDoc, increment, query, where, getDocs, writeBatch } from 'firebase/firestore';
import { ref, deleteObject } from 'firebase/storage';
import { db, storage } from '@/utils/firebase/firebase';
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
  isPublic: boolean;
  firstMedia?: string;
  firstText?: string;
  media?: Array<{ url: string; type: string }>;
}

export function useFirebaseGreetings() {
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [savedGreetings, setSavedGreetings] = useState<SavedGreeting[]>([]);

  // Cleanup old greetings (30+ days old) and their media files
  const cleanupOldGreetings = useCallback(async () => {
    try {
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const greetingsRef = collection(db, 'greetings');
      const oldGreetingsQuery = query(
        greetingsRef,
        where('createdAt', '<', thirtyDaysAgo)
      );
      
      const querySnapshot = await getDocs(oldGreetingsQuery);
      
      if (querySnapshot.empty) {
        console.log('🧹 No old greetings to cleanup');
        return;
      }

      // Delete media files from Storage first
      const mediaDeletePromises: Promise<void>[] = [];
      querySnapshot.docs.forEach((docSnap) => {
        const data = docSnap.data();
        
        // Delete media files
        if (data.media && Array.isArray(data.media)) {
          data.media.forEach((mediaItem: any) => {
            if (mediaItem.url && mediaItem.url.includes('firebasestorage.googleapis.com')) {
              const promise = deleteMediaFromUrl(mediaItem.url).catch(err => 
                console.warn('⚠️ Failed to delete media file:', err)
              );
              mediaDeletePromises.push(promise);
            }
          });
        }

        // Delete background image if it's from Firebase Storage
        if (data.backgroundSettings?.imageUrl && 
            data.backgroundSettings.imageUrl.includes('firebasestorage.googleapis.com')) {
          const promise = deleteMediaFromUrl(data.backgroundSettings.imageUrl).catch(err => 
            console.warn('⚠️ Failed to delete background image:', err)
          );
          mediaDeletePromises.push(promise);
        }

        // Delete audio file if it's from Firebase Storage
        if (data.audioUrl && data.audioUrl.includes('firebasestorage.googleapis.com')) {
          const promise = deleteMediaFromUrl(data.audioUrl).catch(err => 
            console.warn('⚠️ Failed to delete audio file:', err)
          );
          mediaDeletePromises.push(promise);
        }
      });

      // Wait for all media deletions
      await Promise.allSettled(mediaDeletePromises);
      console.log(`🗑️ Deleted ${mediaDeletePromises.length} media files`);

      // Delete Firestore documents
      const batch = writeBatch(db);
      querySnapshot.docs.forEach((doc) => {
        batch.delete(doc.ref);
      });

      await batch.commit();
      console.log(`🗑️ Cleaned up ${querySnapshot.docs.length} old greetings`);
    } catch (error) {
      console.warn('⚠️ Failed to cleanup old greetings:', error);
    }
  }, []);

  // Helper function to delete media from Firebase Storage URL
  const deleteMediaFromUrl = async (url: string): Promise<void> => {
    try {
      // Extract the file path from Firebase Storage URL
      const decodedUrl = decodeURIComponent(url);
      const pathMatch = decodedUrl.match(/\/o\/(.+?)\?/);
      
      if (!pathMatch || !pathMatch[1]) {
        console.warn('⚠️ Could not extract file path from URL:', url);
        return;
      }

      const filePath = pathMatch[1];
      const fileRef = ref(storage, filePath);
      
      await deleteObject(fileRef);
      console.log('✅ Deleted media file:', filePath);
    } catch (error: any) {
      // Ignore "object not found" errors as the file may already be deleted
      if (error.code !== 'storage/object-not-found') {
        throw error;
      }
    }
  };

  // Run cleanup on hook initialization (once per session)
  useEffect(() => {
    const hasCleanedThisSession = sessionStorage.getItem('greetings-cleaned');
    if (!hasCleanedThisSession) {
      // Delay cleanup to not block initial load
      setTimeout(() => {
        cleanupOldGreetings();
        sessionStorage.setItem('greetings-cleaned', 'true');
      }, 2000);
    }
  }, [cleanupOldGreetings]);

  // helper: slug generator (deterministic)
  const generateSlug = (senderName: string, receiverName: string, eventName: string): string => {
    const sanitize = (str: string) =>
      (str || '')
        .toString()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
    return `${sanitize(senderName || 'someone')}-wishes-${sanitize(receiverName || 'you')}-${sanitize(eventName || 'event')}`;
  };

  // Save greeting (stable reference)
  const saveGreeting = useCallback(async (greetingData: GreetingFormData, title?: string, isPublic: boolean = false): Promise<string | null> => {
    console.log('🔥 useFirebaseGreetings.saveGreeting: starting');
    setIsSaving(true);
    try {
      const eventName = greetingData.eventType === 'custom' ? (greetingData.customEventName || 'custom') : (greetingData.eventType || 'event');
      const slug = generateSlug(greetingData.senderName || 'someone', greetingData.receiverName || 'you', eventName);

      const greetingPayload = {
        id: slug,
        userId: null,
        title: title || `${greetingData.senderName || 'Someone'} wishes ${greetingData.receiverName || 'You'}`,
        slug,
        eventType: greetingData.eventType,
        eventName,
        eventEmoji: greetingData.eventType === 'custom' ? (greetingData.customEventEmoji || '🎉') : '🎉',
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
        headerText: greetingData.headerText || null,
        eventNameStyle: greetingData.eventNameStyle || null,
        eventEmojiSettings: greetingData.eventEmojiSettings || null,
        isPublic: isPublic,
        firstMedia: greetingData.media?.[0]?.url || '',
        firstText: greetingData.texts?.[0]?.content || '',
        viewCount: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      const greetingRef = doc(collection(db, 'greetings'), slug);
      console.log('💾 useFirebaseGreetings.saveGreeting: saving slug=', slug);
      await setDoc(greetingRef, greetingPayload);
      console.log('✅ useFirebaseGreetings.saveGreeting: saved');
      // Optionally update local savedGreetings
      setSavedGreetings(prev => [{ 
        id: slug, 
        title: greetingPayload.title, 
        slug, 
        eventType: greetingPayload.eventType, 
        eventName, 
        eventEmoji: greetingPayload.eventEmoji, 
        senderName: greetingPayload.senderName, 
        receiverName: greetingPayload.receiverName, 
        createdAt: greetingPayload.createdAt, 
        viewCount: 0, 
        isPublic: isPublic,
        firstMedia: greetingPayload.firstMedia,
        firstText: greetingPayload.firstText
      }, ...prev]);
      return slug;
    } catch (err) {
      console.error('❌ useFirebaseGreetings.saveGreeting error:', err);
      return null;
    } finally {
      setIsSaving(false);
    }
  }, []);

  // Load greeting (stable reference). increments viewCount in background (non-blocking)
  const loadGreeting = useCallback(async (slug: string): Promise<GreetingFormData | null> => {
    if (!slug) {
      console.warn('useFirebaseGreetings.loadGreeting: no slug provided');
      return null;
    }

    console.log('🔄 useFirebaseGreetings.loadGreeting: loading slug=', slug);
    setIsLoading(true);
    try {
      const greetingRef = doc(db, 'greetings', slug);
      const docSnap = await getDoc(greetingRef);

      if (!docSnap.exists()) {
        console.warn('❌ useFirebaseGreetings.loadGreeting: document not found for slug=', slug);
        return null;
      }

      const data: any = docSnap.data();
      console.log('✅ Successfully loaded data from Firebase:', JSON.stringify(data, null, 2));

      // Build processed payload for frontend
      const processed: GreetingFormData = {
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
        videoPosition: { width: 400, height: 300 },
        headerText: data.headerText || {
          id: "header-text",
          content: "",
          style: {
            fontSize: "32px",
            fontWeight: "bold",
            color: "hsl(var(--primary))",
            textAlign: "center",
            fontFamily: "inherit"
          },
          animation: "fade"
        },
        eventNameStyle: data.eventNameStyle || {
          id: "event-name",
          content: "",
          style: {
            fontSize: "28px",
            fontWeight: "bold",
            color: "hsl(var(--foreground))",
            textAlign: "center",
            fontFamily: "inherit"
          },
          animation: "fade"
        },
        eventEmojiSettings: data.eventEmojiSettings || {
          emoji: "🎉",
          size: 64,
          animation: "bounce",
          rotateSpeed: 2,
          position: { x: 50, y: 50 },
          effects: {
            glow: false,
            bounce: true,
            rotate: false
          }
        },
      };

      console.log('✅ useFirebaseGreetings.loadGreeting: processed data ready');

      // Increment viewCount asynchronously (don't block UI)
      // We intentionally do not await this to avoid delaying the returned data.
      (async () => {
        try {
          await updateDoc(greetingRef, { viewCount: increment(1) });
          console.log('📈 useFirebaseGreetings.loadGreeting: viewCount incremented');
        } catch (err) {
          console.warn('⚠️ useFirebaseGreetings.loadGreeting: failed to increment viewCount', err);
        }
      })();

      console.log('🎯 Processed data for frontend:', JSON.stringify(processed, null, 2));
      return processed;
    } catch (err) {
      console.error('❌ useFirebaseGreetings.loadGreeting error:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getAITextSuggestions = useCallback(async (eventType: string): Promise<string[]> => {
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
  }, []);

  // Fetch public greetings for home page feed
  const getPublicGreetings = useCallback(async (limit: number = 20): Promise<SavedGreeting[]> => {
    try {
      const greetingsRef = collection(db, 'greetings');
      const publicQuery = query(
        greetingsRef,
        where('isPublic', '==', true)
      );
      
      const querySnapshot = await getDocs(publicQuery);
      const publicGreetings: SavedGreeting[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        publicGreetings.push({
          id: data.id,
          title: data.title,
          slug: data.slug,
          eventType: data.eventType,
          eventName: data.eventName,
          eventEmoji: data.eventEmoji,
          senderName: data.senderName,
          receiverName: data.receiverName,
          createdAt: data.createdAt,
          viewCount: data.viewCount || 0,
          isPublic: data.isPublic,
          firstMedia: data.firstMedia,
          firstText: data.firstText,
          media: data.media?.map((m: any) => ({ url: m.url, type: m.type })) || []
        });
      });
      
      // Sort by creation date (newest first)
      return publicGreetings.sort((a, b) => {
        if (a.createdAt?.seconds && b.createdAt?.seconds) {
          return b.createdAt.seconds - a.createdAt.seconds;
        }
        return 0;
      }).slice(0, limit);
    } catch (error) {
      console.error('❌ Error fetching public greetings:', error);
      return [];
    }
  }, []);

  return {
    isLoading,
    isSaving,
    savedGreetings,
    saveGreeting,
    loadGreeting,
    getAITextSuggestions,
    getPublicGreetings,
  };
}