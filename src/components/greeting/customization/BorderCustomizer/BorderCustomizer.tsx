// src/components/BorderCustomizer.tsx
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Frame, Plus, Trash2, Square } from 'lucide-react';
import ElementPicker from './ElementPicker';
import BorderPreview from './BorderPreview';
import { makeCompatibleForLegacy } from '@/types/background';
import { cn } from "@/lib/utils";

interface BorderCustomizerProps {
  settings: any;
  onChange: (settings: any) => void;
}

const DEFAULT = {
  enabled: false,
  style: 'solid',
  width: 4,
  primaryColor: '#2b2b2b',
  secondaryColor: '#06b6d4',
  radius: 8,
  decorativeElements: [] as any[],
};

const BorderCustomizer: React.FC<BorderCustomizerProps> = ({ settings, onChange }) => {
  const [internal, setInternal] = useState<any>({ ...DEFAULT, ...settings });

  useEffect(() => {
    const merged = { ...DEFAULT, ...settings };
    if (!merged.primaryColor && (settings as any).color) merged.primaryColor = (settings as any).color;
    merged.decorativeElements = settings.decorativeElements || [];
    setInternal(merged);
  }, [settings]);

  const update = (field: string, value: any) => {
    const next = { ...internal, [field]: value };
    setInternal(next);
    onChange(makeCompatibleForLegacy(next));
  };

  const addElement = () => {
    if ((internal.decorativeElements || []).length >= 8) return;
    
    const el = {
      id: Date.now().toString(),
      type: 'emoji',
      content: '⭐',
      position: Math.round(Math.random() * 100),
      size: 28,
      animation: 'float',
      rotateSpeed: 3
    };
    
    update('decorativeElements', [...(internal.decorativeElements || []), el]);
  };

  const removeElement = (id: string) => {
    update('decorativeElements', (internal.decorativeElements || []).filter((x: any) => x.id !== id));
  };

  const updateElement = (id: string, field: string, value: any) => {
    const updated = (internal.decorativeElements || []).map((el: any) => 
      el.id === id ? { ...el, [field]: value } : el
    );
    update('decorativeElements', updated);
  };

  return (
    <Card className="border border-pink-300 rounded-lg">
      <CardHeader className="p-4 pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <Frame className="h-4 w-4 text-purple-500" />
            Border Customization
          </CardTitle>
          <Switch 
            checked={internal.enabled} 
            onCheckedChange={(v) => update('enabled', v)} 
          />
        </div>
      </CardHeader>

      <CardContent className="p-4 pt-2 space-y-4">
        {internal.enabled && (
          <>
            {/* Border Style Section */}
            <div className="space-y-3">
               <Select 
                    value={internal.style} 
                    onValueChange={(v) => update('style', v)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="solid">Solid</SelectItem>
                      <SelectItem value="dashed">Dashed</SelectItem>
                      <SelectItem value="dotted">Dotted</SelectItem>
                      <SelectItem value="double">Double</SelectItem>
                    </SelectContent>
                  </Select>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                 
                  <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-3">
                    <Label className="text-xs">Width ({internal.width}px)</Label>
                    <Slider 
                      value={[internal.width]} 
                      onValueChange={([w]) => update('width', w)} 
                      min={1} 
                      max={40} 
                      step={1} 
                    />
                </div>

                <div className="space-y-3">
                   <Label className="text-xs">Corner Radius ({internal.radius}px)</Label>
                    <Slider 
                      value={[internal.radius]} 
                      onValueChange={([r]) => update('radius', r)} 
                      min={0} 
                      max={72} 
                      step={1} 
                    />
                </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="flex-1">
                      <Label className="text-xs">Primary Color</Label>
                      <Input 
                        type="color" 
                        value={internal.primaryColor} 
                        onChange={(e) => update('primaryColor', e.target.value)} 
                        className="w-full"
                      />
                    </div>
                    <div className="flex-1">
                      <Label className="text-xs">Secondary Color</Label>
                      <Input 
                        type="color" 
                        value={internal.secondaryColor || ''} 
                        onChange={(e) => update('secondaryColor', e.target.value)} 
                        className="w-full"
                      />
                    </div>
                  </div>
         
                </div>
              </div>
            </div>

            {/* Border Elements Section */}
            <div className="space-y-3">
         <div className="flex items-center justify-between">
  <Label className="flex items-center gap-2">
    <Square className="h-4 w-4 text-primary" />
    <span className="text-sm font-medium">
      Border Elements
      <span className={cn(
        "ml-2 px-2 py-0.5 rounded-full text-xs",
        internal.decorativeElements.length >= 8 
          ? "bg-destructive/10 text-destructive" 
          : "bg-primary/10 text-primary"
      )}>
        {internal.decorativeElements.length}/8
      </span>
    </span>
  </Label>
  
  <Button
    onClick={addElement}
    disabled={internal.decorativeElements.length >= 8}
    size="sm"
    variant={
    internal.decorativeElements.length >= 8 ? "outline" : 
    internal.decorativeElements.length === 0 ? "default" : "outline"
  }
    className={cn(
        "transition-all duration-300 font-medium",
        internal.decorativeElements.length === 0 ? "h-8 w-8 p-0" : internal.decorativeElements.length >= 8 ? "h-8 px-3 bg-destructive/10 text-destructive border-destructive" : "bg-primary/10 text-primary border-primary"    
    )}
  >
    {internal.decorativeElements.length === 0 ? (
      <Plus className="h-4 w-4" />
    ) : internal.decorativeElements.length >= 8 ? (
      <span className="text-destructive text-xs">Max Reached</span>
    ) : (
      <span className="flex items-center gap-1 text-xs">
        <Plus className="h-3 w-3" />
        Add More
      </span>
    )}
  </Button>
</div>

              {(internal.decorativeElements || []).map((el: any) => (
                <div key={el.id} className="border rounded-md p-3 space-y-3">
                  {/* First Line: Type, Content, Delete */}
                  <div className="grid grid-cols-2 gap-3">
                    <Select 
                      value={el.type} 
                      onValueChange={(v) => updateElement(el.id, 'type', v)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="emoji">Emoji</SelectItem>
                        <SelectItem value="image">Image</SelectItem>
                      </SelectContent>
                    </Select>
<div className="flex items-center gap-2">
                    <Input 
                      value={el.content} 
                      onChange={(e) => updateElement(el.id, 'content', e.target.value)} 
                      placeholder={el.type === 'emoji' ? 'Enter emoji' : 'Image URL'} 
                      className="flex-1"
                    />

                    <ElementPicker 
                      type={el.type} 
                      onSelect={(v) => updateElement(el.id, 'content', v)} 
                    />

                    <Button 
                      size="sm" 
                      variant="destructive" 
                      onClick={() => removeElement(el.id)} 
                      className="h-8 w-8 p-0"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    </div>
                  </div>

                  {/* Animation */}
                  <div>
                      <Label className="text-xs">Animation</Label>
                      <Select 
                        value={el.animation} 
                        onValueChange={(v) => updateElement(el.id, 'animation', v)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="float">Float</SelectItem>
                          <SelectItem value="blink">Blink</SelectItem>
                          <SelectItem value="pulse">Pulse</SelectItem>
                          <SelectItem value="bounce">Bounce</SelectItem>
                          <SelectItem value="shake">Shake</SelectItem>
                          <SelectItem value="revolve">Revolve (around border)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                  {/* Second Line: Position, Size, speed */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <Label className="text-xs">Position ({el.position}%)</Label>
                      <Slider 
                        value={[el.position]} 
                        onValueChange={([p]) => updateElement(el.id, 'position', Math.round(p))} 
                        min={0} 
                        max={100} 
                        step={1} 
                      />
                      <div className="text-xs text-muted-foreground mt-1">Position along the page perimeter (0 → 100)</div>
                    </div>

                    <div>
                      <Label className="text-xs">Size ({el.size}px)</Label>
                      <Slider 
                        value={[el.size]} 
                        onValueChange={([s]) => updateElement(el.id, 'size', s)} 
                        min={8} 
                        max={128} 
                        step={1} 
                      />
                    </div>

<div>
                    <Label className="text-xs">Speed / Duration ({el.rotateSpeed || 3}s)</Label>
                    <Slider 
                      value={[el.rotateSpeed || 3]} 
                      onValueChange={([s]) => updateElement(el.id, 'rotateSpeed', s)} 
                      min={0.5} 
                      max={20} 
                      step={0.5} 
                    />
                    <div className="text-xs text-muted-foreground mt-1">Used for rotate/revolve durations (seconds)</div>
                  </div>
                  </div>
                  
                </div>
              ))}
            </div>

            {/* Preview */}
            <div className="pt-2">
              <BorderPreview 
                settings={makeCompatibleForLegacy({
                  ...internal,
                  color: internal.primaryColor,
                  decorativeElements: internal.decorativeElements || []
                })} 
                height={80} 
              />
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default BorderCustomizer;
