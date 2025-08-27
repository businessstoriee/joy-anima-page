import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Move, Hand, Smartphone, Monitor } from 'lucide-react';
import { motion } from 'framer-motion';

interface DragDropInstructionsProps {
  className?: string;
}

const DragDropInstructions: React.FC<DragDropInstructionsProps> = ({ className = '' }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`${className}`}
    >
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Move className="h-4 w-4 text-primary" />
            <span className="font-medium text-sm">Drag & Drop Guide</span>
            <Badge variant="secondary" className="text-xs">
              Interactive
            </Badge>
          </div>
          
          <div className="space-y-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <Monitor className="h-3 w-3" />
              <span><strong>Desktop:</strong> Click and drag elements to move them around</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Smartphone className="h-3 w-3" />
              <span><strong>Mobile:</strong> Tap and hold, then drag elements</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Hand className="h-3 w-3" />
              <span><strong>Resize:</strong> Drag the corners of media items to resize</span>
            </div>
          </div>
          
          <div className="mt-3 p-2 bg-background/50 rounded text-xs">
            💡 <strong>Tip:</strong> Click an element to select it and see editing options
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default DragDropInstructions;