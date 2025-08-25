import { GreetingFormData } from '@/types/greeting';

export interface ValidationError {
  field: string;
  message: string;
}

export const validateGreetingForm = (data: GreetingFormData): ValidationError[] => {
  const errors: ValidationError[] = [];

  // Event type is required
  if (!data.eventType) {
    errors.push({
      field: 'eventType',
      message: 'Please select an event type'
    });
  }

  // At least one text, media, or video is required
  const hasContent = data.texts.length > 0 || 
                     data.media.length > 0 || 
                     data.videoUrl;

  if (!hasContent) {
    errors.push({
      field: 'content',
      message: 'Please add at least one text message, image, or video'
    });
  }

  // Validate text content
  data.texts.forEach((text, index) => {
    if (!text.content.trim()) {
      errors.push({
        field: `texts.${index}.content`,
        message: `Text message ${index + 1} cannot be empty`
      });
    }
  });

  // Validate media URLs
  data.media.forEach((media, index) => {
    if (!media.url || !isValidUrl(media.url)) {
      errors.push({
        field: `media.${index}.url`,
        message: `Media item ${index + 1} must have a valid URL`
      });
    }
  });

  // Validate video URL if provided
  if (data.videoUrl && !isValidUrl(data.videoUrl)) {
    errors.push({
      field: 'videoUrl',
      message: 'Please provide a valid video URL'
    });
  }

  // Validate audio URL if provided
  // if (data.audioUrl && !isValidUrl(data.audioUrl)) {
  //   errors.push({
  //     field: 'audioUrl',
  //     message: 'Please provide a valid audio URL'
  //   });
  // }

  // Validate emoji positions
  data.emojis.forEach((emoji, index) => {
    if (emoji.position.x < 0 || emoji.position.x > 100) {
      errors.push({
        field: `emojis.${index}.position.x`,
        message: `Emoji ${index + 1} X position must be between 0 and 100`
      });
    }
    if (emoji.position.y < 0 || emoji.position.y > 100) {
      errors.push({
        field: `emojis.${index}.position.y`,
        message: `Emoji ${index + 1} Y position must be between 0 and 100`
      });
    }
  });

  return errors;
};

export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const sanitizeInput = (input: string): string => {
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '');
};

export const validateFileSize = (file: File, maxSizeMB: number = 10): boolean => {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return file.size <= maxSizeBytes;
};

export const validateImageFile = (file: File): boolean => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  return allowedTypes.includes(file.type);
};

export const validateVideoFile = (file: File): boolean => {
  const allowedTypes = ['video/mp4', 'video/webm', 'video/ogg'];
  return allowedTypes.includes(file.type);
};