// uploadMedia.ts
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "./firebase";

export interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

/**
 * Upload a file (image or video) to Firebase Storage
 * @param file - The File object to upload
 * @param type - Type of media ('image' or 'video')
 * @returns Promise with upload result containing the download URL
 */
export async function uploadMediaToFirebase(
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

    // Create storage reference
    const storageRef = ref(storage, fileName);
    console.log('📁 Storage reference created:', fileName);

    // Upload file
    console.log(`📤 Uploading ${type} to Firebase Storage:`, fileName);
    const snapshot = await uploadBytes(storageRef, file);
    console.log('📸 Upload snapshot received:', snapshot.metadata.fullPath);
    
    // Get download URL
    const downloadURL = await getDownloadURL(snapshot.ref);
    console.log(`✅ ${type} uploaded successfully:`, downloadURL);

    return {
      success: true,
      url: downloadURL
    };
  } catch (error: any) {
    console.error(`❌ Error uploading ${type}:`, error);
    console.error('❌ Error details:', {
      name: error.name,
      code: error.code,
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
