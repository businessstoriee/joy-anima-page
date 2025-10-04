import React, { useState } from 'react';
import { motion } from 'framer-motion';
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
import { CalendarIcon, Sparkles, User, Heart, PartyPopper } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { SearchFilters } from './SearchBar';

interface FilterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filters: SearchFilters;
  onApplyFilters: (filters: Partial<SearchFilters>) => void;
}

const eventTypes = [
  'Birthday', 'Anniversary', 'Wedding', 'Graduation', 'Retirement',
  'Promotion', 'Farewell', 'Diwali', 'Holi', 'Eid', 'Christmas',
  'Navratri', 'Ramadan', 'New Year', 'Valentine\'s Day', 'Mother\'s Day',
  'Father\'s Day', 'Friendship Day', 'Custom'
];

const FilterDialog: React.FC<FilterDialogProps> = ({
  open,
  onOpenChange,
  filters,
  onApplyFilters,
}) => {
  const [localFilters, setLocalFilters] = useState(filters);

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
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="w-6 h-6 text-primary" />
            </motion.div>
            Filter Greetings
          </DialogTitle>
          <DialogDescription>
            Refine your search to find the perfect greeting
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Event Name Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-3"
          >
            <Label className="flex items-center gap-2 text-base font-semibold">
              <PartyPopper className="w-4 h-4 text-primary" />
              Event Type
            </Label>
            <div className="flex flex-wrap gap-2">
              {eventTypes.map((event) => (
                <Button
                  key={event}
                  variant={localFilters.eventName === event ? 'default' : 'outline'}
                  size="sm"
                  onClick={() =>
                    setLocalFilters({
                      ...localFilters,
                      eventName: localFilters.eventName === event ? '' : event,
                    })
                  }
                  className={cn(
                    "rounded-full transition-all duration-200",
                    localFilters.eventName === event && "shadow-lg shadow-primary/30"
                  )}
                >
                  {event}
                </Button>
              ))}
            </div>
          </motion.div>

          {/* Sender Name Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-2"
          >
            <Label htmlFor="sender" className="flex items-center gap-2 text-base font-semibold">
              <User className="w-4 h-4 text-primary" />
              Sender Name
            </Label>
            <Input
              id="sender"
              placeholder="Filter by sender name..."
              value={localFilters.senderName}
              onChange={(e) =>
                setLocalFilters({ ...localFilters, senderName: e.target.value })
              }
              className="border-2 focus-visible:ring-primary"
            />
          </motion.div>

          {/* Receiver Name Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-2"
          >
            <Label htmlFor="receiver" className="flex items-center gap-2 text-base font-semibold">
              <Heart className="w-4 h-4 text-primary" />
              Receiver Name
            </Label>
            <Input
              id="receiver"
              placeholder="Filter by receiver name..."
              value={localFilters.receiverName}
              onChange={(e) =>
                setLocalFilters({ ...localFilters, receiverName: e.target.value })
              }
              className="border-2 focus-visible:ring-primary"
            />
          </motion.div>

          {/* Date Range Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-2"
          >
            <Label className="flex items-center gap-2 text-base font-semibold">
              <CalendarIcon className="w-4 h-4 text-primary" />
              Date Range
            </Label>
            <div className="flex gap-4">
              {/* From Date */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "flex-1 justify-start text-left font-normal",
                      !localFilters.dateRange.from && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {localFilters.dateRange.from ? (
                      format(localFilters.dateRange.from, 'PPP')
                    ) : (
                      <span>From date</span>
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
                      "flex-1 justify-start text-left font-normal",
                      !localFilters.dateRange.to && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {localFilters.dateRange.to ? (
                      format(localFilters.dateRange.to, 'PPP')
                    ) : (
                      <span>To date</span>
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

          {/* Sort Options */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="space-y-2"
          >
            <Label className="text-base font-semibold">Sort By</Label>
            <div className="flex gap-2">
              {[
                { value: 'newest', label: 'Newest First' },
                { value: 'oldest', label: 'Oldest First' },
                { value: 'most-viewed', label: 'Most Viewed' },
              ].map((option) => (
                <Button
                  key={option.value}
                  variant={localFilters.sortBy === option.value ? 'default' : 'outline'}
                  onClick={() =>
                    setLocalFilters({
                      ...localFilters,
                      sortBy: option.value as 'newest' | 'oldest' | 'most-viewed',
                    })
                  }
                  className="flex-1 rounded-full"
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4 border-t">
          <Button
            variant="outline"
            onClick={handleReset}
            className="flex-1 rounded-full"
          >
            Reset All
          </Button>
          <Button
            onClick={handleApply}
            className="flex-1 rounded-full bg-gradient-to-r from-pink-500 via-violet-500 to-indigo-500 hover:opacity-90 shadow-lg"
          >
            Apply Filters
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FilterDialog;
