import React from 'react';
import { motion } from 'framer-motion';

interface Emoji {
  id: string;
  emoji: string;
  position: { x: number; y: number };
  size: number;
  animation: string | string[]; // ✅ FIX: allow both string and string[]
}

interface Props {
  emojis: Emoji[];
}

const EmojisLayer: React.FC<Props> = ({ emojis }) => {
  if (!emojis?.length) return null;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {emojis.map((emoji) => (
        <motion.div
          key={emoji.id}
          initial={{ opacity: 0, x: emoji.position.x, y: emoji.position.y }}
          animate={{
            opacity: 1,
            x: [emoji.position.x, emoji.position.x + 10, emoji.position.x],
            y: [emoji.position.y, emoji.position.y - 10, emoji.position.y]
          }}
          transition={{ duration: 3, repeat: Infinity }}
          className="absolute"
          style={{
            left: emoji.position.x,
            top: emoji.position.y,
            fontSize: `${emoji.size}px`,
          }}
        >
          {emoji.emoji}
        </motion.div>
      ))}
    </div>
  );
};

export default EmojisLayer;
