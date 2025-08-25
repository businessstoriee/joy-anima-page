import React, { useState, useRef } from 'react';
import Draggable, { DraggableData, DraggableEvent } from 'react-draggable';
import { Resizable, ResizeCallbackData } from 'react-resizable';
import { Button } from '@/components/ui/button';
import { Move, Maximize2, Edit3, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import 'react-resizable/css/styles.css';

interface InteractiveElementProps {
  id: string;
  children: React.ReactNode;
  position: { x: number; y: number };
  size?: { width: number; height: number };
  isEditing: boolean;
  canResize?: boolean;
  onPositionChange: (id: string, position: { x: number; y: number }) => void;
  onSizeChange?: (id: string, size: { width: number; height: number }) => void;
  onDelete?: (id: string) => void;
  onEdit?: (id: string) => void;
  className?: string;
}

const InteractiveElement: React.FC<InteractiveElementProps> = ({
  id,
  children,
  position,
  size,
  isEditing,
  canResize = false,
  onPositionChange,
  onSizeChange,
  onDelete,
  onEdit,
  className
}) => {
  const [showControls, setShowControls] = useState(false);
  const dragRef = useRef<HTMLDivElement>(null);

  const handleDrag = (e: DraggableEvent, data: DraggableData) => {
    onPositionChange(id, { x: data.x, y: data.y });
  };

  const handleResize = (e: any, { size: newSize }: ResizeCallbackData) => {
    if (onSizeChange) {
      onSizeChange(id, newSize);
    }
  };

  if (!isEditing) {
    return (
      <div
        className={cn("relative", className)}
        style={{
          transform: `translate(${position.x}px, ${position.y}px)`,
          width: size?.width,
          height: size?.height
        }}
      >
        {children}
      </div>
    );
  }

  const ElementContent = (
    <div
      ref={dragRef}
      className={cn(
        "group relative border-2 border-dashed border-transparent hover:border-primary transition-all cursor-move",
        showControls && "border-primary",
        className
      )}
      style={{
        width: size?.width,
        height: size?.height
      }}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      {children}
      
      {/* Controls */}
      {showControls && (
        <div className="absolute -top-10 left-0 flex gap-1 z-50 bg-white/90 backdrop-blur-sm rounded-lg p-1 shadow-lg">
          <Button
            size="sm"
            variant="ghost"
            className="h-6 w-6 p-0 drag-handle hover:bg-primary/20"
            title="Move"
          >
            <Move className="h-3 w-3" />
          </Button>
          
          {onEdit && (
            <Button
              size="sm"
              variant="ghost"
              className="h-6 w-6 p-0 hover:bg-blue-500/20"
              onClick={() => onEdit(id)}
              title="Edit"
            >
              <Edit3 className="h-3 w-3" />
            </Button>
          )}
          
          {canResize && onSizeChange && (
            <Button
              size="sm"
              variant="ghost"
              className="h-6 w-6 p-0 hover:bg-green-500/20"
              title="Resize"
            >
              <Maximize2 className="h-3 w-3" />
            </Button>
          )}
          
          {onDelete && (
            <Button
              size="sm"
              variant="ghost"
              className="h-6 w-6 p-0 hover:bg-red-500/20"
              onClick={() => onDelete(id)}
              title="Delete"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          )}
        </div>
      )}
      
      {/* Resize handle indicator */}
      {canResize && showControls && (
        <div className="absolute bottom-0 right-0 w-3 h-3 bg-primary/30 border border-primary rounded-tl cursor-se-resize">
          <Maximize2 className="h-2 w-2 text-primary" />
        </div>
      )}
    </div>
  );

  if (canResize && size && onSizeChange) {
    return (
      <Draggable
        position={position}
        onDrag={handleDrag}
        disabled={!isEditing}
        nodeRef={dragRef}
        bounds="parent"
        handle=".drag-handle"
      >
        <div className="absolute">
          <Resizable
            width={size.width}
            height={size.height}
            onResize={handleResize}
            minConstraints={[50, 50]}
            maxConstraints={[800, 600]}
            resizeHandles={['se']}
          >
            {ElementContent}
          </Resizable>
        </div>
      </Draggable>
    );
  }

  return (
    <Draggable
      position={position}
      onDrag={handleDrag}
      disabled={!isEditing}
      nodeRef={dragRef}
      bounds="parent"
      handle=".drag-handle"
    >
      <div className="absolute">
        {ElementContent}
      </div>
    </Draggable>
  );
};

export default InteractiveElement;