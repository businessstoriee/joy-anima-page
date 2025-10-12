import React from 'react';
import { GreetingFormData } from '@/types/greeting';
import { motion, AnimatePresence } from 'framer-motion';
import { getAnimation } from '@/types/animations';
import HoverAnimations from './HoverAnimations';

interface Props {
  greetingData: GreetingFormData;
}

const GreetingTexts: React.FC<Props> = ({ greetingData }) => {
  return (
    <div className="space-y-4 max-w-2xl mx-auto">
      <AnimatePresence mode="wait">
        {greetingData.texts.map((text, index) => (
          <HoverAnimations key={`hover-${text.id}`} animation="scale">
            <motion.div
              key={`${text.id}-${text.animation}-${text.content}-${text.continuousAnimation}-${Date.now()}`}
              initial="initial"
              animate="animate"
              variants={getAnimation(text.animation, 'fadeIn')}
              transition={{ 
                delay: index * 0.1,
                duration: 0.6,
                ...(text.continuousAnimation && {
                  repeat: Infinity,
                  repeatDelay: 1
                })
              }}
              exit={{ opacity: 0 }}
              style={{
                fontSize: text.style.fontSize,
                fontWeight: text.style.fontWeight,
                color: text.style.color, 
                textAlign: text.style.textAlign,
                fontFamily: text.style.fontFamily || 'inherit',
                fontStyle: text.style.fontStyle,
                textTransform: text.style.textTransform,
                letterSpacing: text.style.letterSpacing,
                lineHeight: text.style.lineHeight
              }}
            >
              {text.content}
            </motion.div>
          </HoverAnimations>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default GreetingTexts;