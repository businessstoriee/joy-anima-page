import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ChevronUp, ChevronDown, Trash2 } from 'lucide-react';
import { TextContent } from '@/types/greeting';
import { cn } from '@/lib/utils';
import TextBlockControls from './TextBlockControls';

interface Props {
  text: TextContent;
  index: number;
  isActive: boolean;
  onRemove: () => void;
  onMove: (dir: 'up' | 'down') => void;
  onToggle: () => void;
  onUpdate: (updates: Partial<TextContent>) => void;
}

export default function TextBlockItem({ text, index, isActive, onRemove, onMove, onToggle, onUpdate }: Props) {
  return (
    <Card className={cn("border overflow-hidden transition-all", isActive ? "border-primary/50 shadow-sm" : "border-transparent hover:border-border")}>
      <CardHeader className="pb-2 pt-3">
        <div className="flex items-center justify-between">
          <Label className="text-xs font-medium flex items-center gap-2">
            <span className="flex items-center justify-center h-5 w-5 rounded-full bg-primary/10 text-primary text-xs">
              {index + 1}
            </span>
            Text Block
          </Label>
          <div className="flex gap-1">
            <Button onClick={() => onMove('up')} size="sm" variant="ghost" className="h-6 w-6 p-0" disabled={index === 0}>
              <ChevronUp className="h-3 w-3" />
            </Button>
            <Button onClick={() => onMove('down')} size="sm" variant="ghost" className="h-6 w-6 p-0">
              <ChevronDown className="h-3 w-3" />
            </Button>
            <Button onClick={onToggle} size="sm" variant="ghost" className="h-6 px-2 text-xs">
              {isActive ? 'Hide' : 'Edit'}
            </Button>
            <Button onClick={onRemove} size="sm" variant="ghost" className="h-6 px-2 text-destructive hover:text-destructive">
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3 pb-3">
        <Textarea
          value={text.content}
          onChange={(e) => onUpdate({ content: e.target.value })}
          placeholder="Enter your message here..."
          rows={2}
          className="text-sm min-h-[80px] w-full resize-none overflow-auto break-words whitespace-pre-wrap [text-wrap:pretty] hyphens-auto"
        />
        {isActive && <TextBlockControls text={text} onUpdate={onUpdate} />}
      </CardContent>
    </Card>
  );
}
