import React, { createContext, useContext, useState, useCallback } from 'react';
import { GreetingFormData, MediaItem, TextContent } from '@/types/greeting';

interface DragDropContextType {
  isEditing: boolean;
  setIsEditing: (editing: boolean) => void;
  selectedElement: string | null;
  setSelectedElement: (id: string | null) => void;
  handleMediaPositionChange: (id: string, position: { x: number; y: number }) => void;
  handleMediaSizeChange: (id: string, size: { width: number; height: number }) => void;
  handleTextPositionChange: (id: string, position: { x: number; y: number }) => void;
  handleTextSizeChange: (id: string, size: { width: number; height: number }) => void;
  handleDeleteMedia: (id: string) => void;
  handleDeleteText: (id: string) => void;
  handleEmojiPositionChange: (id: string, position: { x: number; y: number }) => void;
  handleDeleteEmoji: (id: string) => void;
}

const DragDropContext = createContext<DragDropContextType | null>(null);

interface DragDropProviderProps {
  children: React.ReactNode;
  greetingData: GreetingFormData;
  onDataChange?: (data: GreetingFormData) => void;
}

export const DragDropProvider: React.FC<DragDropProviderProps> = ({
  children,
  greetingData,
  onDataChange
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);

  const handleMediaPositionChange = useCallback((id: string, position: { x: number; y: number }) => {
    if (!onDataChange) return;
    
    const updatedMedia = greetingData.media.map(item =>
      item.id === id ? { ...item, position: { ...item.position, x: position.x, y: position.y } } : item
    );
    onDataChange({ ...greetingData, media: updatedMedia });
  }, [greetingData, onDataChange]);

  const handleMediaSizeChange = useCallback((id: string, size: { width: number; height: number }) => {
    if (!onDataChange) return;
    
    const updatedMedia = greetingData.media.map(item =>
      item.id === id ? { ...item, position: { ...item.position, width: size.width, height: size.height } } : item
    );
    onDataChange({ ...greetingData, media: updatedMedia });
  }, [greetingData, onDataChange]);

  const handleTextPositionChange = useCallback((id: string, position: { x: number; y: number }) => {
    if (!onDataChange) return;
    
    const updatedTexts = greetingData.texts.map(text =>
      text.id === id ? { ...text, position } : text
    );
    onDataChange({ ...greetingData, texts: updatedTexts });
  }, [greetingData, onDataChange]);

  const handleTextSizeChange = useCallback((id: string, size: { width: number; height: number }) => {
    if (!onDataChange) return;
    
    const updatedTexts = greetingData.texts.map(text =>
      text.id === id ? { ...text, size } : text
    );
    onDataChange({ ...greetingData, texts: updatedTexts });
  }, [greetingData, onDataChange]);

  const handleDeleteMedia = useCallback((id: string) => {
    if (!onDataChange) return;
    
    const updatedMedia = greetingData.media.filter(item => item.id !== id);
    onDataChange({ ...greetingData, media: updatedMedia });
  }, [greetingData, onDataChange]);

  const handleDeleteText = useCallback((id: string) => {
    if (!onDataChange) return;
    
    const updatedTexts = greetingData.texts.filter(text => text.id !== id);
    onDataChange({ ...greetingData, texts: updatedTexts });
  }, [greetingData, onDataChange]);

  const handleEmojiPositionChange = useCallback((id: string, position: { x: number; y: number }) => {
    if (!onDataChange) return;
    
    const updatedEmojis = greetingData.emojis.map(emoji =>
      emoji.id === id ? { ...emoji, position } : emoji
    );
    onDataChange({ ...greetingData, emojis: updatedEmojis });
  }, [greetingData, onDataChange]);

  const handleDeleteEmoji = useCallback((id: string) => {
    if (!onDataChange) return;
    
    const updatedEmojis = greetingData.emojis.filter(emoji => emoji.id !== id);
    onDataChange({ ...greetingData, emojis: updatedEmojis });
  }, [greetingData, onDataChange]);

  const value: DragDropContextType = {
    isEditing,
    setIsEditing,
    selectedElement,
    setSelectedElement,
    handleMediaPositionChange,
    handleMediaSizeChange,
    handleTextPositionChange,
    handleTextSizeChange,
    handleDeleteMedia,
    handleDeleteText,
    handleEmojiPositionChange,
    handleDeleteEmoji,
  };

  return (
    <DragDropContext.Provider value={value}>
      {children}
    </DragDropContext.Provider>
  );
};

export const useDragDrop = () => {
  const context = useContext(DragDropContext);
  if (!context) {
    throw new Error('useDragDrop must be used within a DragDropProvider');
  }
  return context;
};