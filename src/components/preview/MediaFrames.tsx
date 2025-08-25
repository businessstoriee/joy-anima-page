import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Heart, Star, Sparkles, Camera } from 'lucide-react';

export interface FrameStyle {
  name: string;
  className: string;
  decorative?: React.ReactNode;
  overlay?: React.ReactNode;
}

export const frameStyles: Record<string, FrameStyle> = {
  classic: {
    name: 'Classic',
    className: 'border-8 border-white drop-shadow-2xl rounded-lg bg-white p-2',
  },
  modern: {
    name: 'Modern',
    className: 'border-2 bg-gradient-to-br from-gray-50 to-white rounded-xl shadow-lg overflow-hidden',
  },
  vintage: {
    name: 'Vintage',
    className: 'bg-amber-50 border-4 border-amber-200 shadow-xl rounded-sm relative p-3',
    decorative: (
      <div className="absolute inset-2 border-2 border-amber-300 rounded-sm pointer-events-none" />
    ),
  },
  polaroid: {
    name: 'Polaroid',
    className: 'bg-white p-4 pb-12 shadow-2xl transform hover:rotate-0 transition-transform duration-300',
    overlay: (
      <div className="absolute bottom-2 left-4 right-4">
        <div className="text-sm text-gray-700 font-handwriting bg-white/80 backdrop-blur-sm rounded px-2 py-1 text-center border border-gray-200">
          <Camera className="inline h-3 w-3 mr-1" />
          Memory
        </div>
      </div>
    ),
  },
  film: {
    name: 'Film Strip',
    className: 'border-6 border-gray-800 bg-black relative p-1 rounded-sm',
    decorative: (
      <>
        <div className="absolute -top-3 left-0 right-0 h-3 bg-gray-800 rounded-t" />
        <div className="absolute -bottom-3 left-0 right-0 h-3 bg-gray-800 rounded-b" />
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-gray-600 rounded-full"
            style={{
              top: '-1px',
              left: `${10 + i * 12}%`,
            }}
          />
        ))}
      </>
    ),
  },
  elegant: {
    name: 'Elegant',
    className: 'bg-gradient-to-b from-white to-gray-50 rounded-2xl shadow-3xl overflow-hidden border border-gradient-to-r from-gold-400 to-gold-600 p-3',
    decorative: (
      <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 rounded-2xl -z-10" />
    ),
  },
  minimal: {
    name: 'Minimal',
    className: 'border border-gray-200 bg-white shadow-sm rounded-lg overflow-hidden',
  },
  artistic: {
    name: 'Artistic',
    className: 'bg-gradient-to-br from-purple-50 to-pink-50 border-0 shadow-2xl rounded-3xl p-4 overflow-hidden',
    decorative: (
      <div className="absolute inset-0 bg-gradient-to-br from-purple-100/30 to-pink-100/30 rounded-3xl" />
    ),
  },
  neon: {
    name: 'Neon',
    className: 'border-2 border-cyan-400 bg-gray-900 rounded-lg shadow-2xl shadow-cyan-400/50 p-2 overflow-hidden',
    decorative: (
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/10 to-purple-400/10 rounded-lg animate-pulse" />
    ),
  },
  romantic: {
    name: 'Romantic',
    className: 'bg-gradient-to-br from-rose-50 to-pink-100 border-2 border-rose-200 rounded-2xl shadow-lg p-3 overflow-hidden',
    overlay: (
      <div className="absolute top-2 right-2">
        <Heart className="h-4 w-4 text-rose-400 fill-current animate-pulse" />
      </div>
    ),
  },
  starry: {
    name: 'Starry',
    className: 'bg-gradient-to-br from-indigo-900 to-purple-900 border border-yellow-400 rounded-lg shadow-2xl p-3 overflow-hidden relative',
    decorative: (
      <>
        {Array.from({ length: 12 }).map((_, i) => (
          <Star
            key={i}
            className="absolute h-2 w-2 text-yellow-300 fill-current animate-pulse"
            style={{
              top: `${Math.random() * 80 + 10}%`,
              left: `${Math.random() * 80 + 10}%`,
              animationDelay: `${i * 0.3}s`,
            }}
          />
        ))}
      </>
    ),
  },
  magical: {
    name: 'Magical',
    className: 'bg-gradient-to-br from-violet-100 to-fuchsia-100 border-2 border-violet-300 rounded-3xl shadow-xl p-4 overflow-hidden relative',
    decorative: (
      <>
        {Array.from({ length: 8 }).map((_, i) => (
          <Sparkles
            key={i}
            className="absolute h-3 w-3 text-violet-400 animate-bounce"
            style={{
              top: `${Math.random() * 70 + 15}%`,
              left: `${Math.random() * 70 + 15}%`,
              animationDelay: `${i * 0.2}s`,
            }}
          />
        ))}
      </>
    ),
  },
};

interface MediaFrameProps {
  children: React.ReactNode;
  frameType: string;
  className?: string;
  index?: number;
}

const MediaFrame: React.FC<MediaFrameProps> = ({ 
  children, 
  frameType, 
  className = '',
  index = 0 
}) => {
  const frame = frameStyles[frameType] || frameStyles.classic;
  
  return (
    <motion.div
      className={cn('relative', frame.className, className)}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.1, duration: 0.6 }}
      whileHover={{ scale: 1.05 }}
    >
      {frame.decorative}
      {children}
      {frame.overlay}
    </motion.div>
  );
};

export default MediaFrame;