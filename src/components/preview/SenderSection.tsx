import React from 'react';
import { GreetingFormData } from '@/types/greeting';
import { motion } from 'framer-motion';
import { useLanguageTranslation } from '@/components/language/useLanguageTranslation';

interface Props {
  greetingData: GreetingFormData;
}

const SenderSection: React.FC<Props> = ({ greetingData }) => {
  const { translate } = useLanguageTranslation();
  if (!greetingData.senderName) return null;

  return (
    <motion.div
      className="text-center pt-6 border-t border-border/50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
    >
      <p className="text-sm text-muted-foreground mb-1">{translate('With love from')}</p>
      <p className="text-lg font-semibold text-primary">{greetingData.senderName}</p>
    </motion.div>
  );
};

export default SenderSection;
