// EventNameCustomizer.tsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { TextContent, EventType } from '@/types/greeting';
import { Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import TextStyleControls from '../../TextStyleControls';
import { createTextSettings } from '@/types/textSettings';

interface EventNameCustomizerProps {
  eventNameStyle: TextContent;
  selectedEvent: EventType | null;
  onChange: (eventNameStyle: TextContent) => void;
  expanded: boolean;
  onToggleExpanded: () => void;
}

const EventNameCustomizer: React.FC<EventNameCustomizerProps> = ({
  eventNameStyle,
  selectedEvent,
  onChange,
  expanded,
  onToggleExpanded
}) => {
  const defaultText = selectedEvent ? `Happy ${selectedEvent.label}` : 'Happy Celebration';
  
  // Ensure eventNameStyle has proper structure with all required fields
  const safeEventNameStyle: TextContent = {
    id: eventNameStyle?.id || 'event-name',
    content: eventNameStyle?.content || '',
    style: {
      fontSize: eventNameStyle?.style?.fontSize || '28px',
      fontWeight: eventNameStyle?.style?.fontWeight || 'bold',
      color: eventNameStyle?.style?.color || 'hsl(var(--foreground))',
      textAlign: (eventNameStyle?.style?.textAlign as 'left' | 'center' | 'right') || 'center',
      fontFamily: eventNameStyle?.style?.fontFamily || 'inherit',
      fontStyle: eventNameStyle?.style?.fontStyle || 'normal',
      textTransform: eventNameStyle?.style?.textTransform || 'none',
      letterSpacing: eventNameStyle?.style?.letterSpacing || 'normal',
      lineHeight: eventNameStyle?.style?.lineHeight || 'normal'
    },
    animation: eventNameStyle?.animation || 'fadeIn',
    continuousAnimation: eventNameStyle?.continuousAnimation || false
  };

  return (
    <div>
     <AnimatePresence>
       {expanded && (

     
          <motion.div
            initial={{ opacity: 0, scaleY: 0 }}
            animate={{ opacity: 1, scaleY: 1 }}
            exit={{ opacity: 0, scaleY: 0 }}
            style={{ originY: 0 }}
          >
            
              <div className="flex items-center gap-3">
                <div className="flex-1 space-y-2">
                  <Label className="text-xs font-medium">Custom Event Name</Label>
                  <Input
                    value={safeEventNameStyle.content}
                    onChange={(e) =>
                      onChange({ ...safeEventNameStyle, content: e.target.value })
                    }
                    placeholder={`Default: ${defaultText}`}
                    className="text-sm"
                  />
                  <p className="text-xs text-muted-foreground">
                    Leave empty to use default: "{defaultText}"
                  </p>
                </div>
              </div>

              <TextStyleControls
                textSettings={createTextSettings({
                  id: 'event-name',
                  content: safeEventNameStyle.content,
                  style: safeEventNameStyle.style,
                  animation: safeEventNameStyle.animation,
                  continuousAnimation: safeEventNameStyle.continuousAnimation
                })}
                onChange={(settings) =>
                  onChange({
                    ...safeEventNameStyle,
                    content: settings.content || '',
                    style: settings.style,
                    animation: settings.animation,
                    continuousAnimation: settings.continuousAnimation
                  })
                }
                showContent={false}
                showAnimation={true}
              />
         
          </motion.div>

              )  }
              </AnimatePresence>
              </div>
  );
};

export default EventNameCustomizer;
