// ✅ Single source of truth for all layout definitions - consolidating from multiple files

export interface LayoutStyle {
  value: string;
  label: string;
  description?: string;
}

export const layoutStyles: LayoutStyle[] = [
  { value: 'grid', label: '🔲 Grid Layout', description: 'Organized in a clean grid pattern' },
  { value: 'masonry', label: '🧱 Masonry Layout', description: 'Pinterest-style staggered layout' },
  { value: 'carousel', label: '🎠 Carousel Layout', description: 'Horizontal scrolling showcase' },
  { value: 'slideshow', label: '📽️ Slideshow Layout', description: 'Sequential image display' },
  { value: 'polaroid', label: '📷 Polaroid Layout', description: 'Vintage photo style' },
  { value: 'gallery', label: '🖼️ Gallery Layout', description: 'Museum-style presentation' },
  { value: 'hexagon', label: '⬡ Hexagon Layout', description: 'Honeycomb pattern' },
  { value: 'circular', label: '⭕ Circular Layout', description: 'Radial arrangement' },
  { value: 'spiral', label: '🌀 Spiral Layout', description: 'Swirling pattern' },
  { value: 'wave', label: '🌊 Wave Layout', description: 'Flowing arrangement' },
  { value: 'floating', label: '🌊 Freely Floating Layout', description: 'Freely floating elements' },
  { value: 'orbiting', label: '🪐 Orbital Motion Layout', description: 'Circular orbital motion' },
  { value: 'cascading', label: '💧 Waterfall Cascade Layout', description: 'Waterfall cascade effect' },
  { value: 'vortex', label: '🌀 Spiral Vortex Layout', description: 'Spiral vortex pattern' },
  { value: 'constellation', label: '✨ Star Constellation Layout', description: 'Star constellation layout' },
  { value: 'magnetic', label: '🧲 Magnetic Attraction Layout', description: 'Magnetic attraction layout' },
  { value: 'ripple', label: '🌊 Water Ripple Layout', description: 'Water ripple expansion' },
  { value: 'kaleidoscope', label: '🔮 Kaleidoscope Layout', description: 'Kaleidoscope pattern' },
  { value: 'drifting', label: '🌫️ Slow Drift Layout', description: 'Slow drift movement' },
  { value: 'pulsing', label: '💓 Rhythmic Pulse Layout', description: 'Rhythmic pulsing layout' },
];

export const layoutDescriptions: Record<string, string> = layoutStyles.reduce((acc, style) => {
  acc[style.value] = style.description || '';
  return acc;
}, {} as Record<string, string>);

// Layout type for TypeScript
export type LayoutType = 
  | 'grid' 
  | 'masonry' 
  | 'carousel' 
  | 'slideshow' 
  | 'polaroid' 
  | 'gallery' 
  | 'hexagon' 
  | 'circular' 
  | 'spiral' 
  | 'wave' 
  | 'floating' 
  | 'orbiting' 
  | 'cascading' 
  | 'vortex' 
  | 'constellation' 
  | 'magnetic' 
  | 'ripple' 
  | 'kaleidoscope' 
  | 'drifting' 
  | 'pulsing';