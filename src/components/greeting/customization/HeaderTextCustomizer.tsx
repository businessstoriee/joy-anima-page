import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Type } from 'lucide-react';
import { TextContent } from '@/types/greeting';

interface HeaderTextCustomizerProps {
  headerText: TextContent;
  onChange: (headerText: TextContent) => void;
}

const HeaderTextCustomizer: React.FC<HeaderTextCustomizerProps> = ({ headerText, onChange }) => {
  const updateField = (field: keyof TextContent, value: any) => {
    onChange({ ...headerText, [field]: value });
  };

  const updateStyle = (field: string, value: any) => {
    onChange({ 
      ...headerText, 
      style: { ...headerText.style, [field]: value }
    });
  };

  return (
    <Card className="border border-blue-300 shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm">
          <Type className="h-4 w-4 text-blue-500" />
          Header Text<span  className="text-gray-500">(Optional)</span>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Content Input */}
<div className="flex items-center gap-3">
  {/* Header Text Input */}
  <div className="flex-1 space-y-2">
    {/* <Label className="text-sm">Header Text</Label> */}
    <Input
      value={headerText.content}
      onChange={(e) => updateField('content', e.target.value)}
      placeholder="Enter header text (optional)"
      className="text-sm"
    />
  </div>

  {/* Color Picker (only show if text is entered) */}
  {headerText.content && (
    <div className="space-y-2 flex flex-col items-center">
      <Label className="text-xs">Color</Label>
      <Input
        type="color"
        value={headerText.style.color}
        onChange={(e) => updateStyle('color', e.target.value)}
        className="w-10 h-9 p-1 cursor-pointer"
      />
    </div>
  )}
</div>

        {/* Style Controls - Only show if content exists */}
        {headerText.content && (
          <>
            {/* Font Size and Weight */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label className="text-xs">Font Size</Label>
                <Select 
                  value={headerText.style.fontSize} 
                  onValueChange={(v) => updateStyle('fontSize', v)}
                >
                  <SelectTrigger className="text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="20px">Small (20px)</SelectItem>
                    <SelectItem value="24px">Medium (24px)</SelectItem>
                    <SelectItem value="32px">Large (32px)</SelectItem>
                    <SelectItem value="40px">X-Large (40px)</SelectItem>
                    <SelectItem value="48px">XX-Large (48px)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-xs">Font Weight</Label>
                <Select 
                  value={headerText.style.fontWeight} 
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
                  value={headerText.style.textAlign} 
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
                value={headerText.animation} 
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

           
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default HeaderTextCustomizer;