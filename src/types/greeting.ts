import { BorderSettings } from '@/types/background';
import { TextSettings } from '@/types/textSettings';

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
    fontStyle?: 'normal' | 'italic' | 'oblique';
    textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
    letterSpacing?: string;
    lineHeight?: string;
  };
  animation: string;
  continuousAnimation?: boolean;
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

// Update the MediaItem type to include frameStyle and layout
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
  frameStyle?: string; // Add frameStyle to MediaItem interface
  layout?: string; // Add individual layout selection for each media item
}

export interface EventEmojiSettings {
  emoji: string;
  size: number;
  animation: string;
  rotateSpeed: number;
  position: { x: number; y: number };
  textAlign?: 'left' | 'center' | 'right';
  effects?: {
    glow?: boolean;
    glowColor?: string;
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
  senderNameStyle?: TextSettings;
  receiverNameStyle?: TextSettings;
  texts: TextContent[];
  media: MediaItem[];
  audioUrl?: string;
  videoUrl: string;
  videoPosition: {
    width: number;
    height: number;
  };
  animationStyle: string;
  layout: 'grid' | 'masonry' | 'carousel' | 'slideshow' | 'polaroid' | 'gallery' | 'hexagon' | 'circular' | 'spiral' | 'wave' | 'floating' | 'orbiting' | 'cascading' | 'vortex' | 'constellation' | 'magnetic' | 'ripple' | 'kaleidoscope' | 'drifting' | 'pulsing';
  layoutGroupOrder?: string[]; // Order of layout groups for display
  frameStyle: 'classic' | 'modern' | 'vintage' | 'polaroid' | 'film' | 'elegant' | 'minimal' | 'neon' | 'romantic' | 'starry' | 'magical' | 'crystal' | 'royal' | 'nature' | 'cosmic' | 'ocean' | 'fire' | 'rainbow';
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
  isPublic?: boolean; // Default false (private)
}