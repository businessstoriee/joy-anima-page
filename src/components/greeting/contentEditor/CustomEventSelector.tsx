import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { EventType } from '@/types/greeting';
import { eventTypes } from '@/types/eventTypes';
import { Plus, Edit } from 'lucide-react';

interface CustomEventSelectorProps {
  selectedEvent: string;
  customEvent: EventType | null;
  onEventChange: (eventType: string) => void;
  onCustomEventCreate: (event: EventType) => void;
}

const CustomEventSelector = ({ 
  selectedEvent, 
  customEvent, 
  onEventChange, 
  onCustomEventCreate 
}: CustomEventSelectorProps) => {
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [customEventData, setCustomEventData] = useState<Partial<EventType>>({
    value: '',
    label: '',
    emoji: '🎉',
    defaultMessage: '',
    theme: 'card-custom',
    category: 'custom'
  });

  const allEvents = customEvent 
    ? [...eventTypes, customEvent]
    : eventTypes;

  // Group events by category
  const groupedEvents = allEvents.reduce((acc, event) => {
    if (!acc[event.category]) {
      acc[event.category] = [];
    }
    acc[event.category].push(event);
    return acc;
  }, {} as Record<string, EventType[]>);

  const categoryLabels = {
    birthday: '🎂 Birthday Events',
    religious: '🙏 Religious Festivals',
    national: '🏛️ National Holidays',
    seasonal: '🌸 Seasonal Festivals',
    personal: '👥 Personal Milestones',
    custom: '✨ Custom Events'
  };

 const handleCustomEventSubmit = () => {
  if (!customEventData.label || !customEventData.emoji || !customEventData.defaultMessage) {
    return; // Validation failed
  }

  const newEvent: EventType = {
    value: customEventData.label.toLowerCase().replace(/\s+/g, '-'),
    label: customEventData.label,
    emoji: customEventData.emoji,
    defaultMessage: customEventData.defaultMessage,
    theme: 'card-custom',
    category: 'custom'
  };

  // Clear the form
  setCustomEventData({
    value: '',
    label: '',
    emoji: '🎉',
    defaultMessage: '',
    theme: 'card-custom',
    category: 'custom'
  });

  // Pass the new event up
  onCustomEventCreate(newEvent);
  // Select the new event
  onEventChange(newEvent.value);
  setShowCustomForm(false);
};

  const popularEmojis = [
    '🎉', '🎊', '🎈', '🎁', '🌟', '✨', '💫', '⭐',
    '❤️', '💕', '💖', '🌹', '🎂', '🍰', '🥳', '😍'
  ];

  return (
    <Card className="border border-blue-300 rounded-xl shadow-lg">
      <CardHeader>
        <CardTitle className="text-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Edit className="h-4 w-4 text-purple-500" />
            Event Selection
          </div>
          <Button
            onClick={() => setShowCustomForm(!showCustomForm)}
            size="sm"
            variant="default"
            className="transition-all duration-5000 animate-pulse"
          >
            <Plus className="h-3 w-3 mr-1" />
            Custom Event
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Main Event Selector */}
        <div className="space-y-2">
          <Label htmlFor="eventType">Select Event Type *</Label>
          <Select value={selectedEvent} onValueChange={onEventChange}>
            <SelectTrigger>
              <SelectValue placeholder="Choose an event type" />
            </SelectTrigger>
            <SelectContent className="max-h-80">
              {Object.entries(groupedEvents).map(([category, events]) => (
                <div key={category}>
                  <div className="px-2 py-1 text-xs font-semibold text-muted-foreground border-b">
                    {categoryLabels[category as keyof typeof categoryLabels]}
                  </div>
                  {events.map((event) => (
                    <SelectItem key={event.value} value={event.value}>
                      <div className="flex items-center gap-2">
                        <span>{event.emoji}</span>
                        <span>{event.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </div>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Custom Event Creation Form */}
        {showCustomForm && (
          <Card className="border-primary/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Create Custom Event</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs">Event Name *</Label>
                  <Input
                    value={customEventData.label}
                    onChange={(e) => setCustomEventData(prev => ({ ...prev, label: e.target.value }))}
                    placeholder="e.g., Company Anniversary"
                    className="h-8 text-sm"
                  />
                </div>
                <div>
                  <Label className="text-xs">Choose Emoji *</Label>
                  <div className="flex gap-1 flex-wrap">
                    {popularEmojis.map((emoji) => (
                      <Button
                        key={emoji}
                        onClick={() => setCustomEventData(prev => ({ ...prev, emoji }))}
                        variant={customEventData.emoji === emoji ? "default" : "ghost"}
                        size="sm"
                        className="h-8 w-8 p-0 text-sm"
                      >
                        {emoji}
                      </Button>
                    ))}
                  </div>
                  <Input
                    value={customEventData.emoji}
                    onChange={(e) => setCustomEventData(prev => ({ ...prev, emoji: e.target.value }))}
                    placeholder="Or type emoji"
                    className="h-8 text-center mt-1"
                    maxLength={4}
                  />
                </div>
              </div>

              <div>
                <Label className="text-xs">Default Message *</Label>
                <Textarea
                  value={customEventData.defaultMessage}
                  onChange={(e) => setCustomEventData(prev => ({ ...prev, defaultMessage: e.target.value }))}
                  placeholder="Enter a default message for this event..."
                  rows={3}
                  className="text-sm"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  onClick={handleCustomEventSubmit}
                  size="sm"
                  disabled={!customEventData.label || !customEventData.emoji || !customEventData.defaultMessage}
                >
                  Create Event
                </Button>
                <Button
                  onClick={() => setShowCustomForm(false)}
                  size="sm"
                  variant="ghost"
                   className="bg-red-100 hover:bg-red-200 text-red-600"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Event Preview */}
        {selectedEvent && (
  <div className="p-3 bg-muted/50 rounded-lg">
    <Label className="text-xs text-muted-foreground">Selected Event:</Label>
    <div className="flex items-center gap-2 mt-1">
      {(() => {
        // First check in predefined events
        let event = eventTypes.find(e => e.value === selectedEvent);
        
        // If not found, check if it's the custom event
        if (!event && customEvent && customEvent.value === selectedEvent) {
          event = customEvent;
        }
        
        // If still not found, check if it matches the current custom form data
        if (!event && showCustomForm && customEventData.label) {
          event = {
            value: customEventData.label.toLowerCase().replace(/\s+/g, '-'),
            label: customEventData.label,
            emoji: customEventData.emoji,
            defaultMessage: customEventData.defaultMessage || '',
            theme: 'card-custom',
            category: 'custom'
          };
        }

        return event ? (
          <>
            <span className="text-2xl">{event.emoji}</span>
            <div>
              <p className="font-medium">{event.label}</p>
              <p className="text-xs text-muted-foreground line-clamp-2">
                {event.defaultMessage}
              </p>
            </div>
          </>
        ) : (
          <p className="text-sm text-muted-foreground">No event selected</p>
        );
      })()}
    </div>
  </div>
)}
      </CardContent>
    </Card>
  );
};

export default CustomEventSelector;