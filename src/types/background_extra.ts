// background_extra.ts
export interface BorderSettingsExtended {
  enabled: boolean;
  style: string;
  width: number;
  primaryColor: string;
  secondaryColor: string;
  radius: number;
  decorativeElements: BorderElementExtended[];
}

export interface BorderElementExtended {
  id: string;
  type: 'image' | 'emoji';
  content: string;
  position: number; // 0-100 slider, interpreted as 0-360° internally (position * 3.6)
  size: number;
  animation: 'float' | 'rotate-cw' | 'rotate-ccw' | 'blink' | 'pop' | 'bounce' | 'shake' | 'pulse' | 'revolve';
  rotateSpeed?: number; // seconds or speed factor (used as seconds)
}

/**
 * Make configuration compatible with code that expects the old background.ts format.
 * This will:
 *  - ensure .color exists (if gradient is used it becomes a CSS linear-gradient string),
 *  - ensure style/width/radius exist,
 *  - ensure decorativeElements is an array.
 */
export function makeCompatibleForLegacy(s: BorderSettingsExtended) {
  const out: any = { ...s };

  // defaults
  out.style = out.style ?? 'solid';
  out.width = typeof out.width === 'number' ? out.width : 4;
  out.radius = out.radius === undefined ? 8 : out.radius;
  out.decorativeElements = out.decorativeElements || [];

  // map primary -> color if color missing
  if (!out.color && out.primaryColor) out.color = out.primaryColor;

  // If secondaryColor differs, embed gradient string into 'color' so legacy consumers get usable gradient CSS.
  if (out.secondaryColor && out.primaryColor && out.primaryColor !== out.secondaryColor) {
    const angle = out.gradient?.angle ?? 90;
    // Provide both gradient metadata and fallback color string.
    out.gradient = {
      enabled: true,
      colors: [out.primaryColor, out.secondaryColor],
      angle,
    };
    // Put a gradient string into color so old code that expects 'color' gets a usable value.
    out.color = `linear-gradient(${angle}deg, ${out.primaryColor}, ${out.secondaryColor})`;
  }

  return out;
}
