import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { EventType, TextContent } from '@/types/greeting';
import { eventTypes } from '@/types/eventTypes';
import { Plus, Calendar, Edit, Edit2, Edit3 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import EventNameCustomizer from './EventNameCustomizer';
import EventEmojiCustomizer from '../eventName/EventEmojiCustomizer';

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
  const [showEventCustomizer, setShowEventCustomizer] = useState(false);
  const [showEmojiCustomizer, setShowEmojiCustomizer] = useState(false);

  // keep only one open
  const toggleEventCustomizer = () => {
    setShowEventCustomizer((prev) => {
      if (!prev) setShowEmojiCustomizer(false);
      return !prev;
    });
  };

  const toggleEmojiCustomizer = () => {
    setShowEmojiCustomizer((prev) => {
      if (!prev) setShowEventCustomizer(false);
      return !prev;
    });
  };

  // local states
  const [customEventData, setCustomEventData] = useState<Partial<EventType>>({
    value: '',
    label: '',
    emoji: '🎉',
    defaultMessage: '',
    theme: 'card-custom',
    category: 'custom'
  });

  const [eventNameStyle, setEventNameStyle] = useState<TextContent>({
    id: 'event-name',
    content: '',
    style: {
      fontSize: '16px',
      fontWeight: '400',
      color: '#000000',
      textAlign: 'left',
      fontFamily: 'inherit'
    },
    animation: '',
    continuousAnimation: false
  });

  const [eventEmojiSettings, setEventEmojiSettings] = useState<any>({
    size: 32,
    animation: 'none',
  });

  const allEvents = customEvent ? [...eventTypes, customEvent] : eventTypes;

  const groupedEvents = allEvents.reduce((acc, event) => {
    if (!acc[event.category]) acc[event.category] = [];
    acc[event.category].push(event);
    return acc;
  }, {} as Record<string, EventType[]>);

  const categoryLabels = {
    birthday: '🎂 Birthday Events',
    religious: '🙏 Religious Festivals',
    national: '🏛️ National Holidays',
    seasonal: '🌸 Seasonal Festivals',
    personal: '👥 Personal Milestones',
    wellness: '💚 Wellness',
    professional: '📚 Professional',
    international: '🎭 International',
    special: '👩‍🦰 Special',
    custom: '✨ Custom Events'
  };

  const handleCustomEventSubmit = () => {
    if (!customEventData.label || !customEventData.emoji || !customEventData.defaultMessage) return;

    const newEvent: EventType = {
      value: customEventData.label.toLowerCase().replace(/\s+/g, '-'),
      label: customEventData.label,
      emoji: customEventData.emoji,
      defaultMessage: customEventData.defaultMessage,
      theme: 'card-custom',
      category: 'custom'
    };

    onCustomEventCreate(newEvent);
    onEventChange(newEvent.value);
    setShowCustomForm(false);
    setCustomEventData({
      value: '',
      label: '',
      emoji: '🎉',
      defaultMessage: '',
      theme: 'card-custom',
      category: 'custom'
    });
  };

  const popularEmojis = [
    '🎉', '🎊', '🎈', '🎁', '🌟', '✨', '💫', '⭐',
    '❤️', '💕', '💖', '🌹', '🎂', '🍰', '🥳', '😍'
  ];

  const selectedEventData =
    eventTypes.find((e) => e.value === selectedEvent) ||
    (customEvent && customEvent.value === selectedEvent ? customEvent : null);

  return (
    <Card className="border border-green-500 rounded-xl shadow-lg transition-colors duration-300 dark:border-green-400">
      <CardHeader>
        <CardTitle className="text-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-green-500 dark:text-green-400" />
            Event Selection
          </div>
          <Button
            onClick={() => setShowCustomForm(!showCustomForm)}
            size="sm"
            className="transition-all animate-pulse"
          >
            <Plus className="h-3 w-3 mr-1" />
            Custom Event
          </Button>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Event Selector */}
        <div className="space-y-2">
          <Label htmlFor="eventType">Select Event Type *</Label>
          <Select value={selectedEvent} onValueChange={onEventChange}>
            <SelectTrigger>
              <SelectValue placeholder="Choose an event type" />
            </SelectTrigger>
            <SelectContent className="max-h-80">
              {Object.entries(groupedEvents).map(([category, events]) => (
                <div key={category}>
                  <div className="px-2 py-1 text-xs font-semibold text-muted-foreground border-b border-muted">
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

        {/* Custom Event Form */}
        {showCustomForm && (
          <Card className="border-primary/20 dark:border-primary/40">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Create Custom Event</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs">Event Name *</Label>
                  <Input
                    value={customEventData.label}
                    onChange={(e) =>
                      setCustomEventData((prev) => ({ ...prev, label: e.target.value }))
                    }
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
                        onClick={() => setCustomEventData((prev) => ({ ...prev, emoji }))}
                        variant={customEventData.emoji === emoji ? 'default' : 'ghost'}
                        size="sm"
                        className="h-8 w-8 p-0 text-sm"
                      >
                        {emoji}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <Label className="text-xs">Default Message *</Label>
                <Textarea
                  value={customEventData.defaultMessage}
                  onChange={(e) =>
                    setCustomEventData((prev) => ({
                      ...prev,
                      defaultMessage: e.target.value
                    }))
                  }
                  placeholder="Enter a default message for this event..."
                  rows={3}
                  className="text-sm"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  onClick={handleCustomEventSubmit}
                  size="sm"
                  disabled={
                    !customEventData.label ||
                    !customEventData.emoji ||
                    !customEventData.defaultMessage
                  }
                >
                  Create Event
                </Button>
                <Button
                  onClick={() => setShowCustomForm(false)}
                  size="sm"
                  variant="ghost"
                  className="text-red-600 hover:bg-red-100 dark:hover:bg-red-900"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Selected Event + Customizers */}
        {selectedEvent && (
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="p-3 bg-muted/50 dark:bg-muted/20 rounded-lg">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <Label className="text-xs text-muted-foreground whitespace-nowrap">
                    Selected Event:
                  </Label>

                  <div className="flex items-center gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-xs border border-muted/20 hover:border hover:border-purple-300 hover:bg-purple-100"
                      onClick={toggleEventCustomizer}
                    >
                      <span className="hidden sm:inline">
                        {showEventCustomizer ? 'Hide' : 'Edit Event Name'}
                      </span>
                      <span className="sm:hidden">{showEventCustomizer ? '❌' : <Edit></Edit>}</span>
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-xs  border border-muted/20 hover:border hover:border-purple-300 hover:bg-purple-100"
                      onClick={toggleEmojiCustomizer}
                    >
                      <span className="hidden sm:inline">
                        {showEmojiCustomizer ? 'Hide' : 'Edit Emoji Style'}
                      </span>
                      <span className="sm:hidden">{showEmojiCustomizer ? '❌' : '😀'}</span>
                    </Button>
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-1">
                  {selectedEventData ? (
                    <>
                      <span className="text-2xl">{selectedEventData.emoji}</span>
                      <div>
                        <p className="font-medium">{selectedEventData.label}</p>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {selectedEventData.defaultMessage}
                        </p>
                      </div>
                    </>
                  ) : (
                    <p className="text-sm text-muted-foreground">No event selected</p>
                  )}
                </div>
              </div>

              {/* Customizers */}
              <EventNameCustomizer
                eventNameStyle={eventNameStyle}
                selectedEvent={selectedEventData}
                onChange={setEventNameStyle}
                expanded={showEventCustomizer}
                onToggleExpanded={toggleEventCustomizer}
              />

              <EventEmojiCustomizer
                eventEmojiSettings={eventEmojiSettings}
                selectedEvent={selectedEventData}
                onChange={setEventEmojiSettings}
                expanded={showEmojiCustomizer}
                onToggleExpanded={toggleEmojiCustomizer}
              />
            </motion.div>
          </AnimatePresence>
        )}
      </CardContent>
    </Card>
  );
};

export default CustomEventSelector;
