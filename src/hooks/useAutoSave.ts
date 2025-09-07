import { useEffect, useCallback, useRef } from 'react';
import { GreetingFormData } from '@/types/greeting';

const AUTO_SAVE_KEY = 'greeting_auto_save';
const AUTO_SAVE_TIMESTAMP_KEY = 'greeting_auto_save_timestamp';
const AUTO_SAVE_DELAY = 1000; // Save after 1 second of inactivity

export function useAutoSave() {
  const timeoutRef = useRef<NodeJS.Timeout>();

  // Save form data to localStorage
  const saveToLocalStorage = useCallback((data: GreetingFormData) => {
    try {
      localStorage.setItem(AUTO_SAVE_KEY, JSON.stringify(data));
      localStorage.setItem(AUTO_SAVE_TIMESTAMP_KEY, Date.now().toString());
      console.log('📱 Auto-saved form data to localStorage');
    } catch (error) {
      console.warn('Failed to auto-save to localStorage:', error);
    }
  }, []);

  // Load form data from localStorage
  const loadFromLocalStorage = useCallback((): GreetingFormData | null => {
    try {
      const savedData = localStorage.getItem(AUTO_SAVE_KEY);
      const savedTimestamp = localStorage.getItem(AUTO_SAVE_TIMESTAMP_KEY);
      
      if (!savedData || !savedTimestamp) return null;

      // Check if data is older than 24 hours (optional cleanup)
      const timestamp = parseInt(savedTimestamp);
      const dayInMs = 24 * 60 * 60 * 1000;
      if (Date.now() - timestamp > dayInMs) {
        clearAutoSave();
        return null;
      }

      console.log('📱 Restored form data from localStorage');
      return JSON.parse(savedData) as GreetingFormData;
    } catch (error) {
      console.warn('Failed to load from localStorage:', error);
      return null;
    }
  }, []);

  // Clear auto-save data
  const clearAutoSave = useCallback(() => {
    localStorage.removeItem(AUTO_SAVE_KEY);
    localStorage.removeItem(AUTO_SAVE_TIMESTAMP_KEY);
    console.log('🗑️ Cleared auto-save data');
  }, []);

  // Auto-save with debouncing
  const autoSave = useCallback((data: GreetingFormData) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      saveToLocalStorage(data);
    }, AUTO_SAVE_DELAY);
  }, [saveToLocalStorage]);

  // Check if auto-save data exists
  const hasAutoSaveData = useCallback((): boolean => {
    return localStorage.getItem(AUTO_SAVE_KEY) !== null;
  }, []);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return {
    autoSave,
    loadFromLocalStorage,
    clearAutoSave,
    hasAutoSaveData,
  };
}