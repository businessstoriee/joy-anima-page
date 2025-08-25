import { Separator } from '@/components/ui/separator';
import { useState, useEffect, useRef } from "react";
import { BorderSettings } from '@/types/background';
import BackgroundCustomizer from '../customization/BackgroundCustomizer/BackgroundCustomizer';
import BorderCustomizer from '../customization/BorderCustomizer/BorderCustomizer';
import LayoutSelector from '../customization/LayoutSelector';
import EmojiSelector from '@/components/greeting/contentEditor/EmojiSelector/EmojiSelector';

interface CustomizationFormProps {
  backgroundSettings: any;
  borderSettings: BorderSettings;
  layout: string;
  animationStyle: string;
  emojis: { id: string; emoji: string; position: { x: number; y: number }; size: number; animation: string; }[];
  frameStyle: string;
  onBackgroundChange: (settings: any) => void;
  onBorderChange: (settings: BorderSettings) => void;
  onLayoutChange: (layout: string) => void;
  onAnimationChange: (animation: string) => void;
  onEmojiChange: (emojis: any[]) => void;
  onFrameStyleChange: (frame: string) => void;
}

const CustomizationForm = ({
  backgroundSettings,
  borderSettings,
  layout,
  animationStyle,
  emojis,
  frameStyle,
  onBackgroundChange,
  onBorderChange,
  onLayoutChange,
  onAnimationChange,
  onEmojiChange,
  onFrameStyleChange, 

}: CustomizationFormProps) => {

   const [audioUrl, setAudioUrl] = useState("");

  return (
    <>

     {/* Emoji Decorator */}
      <EmojiSelector
        emojis={emojis}
        onChange={onEmojiChange}
      />

      <Separator />

      {/* Background Customizer */}
      <BackgroundCustomizer
        settings={backgroundSettings}
        onChange={onBackgroundChange}
      />

      <Separator />

      {/* Border Customizer */}
      <BorderCustomizer
        settings={borderSettings}
        onChange={onBorderChange} 
      />

      <Separator />

      {/* Layout & Animation Selector */}
      <LayoutSelector
        layout={layout}
        animationStyle={animationStyle}
        frameStyle = {frameStyle}
        onLayoutChange={onLayoutChange}
        onAnimationChange={onAnimationChange}
        onFrameStyleChange={onFrameStyleChange}
      />
      
      
    </>
  );
};

export default CustomizationForm;


export interface BorderSettingsExtended {
  // keep original field names for compatibility but add new fields
  enabled: boolean;
  styleEnabled?: boolean;
  elementsEnabled?: boolean;
  style: string;
  width: number;

  // original color is kept for backward compatibility; primaryColor mirrors it
  color?: string; // original field (may be used by other files)
  primaryColor?: string; // new preferred name — use color if not supplied
  secondaryColor?: string;
  gradientMode?: boolean;
  gradientValue?: string;

  radius?: number;
  decorativeElements: BorderElementExtended[];
  elementGlobal?: ElementGlobalSettings;
}

export interface BorderElementExtended {
  id: string;
  type: 'image' | 'emoji';
  content: string;
  position: number;
  size: number;
  animation: 'float' | 'rotate-cw' | 'rotate-ccw' | 'blink' | 'pop' | 'travel';
  rotateSpeed?: number;
  travelSpeed?: number;
}

export interface ElementGlobalSettings {
  rotateDirection?: 'clockwise' | 'anticlockwise' | 'both';
  travelEnabled?: boolean;
  travelSpeed?: number;
}