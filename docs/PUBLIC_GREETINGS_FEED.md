# Public Greetings Feed - Instagram Explore Style

## Overview
The Public Greetings Feed displays community-shared greetings in an Instagram Explore-style grid with interactive cards, carousels, and smooth animations.

## Features

### 🎨 Visual Design
- **Responsive Grid Layout**: 2-5 columns based on screen size (mobile to desktop)
- **Gradient Overlays**: Each card has dynamic gradients based on event type
- **Badge System**: Event badges with emoji and view count badges
- **Hover Animations**: Cards lift and scale on hover with framer-motion

### 📸 Media Carousel
- **Multiple Media Support**: Cards with multiple images show a carousel
- **Navigation**: Left/right arrow buttons for navigation
- **Pagination Dots**: Visual indicator of current media position
- **Keyboard Accessible**: Arrow keys to navigate when card is focused
- **Lazy Loading**: Images load efficiently with `loading="lazy"`

### 📊 View Count Normalization
The `normalizeViews()` utility handles various view count formats:
- Number: `normalizeViews(42)` → `42`
- String: `normalizeViews("12")` → `12`
- Object: `normalizeViews({ count: 3 })` → `3`
- Invalid: `normalizeViews(null)` → `0`

### ⏱️ Time Formatting
The `formatTimeAgo()` utility provides friendly time stamps:
- Just now (< 1 minute)
- 12m ago (minutes)
- 3h ago (hours)
- 5d ago (days)
- 2w ago (weeks)
- 3mo ago (months)

## Data Shape

### SavedGreeting Interface
```typescript
interface SavedGreeting {
  id: string;
  slug: string;              // URL identifier (/{slug})
  eventName: string;         // e.g., "Birthday"
  eventEmoji: string;        // e.g., "🎂"
  senderName: string;
  receiverName: string;
  createdAt: Timestamp;      // Firebase timestamp
  viewCount: number | { count: number } | string;
  isPublic: boolean;
  firstMedia?: string;       // First media URL
  firstText?: string;        // Text preview
  media?: Array<{ url: string; type: string }>; // Full media array for carousel
}
```

## Integration

### 1. Firebase Setup
Greetings are stored in Firebase Firestore with `isPublic: true` flag.

### 2. Create Page Integration
The PublicPrivateToggle component is integrated in the Create page's "Basics" tab:
- **Default**: Public (isPublic: true)
- **Toggle UI**: Beautiful switch with Globe/Lock icons
- **State Management**: Connected to useCreate hook

### 3. Home Page Display
The feed appears on the landing page after the "Let's Get Started" button.

### 4. Navigation
Clicking any card navigates to `/{slug}` to view the full greeting.

## Usage Examples

### Fetching Public Greetings
```typescript
import { useFirebaseGreetings } from '@/hooks/useFirebaseGreetings';

const { getPublicGreetings } = useFirebaseGreetings();
const greetings = await getPublicGreetings(24); // Fetch 24 greetings
```

### Using Helper Functions
```typescript
import { normalizeViews, formatTimeAgo } from '@/utils/greetingHelpers';

const viewCount = normalizeViews(greeting.viewCount); // Always returns number
const timeString = formatTimeAgo(greeting.createdAt); // "2h ago"
```

## Accessibility

- ✅ ARIA labels on navigation buttons
- ✅ Proper alt text on images
- ✅ Keyboard navigation (Tab, Enter, Arrow keys)
- ✅ Focus indicators
- ✅ Semantic HTML structure

## Performance

- ✅ Images use `loading="lazy"` attribute
- ✅ Optimized re-renders with useCallback
- ✅ AnimatePresence for smooth transitions
- ✅ Gradient calculations cached per event

## Testing

Run the test suite:
```bash
npm test src/utils/__tests__/greetingHelpers.test.ts
```

Tests cover:
- View count normalization (all input types)
- Time formatting (all ranges)
- Gradient generation (consistency)

## Future Enhancements

- [ ] Infinite scroll for loading more greetings
- [ ] Filter by event type
- [ ] Search functionality
- [ ] Like/comment features
- [ ] User profiles
- [ ] Trending/popular sorting
