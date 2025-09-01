import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TextContent } from '@/types/greeting';
import { animationOptions } from '@/types/animations'; // ✅ Use consolidated animations
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Trash2, ChevronUp, ChevronDown } from 'lucide-react';
import { fontSizeOptions, fontWeightOptions, colorOptions, textAlignOptions } from '@/types/textSettings';


interface Props {
  text: TextContent;
  index: number;
  onUpdate: (updates: Partial<TextContent>) => void;
  onRemove: () => void;
  onMove: (direction: 'up' | 'down') => void;
}

export default function TextBlockControls({ text, index, onUpdate, onRemove, onMove }: Props) {
  return (
    <div className="space-y-3 border-t pt-3 animate-in fade-in">
      {text.content && (
        <div className="p-3 border rounded">
          <Label className="text-xs text-muted-foreground">Preview:</Label>
          <div
  style={{
    fontSize: text.style.fontSize,
    fontWeight: text.style.fontWeight,
    color: text.style.color,
    textAlign: text.style.textAlign,
    animation: text.animation ? `${text.animation} 1.5s ease-in-out infinite` : undefined
  }}
  className="mt-1"
>
  {text.content}
</div>

        </div>
        
      )}


      {/* Font size & weight */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="text-xs mb-1 block">Font Size</Label>
          <Select
            value={text.style.fontSize}
            onValueChange={(value) => onUpdate({ style: { ...text.style, fontSize: value } })}
          >
            <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
            <SelectContent>
              {fontSizeOptions.map((s) => (
                <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-xs mb-1 block">Font Weight</Label>
          <Select
            value={text.style.fontWeight}
            onValueChange={(value) => onUpdate({ style: { ...text.style, fontWeight: value } })}
          >
            <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
            <SelectContent>
              {fontWeightOptions.map((w) => (
                <SelectItem key={w.value} value={w.value}>{w.label}</SelectItem>
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
              value={text.style.color}
              onChange={(e) => onUpdate({ style: { ...text.style, color: e.target.value } })}
              className="h-8 w-8 p-0 border-none"
            />
            <Select
              value={text.style.color}
              onValueChange={(v) => onUpdate({ style: { ...text.style, color: v } })}
            >
              <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
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
          <Label className="text-xs mb-1 block">Alignment</Label>
          <Select value={text.style.textAlign} onValueChange={(value: 'left' | 'center' | 'right') => onUpdate({ style: { ...text.style, textAlign: value } })}>
            <SelectTrigger className="h-8">
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
          value={text.animation}
          onValueChange={(v) => onUpdate({ animation: v })}
        >
          <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
          <SelectContent>
            {animationOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {/* Continuous Animation */}
        {/* <div className="space-y-1">
          <Label className="text-xs mb-1 block">Continuous Animation</Label>
          <div className="flex items-center gap-2">
            <Switch
              checked={text.continuousAnimation || false}
              onCheckedChange={(checked) => onUpdate({ continuousAnimation: checked })}
            />
            <span className="text-xs text-muted-foreground">Repeat</span>
          </div>
        </div> */}
         </div>
    </div>
  );
}
