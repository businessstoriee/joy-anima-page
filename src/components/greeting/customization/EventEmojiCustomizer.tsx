import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Smile } from 'lucide-react';
import { EventEmojiSettings, EventType } from '@/types/greeting';
import ElementPicker from './BorderCustomizer/ElementPicker';
import { animationOptions } from '@/types/animations';
import { motion, AnimatePresence } from 'framer-motion';

interface EventEmojiCustomizerProps {
  eventEmojiSettings: EventEmojiSettings;
  selectedEvent: EventType | null;
  onChange: (settings: EventEmojiSettings) => void;
}

const EventEmojiCustomizer: React.FC<EventEmojiCustomizerProps> = ({ 
  eventEmojiSettings, 
  selectedEvent,
  onChange 
}) => {
  const [expanded, setExpanded] = useState(false); // For expand/collapse

  const updateField = (field: keyof EventEmojiSettings, value: any) => {
    onChange({ ...eventEmojiSettings, [field]: value });
  };

  const updateEffect = (field: string, value: any) => {
    onChange({ 
      ...eventEmojiSettings, 
      effects: { ...eventEmojiSettings.effects, [field]: value }
    });
  };

  const defaultEmoji = selectedEvent?.emoji || '🎉';

  return (
    <Card className="border border-purple-300 shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex w-full items-center justify-between">
          {/* Left Section */}
          <div className="flex items-center gap-2 min-w-0">
            <Smile className="h-4 w-4 text-purple-500 flex-shrink-0" />
            <CardTitle className="text-sm truncate min-w-0">
              Event Emoji Customization
            </CardTitle>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs text-muted-foreground hidden sm:inline">Show Settings</span>
            <Switch 
              checked={expanded} 
              onCheckedChange={(checked) => setExpanded(checked)} 
            />
          </div>
        </div>
      </CardHeader>

      {/* Expand/Collapse with Animation */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <CardContent className="space-y-4">
              {/* Emoji Selection */}
              <div className="space-y-2">
                <Label className="text-xs font-medium">Event Emoji</Label>
                <div className="flex items-center gap-2">
                  <Input
                    value={eventEmojiSettings.emoji}
                    onChange={(e) => updateField('emoji', e.target.value)}
                    placeholder={defaultEmoji}
                    className="flex-1 text-sm"
                  />
                  <ElementPicker 
                    type="emoji" 
                    onSelect={(emoji) => updateField('emoji', emoji)} 
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Default: {defaultEmoji}
                </p>
              </div>

              {/* Settings Grid */}
              <div className="grid grid-cols-2 gap-3">
                {/* Size Control */}
                <div className="space-y-2">
                  <Label className="text-xs">Size ({eventEmojiSettings.size}px)</Label>
                  <Slider 
                    value={[eventEmojiSettings.size]} 
                    onValueChange={([size]) => updateField('size', size)} 
                    min={24} 
                    max={128} 
                    step={4} 
                  />
                </div>

                {/* Animation Speed */}
                <div className="space-y-2">
                  <Label className="text-xs">Animation Speed ({eventEmojiSettings.rotateSpeed.toFixed(1)}s)</Label>
                  <Slider 
                    value={[eventEmojiSettings.rotateSpeed]} 
                    onValueChange={([speed]) => updateField('rotateSpeed', speed)} 
                    min={0.5} 
                    max={5} 
                    step={0.1} 
                  />
                </div>

                {/* Text Align */}
                <div className="space-y-2">
                  <Label className="text-xs">Text Align</Label>
                  <Select 
                    value={eventEmojiSettings.textAlign || 'center'} 
                    onValueChange={(v) => updateField('textAlign', v)}
                  >
                    <SelectTrigger className="text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="left">Left</SelectItem>
                      <SelectItem value="center">Center</SelectItem>
                      <SelectItem value="right">Right</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Animation Selection */}
                <div className="space-y-2">
                  <Label className="text-xs">Animation</Label>
                  <Select 
                    value={eventEmojiSettings.animation} 
                    onValueChange={(v) => updateField('animation', v)}
                  >
                    <SelectTrigger className="text-xs">
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

                {/* Glow Effect */}
                <div className="space-y-2">
                  <Label className="text-xs">Glow Effect</Label>
                  <br/>
                  <Switch
                    checked={eventEmojiSettings.effects?.glow || false}
                    onCheckedChange={(checked) => updateEffect('glow', checked)}
                  />
                </div>
              </div>
            </CardContent>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
};

export default EventEmojiCustomizer;
