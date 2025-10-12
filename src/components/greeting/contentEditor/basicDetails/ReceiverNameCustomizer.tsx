import React from 'react';
import { CardContent } from '@/components/ui/card';
import TextStyleControls from '@/components/greeting/TextStyleControls';
import { createTextSettings, TextSettings } from '@/types/textSettings';
import { motion, AnimatePresence } from 'framer-motion';

interface ReceiverNameCustomizerProps {
  receiverNameStyle?: TextSettings;
  onChange: (settings: TextSettings | undefined) => void;
  expanded: boolean;
  onToggleExpanded: () => void;
}

const ReceiverNameCustomizer: React.FC<ReceiverNameCustomizerProps> = ({
  receiverNameStyle,
  onChange,
  expanded, // ✅ use prop, not local state
}) => {

  const handleSettingsChange = (updates: Partial<TextSettings>) => {
    if (receiverNameStyle) {
      onChange({ ...receiverNameStyle, ...updates });
    } else {
      onChange(createTextSettings({ id: 'receiver-name', content: '', ...updates }));
    }
  };

  return (
    <div>
      <AnimatePresence initial={false}>
        {expanded && receiverNameStyle && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <CardContent>
              <TextStyleControls
                textSettings={receiverNameStyle}
                onChange={handleSettingsChange}
                showContent={false}
                showAnimation
                label="Receiver Name Style"
              />
            </CardContent>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ReceiverNameCustomizer;
