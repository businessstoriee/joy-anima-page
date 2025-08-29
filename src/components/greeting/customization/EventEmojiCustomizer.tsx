import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Smile } from 'lucide-react';
import { EventEmojiSettings, EventType } from '@/types/greeting';
import ElementPicker from './BorderCustomizer/ElementPicker';

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
  const updateField = (field: keyof EventEmojiSettings, value: any) => {
    onChange({ ...eventEmojiSettings, [field]: value });
  };

  const updateEffect = (field: string, value: any) => {
    onChange({ 
      ...eventEmojiSettings, 
      effects: { ...eventEmojiSettings.effects, [field]: value }
    });
  };

  // Default emoji from selected event
  const defaultEmoji = selectedEvent?.emoji || '🎉';

  return (
    <Card className="border border-purple-300 shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm">
          <Smile className="h-4 w-4 text-purple-500" />
          Event Emoji Customization
        </CardTitle>
      </CardHeader>

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
          <Label className="text-xs">Animation Speed ({eventEmojiSettings.rotateSpeed}s)</Label>
          <Slider 
            value={[eventEmojiSettings.rotateSpeed]} 
            onValueChange={([speed]) => updateField('rotateSpeed', speed)} 
            min={0.5} 
            max={5} 
            step={0.1} 
          />
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
              <SelectItem value="bounce">Bounce</SelectItem>
              <SelectItem value="float">Float</SelectItem>
              <SelectItem value="pulse">Pulse</SelectItem>
              <SelectItem value="shake">Shake</SelectItem>
              <SelectItem value="rotate">Rotate</SelectItem>
              <SelectItem value="none">No Animation</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Glow Effect */}
        <div className="space-y-2 ">
          <Label className="text-xs">Glow Effect</Label>
          <br/>
         <Switch
            checked={eventEmojiSettings.effects?.glow || false}
            onCheckedChange={(checked) => updateEffect('glow', checked)}
          />
        </div>

        </div>

        {/* Preview */}
        {/* <div className="pt-2 border-t">
          <Label className="text-xs font-medium mb-2 block">Preview</Label>
          <div className="text-center bg-muted/20 rounded-lg">
            <div 
              className="inline-block transition-all duration-300"
              style={{
                fontSize: `${eventEmojiSettings.size}px`,
                filter: eventEmojiSettings.effects?.glow ? 'drop-shadow(0 0 10px currentColor)' : 'none',
                animation: eventEmojiSettings.animation !== 'none' 
                  ? `${eventEmojiSettings.animation} ${eventEmojiSettings.rotateSpeed}s ease-in-out infinite` 
                  : 'none'
              }}
            >
              {eventEmojiSettings.emoji}
            </div>
          </div>
        </div> */}
      </CardContent>
    </Card>
  );
};

export default EventEmojiCustomizer;