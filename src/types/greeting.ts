import { BorderSettings } from '@/types/background';

export interface EventType {
  value: string;
  label: string;
  emoji: string;
  defaultMessage: string;
  theme?: string;
  backgroundImage?: string;
  category?: 'birthday' | 'religious' | 'national' | 'seasonal' | 'personal' | 'special' | 'wellness' | 'professional' | 'international' | 'custom';
}

export interface TextContent {
  id: string;
  content: string;
  position?: { x: number; y: number };
  size?: { width: number; height: number };
  style: {
    fontSize: string;
    fontWeight: string;
    color: string;
    textAlign: 'left' | 'center' | 'right';
    fontFamily?: string;
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
  alt?: string;
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
  effects?: {
    filter?: string;
    rotation?: number;
  };
}

export interface EventEmojiSettings {
  emoji: string;
  size: number;
  animation: string;
  rotateSpeed: number;
  position: { x: number; y: number };
  effects?: {
    glow?: boolean;
    bounce?: boolean;
    rotate?: boolean;
  };
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
  audioUrl?: string;
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
  headerText?: TextContent;
  eventNameStyle?: TextContent;
  eventEmojiSettings?: EventEmojiSettings;
  backgroundSettings: {
    color: string;
    image?: string;
    imageOpacity?: number;
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