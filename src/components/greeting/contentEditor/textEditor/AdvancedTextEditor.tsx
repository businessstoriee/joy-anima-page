import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Type, Plus, Sparkles } from 'lucide-react';
import { TextContent } from '@/types/greeting';
import { cn } from '@/lib/utils';
import TextBlockItem from './TextBlockItem';

interface Props {
  texts: TextContent[];
  onChange: (texts: TextContent[]) => void;
}

const MAX_TEXT_LIMIT = 10;

export default function AdvancedTextEditor({ texts, onChange }: Props) {
  const [activeTextIndex, setActiveTextIndex] = useState<number | null>(null);
  const [isAddingText, setIsAddingText] = useState(false);

  useEffect(() => {
    if (texts.length === 1) setActiveTextIndex(0);
  }, [texts.length]);

  const addText = () => {
    if (texts.length >= MAX_TEXT_LIMIT) return;
    setIsAddingText(true);
    setTimeout(() => {
      const newText: TextContent = {
        id: Date.now().toString(),
        content: '',
        style: { fontSize: '18px', fontWeight: 'normal', color: 'hsl(var(--foreground))', textAlign: 'center' },
        animation: 'fade'
      };
      onChange([...texts, newText]);
      setActiveTextIndex(texts.length);
      setIsAddingText(false);
    }, 150);
  };

  const removeText = (i: number) => {
    const newTexts = texts.filter((_, idx) => idx !== i);
    onChange(newTexts);
    if (activeTextIndex === i) setActiveTextIndex(null);
  };

  const updateText = (i: number, updates: Partial<TextContent>) => {
    const newTexts = [...texts];
    newTexts[i] = { ...newTexts[i], ...updates };
    onChange(newTexts);
  };

  const moveText = (i: number, dir: 'up' | 'down') => {
    if ((dir === 'up' && i === 0) || (dir === 'down' && i === texts.length - 1)) return;
    const newIndex = dir === 'up' ? i - 1 : i + 1;
    const newTexts = [...texts];
    [newTexts[i], newTexts[newIndex]] = [newTexts[newIndex], newTexts[i]];
    onChange(newTexts);
    setActiveTextIndex(newIndex);
  };

  return (
    <Card className="border border-yellow-300 shadow-lg">
      <CardHeader className="pb-0">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Type className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">
              Text Content
              <span className={cn("ml-2 px-2 py-1 rounded-full text-xs", texts.length === MAX_TEXT_LIMIT ? "bg-destructive/10 text-destructive" : "bg-primary/10 text-primary")}>
                {texts.length}/{MAX_TEXT_LIMIT}
              </span>
            </span>
          </CardTitle>
         <Button 
  onClick={addText} 
  disabled={texts.length >= MAX_TEXT_LIMIT}
  size="sm"
  variant={
    texts.length >= MAX_TEXT_LIMIT ? "outline" : 
    texts.length === 0 ? "default" : "outline"
  }
  className={cn(
    "transition-all duration-300 font-medium",
    texts.length === 0 ? "h-8 w-8 p-0" : texts.length >= MAX_TEXT_LIMIT ? "h-8 px-3 bg-destructive/10 text-destructive border-destructive" : "bg-primary/10 text-primary border-primary",
    isAddingText && "animate-pulse"
  )}
>
  {texts.length === 0 ? (
    <Plus className={cn(
      "h-4 w-4 transition-transform", 
      isAddingText && "rotate-90 scale-110"
    )} />
  ) : texts.length >= MAX_TEXT_LIMIT ? (
    <span className="text-xs font-medium">Max Reached</span>
  ) : (
    <span className="flex items-center gap-1.5 text-xs">
      <Plus className="h-3.5 w-3.5" />
      Add More
    </span>
  )}
</Button>
        </div>
      </CardHeader>

      <CardContent className="pt-4 space-y-3">
        {texts.length === 0 && (
          <div className="text-center py-8 rounded-lg bg-muted/30 animate-in fade-in">
            <div className="flex flex-col items-center justify-center">
              <Type className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-muted-foreground mb-3">No text content added yet</p>
              <Button onClick={addText} variant="outline" size="sm" className="bg-primary/10 text-primary gap-2">
                <Sparkles className="h-3 w-3" /> Start Adding Text
              </Button>
            </div>
          </div>
        )}

        {texts.map((text, i) => (
          <TextBlockItem
            key={text.id}
            text={text}
            index={i}
            isActive={activeTextIndex === i}
            onRemove={() => removeText(i)}
            onMove={(dir) => moveText(i, dir)}
            onToggle={() => setActiveTextIndex(activeTextIndex === i ? null : i)}
            onUpdate={(updates) => updateText(i, updates)}
          />
        ))}
      </CardContent>
    </Card>
  );
}
