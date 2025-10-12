import React from 'react';
import { Card, CardContent, CardTitle, CardHeader } from '@/components/ui/card';
import { Type } from 'lucide-react';
import { TextContent } from '@/types/greeting';
import TextStyleControls from '@/components/greeting/TextStyleControls';
import { createTextSettings, TextSettings } from '@/types/textSettings';
import { motion, AnimatePresence } from 'framer-motion';

interface HeaderTextCustomizerProps {
  headerText: TextContent;
  onChange: (headerText: TextContent) => void;
}

const HeaderTextCustomizer: React.FC<HeaderTextCustomizerProps> = ({ headerText, onChange }) => {

  const updateHeaderText = (updates: Partial<TextContent>) => {
    onChange({ ...headerText, ...updates });
  };

  return (
    <Card className="border border-blue-500 shadow-sm transition-all">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm">
          <Type className="h-4 w-4 text-blue-500" />
          Header Text 
          <span className="flex items-center px-2 py-1 justify-center rounded-full bg-primary/10 text-primary text-xs">
              (Optional)
          </span>
        </CardTitle>
      </CardHeader>

      <CardContent>
        <AnimatePresence initial={false}>
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <TextStyleControls
              textSettings={headerText as any as TextSettings}
              onChange={(updates) => updateHeaderText(updates as Partial<TextContent>)}
              showContent={true} // Always show input field
              contentPlaceholder="Enter header text (optional)"
              showAnimation={true}
              compact={false}
              label="Header Text"
            />
          </motion.div>
        </AnimatePresence>
      </CardContent>
    </Card>
  );
};

export default HeaderTextCustomizer;
