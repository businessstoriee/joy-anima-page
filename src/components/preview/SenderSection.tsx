import React from 'react';
import { GreetingFormData } from '@/types/greeting';
import { motion } from 'framer-motion';
import { useLanguageTranslation } from '@/components/language/useLanguageTranslation';
import HoverAnimations from './HoverAnimations';

interface Props {
  greetingData: GreetingFormData;
}

const SenderSection: React.FC<Props> = ({ greetingData }) => {
  const { translate } = useLanguageTranslation();
  if (!greetingData.senderName) return null;

  const senderStyle = greetingData.senderNameStyle;

  return (
    <HoverAnimations animation="float">
      <motion.div
        className="text-center pt-6 border-t border-border/50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <p className="text-sm text-muted-foreground mb-1">{translate('With love from')}</p>
        <motion.p 
          className="text-lg font-semibold text-primary"
          initial="initial"
          animate="animate"
          variants={{
            initial: { opacity: 0, y: 10 },
            animate: { 
              opacity: 1, 
              y: 0,
              transition: { 
                duration: 0.6,
                ...(senderStyle?.continuousAnimation && {
                  repeat: Infinity,
                  repeatDelay: 1
                })
              }
            }
          }}
          style={senderStyle ? {
            fontSize: senderStyle.style.fontSize,
            fontWeight: senderStyle.style.fontWeight,
            color: senderStyle.style.color,
            textAlign: senderStyle.style.textAlign,
            fontFamily: senderStyle.style.fontFamily,
            fontStyle: senderStyle.style.fontStyle,
            textTransform: senderStyle.style.textTransform,
            letterSpacing: senderStyle.style.letterSpacing,
            lineHeight: senderStyle.style.lineHeight
          } : undefined}
        >
          {greetingData.senderName}
        </motion.p>
      </motion.div>
    </HoverAnimations>
  );
};

export default SenderSection;
