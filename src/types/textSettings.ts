// ✅ Single source of truth for all text settings - consolidating from multiple components

export interface TextStyleSettings {
  fontSize: string;
  fontWeight: string;
  color: string;
  textAlign: 'left' | 'center' | 'right';
  fontFamily?: string;
  fontStyle?: 'normal' | 'italic' | 'oblique';
  textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
  letterSpacing?: string;
  lineHeight?: string;
}

// Font family options with Google Fonts
export const fontFamilyOptions = [
  { value: 'inherit', label: 'Default' },
  { value: 'Arial, sans-serif', label: 'Arial' },
  { value: 'Georgia, serif', label: 'Georgia' },
  { value: 'Times New Roman, serif', label: 'Times New Roman' },
  { value: 'Courier New, monospace', label: 'Courier New' },
  { value: 'Verdana, sans-serif', label: 'Verdana' },
  { value: 'Comic Sans MS, cursive', label: 'Comic Sans' },
  { value: 'Impact, sans-serif', label: 'Impact' },
  { value: 'Trebuchet MS, sans-serif', label: 'Trebuchet' },
  { value: 'Palatino, serif', label: 'Palatino' },
  { value: 'Garamond, serif', label: 'Garamond' },
  { value: 'Brush Script MT, cursive', label: 'Brush Script' },
  { value: '"Playfair Display", serif', label: 'Playfair Display' },
  { value: '"Montserrat", sans-serif', label: 'Montserrat' },
  { value: '"Dancing Script", cursive', label: 'Dancing Script' },
  { value: '"Pacifico", cursive', label: 'Pacifico' },
  { value: '"Quicksand", sans-serif', label: 'Quicksand' },
  { value: '"Satisfy", cursive', label: 'Satisfy' },
  { value: '"Great Vibes", cursive', label: 'Great Vibes' },
  { value: '"Lobster", cursive', label: 'Lobster' },
  { value: '"Bebas Neue", sans-serif', label: 'Bebas Neue' },
  { value: '"Caveat", cursive', label: 'Caveat' },
] as const;

export interface TextSettings {
  id: string;
  content: string;
  style: TextStyleSettings;
  animation: string;
  position?: { x: number; y: number };
  size?: { width: number; height: number };
  continuousAnimation?: boolean;
}

// Font size options - consolidated from all components
export const fontSizeOptions = [
  { value: '12px', label: 'Extra Small (12px)' },
  { value: '14px', label: 'Small (14px)' },
  { value: '16px', label: 'Regular (16px)' },
  { value: '18px', label: 'Medium (18px)' },
  { value: '20px', label: 'Large (20px)' },
  { value: '24px', label: 'X-Large (24px)' },
  { value: '28px', label: 'XX-Large (28px)' },
  { value: '32px', label: 'XXX-Large (32px)' },
  { value: '36px', label: 'XXXX-Large (36px)' },
  { value: '40px', label: 'Huge (40px)' },
  { value: '48px', label: 'Giant (48px)' }
];

// Font weight options - consolidated from all components
export const fontWeightOptions = [
  { value: 'normal', label: 'Normal (400)' },
  { value: '100', label: 'Thin (100)' },
  { value: '200', label: 'Extra Light (200)' },
  { value: '300', label: 'Light (300)' },
  { value: '400', label: 'Regular (400)' },
  { value: '500', label: 'Medium (500)' },
  { value: '600', label: 'Semi Bold (600)' },
  { value: '700', label: 'Bold (700)' },
  { value: 'bold', label: 'Bold' },
  { value: '800', label: 'Extra Bold (800)' },
  { value: 'extrabold', label: 'Extra Bold' },
  { value: '900', label: 'Black (900)' }
];

// Color options - consolidated from all components
export const colorOptions = [
  { value: 'hsl(var(--foreground))', label: 'Default', color: 'hsl(var(--foreground))' },
  { value: 'hsl(var(--primary))', label: 'Primary', color: 'hsl(var(--primary))' },
  { value: 'hsl(var(--secondary))', label: 'Secondary', color: 'hsl(var(--secondary))' },
  { value: 'hsl(var(--muted-foreground))', label: 'Muted', color: 'hsl(var(--muted-foreground))' },
  { value: 'hsl(0 0% 100%)', label: 'White', color: '#ffffff' },
  { value: 'hsl(0 0% 0%)', label: 'Black', color: '#000000' },
  { value: 'hsl(0 70% 50%)', label: 'Red', color: '#dc2626' },
  { value: 'hsl(120 60% 40%)', label: 'Green', color: '#16a34a' },
  { value: 'hsl(220 90% 50%)', label: 'Blue', color: '#2563eb' },
  { value: 'hsl(45 90% 50%)', label: 'Yellow', color: '#eab308' },
  { value: 'hsl(280 60% 50%)', label: 'Purple', color: '#9333ea' },
  { value: 'hsl(320 70% 50%)', label: 'Pink', color: '#ec4899' }
];

// Text alignment options
export const textAlignOptions = [
  { value: 'left', label: 'Left' },
  { value: 'center', label: 'Center' },
  { value: 'right', label: 'Right' }
] as const;

// Font style options
export const fontStyleOptions = [
  { value: 'normal', label: 'Normal' },
  { value: 'italic', label: 'Italic' },
  { value: 'oblique', label: 'Oblique' }
] as const;

// Text transform options
export const textTransformOptions = [
  { value: 'none', label: 'None' },
  { value: 'uppercase', label: 'UPPERCASE' },
  { value: 'lowercase', label: 'lowercase' },
  { value: 'capitalize', label: 'Capitalize' }
] as const;

// Letter spacing options
export const letterSpacingOptions = [
  { value: 'normal', label: 'Normal' },
  { value: '0.05em', label: 'Tight' },
  { value: '0.1em', label: 'Wide' },
  { value: '0.2em', label: 'Wider' }
] as const;

// Line height options
export const lineHeightOptions = [
  { value: 'normal', label: 'Normal' },
  { value: '1', label: 'Tight (1)' },
  { value: '1.5', label: 'Normal (1.5)' },
  { value: '2', label: 'Loose (2)' }
] as const;

// Default text settings
export const defaultTextSettings: TextSettings = {
  id: '',
  content: '',
  style: {
    fontSize: '24px',
    fontWeight: 'normal',
    color: 'hsl(var(--foreground))',
    textAlign: 'center',
    fontFamily: 'inherit',
    fontStyle: 'normal',
    textTransform: 'none',
    letterSpacing: 'normal',
    lineHeight: 'normal'
  },
  animation: 'fadeIn'
};

// Create text settings with defaults
export const createTextSettings = (overrides: Partial<TextSettings> = {}): TextSettings => ({
  ...defaultTextSettings,
  ...overrides,
  style: {
    ...defaultTextSettings.style,
    ...(overrides.style || {})
  }
});

// Validate text settings
export const isValidTextSettings = (settings: any): settings is TextSettings => {
  return (
    settings &&
    typeof settings.id === 'string' &&
    typeof settings.content === 'string' &&
    settings.style &&
    typeof settings.style.fontSize === 'string' &&
    typeof settings.style.fontWeight === 'string' &&
    typeof settings.style.color === 'string' &&
    ['left', 'center', 'right'].includes(settings.style.textAlign) &&
    typeof settings.animation === 'string'
  );
};