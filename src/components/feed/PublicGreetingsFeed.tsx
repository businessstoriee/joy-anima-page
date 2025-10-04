import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFirebaseGreetings, SavedGreeting } from '@/hooks/useFirebaseGreetings';
import { Button } from '@/components/ui/button';
import { Eye, User, ChevronLeft, ChevronRight, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { normalizeViews, formatTimeAgo, getEventGradient } from '@/utils/greetingHelpers';
import { cn } from '@/lib/utils';
import SearchBar, { SearchFilters } from './SearchBar';
import BeautifulGreetingsText from '../landingPage/BeautifulGreetingsText'


interface GreetingCardProps {
  greeting: SavedGreeting;
  index: number;
  onClick: () => void;
}

const GreetingCard: React.FC<GreetingCardProps> = ({ greeting, index, onClick }) => {
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  
  // Parse media from greeting data - use media array if available, fallback to firstMedia
  const mediaItems = greeting.media && greeting.media.length > 0 
    ? greeting.media.map(m => m.url)
    : greeting.firstMedia 
      ? [greeting.firstMedia] 
      : [];
  const hasMultipleMedia = mediaItems.length > 1;
  const viewCount = normalizeViews(greeting.viewCount);
  const timeAgo = formatTimeAgo(greeting.createdAt);
  const gradientClass = getEventGradient(greeting.eventName);

  const handlePrevMedia = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentMediaIndex((prev) => (prev === 0 ? mediaItems.length - 1 : prev - 1));
  }, [mediaItems.length]);

  const handleNextMedia = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentMediaIndex((prev) => (prev === mediaItems.length - 1 ? 0 : prev + 1));
  }, [mediaItems.length]);

  // Keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      e.stopPropagation();
      handlePrevMedia(e as any);
    } else if (e.key === 'ArrowRight') {
      e.stopPropagation();
      handleNextMedia(e as any);
    } else if (e.key === 'Enter') {
      onClick();
    }
  }, [handlePrevMedia, handleNextMedia, onClick]);

  const cardHeight = greeting.firstText ? 280 : 320;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      whileHover={{ y: -6 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`View ${greeting.eventName} greeting from ${greeting.senderName}`}
      className="group cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/50 rounded-xl"
    >
      <div className="relative overflow-hidden rounded-xl border border-border/30 shadow-sm hover:shadow-2xl transition-all duration-300 bg-card">
        {/* Media Section */}
        <div 
          className="relative overflow-hidden bg-gradient-to-br from-primary/10 to-secondary/10"
          style={{ height: cardHeight }}
        >
          {/* Media Display */}
          {mediaItems.length > 0 ? (
            <div className="relative w-full h-full">
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentMediaIndex}
                  src={mediaItems[currentMediaIndex]}
                  alt={`${greeting.eventName} greeting`}
                  draggable={false}
                  loading="lazy"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => {
                    // Fallback to emoji if image fails
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </AnimatePresence>

              {/* Carousel Navigation */}
              {hasMultipleMedia && (
                <>
                  <button
                    onClick={handlePrevMedia}
                    aria-label="Previous image"
                    className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/50 text-white backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleNextMedia}
                    aria-label="Next image"
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/50 text-white backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>

                  {/* Pagination Dots */}
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                    {mediaItems.map((_, idx) => (
                      <div
                        key={idx}
                        className={cn(
                          "w-1.5 h-1.5 rounded-full transition-all duration-300",
                          idx === currentMediaIndex
                            ? "bg-white w-6"
                            : "bg-white/50"
                        )}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          ) : (
            // Emoji Fallback
            <div className="w-full h-full flex items-center justify-center">
              <motion.div
                animate={{ scale: isHovered ? 1.1 : 1 }}
                transition={{ duration: 0.2 }}
                className="text-7xl opacity-90"
              >
                {greeting.eventEmoji || '🎉'}
              </motion.div>
            </div>
          )}

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none" />

          {/* Event Badge */}
          <Badge 
            className={cn(
              "absolute top-3 left-3 px-3 py-1 text-xs font-semibold bg-gradient-to-r backdrop-blur-md border-white/20 text-white shadow-lg",
              gradientClass
            )}
          >
            <span className="mr-1.5">{greeting.eventEmoji}</span>
            {greeting.eventName}
          </Badge>

          {/* View Count Badge */}
          <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2 py-1 rounded-full bg-black/40 backdrop-blur-sm text-white text-xs font-medium">
            <Eye className="w-3.5 h-3.5" />
            <span>{viewCount}</span>
          </div>

          {/* Bottom Content Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
            {/* Sender Info */}
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
                <User className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">
                  {greeting.senderName || 'Anonymous'}
                </p>
                <p className="text-xs text-white/80">
                  {timeAgo}
                </p>
              </div>
            </div>

            {/* Text Preview */}
            {greeting.firstText && (
              <p className="text-sm leading-relaxed line-clamp-2 opacity-95 mb-2">
                {greeting.firstText}
              </p>
            )}

            {/* Receiver Info */}
            {greeting.receiverName && (
              <p className="text-xs text-white/90">
                For <span className="font-semibold">{greeting.receiverName}</span>
              </p>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const PublicGreetingsFeed: React.FC = () => {
  const [publicGreetings, setPublicGreetings] = useState<SavedGreeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<SearchFilters>({
    searchQuery: '',
    eventName: '',
    senderName: '',
    receiverName: '',
    dateRange: { from: null, to: null },
    sortBy: 'newest',
  });
  const { getPublicGreetings } = useFirebaseGreetings();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPublicGreetings = async () => {
      setLoading(true);
      const greetings = await getPublicGreetings(50); // Fetch more for filtering
      setPublicGreetings(greetings);
      setLoading(false);
    };

    fetchPublicGreetings();
  }, [getPublicGreetings]);

  // Filter and sort greetings
  const filteredGreetings = useMemo(() => {
    let result = [...publicGreetings];

    // Search query filter
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      result = result.filter((g) =>
        g.senderName?.toLowerCase().includes(query) ||
        g.receiverName?.toLowerCase().includes(query) ||
        g.eventName?.toLowerCase().includes(query) ||
        g.firstText?.toLowerCase().includes(query)
      );
    }

    // Event name filter
    if (filters.eventName) {
      result = result.filter((g) => g.eventName === filters.eventName);
    }

    // Sender name filter
    if (filters.senderName) {
      const query = filters.senderName.toLowerCase();
      result = result.filter((g) => g.senderName?.toLowerCase().includes(query));
    }

    // Receiver name filter
    if (filters.receiverName) {
      const query = filters.receiverName.toLowerCase();
      result = result.filter((g) => g.receiverName?.toLowerCase().includes(query));
    }

    // Date range filter
    if (filters.dateRange.from || filters.dateRange.to) {
      result = result.filter((g) => {
        const greetingDate = new Date(g.createdAt);
        const fromMatch = filters.dateRange.from ? greetingDate >= filters.dateRange.from : true;
        const toMatch = filters.dateRange.to ? greetingDate <= filters.dateRange.to : true;
        return fromMatch && toMatch;
      });
    }

    // Sort
    result.sort((a, b) => {
      if (filters.sortBy === 'newest') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else if (filters.sortBy === 'oldest') {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      } else {
        // most-viewed
        return normalizeViews(b.viewCount) - normalizeViews(a.viewCount);
      }
    });

    return result;
  }, [publicGreetings, filters]);

  const handleGreetingClick = useCallback((slug: string) => {
    navigate(`/${slug}`);
  }, [navigate]);

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Loading Skeleton */}
        <div className="text-center space-y-2">
          <div className="h-8 w-64 bg-muted/50 rounded-lg mx-auto animate-pulse" />
          <div className="h-4 w-96 bg-muted/30 rounded mx-auto animate-pulse" />
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-square bg-muted/50 rounded-xl" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!loading && publicGreetings.length === 0) {
    return (
      <div className="text-center py-16 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="space-y-6"
        >
          <div className="w-20 h-20 mx-auto bg-gradient-to-br from-pink-500/20 to-violet-500/20 rounded-full flex items-center justify-center backdrop-blur-sm">
            <Heart className="w-10 h-10 text-primary" />
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-pink-500 via-violet-500 to-indigo-500 bg-clip-text text-transparent">
              No Public Greetings Yet
            </h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Be the first to share a beautiful greeting with the community! Create your greeting and make it public to inspire others.
            </p>
          </div>
          <Button 
            onClick={() => navigate('/create')}
            size="lg"
            className="bg-gradient-to-r from-pink-500 via-violet-500 to-indigo-500 hover:opacity-90 text-white px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all"
          >
            <span className="text-lg">✨ Create First Public Greeting</span>
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
     <motion.div
  initial={{ opacity: 0, y: -20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5, ease: "easeOut" }}
  className="text-center space-y-3 px-4"
>
  {/* Title */}
  
   <BeautifulGreetingsText text="Community Greetings"/>

  {/* Subtitle */}
  <p
    className={cn(
      "text-base md:text-lg max-w-2xl mx-auto leading-relaxed",
      "text-slate-600 dark:text-slate-300"
    )}
  >
    Beautiful greetings shared by our community{" "}
    <span className="inline-block text-xl hover:animate-spin cursor-pointer">
      ✨
    </span>
  </p>
<small className="text-gray-400 dark:text-gray-500">
  Posts stay live for 7 days from the time they're created.
</small>
</motion.div>


      {/* Search Bar */}
      <SearchBar
        onFiltersChange={setFilters}
        resultsCount={filteredGreetings.length}
      />

      {/* No Results Message */}
      {!loading && filteredGreetings.length === 0 && publicGreetings.length > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-12"
        >
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold mb-2">No greetings found</h3>
          <p className="text-muted-foreground">
            Try adjusting your filters or search terms
          </p>
        </motion.div>
      )}

      {/* Instagram Explore Grid */}
      {filteredGreetings.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-4">
          {filteredGreetings.map((greeting, index) => (
          <GreetingCard
            key={greeting.id}
            greeting={greeting}
            index={index}
            onClick={() => handleGreetingClick(greeting.slug)}
          />
        ))}
        </div>
      )}



      {/* CTA Button */}
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ delay: 0.3 }}
  className="flex justify-center pt-6"
>
  <Button
    onClick={() => navigate('/create')}
    size="lg"
    className={cn(
      "relative overflow-hidden rounded-full px-8 py-6 text-base font-medium",
      "bg-gradient-to-r from-pink-500 via-violet-500 to-indigo-500",
      "text-white shadow-lg hover:shadow-xl",
      "transition-all duration-300 group",
      "hover:opacity-90 hover:scale-105"
    )}
  >
    <span className="flex items-center gap-2">
      <span className="text-xl hover:animate-spin">✨</span>
      <span className="hidden sm:inline">Share Your Greeting</span>
      <span className="sm:hidden">Share</span>
    </span>

    {/* Shine Effect */}
    <span
      className="absolute top-0 left-1/2 h-full w-20 -translate-x-1/2 -skew-x-12 bg-white/30
                 opacity-0 group-hover:opacity-100 group-hover:animate-shine transition-opacity duration-700"
    ></span>
  </Button>
</motion.div>


    </div>
  );
};

export default PublicGreetingsFeed;
