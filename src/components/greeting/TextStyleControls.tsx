import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  TextSettings,
  fontSizeOptions,
  fontWeightOptions,
  colorOptions,
  textAlignOptions,
  fontStyleOptions,
  textTransformOptions,
  letterSpacingOptions,
  lineHeightOptions,
  fontFamilyOptions,
} from "@/types/textSettings";
import { animationOptions } from '@/types/animations';


interface TextStyleControlsProps {
  textSettings?: TextSettings;
  onChange?: (updates: Partial<TextSettings>) => void;
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
  label = "Text Settings",
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const toggleExpand = () => setIsExpanded((prev) => !prev);

  const updateStyle = (field: string, value: any) => {
    onChange?.({
      style: { ...textSettings?.style, [field]: value },
    });
  };

  return (
    <div className="space-y-4">
      {/* Header and Input */}
      {showContent && (
        <div className="space-y-2">
          <div className="flex items-center justify-between min-h-[24px]">
            <Label className="text-xs font-medium">{label}</Label>

            {/* Only show Edit/Hide if user has typed something */}
            {/* {textSettings?.content && textSettings.content.length > 0 && ( */}
              <Button
                onClick={toggleExpand}
                size="sm"
                variant="ghost"
                className="text-[10px] h-6 px-2 py-0 border border-muted/20 hover:border-primary/40 hover:bg-primary/5 transition-all duration-200"
              >
                {isExpanded ? "Hide" : "Edit"}
              </Button>
            {/* )} */}
          </div>

          <Input
            value={textSettings?.content || ''}
            onChange={(e) => onChange?.({ content: e.target.value })}
            placeholder={contentPlaceholder}
            className="text-sm"
          />
        </div>
      )}

      {/* Expanded Section */}
      {isExpanded && (
        <>
          {/* Preview */}
          {textSettings?.content && (
            <div className="pt-2 border-t">
              <Label className="text-xs text-muted-foreground mb-2 block">Preview:</Label>
              <div
                style={{
                  fontSize: textSettings.style?.fontSize,
                  fontWeight: textSettings.style?.fontWeight,
                  color: textSettings.style?.color,
                  textAlign: textSettings.style?.textAlign,
                  fontFamily: textSettings.style?.fontFamily,
                  fontStyle: textSettings.style?.fontStyle,
                  textTransform: textSettings.style?.textTransform,
                  letterSpacing: textSettings.style?.letterSpacing,
                  lineHeight: textSettings.style?.lineHeight,
                }}
                className="p-2 border rounded bg-muted/20"
              >
                {textSettings.content}
              </div>
            </div>
          )}

          {/* Font Size + Weight */}
          <div className={`grid gap-3 ${compact ? "grid-cols-1" : "grid-cols-2"}`}>
            <div className="space-y-2">
              <Label className="text-xs">Font Size</Label>
              <Select value={textSettings?.style?.fontSize} onValueChange={(v) => updateStyle("fontSize", v)}>
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
              <Select value={textSettings?.style?.fontWeight} onValueChange={(v) => updateStyle("fontWeight", v)}>
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

          {/* Text Align + Color */}
            <div className="space-y-2">
              <Label className="text-xs">Text Align</Label>
              <Select value={textSettings?.style?.textAlign} onValueChange={(v) => updateStyle("textAlign", v)}>
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
              <div className="flex items-center gap-2">
                <Input
                  type="color"
                  value={textSettings?.style?.color?.startsWith("hsl") ? "#333333" : textSettings?.style?.color}
                  onChange={(e) => updateStyle("color", e.target.value)}
                  className="w-10 h-9 p-1 cursor-pointer"
                />
                <Select value={textSettings?.style?.color} onValueChange={(v) => updateStyle("color", v)}>
                  <SelectTrigger className="text-xs">
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

          {/* Font Family */}
            <div className="space-y-2">
              <Label className="text-xs">Font Family</Label>
              <Select
                value={textSettings?.style?.fontFamily || "inherit"}
                onValueChange={(v) => updateStyle("fontFamily", v)}
              >
                <SelectTrigger className="text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {fontFamilyOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <span style={{ fontFamily: option.value }}>{option.label}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

          {/* Font Style */}
         {/*    <div className="space-y-2">
              <Label className="text-xs">Font Style</Label>
              <Select
                value={textSettings?.style?.fontStyle || "normal"}
                onValueChange={(v: "normal" | "italic" | "oblique") => updateStyle("fontStyle", v)}
              >
                <SelectTrigger className="text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {fontStyleOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div> */}

          {/* Animation */}
          {showAnimation && (
            <div className="space-y-2">
              <Label className="text-xs">Animation</Label>
              <Select value={textSettings?.animation} onValueChange={(v) => onChange?.({ animation: v })}>
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

           </div>
        </>
      )}
    </div>
  );
};

export default TextStyleControls;
