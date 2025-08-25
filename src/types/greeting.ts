import { BorderSettings } from '@/types/background';

export interface EventType {
  value: string;
  label: string;
  emoji: string;
  defaultMessage: string;
  theme?: string;
  backgroundImage?: string;
  category?: 'birthday' | 'religious' | 'national' | 'seasonal' | 'personal' | 'special' | 'custom';
}

export interface TextContent {
  id: string;
  content: string;
  position?: { x: number; y: number };
  style: {
    fontSize: string;
    fontWeight: string;
    color: string;
    textAlign: 'left' | 'center' | 'right';
  };
  animation: string;
}

export interface TextOverlay {
  id: string;
  content: string;
  position: { x: number; y: number };
  style: {
    fontSize: string;
    fontWeight: string;
    color: string;
    textAlign: 'left' | 'center' | 'right';
    backgroundColor?: string;
    padding?: string;
    borderRadius?: string;
  };
}

export interface MediaItem {
  id: string;
  url: string;
  type: 'image' | 'video' | 'gif';
  position: {
    width: number;
    height: number;
    x?: number;
    y?: number;
  };
  animation: string;
  priority: number;
  fileType?: string; 
  textOverlays?: TextOverlay[];
}

export interface GreetingFormData {
  eventType: string;
  customEventName?: string;
  customEventEmoji?: string;
  customEventText?:string;
  senderName: string;
  receiverName: string;
  texts: TextContent[];
  media: MediaItem[];
  audioUrl?: '',
  videoUrl: string;
  videoPosition: {
    width: number;
    height: number;
  };
  animationStyle: string;
  layout: 'grid' | 'masonry' | 'carousel' | 'slideshow' | 'polaroid' | 'gallery' | 'hexagon' | 'circular' | 'spiral' | 'wave';  
  frameStyle: 'classic' | 'modern' | 'vintage' | 'polaroid' | 'film' | 'elegant' | 'minimal' | 'neon' | 'romantic' | 'starry' | 'magical';
  mediaAnimation?: string;
  theme: string;
  backgroundSettings: {
    color: string;
    gradient: {
      enabled: boolean;
      colors: [string, string];
      direction: string;
    };
    animation: {
      enabled: boolean;
      type: string;
      speed: number;
      intensity: number;
    };
    pattern: {
      enabled: boolean;
      type: string;
      opacity: number;
    };
  };
  emojis: {
    id: string;
    emoji: string;
    position: { x: number; y: number };
    size: number;
    animation: string;
  }[];
  borderSettings: BorderSettings;
}