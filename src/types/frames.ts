// ✅ Single source of truth for frame style definitions

export interface FrameStyleOption {
  value: string;
  label: string;
  description?: string;
}

export const frameStyleOptions: FrameStyleOption[] = [
  { value: 'classic', label: 'Classic', description: 'Traditional white border frame' },
  { value: 'modern', label: 'Modern', description: 'Clean minimal border' },
  { value: 'vintage', label: 'Vintage', description: 'Retro amber-toned frame' },
  { value: 'polaroid', label: 'Polaroid', description: 'Instant camera photo style' },
  { value: 'film', label: 'Film Strip', description: 'Cinema film negative style' },
  { value: 'elegant', label: 'Elegant', description: 'Luxurious golden frame' },
  { value: 'minimal', label: 'Minimal', description: 'Simple clean border' },
  { value: 'artistic', label: 'Artistic', description: 'Creative gradient frame' },
  { value: 'neon', label: 'Neon', description: 'Glowing cyberpunk style' },
  { value: 'romantic', label: 'Romantic', description: 'Rose-tinted love theme' },
  { value: 'starry', label: 'Starry', description: 'Night sky with stars' },
  { value: 'magical', label: 'Magical', description: 'Enchanted with sparkles' },
  { value: 'crystal', label: 'Crystal', description: 'Crystalline structure' },
  { value: 'royal', label: 'Royal', description: 'Majestic golden design' },
  { value: 'nature', label: 'Nature', description: 'Organic earth tones' },
  { value: 'cosmic', label: 'Cosmic', description: 'Space-themed frame' },
  { value: 'ocean', label: 'Ocean', description: 'Aquatic blue theme' },
  { value: 'fire', label: 'Fire', description: 'Fiery red-orange theme' },
  { value: 'rainbow', label: 'Rainbow', description: 'Colorful spectrum border' },
];

// Frame type for TypeScript
export type FrameType = 
  | 'classic' 
  | 'modern' 
  | 'vintage' 
  | 'polaroid' 
  | 'film' 
  | 'elegant' 
  | 'minimal' 
  | 'artistic' 
  | 'neon' 
  | 'romantic' 
  | 'starry' 
  | 'magical' 
  | 'crystal' 
  | 'royal' 
  | 'nature' 
  | 'cosmic' 
  | 'ocean' 
  | 'fire' 
  | 'rainbow';