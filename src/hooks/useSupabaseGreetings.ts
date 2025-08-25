import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { GreetingFormData } from '@/types/greeting';

export interface SavedGreeting {
  id: string;
  title: string;
  slug: string;
  event_type: string;
  sender_name: string;
  receiver_name: string;
  created_at: string;
  view_count: number;
}

export function useSupabaseGreetings() {
  const [isLoading, setIsLoading] = useState(false);
  const [savedGreetings, setSavedGreetings] = useState<SavedGreeting[]>([]);

  // Save greeting to database
  const saveGreeting = async (greetingData: GreetingFormData, title?: string): Promise<string | null> => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      // Generate slug using database function
      const eventName = greetingData.eventType === 'custom' 
        ? (greetingData.customEventName || 'custom') 
        : greetingData.eventType;
      
      const { data: slugData, error: slugError } = await supabase.rpc(
        'generate_greeting_slug',
        {
          sender_name: greetingData.senderName || 'Someone',
          receiver_name: greetingData.receiverName || 'You',
          event_name: eventName
        }
      );

      if (slugError) throw slugError;

      const greetingToSave = {
        user_id: user?.id || null,
        title: title || `${greetingData.senderName || 'Someone'} wishes ${greetingData.receiverName || 'You'}`,
        slug: slugData,
        event_type: greetingData.eventType,
        event_name: greetingData.eventType === 'custom' ? greetingData.customEventName : null,
        event_emoji: greetingData.eventType === 'custom' ? greetingData.customEventEmoji : null,
        sender_name: greetingData.senderName || '',
        receiver_name: greetingData.receiverName || '',
        theme: greetingData.theme || null,
        layout: greetingData.layout || 'grid',
        frame_style: greetingData.frameStyle || 'classic',
        animation_style: greetingData.animationStyle || 'fade',
        texts: JSON.stringify(greetingData.texts || []),
        media: JSON.stringify(greetingData.media || []),
        emojis: JSON.stringify(greetingData.emojis || []),
        background_settings: JSON.stringify(greetingData.backgroundSettings || {}),
        border_settings: JSON.stringify(greetingData.borderSettings || {}),
      };

      const { data, error } = await supabase
        .from('greetings')
        .insert(greetingToSave)
        .select('slug')
        .single();

      if (error) throw error;
      
      return data.slug;
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
      const { data, error } = await supabase
        .from('greetings')
        .select('*')
        .eq('slug', slug)
        .single();

      if (error) throw error;

      // Increment view count
      await supabase
        .from('greetings')
        .update({ view_count: (data.view_count || 0) + 1 })
        .eq('id', data.id);

      return {
        eventType: data.event_type,
        customEventName: data.event_name,
        customEventEmoji: data.event_emoji,
        senderName: data.sender_name,
        receiverName: data.receiver_name,
        theme: data.theme,
        layout: data.layout as any,
        frameStyle: data.frame_style as any,
        animationStyle: data.animation_style,
        texts: typeof data.texts === 'string' ? JSON.parse(data.texts) : (data.texts as any || []),
        media: typeof data.media === 'string' ? JSON.parse(data.media) : (data.media as any || []),
        emojis: typeof data.emojis === 'string' ? JSON.parse(data.emojis) : (data.emojis as any || []),
        backgroundSettings: typeof data.background_settings === 'string' ? JSON.parse(data.background_settings) : (data.background_settings as any || {}),
        borderSettings: typeof data.border_settings === 'string' ? JSON.parse(data.border_settings) : (data.border_settings as any || {}),
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

  // Get user's saved greetings
  const getUserGreetings = async (): Promise<SavedGreeting[]> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('greetings')
        .select('id, title, slug, event_type, sender_name, receiver_name, created_at, view_count')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setSavedGreetings(data || []);
      return data || [];
    } catch (error) {
      console.error('Error fetching user greetings:', error);
      return [];
    }
  };

  // Get AI text suggestions
  const getAITextSuggestions = async (eventType: string): Promise<string[]> => {
    try {
      const { data, error } = await supabase
        .from('ai_suggestions')
        .select('content')
        .eq('event_type', eventType)
        .eq('suggestion_type', 'text')
        .limit(1);

      if (error) throw error;
      
      if (data && data.length > 0) {
        const suggestions = data[0].content as any;
        return suggestions?.suggestions || [];
      }
      
      // Fallback suggestions
      return [
        "Wishing you joy and happiness on this special day!",
        "May this moment bring you wonderful memories!",
        "Celebrating you and all the joy you bring to others!"
      ];
    } catch (error) {
      console.error('Error fetching AI suggestions:', error);
      return [];
    }
  };

  return {
    isLoading,
    savedGreetings,
    saveGreeting,
    loadGreeting,
    getUserGreetings,
    getAITextSuggestions,
  };
}