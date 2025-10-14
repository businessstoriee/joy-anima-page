import React from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { GripVertical, Layout } from 'lucide-react';
import { MediaItem } from '@/types/greeting';
import { layoutStyles } from '@/types/layouts';

interface LayoutGroupManagerProps {
  media: MediaItem[];
  layoutGroupOrder: string[];
  onLayoutGroupOrderChange: (newOrder: string[]) => void;
}

const LayoutGroupManager: React.FC<LayoutGroupManagerProps> = ({
  media,
  layoutGroupOrder,
  onLayoutGroupOrderChange
}) => {
  // Group media by layout
  const mediaGroups = media.reduce((groups, item) => {
    const layout = item.layout || 'grid';
    if (!groups[layout]) {
      groups[layout] = [];
    }
    groups[layout].push(item);
    return groups;
  }, {} as Record<string, MediaItem[]>);

  // Get available layouts from media
  const availableLayouts = Object.keys(mediaGroups);
  
  // Ensure all available layouts are in the order array
  const completeOrder = [
    ...layoutGroupOrder.filter(layout => availableLayouts.includes(layout)),
    ...availableLayouts.filter(layout => !layoutGroupOrder.includes(layout))
  ];

  const handleOnDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(completeOrder);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    onLayoutGroupOrderChange(items);
  };

  const getLayoutLabel = (layoutValue: string) => {
    const layout = layoutStyles.find(l => l.value === layoutValue);
    return layout ? layout.label : layoutValue;
  };

  if (availableLayouts.length <= 1) {
    return null; // Don't show if only one layout group
  }

  return (
    <Card className="border border-purple-500 bg-gradient-to-br from-purple-50 to-white">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold text-purple-800 flex items-center gap-2">
          <Layout className="h-4 w-4" />
          Layout Group Order
        </CardTitle>
        <p className="text-xs text-purple-600">
          Drag to reorder how layout groups appear in your greeting
        </p>
      </CardHeader>
      <CardContent className="pt-0">
        <DragDropContext onDragEnd={handleOnDragEnd}>
          <Droppable droppableId="layout-groups">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="space-y-2"
              >
                {completeOrder.map((layout, index) => (
                  <Draggable key={layout} draggableId={layout} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                          snapshot.isDragging
                            ? 'bg-purple-100 border-purple-300 shadow-lg'
                            : 'bg-white border-purple-200 hover:border-purple-300'
                        }`}
                      >
                        <div
                          {...provided.dragHandleProps}
                          className="cursor-grab active:cursor-grabbing"
                        >
                          <GripVertical className="h-4 w-4 text-purple-400" />
                        </div>
                        <div className="flex-1 flex items-center justify-between">
                          <div>
                            <div className="font-medium text-sm text-purple-800">
                              {getLayoutLabel(layout)}
                            </div>
                            <div className="text-xs text-purple-600">
                              {mediaGroups[layout].length} media item{mediaGroups[layout].length !== 1 ? 's' : ''}
                            </div>
                          </div>
                          <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                            Group {index + 1}
                          </Badge>
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </CardContent>
    </Card>
  );
};

export default LayoutGroupManager;