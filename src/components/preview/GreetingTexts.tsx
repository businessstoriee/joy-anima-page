import React from 'react';
import { GreetingFormData } from '@/types/greeting';
import { motion, AnimatePresence, Variants } from 'framer-motion';

interface Props {
  greetingData: GreetingFormData;
}

const GreetingTexts: React.FC<Props> = ({ greetingData }) => {
  const variants: Variants = {
    fade: { opacity: [0, 1], transition: { duration: 0.5 } },
    slide: { x: [-100, 0], opacity: [0, 1], transition: { duration: 0.5 } },
    bounce: { y: [50, 0], opacity: [0, 1], transition: { type: 'spring', bounce: 0.4 } },
  };

  return (
    <div className="space-y-4 max-w-2xl mx-auto">
      <AnimatePresence>
        {greetingData.texts.map(text => (
          <motion.div
            key={text.id}
            variants={variants}
            animate={text.animation}
            exit={{ opacity: 0 }}
            style={{
              fontSize: text.style.fontSize,
              fontWeight: text.style.fontWeight,
              color: text.style.color, 
              textAlign: text.style.textAlign,
              animation: text.animation ? `${text.animation} 1.5s ease-in-out infinite` : undefined
            }}
          >
            {text.content}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default GreetingTexts;
