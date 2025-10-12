// uploadMedia.ts
import { supabase } from "@/integrations/supabase/client";

export interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

/**
 * Upload a file (image or video) to Supabase Storage
 * @param file - The File object to upload
 * @param type - Type of media ('image' or 'video')
 * @returns Promise with upload result containing the download URL
 */
export async function uploadMediaToSupabase(
  file: File,
  type: 'image' | 'video'
): Promise<UploadResult> {
  try {
    console.log('🔍 Upload attempt started:', { fileName: file.name, fileType: file.type, fileSize: file.size });
    
    // Validate file
    if (!file) {
      console.error('❌ No file provided');
      return { success: false, error: 'No file provided' };
    }

    // Validate file type
    const isValidImage = type === 'image' && file.type.startsWith('image/');
    const isValidVideo = type === 'video' && file.type.startsWith('video/');
    
    if (!isValidImage && !isValidVideo) {
      return { 
        success: false, 
        error: `Invalid file type. Expected ${type} but got ${file.type}` 
      };
    }

    // Validate file size
    const maxSize = type === 'image' ? 10 * 1024 * 1024 : 50 * 1024 * 1024; // 10MB for images, 50MB for videos
    if (file.size > maxSize) {
      return { 
        success: false, 
        error: `File too large. Maximum size is ${maxSize / 1024 / 1024}MB` 
      };
    }

    // Validate video duration if it's a video
    if (type === 'video') {
      const duration = await getVideoDuration(file);
      if (duration > 30) {
        return {
          success: false,
          error: 'Video must be 30 seconds or less'
        };
      }
    }

    // Create a unique filename
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 9);
    const fileExtension = file.name.split('.').pop();
    const fileName = `${type}s/${timestamp}_${randomString}.${fileExtension}`;

    console.log(`📤 Uploading ${type} to Supabase Storage:`, fileName);
    
    // Upload file to Supabase Storage
    const { data, error } = await supabase.storage
      .from('media')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error(`❌ Error uploading ${type}:`, error);
      return {
        success: false,
        error: error.message || 'Failed to upload file'
      };
    }

    console.log('📸 Upload completed:', data.path);
    
    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('media')
      .getPublicUrl(data.path);

    console.log(`✅ ${type} uploaded successfully:`, publicUrl);

    return {
      success: true,
      url: publicUrl
    };
  } catch (error: any) {
    console.error(`❌ Error uploading ${type}:`, error);
    console.error('❌ Error details:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    return {
      success: false,
      error: error.message || 'Failed to upload file'
    };
  }
}

/**
 * Get video duration in seconds
 */
function getVideoDuration(file: File): Promise<number> {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.preload = 'metadata';
    
    video.onloadedmetadata = () => {
      window.URL.revokeObjectURL(video.src);
      resolve(video.duration);
    };
    
    video.onerror = () => {
      reject(new Error('Failed to load video metadata'));
    };
    
    video.src = URL.createObjectURL(file);
  });
}
