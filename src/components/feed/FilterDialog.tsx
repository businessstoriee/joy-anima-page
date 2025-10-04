import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Sparkles, User, Heart, PartyPopper, TrendingUp } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { SearchFilters } from './SearchBar';
import { collection, query, getDocs, limit, orderBy } from 'firebase/firestore';
import { db } from '@/utils/firebase/firebase';
import { eventTypes as staticEventTypes } from '@/types/eventTypes';

interface FilterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filters: SearchFilters;
  onApplyFilters: (filters: Partial<SearchFilters>) => void;
}

const FilterDialog: React.FC<FilterDialogProps> = ({
  open,
  onOpenChange,
  filters,
  onApplyFilters,
}) => {
  const [localFilters, setLocalFilters] = useState(filters);
  const [dynamicEventTypes, setDynamicEventTypes] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTopEvents = async () => {
      setLoading(true);
      try {
        const greetingsRef = collection(db, 'greetings');
        const q = query(greetingsRef, orderBy('views', 'desc'), limit(100));
        const snapshot = await getDocs(q);
        
        const eventCounts: { [key: string]: number } = {};
        snapshot.forEach((doc) => {
          const data = doc.data();
          const eventName = data.eventName || 'Custom';
          eventCounts[eventName] = (eventCounts[eventName] || 0) + (data.views || 0);
        });

        const topEvents = Object.entries(eventCounts)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 10)
          .map(([event]) => event);

        const staticLabels = staticEventTypes.map(e => e.label);
        const allEvents = Array.from(new Set([...topEvents, ...staticLabels]));
        setDynamicEventTypes(allEvents);
      } catch (error) {
        console.error('Error fetching top events:', error);
        setDynamicEventTypes(staticEventTypes.map(e => e.label));
      } finally {
        setLoading(false);
      }
    };

    if (open) {
      fetchTopEvents();
    }
  }, [open]);

  const handleApply = () => {
    onApplyFilters(localFilters);
    onOpenChange(false);
  };

  const handleReset = () => {
    const resetFilters: SearchFilters = {
      searchQuery: '',
      eventName: '',
      senderName: '',
      receiverName: '',
      dateRange: { from: null, to: null },
      sortBy: 'newest',
    };
    setLocalFilters(resetFilters);
    onApplyFilters(resetFilters);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden">
        <DialogHeader className="space-y-2">
          <DialogTitle className="flex items-center gap-3 text-2xl font-bold">
            <motion.div
              animate={{ 
                rotate: [0, 10, -10, 10, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <Sparkles className="w-7 h-7 text-primary hover:animate-spin" />
            </motion.div>
            <span className="bg-gradient-to-r from-pink-500 via-violet-500 to-indigo-500 bg-clip-text text-transparent">
              Filter Greetings
            </span>
          </DialogTitle>
          <DialogDescription className="text-base">
            Discover the perfect greeting with smart filters
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-4 overflow-y-auto max-h-[calc(85vh-180px)] px-4 custom-scrollbar">
          {/* Event Name Filter */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-3"
          >
            <Label className="flex items-center gap-2 text-base font-semibold">
              <div className="p-1.5 rounded-lg bg-gradient-to-br from-pink-500 to-violet-500">
                <PartyPopper className="w-4 h-4 text-white" />
              </div>
              Event Type
              {loading && (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <TrendingUp className="w-4 h-4 text-primary" />
                </motion.div>
              )}
            </Label>
   <div className="flex flex-wrap gap-2 max-h-[140px] overflow-y-auto pr-2 custom-scrollbar">
  <AnimatePresence mode="popLayout">
    {dynamicEventTypes.map((event, idx) => (
      <motion.div
        key={event}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ delay: idx * 0.02 }}
      >
        <Button
          variant={localFilters.eventName === event ? 'default' : 'outline'}
          size="sm"
          onClick={() =>
            setLocalFilters({
              ...localFilters,
              eventName: localFilters.eventName === event ? '' : event,
            })
          }
          className={cn(
            "relative overflow-hidden rounded-full border text-sm font-medium transition-all duration-300 group",
            localFilters.eventName === event &&
              "shadow-lg shadow-primary/40 bg-gradient-to-r from-pink-500 via-violet-500 to-indigo-500 text-white"
          )}
        >
          {/* Expanding fill background */}
          <span className="absolute inset-0 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 ease-out bg-gradient-to-r from-pink-500 via-violet-500 to-indigo-500 rounded-full"></span>

          {/* Button text (kept above bg) */}
          <span className="relative z-10 group-hover:text-white">{event}</span>
        </Button>
      </motion.div>
    ))}
  </AnimatePresence>
</div>

            
          </motion.div>

          {/* Sender & Receiver Names - Single Row */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-2 gap-4"
          >
            <div className="space-y-2">
              <Label htmlFor="sender" className="flex items-center gap-2 text-sm font-semibold">
                <div className="p-1 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500">
                  <User className="w-3.5 h-3.5 text-white" />
                </div>
                Sender
              </Label>
              <Input
                id="sender"
                placeholder="Sender name..."
                value={localFilters.senderName}
                onChange={(e) =>
                  setLocalFilters({ ...localFilters, senderName: e.target.value })
                }
                className="border-2 focus-visible:ring-primary transition-all duration-200"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="receiver" className="flex items-center gap-2 text-sm font-semibold">
                <div className="p-1 rounded-lg bg-gradient-to-br from-rose-500 to-pink-500">
                  <Heart className="w-3.5 h-3.5 text-white" />
                </div>
                Receiver
              </Label>
              <Input
                id="receiver"
                placeholder="Receiver name..."
                value={localFilters.receiverName}
                onChange={(e) =>
                  setLocalFilters({ ...localFilters, receiverName: e.target.value })
                }
                className="border-2 focus-visible:ring-primary transition-all duration-200"
              />
            </div>
          </motion.div>

          {/* Date Range Filter - Compact */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-2"
          >
            <Label className="flex items-center gap-2 text-sm font-semibold">
              <div className="p-1 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-500">
                <CalendarIcon className="w-3.5 h-3.5 text-white" />
              </div>
              Date Range
            </Label>
            <div className="grid grid-cols-2 gap-3">
              {/* From Date */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal text-sm h-10",
                      !localFilters.dateRange.from && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-3.5 w-3.5" />
                    {localFilters.dateRange.from ? (
                      format(localFilters.dateRange.from, 'MMM d, yy')
                    ) : (
                      <span>From</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={localFilters.dateRange.from || undefined}
                    onSelect={(date) =>
                      setLocalFilters({
                        ...localFilters,
                        dateRange: { ...localFilters.dateRange, from: date || null },
                      })
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>

              {/* To Date */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal text-sm h-10",
                      !localFilters.dateRange.to && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-3.5 w-3.5" />
                    {localFilters.dateRange.to ? (
                      format(localFilters.dateRange.to, 'MMM d, yy')
                    ) : (
                      <span>To</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={localFilters.dateRange.to || undefined}
                    onSelect={(date) =>
                      setLocalFilters({
                        ...localFilters,
                        dateRange: { ...localFilters.dateRange, to: date || null },
                      })
                    }
                    disabled={(date) =>
                      localFilters.dateRange.from
                        ? date < localFilters.dateRange.from
                        : false
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </motion.div>

          {/* Sort Options - Compact */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-2"
          >
            <Label className="flex items-center gap-2 text-sm font-semibold">
              <div className="p-1 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500">
                <TrendingUp className="w-3.5 h-3.5 text-white" />
              </div>
              Sort By
            </Label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: 'newest', label: 'Newest', emoji: '🆕' },
                { value: 'oldest', label: 'Oldest', emoji: '📅' },
                { value: 'most-viewed', label: 'Popular', emoji: '🔥' },
              ].map((option, idx) => (
                <motion.div
                  key={option.value}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant={localFilters.sortBy === option.value ? 'default' : 'outline'}
                    onClick={() =>
                      setLocalFilters({
                        ...localFilters,
                        sortBy: option.value as 'newest' | 'oldest' | 'most-viewed',
                      })
                    }
                    className={cn(
                      "w-full rounded-xl transition-all duration-300 text-sm",
                      localFilters.sortBy === option.value && 
                      "shadow-lg bg-gradient-to-r from-pink-500 via-violet-500 to-indigo-500"
                    )}
                  >
                    <span className="mr-1.5">{option.emoji}</span>
                    {option.label}
                  </Button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Action Buttons */}
        <motion.div 
          className="flex gap-3 pt-4 px-4 border-t"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1">
            <Button
              variant="outline"
              onClick={handleReset}
              className="w-full rounded-full border-2 hover:border-primary"
            >
              Reset All
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1">
            <Button
              onClick={handleApply}
              className="w-full rounded-full bg-gradient-to-r from-pink-500 via-violet-500 to-indigo-500 hover:opacity-90 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Apply Filters
              <span className="text-xl animate-bounce hover:animate-spin">✨</span>
            </Button>
          </motion.div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

export default FilterDialog;
