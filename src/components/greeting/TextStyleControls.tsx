// Common text style controls component - used across all text customizers

import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  TextSettings, 
  fontSizeOptions, 
  fontWeightOptions, 
  colorOptions, 
  textAlignOptions 
} from '@/types/textSettings';
import { animationOptions } from '@/types/animations';

interface TextStyleControlsProps {
  textSettings: TextSettings;
  onChange: (updates: Partial<TextSettings>) => void;
  showContent?: boolean;
  contentPlaceholder?: string;
  showAnimation?: boolean;
  showPosition?: boolean;
  showSize?: boolean;
  compact?: boolean;
  label?: string;
}

const TextStyleControls: React.FC<TextStyleControlsProps> = ({
  textSettings,
  onChange,
  showContent = true,
  contentPlaceholder = "Enter text...",
  showAnimation = true,
  showPosition = false,
  showSize = false,
  compact = false,
  label = "Text Settings"
}) => {
  const updateStyle = (field: string, value: any) => {
    onChange({ 
      style: { ...textSettings.style, [field]: value }
    });
  };

  return (
    <div className="space-y-4">
      {/* Content Input */}
      {showContent && (
        <div className="flex items-center gap-3">
          <div className="flex-1 space-y-2">
            <Label className="text-xs font-medium">{label}</Label>
            <Input
              value={textSettings.content}
              onChange={(e) => onChange({ content: e.target.value })}
              placeholder={contentPlaceholder}
              className="text-sm"
            />
          </div>
          
          {/* Color Picker - Show when content exists */}
          {textSettings.content && (
            <div className="space-y-2 flex flex-col items-center">
              <Label className="text-xs">Color</Label>
              <Input
                type="color"
                value={textSettings.style.color.startsWith('hsl') ? '#333333' : textSettings.style.color}
                onChange={(e) => updateStyle('color', e.target.value)}
                className="w-10 h-9 p-1 cursor-pointer"
              />
            </div>
          )}
        </div>
      )}

      {/* Font Size and Weight */}
      <div className={`grid gap-3 ${compact ? 'grid-cols-1' : 'grid-cols-2'}`}>
        <div className="space-y-2">
          <Label className="text-xs">Font Size</Label>
          <Select 
            value={textSettings.style.fontSize} 
            onValueChange={(v) => updateStyle('fontSize', v)}
          >
            <SelectTrigger className="text-xs">
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

        <div className="space-y-2">
          <Label className="text-xs">Font Weight</Label>
          <Select 
            value={textSettings.style.fontWeight} 
            onValueChange={(v) => updateStyle('fontWeight', v)}
          >
            <SelectTrigger className="text-xs">
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
      </div>

      {/* Text Align and Color Dropdown */}
      <div className={`grid gap-3 ${compact ? 'grid-cols-1' : 'grid-cols-2'}`}>
        <div className="space-y-2">
          <Label className="text-xs">Text Align</Label>
          <Select 
            value={textSettings.style.textAlign} 
            onValueChange={(v) => updateStyle('textAlign', v)}
          >
            <SelectTrigger className="text-xs">
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

        <div className="space-y-2">
          <Label className="text-xs">Text Color</Label>
          <Select 
            value={textSettings.style.color} 
            onValueChange={(v) => updateStyle('color', v)}
          >
            <SelectTrigger className="text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {colorOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-4 h-4 rounded border" 
                      style={{ backgroundColor: option.color || option.value }} 
                    />
                    {option.label}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Animation */}
      {showAnimation && (
        <div className="space-y-2">
          <Label className="text-xs">Animation</Label>
          <Select 
            value={textSettings.animation} 
            onValueChange={(v) => onChange({ animation: v })}
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
      )}

      {/* Position Controls */}
      {showPosition && textSettings.position && (
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label className="text-xs">X Position</Label>
            <Input
              type="number"
              value={textSettings.position.x}
              onChange={(e) => onChange({ 
                position: { ...textSettings.position!, x: Number(e.target.value) }
              })}
              className="text-xs"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs">Y Position</Label>
            <Input
              type="number"
              value={textSettings.position.y}
              onChange={(e) => onChange({ 
                position: { ...textSettings.position!, y: Number(e.target.value) }
              })}
              className="text-xs"
            />
          </div>
        </div>
      )}

      {/* Size Controls */}
      {showSize && textSettings.size && (
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label className="text-xs">Width (px)</Label>
            <Input
              type="number"
              value={textSettings.size.width}
              onChange={(e) => onChange({ 
                size: { ...textSettings.size!, width: Number(e.target.value) }
              })}
              className="text-xs"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs">Height (px)</Label>
            <Input
              type="number"
              value={textSettings.size.height}
              onChange={(e) => onChange({ 
                size: { ...textSettings.size!, height: Number(e.target.value) }
              })}
              className="text-xs"
            />
          </div>
        </div>
      )}

      {/* Preview */}
      {textSettings.content && (
        <div className="pt-2 border-t">
          <Label className="text-xs text-muted-foreground mb-2 block">Preview:</Label>
          <div
            style={{
              fontSize: textSettings.style.fontSize,
              fontWeight: textSettings.style.fontWeight,
              color: textSettings.style.color,
              textAlign: textSettings.style.textAlign,
              fontFamily: textSettings.style.fontFamily
            }}
            className="p-2 border rounded bg-muted/20"
          >
            {textSettings.content}
          </div>
        </div>
      )}
    </div>
  );
};

export default TextStyleControls;