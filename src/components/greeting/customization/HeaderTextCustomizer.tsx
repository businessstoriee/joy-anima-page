import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Type } from 'lucide-react';
import { TextContent } from '@/types/greeting';
import { animationOptions } from '@/types/animations';
import { fontSizeOptions, fontWeightOptions, colorOptions, textAlignOptions } from '@/types/textSettings';


interface HeaderTextCustomizerProps {
  headerText: TextContent;
  onChange: (headerText: TextContent) => void;
}


const HeaderTextCustomizer: React.FC<HeaderTextCustomizerProps> = ({ headerText, onChange }) => {

  const [animationKey, setAnimationKey] = useState(0);
  const updateHeaderText = (updates: Partial<TextContent>) => {
    const updated = { ...headerText, ...updates };
    onChange(updated);
    // Force re-animation when animation changes
    if (updates.animation || updates.continuousAnimation !== undefined) {
      setAnimationKey(prev => prev + 1);
    }
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
    <Label className="text-xs font-medium">Header Text</Label>
    <Input
      value={headerText.content}
      onChange={(e) => updateHeaderText({ content: e.target.value })}
      placeholder="Enter header text (optional)"
      className="text-sm"
    />
  </div>

</div>

        {/* Style Controls - Only show if content exists */}
        {headerText.content && (
          <>

 {/* Font size & weight */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="text-xs mb-1 block">Font Size</Label>
          <Select value={headerText.style.fontSize} onValueChange={(value) => updateHeaderText({ style: { ...headerText.style, fontSize: value } })}>
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
           <Select value={headerText.style.fontWeight} onValueChange={(value) => updateHeaderText({ style: { ...headerText.style, fontWeight: value } })}>
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
   

      {/* Color & Align */}
      
        <div>
          <Label className="text-xs mb-1 block">Text Color</Label>
          <div className="flex items-center gap-2">
            <Input
              type="color"
              value={headerText.style.color}
              onChange={(e) => updateHeaderText({ style: { ...headerText.style, color: e.target.value } })}
              className="h-8 w-8 p-0 border-none"
            />
             <Select value={headerText.style.color} onValueChange={(value) => updateHeaderText({ style: { ...headerText.style, color: value } })}>
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
       

        <div>

        <div>
          <Label className="text-xs mb-1 block">Alignment</Label>
           <Select value={headerText.style.textAlign} onValueChange={(value: 'left' | 'center' | 'right') => updateHeaderText({ style: { ...headerText.style, textAlign: value } })}>
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
      </div>

      {/* Animation */}
      <div>
        <Label className="text-xs mb-1 block">Animation</Label>
       <Select value={headerText.animation} onValueChange={(value) => updateHeaderText({ animation: value })}>
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
              checked={headerText.continuousAnimation || false}
              onCheckedChange={(checked) => updateHeaderText({ continuousAnimation: checked })}
            />
            <span className="text-xs text-muted-foreground">Repeat</span>
          </div>
        </div> */}
         </div>

           
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default HeaderTextCustomizer;