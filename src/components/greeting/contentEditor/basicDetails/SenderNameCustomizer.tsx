import React from 'react';
import { CardContent } from '@/components/ui/card';
import TextStyleControls from '@/components/greeting/TextStyleControls';
import { createTextSettings, TextSettings } from '@/types/textSettings';
import { motion, AnimatePresence } from 'framer-motion';

interface SenderNameCustomizerProps {
  senderNameStyle?: TextSettings;
  onChange: (settings: TextSettings | undefined) => void;
  expanded: boolean;
  onToggleExpanded: () => void;
}

const SenderNameCustomizer: React.FC<SenderNameCustomizerProps> = ({
  senderNameStyle,
  onChange,
  expanded,
}) => {
  const handleSettingsChange = (updates: Partial<TextSettings>) => {
    if (senderNameStyle) {
      onChange({ ...senderNameStyle, ...updates });
    } else {
      onChange(createTextSettings({ id: 'sender-name', content: '', ...updates }));
    }
  };

  return (
    <div>
      <AnimatePresence initial={false}>
        {expanded && senderNameStyle && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <CardContent>
              <TextStyleControls
                textSettings={senderNameStyle}
                onChange={handleSettingsChange}
                showContent={false}
                showAnimation
                label="Sender Name Style"
              />
            </CardContent>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SenderNameCustomizer;
