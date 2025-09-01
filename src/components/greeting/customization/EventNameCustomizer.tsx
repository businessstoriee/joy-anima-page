import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { TextContent, EventType } from '@/types/greeting';
import { fontSizeOptions, fontWeightOptions, colorOptions, textAlignOptions } from '@/types/textSettings';
import { animationOptions } from '@/types/animations';
import { Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface EventNameCustomizerProps {
  eventNameStyle: TextContent;
  selectedEvent: EventType | null;
  onChange: (eventNameStyle: TextContent) => void;
}

const EventNameCustomizer: React.FC<EventNameCustomizerProps> = ({ eventNameStyle, selectedEvent, onChange }) => {
  const [animationKey, setAnimationKey] = useState(0);
  const [expanded, setExpanded] = useState(false); // Toggle state for expand/collapse

  const updateEventNameStyle = (updates: Partial<TextContent>) => {
    const updated = { ...eventNameStyle, ...updates };
    onChange(updated);

    // Force re-animation when animation changes
    if (updates.animation || updates.continuousAnimation !== undefined) {
      setAnimationKey((prev) => prev + 1);
    }
  };

  // Default text when no custom content is provided
  const defaultText = selectedEvent ? `Happy ${selectedEvent.label}` : 'Happy Celebration';

  return (
    <Card className="border border-green-300 shadow-sm">
      <CardHeader className="pb-3">
  <div className="flex w-full items-center justify-between">
    {/* Left: icon + title (allow truncation so it doesn't push the right side) */}
    <div className="flex items-center gap-2 min-w-0">
      <Calendar className="h-4 w-4 text-green-500 flex-shrink-0" />
      <CardTitle className="text-sm truncate min-w-0">
        Event Name Customization
      </CardTitle>
    </div>

    {/* Right: switch (stays at the extreme right) */}
    <div className="flex items-center gap-2 shrink-0">
      <span className="text-xs text-muted-foreground hidden sm:inline">Show Settings</span>
      <Switch
        checked={expanded}
        onCheckedChange={(checked) => setExpanded(checked)}
        aria-label={expanded ? 'Collapse settings' : 'Expand settings'}
      />
    </div>
  </div>
</CardHeader>



      {/* Animate Expand/Collapse */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, scaleY: 0 }}
            animate={{ opacity: 1, scaleY: 1 }}
            exit={{ opacity: 0, scaleY: 0 }}
            style={{ originY: 0 }}
          >
            <CardContent className="space-y-4">
              {/* Custom Event Name */}
              <div className="flex items-center gap-3">
                <div className="flex-1 space-y-2">
                  <Label className="text-xs font-medium">Custom Event Name</Label>
                  <Input
                    value={eventNameStyle.content}
                    onChange={(e) => updateEventNameStyle({ content: e.target.value })}
                    placeholder={`Default: ${defaultText}`}
                    className="text-sm"
                  />
                  <p className="text-xs text-muted-foreground">
                    Leave empty to use default: "{defaultText}"
                  </p>
                </div>
              </div>

              {/* Font size & weight */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs mb-1 block">Font Size</Label>
                  <Select
                    value={eventNameStyle.style.fontSize}
                    onValueChange={(value) =>
                      updateEventNameStyle({ style: { ...eventNameStyle.style, fontSize: value } })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {fontSizeOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs mb-1 block">Font Weight</Label>
                  <Select
                    value={eventNameStyle.style.fontWeight}
                    onValueChange={(value) =>
                      updateEventNameStyle({ style: { ...eventNameStyle.style, fontWeight: value } })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {fontWeightOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Color */}
                <div>
                  <Label className="text-xs mb-1 block">Text Color</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="color"
                      value={eventNameStyle.style.color}
                      onChange={(e) =>
                        updateEventNameStyle({ style: { ...eventNameStyle.style, color: e.target.value } })
                      }
                      className="h-8 w-8 p-0 border-none"
                    />
                    <Select
                      value={eventNameStyle.style.color}
                      onValueChange={(value) =>
                        updateEventNameStyle({ style: { ...eventNameStyle.style, color: value } })
                      }
                    >
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                {colorOptions.map((c) => (
                  <SelectItem key={c.value} value={c.value}>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded border" style={{ backgroundColor: c.value }} />
                      {c.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Alignment */}
                <div>
                  <Label className="text-xs mb-1 block">Alignment</Label>
                  <Select
                    value={eventNameStyle.style.textAlign}
                    onValueChange={(value: 'left' | 'center' | 'right') =>
                      updateEventNameStyle({ style: { ...eventNameStyle.style, textAlign: value } })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {textAlignOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Animation */}
                <div>
                  <Label className="text-xs mb-1 block">Animation</Label>
                  <Select
                    value={eventNameStyle.animation}
                    onValueChange={(value) => updateEventNameStyle({ animation: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {animationOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Continuous Animation */}
                {/* <div className="space-y-1">
                  <Label className="text-xs mb-1 block">Continuous Animation</Label>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={eventNameStyle.continuousAnimation || false}
                      onCheckedChange={(checked) => updateEventNameStyle({ continuousAnimation: checked })}
                    />
                    <span className="text-xs text-muted-foreground">Repeat</span>
                  </div>
                </div> */}
              </div>
            </CardContent>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
};

export default EventNameCustomizer;
