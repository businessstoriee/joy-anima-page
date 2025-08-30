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
  // New Creative Frames
  crystal: {
    name: 'Crystal',
    className: 'bg-gradient-to-br from-blue-50 to-cyan-100 border-4 border-cyan-300 shadow-2xl p-3 overflow-hidden relative',
    decorative: (
      <>
        <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 rounded-2xl opacity-75 blur-sm" />
        <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent rounded-xl" />
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white rounded-full animate-pulse opacity-80"
            style={{
              top: `${Math.random() * 80 + 10}%`,
              left: `${Math.random() * 80 + 10}%`,
              animationDelay: `${i * 0.4}s`,
            }}
          />
        ))}
      </>
    ),
  },
  royal: {
    name: 'Royal',
    className: 'bg-gradient-to-b from-yellow-100 to-amber-50 border-4 border-yellow-600 shadow-2xl p-4 overflow-hidden relative',
    decorative: (
      <>
        <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
          <div className="w-6 h-6 bg-yellow-600 rotate-45 rounded-sm" />
        </div>
        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
          <div className="w-6 h-6 bg-yellow-600 rotate-45 rounded-sm" />
        </div>
        <div className="absolute -left-2 top-1/2 transform -translate-y-1/2">
          <div className="w-6 h-6 bg-yellow-600 rotate-45 rounded-sm" />
        </div>
        <div className="absolute -right-2 top-1/2 transform -translate-y-1/2">
          <div className="w-6 h-6 bg-yellow-600 rotate-45 rounded-sm" />
        </div>
        <div className="absolute inset-2 border-2 border-yellow-500 rounded-lg" />
      </>
    ),
  },
  nature: {
    name: 'Nature',
    className: 'bg-gradient-to-br from-green-50 to-emerald-100 border-4 border-green-400 rounded-2xl shadow-xl p-3 overflow-hidden relative',
    decorative: (
      <>
        <div className="absolute inset-0 opacity-20 rounded-2xl" style={{
          backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(34,197,94,0.1) 10px, rgba(34,197,94,0.1) 20px)'
        }} />
        {['🌿', '🍃', '🌱'].map((leaf, i) => (
          <div
            key={i}
            className="absolute text-green-600 animate-pulse opacity-60"
            style={{
              top: `${15 + i * 25}%`,
              right: '8px',
              animationDelay: `${i * 0.5}s`,
            }}
          >
            {leaf}
          </div>
        ))}
      </>
    ),
  },
  cosmic: {
    name: 'Cosmic',
    className: 'bg-gradient-to-br from-purple-900 to-black border-2 border-purple-500 rounded-2xl shadow-2xl p-3 overflow-hidden relative',
    decorative: (
      <>
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-pink-500/20 to-blue-600/20 animate-pulse rounded-2xl" />
        {Array.from({ length: 15 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.2}s`,
              opacity: Math.random(),
            }}
          />
        ))}
        <div className="absolute top-2 right-2">
          <div className="w-4 h-4 bg-yellow-300 rounded-full animate-ping opacity-75" />
        </div>
      </>
    ),
  },
  ocean: {
    name: 'Ocean',
    className: 'bg-gradient-to-br from-blue-100 to-teal-200 border-3 border-blue-400 rounded-3xl shadow-2xl p-4 overflow-hidden relative',
    decorative: (
      <>
        <div className="absolute inset-0 opacity-30 rounded-3xl" style={{
          backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(59,130,246,0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(34,211,238,0.3) 0%, transparent 50%)',
        }} />
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="absolute text-blue-500 animate-bounce opacity-70"
            style={{
              bottom: '10px',
              left: `${20 + i * 20}%`,
              animationDelay: `${i * 0.3}s`,
            }}
          >
            〰️
          </div>
        ))}
      </>
    ),
  },
  fire: {
    name: 'Fire',
    className: 'bg-gradient-to-br from-red-100 to-orange-200 border-3 border-red-500 rounded-2xl shadow-2xl p-3 overflow-hidden relative',
    decorative: (
      <>
        <div className="absolute inset-0 bg-gradient-to-t from-red-500/20 via-orange-400/20 to-yellow-300/20 animate-pulse rounded-2xl" />
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="absolute text-red-500 animate-pulse"
            style={{
              bottom: `${10 + Math.random() * 20}px`,
              left: `${20 + i * 15}%`,
              animationDelay: `${i * 0.2}s`,
              transform: `rotate(${Math.random() * 20 - 10}deg)`,
            }}
          >
            🔥
          </div>
        ))}
      </>
    ),
  },
  rainbow: {
    name: 'Rainbow',
    className: 'bg-white border-4 rounded-2xl shadow-2xl p-3 overflow-hidden relative',
    decorative: (
      <>
        <div className="absolute -inset-1 bg-gradient-to-r from-red-400 via-yellow-400 via-green-400 via-blue-400 via-indigo-400 to-purple-400 rounded-2xl opacity-75 animate-pulse" />
        <div className="absolute inset-0 bg-white rounded-xl" />
        <div className="absolute inset-2 border-2 border-transparent bg-gradient-to-r from-red-300 via-yellow-300 via-green-300 via-blue-300 via-indigo-300 to-purple-300 rounded-lg" style={{
          backgroundClip: 'border-box',
          WebkitBackgroundClip: 'border-box',
        }} />
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