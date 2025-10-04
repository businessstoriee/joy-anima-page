import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import FilterDialog from './FilterDialog';

export interface SearchFilters {
  searchQuery: string;
  eventName: string;
  senderName: string;
  receiverName: string;
  dateRange: { from: Date | null; to: Date | null };
  sortBy: 'newest' | 'oldest' | 'most-viewed';
}

interface SearchBarProps {
  onFiltersChange: (filters: SearchFilters) => void;
  resultsCount: number;
}

const SearchBar: React.FC<SearchBarProps> = ({ onFiltersChange, resultsCount }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    searchQuery: '',
    eventName: '',
    senderName: '',
    receiverName: '',
    dateRange: { from: null, to: null },
    sortBy: 'newest',
  });
  const [isFocused, setIsFocused] = useState(false);

  // Real-time search
  useEffect(() => {
    const timer = setTimeout(() => {
      const updatedFilters = { ...filters, searchQuery };
      setFilters(updatedFilters);
      onFiltersChange(updatedFilters);
    }, 300); // Debounce for 300ms

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleClear = () => {
    setSearchQuery('');
    const clearedFilters: SearchFilters = {
      searchQuery: '',
      eventName: '',
      senderName: '',
      receiverName: '',
      dateRange: { from: null, to: null },
      sortBy: 'newest',
    };
    setFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const handleApplyFilters = (newFilters: Partial<SearchFilters>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    onFiltersChange(updatedFilters);
  };

  const hasActiveFilters = 
    filters.eventName || 
    filters.senderName || 
    filters.receiverName || 
    filters.dateRange.from || 
    filters.dateRange.to ||
    filters.sortBy !== 'newest';

  return (
    <div className="w-full space-y-4">
      {/* Main Search Bar */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative hover:animate-pulse"
      >
        <div
          className={cn(
            "relative flex items-center gap-2 p-2 rounded-2xl border-2 transition-all duration-300",
            isFocused
              ? "border-primary shadow-xl shadow-primary/20 bg-card"
              : "border border-gray-400 bg-card/50 backdrop-blur-sm"
          )}
        >
          {/* Search Icon */}
          <motion.div
            animate={{ scale: isFocused ? 1.1 : 1 }}
            transition={{ duration: 0.2 }}
            className="pl-2"
          >
            <Search className={cn(
              "w-5 h-5 transition-colors",
              isFocused ? "text-primary" : "text-muted-foreground"
            )} />
          </motion.div>

          {/* Input Field */}
          <Input
            type="text"
            placeholder="Search by name, event, or message..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className="flex-1 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent text-base placeholder:text-muted-foreground/60"
          />

          {/* Clear Button */}
          <AnimatePresence>
            {searchQuery && (
              <motion.button
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                onClick={handleClear}
                className="p-1.5 rounded-full hover:bg-muted transition-colors"
                aria-label="Clear search"
              >
                <X className="w-4 h-4 text-muted-foreground hover:text-foreground" />
              </motion.button>
            )}
          </AnimatePresence>

          {/* Sort Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              const sortOrder: ('newest' | 'oldest' | 'most-viewed')[] = ['newest', 'oldest', 'most-viewed'];
              const currentIndex = sortOrder.indexOf(filters.sortBy);
              const nextSort = sortOrder[(currentIndex + 1) % sortOrder.length];
              handleApplyFilters({ sortBy: nextSort });
            }}
            className="relative group"
            aria-label="Sort greetings"
          >
            <motion.div
              animate={{ rotate: filters.sortBy === 'oldest' ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <ArrowUpDown className="w-4 h-4" />
            </motion.div>
            {filters.sortBy !== 'newest' && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-primary"
              />
            )}
          </Button>

          {/* Filter Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowFilters(true)}
            className="relative"
            aria-label="Open filters"
          >
            <SlidersHorizontal className="w-4 h-4" />
            {hasActiveFilters && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-primary"
              />
            )}
          </Button>
        </div>

        {/* Search Pulse Effect */}
        <AnimatePresence>
          {isFocused && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="absolute inset-0 rounded-2xl border-2 border-primary/30 pointer-events-none"
              style={{
                animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
              }}
            />
          )}
        </AnimatePresence>
      </motion.div>

      {/* Results Count & Active Filters */}
      <AnimatePresence>
        {(searchQuery || hasActiveFilters) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-center justify-between text-sm text-muted-foreground px-2"
          >
            <div className="flex items-center gap-2">
              <span className="font-medium text-foreground">{resultsCount}</span>
              <span>greeting{resultsCount !== 1 ? 's' : ''} found</span>
            </div>
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClear}
                className="h-7 text-xs hover:text-destructive"
              >
                Clear all filters
              </Button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filter Dialog */}
      <FilterDialog
        open={showFilters}
        onOpenChange={setShowFilters}
        filters={filters}
        onApplyFilters={handleApplyFilters}
      />
    </div>
  );
};

export default SearchBar;
