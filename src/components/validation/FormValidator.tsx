import { GreetingFormData } from '@/types/greeting';

export interface ValidationError {
  field: string;
  message: string;
}

export class FormValidator {
  static validateGreetingData(data: GreetingFormData): ValidationError[] {
    const errors: ValidationError[] = [];

    // Required fields
    if (!data.eventType) {
      errors.push({ field: 'eventType', message: 'Event type is required' });
    }

    // URL validations
    if (data.videoUrl && !this.isValidURL(data.videoUrl)) {
      errors.push({ field: 'videoUrl', message: 'Please enter a valid video URL' });
    }

    // if (data.audioUrl && !this.isValidURL(data.audioUrl)) {
    //   errors.push({ field: 'audioUrl', message: 'Please enter a valid audio URL' });
    // }

    // Media validations
    data.media.forEach((item, index) => {
      if (item.url && !this.isValidURL(item.url)) {
        errors.push({ 
          field: `media[${index}].url`, 
          message: `Media item ${index + 1} has an invalid URL` 
        });
      }
    });

    // Text validations
    data.texts.forEach((text, index) => {
      if (!text.content.trim()) {
        errors.push({ 
          field: `texts[${index}].content`, 
          message: `Text content ${index + 1} cannot be empty` 
        });
      }
      
      if (text.content.length > 500) {
        errors.push({ 
          field: `texts[${index}].content`, 
          message: `Text content ${index + 1} is too long (max 500 characters)` 
        });
      }
    });

    // Text content length validation
    data.texts.forEach((text, index) => {
      if (text.content.length > 500) {
        errors.push({ 
          field: `texts[${index}].content`, 
          message: `Text ${index + 1} content is too long (max 500 characters)` 
        });
      }
    });

    // Media position validations
    data.media.forEach((item, index) => {
      // if (item.position.x < 0 || item.position.x > 100) {
      //   errors.push({ 
      //     field: `media[${index}].position.x`, 
      //     message: `Media ${index + 1} X position must be between 0 and 100` 
      //   });
      // }
      
      // if (item.position.y < 0 || item.position.y > 100) {
      //   errors.push({ 
      //     field: `media[${index}].position.y`, 
      //     message: `Media ${index + 1} Y position must be between 0 and 100` 
      //   });
      // }

      if (item.position.width < 50 || item.position.width > 1000) {
        errors.push({ 
          field: `media[${index}].position.width`, 
          message: `Media ${index + 1} width must be between 50 and 1000 pixels` 
        });
      }

      if (item.position.height < 50 || item.position.height > 1000) {
        errors.push({ 
          field: `media[${index}].position.height`, 
          message: `Media ${index + 1} height must be between 50 and 1000 pixels` 
        });
      }
    });

    // Color validations
    if (data.backgroundSettings.color && !this.isValidColor(data.backgroundSettings.color)) {
      errors.push({ field: 'backgroundSettings.color', message: 'Invalid background color format' });
    }

    if (data.borderSettings.color && !this.isValidColor(data.borderSettings.color)) {
      errors.push({ field: 'borderSettings.color', message: 'Invalid border color format' });
    }

    return errors;
  }

  static isValidURL(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  static isValidColor(color: string): boolean {
    // Check hex colors (#rgb, #rrggbb)
    if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(color)) {
      return true;
    }
    
    // Check rgb/rgba
    if (/^rgba?\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*(,\s*[\d.]+\s*)?\)$/.test(color)) {
      return true;
    }
    
    // Check hsl/hsla
    if (/^hsla?\(\s*\d+\s*,\s*\d+%\s*,\s*\d+%\s*(,\s*[\d.]+\s*)?\)$/.test(color)) {
      return true;
    }
    
    return false;
  }

  static sanitizeInput(input: string): string {
    return input
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+\s*=/gi, '')
      .trim();
  }

  static validateImageFile(file: File): ValidationError[] {
    const errors: ValidationError[] = [];
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

    if (file.size > maxSize) {
      errors.push({ field: 'file', message: 'Image file size must be less than 10MB' });
    }

    if (!allowedTypes.includes(file.type)) {
      errors.push({ field: 'file', message: 'Only JPEG, PNG, GIF, and WebP images are allowed' });
    }

    return errors;
  }

  static validateVideoFile(file: File): ValidationError[] {
    const errors: ValidationError[] = [];
    const maxSize = 50 * 1024 * 1024; // 50MB
    const allowedTypes = ['video/mp4', 'video/webm', 'video/ogg'];

    if (file.size > maxSize) {
      errors.push({ field: 'file', message: 'Video file size must be less than 50MB' });
    }

    if (!allowedTypes.includes(file.type)) {
      errors.push({ field: 'file', message: 'Only MP4, WebM, and OGG videos are allowed' });
    }

    return errors;
  }
}

export default FormValidator;