// src/types/background.ts
export interface BackgroundSettings {
  enabled?: boolean;
  color: string;
  gradient: {
    enabled: boolean;
    colors: [string, string];
    direction: string;
  };
  animation: {
    enabled: boolean;
    type: string; // 'tsparticles' | 'threejs' | 'fireworks-js' | CSS-name...
    speed: number;
    intensity: number;
    options?: Record<string, any>; // engine-specific options
  };
  pattern: {
    enabled: boolean;
    type: string;
    opacity: number;
  };
}


export interface EmojiItem {
  id: string;
  emoji: string;
  position: { x: number; y: number };
  size: number;
  animation: string;
}





// src/types/background.ts
export interface BorderSettings {
  enabled: boolean;
  style: string;               // css border style: "solid", "dashed", "dotted", etc.
  width: number;               // border width in px
  color?: string;              // legacy
  primaryColor?: string;       // main color
  secondaryColor?: string | null; // secondary color for gradient
  radius: number;              // corner radius in px
  animation?: { enabled: boolean; type: string; speed: number };
  elements?: any[];
  decorativeElements: BorderElement[];
}

export interface BorderElement {
  id: string;
  type: 'image' | 'emoji';
  content: string;
  // position: percentage along perimeter 0..100
  position: number;
  size: number;
  // animations include revolve now
  animation: 'float' | 'rotate-cw' | 'rotate-ccw' | 'blink' | 'pop' | 'bounce' | 'shake' | 'pulse' | 'revolve';
  rotateSpeed?: number; // seconds, used for rotate & revolve duration
}

/**
 * Make settings backward compatible. Keep it simple so index/other files can
 * import this single file.
 */
export function makeCompatibleForLegacy(s: Partial<BorderSettings>): BorderSettings {
  const primary = s.primaryColor || (s as any).color || '#2b2b2b';
  const secondary = (s as any).secondaryColor ?? null;

  const out: BorderSettings = {
    enabled: s.enabled ?? false,
    style: s.style ?? 'solid',
    width: s.width ?? 4,
    color: (s as any).color ?? primary,
    primaryColor: primary,
    secondaryColor: secondary,
    radius: s.radius ?? 8,
    animation: s.animation ?? { enabled: false, type: 'none', speed: 1 },
    elements: s.elements || [],
    decorativeElements: s.decorativeElements || []
  };

  return out;
}
