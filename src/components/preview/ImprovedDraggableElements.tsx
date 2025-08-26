import React, { useState, useRef, useCallback } from 'react';
import Draggable, { DraggableData, DraggableEvent } from 'react-draggable';
import { ResizableBox } from 'react-resizable';
import { Button } from '@/components/ui/button';
import { Grip, Move, Maximize2, Edit3, Trash2, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import 'react-resizable/css/styles.css';

interface DraggableElementProps {
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
  containerBounds?: string;
  snapToGrid?: boolean;
  gridSize?: number;
}

const DraggableElement: React.FC<DraggableElementProps> = ({
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
  className,
  containerBounds = "parent",
  snapToGrid = false,
  gridSize = 10
}) => {
  const [isSelected, setIsSelected] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef<HTMLDivElement>(null);

  const handleDrag = useCallback((e: DraggableEvent, data: DraggableData) => {
    let newX = data.x;
    let newY = data.y;

    // Snap to grid if enabled
    if (snapToGrid) {
      newX = Math.round(newX / gridSize) * gridSize;
      newY = Math.round(newY / gridSize) * gridSize;
    }

    onPositionChange(id, { x: newX, y: newY });
  }, [id, onPositionChange, snapToGrid, gridSize]);

  const handleDragStart = useCallback(() => {
    setIsDragging(true);
    setIsSelected(true);
  }, []);

  const handleDragStop = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleResize = useCallback((e: any, { size: newSize }: any) => {
    if (onSizeChange) {
      onSizeChange(id, newSize);
    }
  }, [id, onSizeChange]);

  const resetPosition = useCallback(() => {
    onPositionChange(id, { x: 0, y: 0 });
  }, [id, onPositionChange]);

  const handleClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsSelected(true);
  }, []);

  // Non-editing mode
  if (!isEditing) {
    return (
      <motion.div
        className={cn("absolute", className)}
        style={{
          left: position.x,
          top: position.y,
          width: size?.width,
          height: size?.height
        }}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        {children}
      </motion.div>
    );
  }

  const ElementContent = (
    <div
      ref={dragRef}
      className={cn(
        "group relative transition-all duration-200 rounded-lg",
        "border-2 border-transparent hover:border-primary/50",
        isSelected && "border-primary shadow-lg ring-2 ring-primary/20",
        isDragging && "cursor-grabbing opacity-80",
        !isDragging && isEditing && "cursor-grab",
        className
      )}
      style={{
        width: size?.width,
        height: size?.height
      }}
      onClick={handleClick}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      {children}
      
      {/* Control Panel */}
      {(showControls || isSelected) && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute -top-12 left-0 flex items-center gap-1 bg-background/95 backdrop-blur-sm border border-border rounded-lg p-1 shadow-lg z-50"
        >
          {/* Drag Handle */}
          <Button
            size="sm"
            variant="ghost"
            className="h-7 w-7 p-0 drag-handle cursor-grab active:cursor-grabbing hover:bg-primary/20"
            title="Drag to move"
          >
            <Grip className="h-3 w-3" />
          </Button>
          
          {/* Edit Button */}
          {onEdit && (
            <Button
              size="sm"
              variant="ghost"
              className="h-7 w-7 p-0 hover:bg-blue-500/20"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(id);
              }}
              title="Edit element"
            >
              <Edit3 className="h-3 w-3" />
            </Button>
          )}
          
          {/* Resize Indicator */}
          {canResize && onSizeChange && (
            <Button
              size="sm"
              variant="ghost"
              className="h-7 w-7 p-0 hover:bg-green-500/20"
              title="Resizable element"
            >
              <Maximize2 className="h-3 w-3" />
            </Button>
          )}
          
          {/* Reset Position */}
          <Button
            size="sm"
            variant="ghost"
            className="h-7 w-7 p-0 hover:bg-yellow-500/20"
            onClick={(e) => {
              e.stopPropagation();
              resetPosition();
            }}
            title="Reset position"
          >
            <RotateCcw className="h-3 w-3" />
          </Button>
          
          {/* Delete Button */}
          {onDelete && (
            <Button
              size="sm"
              variant="ghost"
              className="h-7 w-7 p-0 hover:bg-destructive/20 text-destructive"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(id);
              }}
              title="Delete element"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          )}
        </motion.div>
      )}
      
      {/* Resize Handle Indicator */}
      {canResize && (showControls || isSelected) && (
        <div className="absolute bottom-0 right-0 w-4 h-4 bg-primary/30 border-2 border-primary rounded-tl-lg cursor-se-resize flex items-center justify-center">
          <div className="w-1 h-1 bg-primary rounded-full"></div>
        </div>
      )}
      
      {/* Position Indicator */}
      {isDragging && (
        <div className="absolute -bottom-8 left-0 bg-black/70 text-white text-xs px-2 py-1 rounded pointer-events-none">
          x: {Math.round(position.x)}, y: {Math.round(position.y)}
        </div>
      )}
    </div>
  );

  // Resizable Element
  if (canResize && size && onSizeChange) {
    return (
      <Draggable
        position={position}
        onDrag={handleDrag}
        onStart={handleDragStart}
        onStop={handleDragStop}
        disabled={!isEditing}
        nodeRef={dragRef}
        bounds={containerBounds}
        handle=".drag-handle"
        grid={snapToGrid ? [gridSize, gridSize] : undefined}
      >
        <div className="absolute">
          <ResizableBox
            width={size.width}
            height={size.height}
            onResize={handleResize}
            minConstraints={[50, 50]}
            maxConstraints={[800, 600]}
            resizeHandles={['se', 'sw', 'ne', 'nw']}
            className="relative"
          >
            {ElementContent}
          </ResizableBox>
        </div>
      </Draggable>
    );
  }

  // Draggable Only Element
  return (
    <Draggable
      position={position}
      onDrag={handleDrag}
      onStart={handleDragStart}
      onStop={handleDragStop}
      disabled={!isEditing}
      nodeRef={dragRef}
      bounds={containerBounds}
      handle=".drag-handle"
      grid={snapToGrid ? [gridSize, gridSize] : undefined}
    >
      <div className="absolute">
        {ElementContent}
      </div>
    </Draggable>
  );
};

export default DraggableElement;