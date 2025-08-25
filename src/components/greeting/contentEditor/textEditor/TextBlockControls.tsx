import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TextContent } from '@/types/greeting';
import { animationStyles } from '@/types/eventTypes';

const fontSizes = [
  { value: '12px', label: 'Small (12px)' },
  { value: '14px', label: 'Regular (14px)' },
  { value: '16px', label: 'Medium (16px)' },
  { value: '18px', label: 'Large (18px)' },
  { value: '20px', label: 'X-Large (20px)' },
  { value: '24px', label: 'XX-Large (24px)' },
  { value: '28px', label: 'XX-Large (28px)' },
  { value: '32px', label: 'XXX-Large (32px)' },
  { value: '36px', label: 'XXX-Large (36px)' },
  { value: '48px', label: 'Huge (48px)' }
];

const fontWeights = [
  { value: 'normal', label: 'Normal' },
  { value: 'bold', label: 'Bold' },
  { value: '100', label: 'Thin (100)' },
  { value: '200', label: 'Extra Light (200)' },
  { value: '300', label: 'Light (300)' },
  { value: '400', label: 'Regular (400)' },
  { value: '500', label: 'Medium (500)' },
  { value: '600', label: 'Semi Bold (600)' },
  { value: '700', label: 'Bold (700)' },
  { value: '800', label: 'Extra Bold (800)' },
  { value: '900', label: 'Black (900)' }
];

const colors = [
  { value: 'hsl(var(--foreground))', label: 'Default' },
  { value: 'hsl(var(--primary))', label: 'Primary' },
  { value: 'hsl(var(--secondary))', label: 'Secondary' },
  { value: 'hsl(var(--muted-foreground))', label: 'Muted' },
  { value: 'hsl(0 0% 100%)', label: 'White' },
  { value: 'hsl(0 0% 0%)', label: 'Black' },
  { value: 'hsl(0 70% 50%)', label: 'Red' },
  { value: 'hsl(120 60% 40%)', label: 'Green' },
  { value: 'hsl(220 90% 50%)', label: 'Blue' },
  { value: 'hsl(45 90% 50%)', label: 'Yellow' }
];

const textAligns = ['left', 'center', 'right'] as const;
type TextAlign = (typeof textAligns)[number];

interface Props {
  text: TextContent;
  onUpdate: (updates: Partial<TextContent>) => void;
}

export default function TextBlockControls({ text, onUpdate }: Props) {
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
              {fontSizes.map((s) => (
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
              {fontWeights.map((w) => (
                <SelectItem key={w.value} value={w.value}>{w.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Color & Align */}
      <div className="grid grid-cols-2 gap-3">
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
                {colors.map((c) => (
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
          <Select
            value={text.style.textAlign}
            onValueChange={(v) => {
              if (textAligns.includes(v as TextAlign)) {
                onUpdate({ style: { ...text.style, textAlign: v as TextAlign } });
              }
            }}
          >
            <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
            <SelectContent>
              {textAligns.map((align) => (
                <SelectItem key={align} value={align}>{align}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
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
            {animationStyles.map((style) => (
              <SelectItem key={style.value} value={style.value}>{style.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
