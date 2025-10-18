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
                    value={eventNameStyle.content || ''}
                    onChange={(e) =>
                      onChange({ ...eventNameStyle, content: e.target.value })
                    }
                    placeholder={`Default: ${defaultText}`}
                    className="text-sm"
                    showClearButton={true}
                    onClear={() => onChange({ ...eventNameStyle, content: '' })}
                  />
                  <p className="text-xs text-muted-foreground">
                    Leave empty to use default: "{defaultText}"
                  </p>
                </div>
              </div>

              <TextStyleControls
                textSettings={createTextSettings({
                  id: 'event-name',
                  content: eventNameStyle.content || '',
                  style: eventNameStyle.style || {
                    fontSize: '28px',
                    fontWeight: 'bold',
                    color: 'hsl(var(--foreground))',
                    textAlign: 'center',
                    fontFamily: 'inherit',
                    fontStyle: 'normal',
                    textTransform: 'none',
                    letterSpacing: 'normal',
                    lineHeight: 'normal'
                  },
                  animation: eventNameStyle.animation,
                  continuousAnimation: eventNameStyle.continuousAnimation
                })}
                onChange={(settings) => {
                  const updates: Partial<TextContent> = {};
                  if (settings.style) updates.style = settings.style;
                  if (settings.animation !== undefined) updates.animation = settings.animation;
                  if (settings.continuousAnimation !== undefined) updates.continuousAnimation = settings.continuousAnimation;
                  onChange({ ...eventNameStyle, ...updates });
                }}
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
