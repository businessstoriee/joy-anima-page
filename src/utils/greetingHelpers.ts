/**
 * Normalize view count from various formats to a number
 * Handles: number, string numeric, object with count, null/undefined
 */
export function normalizeViews(views: any): number {
  if (typeof views === 'number') return views;
  if (typeof views === 'string') {
    const parsed = parseInt(views, 10);
    return isNaN(parsed) ? 0 : parsed;
  }
  if (views && typeof views === 'object' && 'count' in views) {
    return normalizeViews(views.count);
  }
  return 0;
}

/**
 * Format timestamp to friendly "time ago" string
 * Supports Firebase timestamp objects and Date objects
 */
export function formatTimeAgo(timestamp: any): string {
  if (!timestamp) return 'Recently';
  
  let date: Date;
  
  // Handle Firebase timestamp object
  if (timestamp.seconds) {
    date = new Date(timestamp.seconds * 1000);
  } else if (timestamp instanceof Date) {
    date = timestamp;
  } else if (typeof timestamp === 'number') {
    date = new Date(timestamp);
  } else {
    return 'Recently';
  }
  
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return 'Just now';
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays}d ago`;
  
  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) return `${diffInWeeks}w ago`;
  
  const diffInMonths = Math.floor(diffInDays / 30);
  return `${diffInMonths}mo ago`;
}

/**
 * Generate dynamic gradient based on event name for visual variety
 */
export function getEventGradient(eventName: string): string {
  const gradients = [
    'from-pink-500 via-rose-500 to-red-500',
    'from-purple-500 via-violet-500 to-indigo-500',
    'from-blue-500 via-cyan-500 to-teal-500',
    'from-green-500 via-emerald-500 to-lime-500',
    'from-yellow-500 via-amber-500 to-orange-500',
    'from-fuchsia-500 via-pink-500 to-rose-500',
    'from-indigo-500 via-purple-500 to-pink-500',
    'from-cyan-500 via-blue-500 to-indigo-500',
  ];
  
  // Use event name hash to consistently pick a gradient
  const hash = eventName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return gradients[hash % gradients.length];
}
