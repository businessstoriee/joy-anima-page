import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from 'lucide-react';
import { TextContent, EventType } from '@/types/greeting';

interface EventNameCustomizerProps {
  eventNameStyle: TextContent;
  selectedEvent: EventType | null;
  onChange: (eventNameStyle: TextContent) => void;
}

const EventNameCustomizer: React.FC<EventNameCustomizerProps> = ({ 
  eventNameStyle, 
  selectedEvent, 
  onChange 
}) => {
  const updateField = (field: keyof TextContent, value: any) => {
    onChange({ ...eventNameStyle, [field]: value });
  };

  const updateStyle = (field: string, value: any) => {
    onChange({ 
      ...eventNameStyle, 
      style: { ...eventNameStyle.style, [field]: value }
    });
  };

  // Default text when no custom content is provided
  const defaultText = selectedEvent ? `Happy ${selectedEvent.label}` : 'Happy Celebration';

  return (
    <Card className="border border-green-300 shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm">
          <Badge className="h-4 w-4 text-green-500" />
          Event Name Customization
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">

        <div className="flex items-center gap-3">
        {/* Content Input */}
        <div className="flex-1 space-y-2">
          <Label className="text-xs font-medium">Custom Event Name</Label>
          <Input
            value={eventNameStyle.content}
            onChange={(e) => updateField('content', e.target.value)}
            placeholder={`Default: ${defaultText}`}
            className="text-sm"
          />
         
        </div>

          <div className="space-y-2 flex flex-col items-center">
            <Label className="text-xs">Text Color</Label>
            <Input 
              type="color"
              value={eventNameStyle.style.color}
              onChange={(e) => updateStyle('color', e.target.value)}
              className=" w-10 h-9 p-1 cursor-pointer"
            />
          </div>
</div>
 <p className="text-xs text-muted-foreground">
            Leave empty to use default: "{defaultText}"
          </p>
          
        {/* Font Size and Weight */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label className="text-xs">Font Size</Label>
            <Select 
              value={eventNameStyle.style.fontSize} 
              onValueChange={(v) => updateStyle('fontSize', v)}
            >
              <SelectTrigger className="text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="18px">Small (18px)</SelectItem>
                <SelectItem value="24px">Medium (24px)</SelectItem>
                <SelectItem value="28px">Large (28px)</SelectItem>
                <SelectItem value="32px">X-Large (32px)</SelectItem>
                <SelectItem value="40px">XX-Large (40px)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-xs">Font Weight</Label>
            <Select 
              value={eventNameStyle.style.fontWeight} 
              onValueChange={(v) => updateStyle('fontWeight', v)}
            >
              <SelectTrigger className="text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="bold">Bold</SelectItem>
                <SelectItem value="extrabold">Extra Bold</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Text Align and Color */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label className="text-xs">Text Align</Label>
            <Select 
              value={eventNameStyle.style.textAlign} 
              onValueChange={(v) => updateStyle('textAlign', v)}
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

        


           {/* Animation */}
        <div className="space-y-2">
          <Label className="text-xs">Animation</Label>
          <Select 
            value={eventNameStyle.animation} 
            onValueChange={(v) => updateField('animation', v)}
          >
            <SelectTrigger className="text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="fade">Fade In</SelectItem>
              <SelectItem value="slide">Slide In</SelectItem>
              <SelectItem value="bounce">Bounce</SelectItem>
              <SelectItem value="scale">Scale</SelectItem>
              <SelectItem value="none">No Animation</SelectItem>
            </SelectContent>
          </Select>
        </div>
        </div>

       
      </CardContent>
    </Card>
  );
};

export default EventNameCustomizer;