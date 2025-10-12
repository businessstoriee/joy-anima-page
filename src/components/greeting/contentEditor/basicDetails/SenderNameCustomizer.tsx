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
  // Initialize with defaults if not present
  const currentSettings = senderNameStyle || createTextSettings({ id: 'sender-name', content: '' });

  const handleSettingsChange = (updates: Partial<TextSettings>) => {
    onChange({ ...currentSettings, ...updates });
  };

  return (
    <div>
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <CardContent className="pt-3">
              <TextStyleControls
                textSettings={currentSettings}
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
