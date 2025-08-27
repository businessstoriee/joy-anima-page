import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Rnd } from 'react-rnd';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Edit, Eye, Move, Trash2, Volume2 } from 'lucide-react';

import BackgroundWrapper from './BackgroundWrapper';
import BorderContainer from './BorderContainer';
import EventHeader from './EventHeader';
import SenderSection from './SenderSection';
import ShareActions from '../share/ShareActions';
import EmojisLayer from './EmojisLayer';
import DragDropInstructions from './DragDropInstructions';
import MediaFrame from './MediaFrames';
import { mediaAnimations } from './MediaAnimations';

// Simple throttle utility
function throttle(fn: (...args: any[]) => void, wait = 50) {
  let last = 0;
  let timeout: any = null;
  return function(this: any, ...args: any[]) {
    const now = Date.now();
    const remaining = wait - (now - last);
    if (remaining <= 0) {
      if (timeout) { clearTimeout(timeout); timeout = null; }
      last = now;
      fn.apply(this, args);
    } else if (!timeout) {
      timeout = setTimeout(() => {
        last = Date.now();
        timeout = null;
        fn.apply(this, args);
      }, remaining);
    }
  };
}

// Editable Greeting Texts (supports live updates via onUpdateLive)
const GreetingTexts = ({ greetingData, onSelect, selectedItem, onUpdate, onUpdateLive, canEdit, snapGrid }) => (
  <div className="relative">
    {greetingData.texts?.map((text, idx) => (
      <Rnd
        key={idx}
        bounds="parent"
        size={{ width: text.width, height: text.height }}
        position={{ x: text.x || 0, y: text.y || 0 }}
        onDrag={(e, d) => canEdit && onUpdateLive && onUpdateLive('text', idx, { ...text, x: d.x, y: d.y })}
        onDragStop={(e, d) => canEdit && onUpdate && onUpdate('text', idx, { ...text, x: d.x, y: d.y })}
        onResizeStop={(e, dir, ref, delta, pos) => canEdit && onUpdate && onUpdate('text', idx, { ...text, width: ref.offsetWidth, height: ref.offsetHeight, x: pos.x, y: pos.y })}
        onClick={() => canEdit && onSelect({ type: 'text', index: idx })}
        className={`absolute ${selectedItem?.type === 'text' && selectedItem.index === idx ? 'ring-2 ring-blue-500' : ''}`}
        dragHandleClassName={canEdit ? undefined : ''}
        grid={snapGrid ? [snapGrid, snapGrid] : undefined}
        resizeGrid={snapGrid ? [snapGrid, snapGrid] : undefined}
      >
        <motion.div
          className="flex items-center justify-center w-full h-full cursor-move p-2"
          role="group"
          aria-label={`Text item ${idx + 1}`}
          tabIndex={-1}
        >
          <div
            style={{
              fontSize: text.fontSize,
              color: text.color,
              textAlign: text.alignment,
              fontFamily: text.fontFamily,
              fontWeight: text.style?.fontWeight || text.fontWeight || 'normal'
            }}
          >
            {text.content}
          </div>
        </motion.div>
      </Rnd>
    ))}
  </div>
);

// Editable Media Gallery (supports live updates)
const EnhancedMediaGallery = ({ greetingData, onSelect, selectedItem, onUpdate, onUpdateLive, canEdit, frameStyle, mediaAnimation, snapGrid }) => (
  <div className="relative">
    {greetingData.media?.map((media, idx) => (
      <Rnd
        key={idx}
        bounds="parent"
        size={{ width: media.width || 300, height: media.height || 200 }}
        position={{ x: media.x || 0, y: media.y || 0 }}
        onDrag={(e, d) => canEdit && onUpdateLive && onUpdateLive('media', idx, { ...media, x: d.x, y: d.y })}
        onDragStop={(e, d) => canEdit && onUpdate && onUpdate('media', idx, { ...media, x: d.x, y: d.y })}
        onResizeStop={(e, dir, ref, delta, pos) => canEdit && onUpdate && onUpdate('media', idx, { ...media, width: ref.offsetWidth, height: ref.offsetHeight, x: pos.x, y: pos.y })}
        onClick={() => canEdit && onSelect({ type: 'media', index: idx })}
        className={`absolute ${selectedItem?.type === 'media' && selectedItem.index === idx ? 'ring-2 ring-green-500' : ''}`}
        grid={snapGrid ? [snapGrid, snapGrid] : undefined}
        resizeGrid={snapGrid ? [snapGrid, snapGrid] : undefined}
      >
        <motion.div className="w-full h-full flex items-center justify-center overflow-hidden cursor-move" role="group" aria-label={`Media item ${idx + 1}`} tabIndex={-1}>
          <MediaFrame frameType={media.frameType || frameStyle} index={idx}>
            {media.type === 'image' ? (
              <img src={media.url} alt={media.alt || 'greeting media'} className="object-cover w-full h-full" onError={(e) => { const t = e.target as HTMLImageElement; t.style.display = 'none'; const p = t.parentElement; if (p) p.innerHTML = `<div class="flex items-center justify-center h-full bg-gray-100 text-gray-500"><div class="text-center"><div class="text-2xl mb-2">📷</div><div class="text-sm">Image not found</div></div></div>`; }} />
            ) : (
              <video src={media.url} className="object-cover w-full h-full" controls onError={(e) => { const t = e.target as HTMLVideoElement; t.style.display = 'none'; const p = t.parentElement; if (p) p.innerHTML = `<div class="flex items-center justify-center h-full bg-gray-100 text-gray-500"><div class="text-center"><div class="text-2xl mb-2">🎥</div><div class="text-sm">Video not found</div></div></div>`; }} />
            )}
          </MediaFrame>
        </motion.div>
      </Rnd>
    ))}
  </div>
);

// Side Editing Panel (Live Updates + new action buttons)
const SideEditingPanel = ({ selectedItem, greetingData, onDataChange, onDuplicate, onReset, onZOrder, onQuickStyle, onDelete }) => {
  if (!selectedItem) return null;

  const updateItem = (updates) => {
    if (selectedItem.type === 'text') {
      const updated = [...greetingData.texts];
      updated[selectedItem.index] = { ...updated[selectedItem.index], ...updates };
      onDataChange({ ...greetingData, texts: updated });
    } else if (selectedItem.type === 'media') {
      const updated = [...greetingData.media];
      updated[selectedItem.index] = { ...updated[selectedItem.index], ...updates };
      onDataChange({ ...greetingData, media: updated });
    }
  };

  const item =
    selectedItem.type === 'text'
      ? greetingData.texts[selectedItem.index]
      : greetingData.media[selectedItem.index];

  // safe reads
  const posX = item?.x ?? 0;
  const posY = item?.y ?? 0;
  const width = item?.width ?? 'auto';
  const height = item?.height ?? 'auto';

  return (

    <Card className="fixed top-0 right-0 h-full w-72 shadow-xl bg-white border-l z-50 p-4 transform transition-transform duration-300 translate-x-0" role="region" aria-label="Editor panel">
      <h3 className="text-lg font-semibold">Edit {selectedItem.type}</h3>

      {/* Position & Size indicator */}
      <div className="text-xs text-muted-foreground">
        Position: (x: {posX}, y: {posY}) • Size: {width} × {height}
      </div>

      {selectedItem.type === 'text' && (
        <>
          <div>
            <Label>Content</Label>
            <Input value={item.content} onChange={(e) => updateItem({ content: e.target.value })} />
          </div>
          <div>
            <Label>Font Size</Label>
            <Input
              type="number"
              value={item.fontSize}
              onChange={(e) => updateItem({ fontSize: parseInt(e.target.value, 10) })}
            />
          </div>
          <div>
            <Label>Color</Label>
            <Input type="color" value={item.color} onChange={(e) => updateItem({ color: e.target.value })} />
          </div>
          <div>
            <Label>Alignment</Label>
            <select value={item.alignment} onChange={(e) => updateItem({ alignment: e.target.value })}>
              <option value="left">Left</option>
              <option value="center">Center</option>
              <option value="right">Right</option>
            </select>
          </div>
        </>
      )}

      {selectedItem.type === 'media' && (
        <>
          <div>
            <Label>Media URL</Label>
            <Input value={item.url} onChange={(e) => updateItem({ url: e.target.value })} />
          </div>
        </>
      )}

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2 pt-2">
        <Button size="sm" onClick={onDuplicate}>Duplicate (Ctrl+D)</Button>
        <Button size="sm" onClick={onReset}>Reset Position (Ctrl+0)</Button>
        <Button size="sm" onClick={() => onZOrder('up')}>Bring Front (Ctrl+↑)</Button>
        <Button size="sm" onClick={() => onZOrder('down')}>Send Back (Ctrl+↓)</Button>
        <Button size="sm" onClick={onQuickStyle}>Quick Style (Ctrl+B)</Button>
        <Button size="sm" variant="destructive" onClick={onDelete}>Delete (Del)</Button>
      </div>
    </Card>
  );
};

// Main Hybrid Component with keyboard, centralized selection, accessibility, throttled live updates,
// and the requested new features: snap-to-grid, reset, position indicator, nudge, z-order, duplicate, quick-style, delete.
export default function EnhancedInteractivePreview({
  greetingData,
  onDataChange,
  selectedEvent,
  frameStyle = null,
  mediaAnimation = null,
  className,
  isEditable = true,
  nudgeStep = 2,      // NEW prop: nudge step for keyboard nudging
  snapGrid = 10,      // NEW prop: grid size for snapping (drag + resize)
}: {
  greetingData: any;
  onDataChange: (data: any) => void;
  selectedEvent: any;
  frameStyle?: any;
  mediaAnimation?: any;
  className?: string;
  isEditable?: boolean;
  nudgeStep?: number;
  snapGrid?: number;
})  {
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const greetingRef = useRef<HTMLDivElement | null>(null);

  // keep refs to avoid stale closures in throttled functions
  const onDataChangeRef = useRef(onDataChange);
  const greetingDataRef = useRef(greetingData);
  useEffect(() => { onDataChangeRef.current = onDataChange; }, [onDataChange]);
  useEffect(() => { greetingDataRef.current = greetingData; }, [greetingData]);

  // throttled live update (for onDrag rapid events)
  const throttledLiveUpdate = useRef(throttle((type: 'text' | 'media', idx: number, updated: any) => {
    const gd = greetingDataRef.current;
    if (!onDataChangeRef.current) return;
    if (type === 'text') {
      const texts = [...(gd.texts || [])];
      texts[idx] = { ...texts[idx], ...updated };
      onDataChangeRef.current({ ...gd, texts });
    } else {
      const media = [...(gd.media || [])];
      media[idx] = { ...media[idx], ...updated };
      onDataChangeRef.current({ ...gd, media });
    }
  }, 40)).current;

  const liveUpdate = useCallback((type: 'text' | 'media', idx: number, updated: any) => {
    throttledLiveUpdate(type, idx, updated);
  }, [throttledLiveUpdate]);

  // immediate updates (onDragStop / onResizeStop)
  const applyUpdate = useCallback((type: 'text' | 'media', idx: number, updated: any) => {
    if (!onDataChange) return;
    if (type === 'text') {
      const texts = [...(greetingData.texts || [])];
      texts[idx] = { ...texts[idx], ...updated };
      onDataChange({ ...greetingData, texts });
    } else {
      const media = [...(greetingData.media || [])];
      media[idx] = { ...media[idx], ...updated };
      onDataChange({ ...greetingData, media });
    }
  }, [greetingData, onDataChange]);

  // helper for delete (exposed also to side panel)
  const deleteSelected = useCallback(() => {
    if (!selectedItem || !onDataChange) return;
    const { type, index } = selectedItem;
    if (type === 'text') {
      const texts = [...(greetingData.texts || [])];
      texts.splice(index, 1);
      onDataChange({ ...greetingData, texts });
    } else if (type === 'media') {
      const media = [...(greetingData.media || [])];
      media.splice(index, 1);
      onDataChange({ ...greetingData, media });
    }
    setSelectedItem(null);
  }, [selectedItem, greetingData, onDataChange]);

  // Duplicate selected
  const duplicateSelected = useCallback(() => {
    if (!selectedItem || !onDataChange) return;
    const { type, index } = selectedItem;
    if (type === 'text') {
      const texts = [...(greetingData.texts || [])];
      const original = texts[index];
      const clone = { ...original, x: (original.x || 0) + 20, y: (original.y || 0) + 20 };
      // ensure unique id if present
      if (clone.id) clone.id = `${clone.id}_dup_${Date.now()}`;
      texts.push(clone);
      onDataChange({ ...greetingData, texts });
      setSelectedItem({ type: 'text', index: texts.length - 1 });
    } else {
      const media = [...(greetingData.media || [])];
      const original = media[index];
      const clone = { ...original, x: (original.x || 0) + 20, y: (original.y || 0) + 20 };
      if (clone.id) clone.id = `${clone.id}_dup_${Date.now()}`;
      media.push(clone);
      onDataChange({ ...greetingData, media });
      setSelectedItem({ type: 'media', index: media.length - 1 });
    }
  }, [selectedItem, greetingData, onDataChange]);

  // Reset selected position (Ctrl+0)
  const resetSelectedPosition = useCallback(() => {
    if (!selectedItem || !onDataChange) return;
    const { type, index } = selectedItem;
    if (type === 'text') {
      const texts = [...(greetingData.texts || [])];
      texts[index] = { ...texts[index], x: 50, y: 50 };
      onDataChange({ ...greetingData, texts });
    } else {
      const media = [...(greetingData.media || [])];
      media[index] = { ...media[index], x: 50, y: 50 };
      onDataChange({ ...greetingData, media });
    }
  }, [selectedItem, greetingData, onDataChange]);

  // Z-order (bring front / send back). We use array order to represent z-order.
  const changeZOrder = useCallback((dir: 'up' | 'down') => {
    if (!selectedItem || !onDataChange) return;
    const { type, index } = selectedItem;
    if (type === 'text') {
      const arr = [...(greetingData.texts || [])];
      const item = arr.splice(index, 1)[0];
      if (!item) return;
      if (dir === 'up') arr.push(item);
      else arr.unshift(item);
      onDataChange({ ...greetingData, texts: arr });
      // update selection to new index
      setSelectedItem({ type: 'text', index: dir === 'up' ? arr.length - 1 : 0 });
    } else {
      const arr = [...(greetingData.media || [])];
      const item = arr.splice(index, 1)[0];
      if (!item) return;
      if (dir === 'up') arr.push(item);
      else arr.unshift(item);
      onDataChange({ ...greetingData, media: arr });
      setSelectedItem({ type: 'media', index: dir === 'up' ? arr.length - 1 : 0 });
    }
  }, [selectedItem, greetingData, onDataChange]);

  // Quick style: toggles bold for texts and quick border for media
  const toggleQuickStyle = useCallback(() => {
    if (!selectedItem || !onDataChange) return;
    const { type, index } = selectedItem;
    if (type === 'text') {
      const texts = [...(greetingData.texts || [])];
      const current = texts[index];
      const newStyle = { ...(current.style || {}), fontWeight: (current.style?.fontWeight === 'bold' ? 'normal' : 'bold') };
      texts[index] = { ...current, style: newStyle };
      onDataChange({ ...greetingData, texts });
    } else {
      const media = [...(greetingData.media || [])];
      const current = media[index];
      media[index] = { ...current, quickBorder: !current.quickBorder };
      onDataChange({ ...greetingData, media });
    }
  }, [selectedItem, greetingData, onDataChange]);

  // keyboard nudge and shortcuts (centralized)
  useEffect(() => {
    const el = greetingRef.current;
    if (!el) return;

    const handleKey = (e: KeyboardEvent) => {
      if (!isEditable) return;
      if (!selectedItem) return;

      // prioritize Ctrl combos
      if (e.ctrlKey || e.metaKey) {
        // duplicate (Ctrl+D)
        if (e.key.toLowerCase() === 'd') {
          e.preventDefault();
          duplicateSelected();
          return;
        }
        // reset position (Ctrl+0)
        if (e.key === '0') {
          e.preventDefault();
          resetSelectedPosition();
          return;
        }
        // quick style (Ctrl+B)
        if (e.key.toLowerCase() === 'b') {
          e.preventDefault();
          toggleQuickStyle();
          return;
        }
        // z-order (Ctrl+ArrowUp / Ctrl+ArrowDown)
        if (e.key === 'ArrowUp') {
          e.preventDefault();
          changeZOrder('up');
          return;
        }
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          changeZOrder('down');
          return;
        }
      }

      const multiplier = e.shiftKey ? 5 : 1;
      const step = (nudgeStep || 1) * multiplier;

      let handled = false;
      const { type, index } = selectedItem;

      // Arrow nudges (not with Ctrl)
      if (!e.ctrlKey && !e.metaKey) {
        if (e.key === 'ArrowUp') {
          handled = true;
          // read current coordinates safely
          const curY = type === 'text' ? (greetingData.texts?.[index]?.y ?? 0) : (greetingData.media?.[index]?.y ?? 0);
          applyUpdate(type, index, { y: curY - step });
        }
        if (e.key === 'ArrowDown') {
          handled = true;
          const curY = type === 'text' ? (greetingData.texts?.[index]?.y ?? 0) : (greetingData.media?.[index]?.y ?? 0);
          applyUpdate(type, index, { y: curY + step });
        }
        if (e.key === 'ArrowLeft') {
          handled = true;
          const curX = type === 'text' ? (greetingData.texts?.[index]?.x ?? 0) : (greetingData.media?.[index]?.x ?? 0);
          applyUpdate(type, index, { x: curX - step });
        }
        if (e.key === 'ArrowRight') {
          handled = true;
          const curX = type === 'text' ? (greetingData.texts?.[index]?.x ?? 0) : (greetingData.media?.[index]?.x ?? 0);
          applyUpdate(type, index, { x: curX + step });
        }
      }

      // delete / backspace remove
      if (e.key === 'Delete' || e.key === 'Backspace') {
        handled = true;
        deleteSelected();
      }

      if (e.key === 'Escape') {
        handled = true;
        setSelectedItem(null);
      }

      if (handled) {
        e.preventDefault();
        // keep focus on container so further keys continue to work
        (el as HTMLElement).focus();
      }
    };

    el.addEventListener('keydown', handleKey);
    return () => el.removeEventListener('keydown', handleKey);
  }, [selectedItem, isEditable, greetingData, applyUpdate, deleteSelected, duplicateSelected, resetSelectedPosition, changeZOrder, toggleQuickStyle, nudgeStep]);

  // ensure container is focusable and focused when selection changes
  useEffect(() => {
    if (selectedItem && greetingRef.current) {
      greetingRef.current.focus();
    }
  }, [selectedItem]);

  // determine currentEvent (supports custom event fallback)
  const currentEvent = selectedEvent || (greetingData.eventType === 'custom'
    ? {
        value: 'custom',
        emoji: greetingData.customEventEmoji || '🎉',
        label: greetingData.customEventName || 'Custom Event',
        defaultMessage: greetingData.texts?.[0]?.content || 'Wishing you a wonderful celebration!',
        theme: greetingData.theme || '',
        category: 'custom'
      }
    : null);

  const canEdit = Boolean(isEditable && typeof onDataChange === 'function');

  return (
    <BackgroundWrapper greetingData={greetingData} className={className}>
      <div
        className="max-w-4xl mx-auto relative"
        ref={greetingRef}
        tabIndex={0}
        role="application"
        aria-label="Greeting editor"
      >
       {/* Edit toggle */}
{isEditable && (
  <div className="mb-4 flex justify-center">
    <Button
      onClick={() => setSelectedItem(null)}
      variant={'ghost'}
      size="sm"
    >
      {/* small helper - clear selection */}
      Clear Selection
    </Button>
  </div>
)}


        <BorderContainer greetingData={greetingData} selectedEvent={currentEvent}>
          <div className="space-y-8">
            <EventHeader greetingData={greetingData} selectedEvent={selectedEvent} />

            <div className="space-y-4 text-center mb-6">
              {(greetingData.texts || []).filter(t => !t.position).map((t, i) => (
                <motion.div
                  key={i}
                  className="p-4 bg-white/80 backdrop-blur-sm rounded-lg shadow-lg mx-auto max-w-md"
                  style={{
                    fontSize: t.style?.fontSize || '16px',
                    fontWeight: t.style?.fontWeight || 'normal',
                    color: t.style?.color || '#333333',
                    textAlign: t.style?.textAlign || 'center'
                  }}
                  initial="hidden"
                  animate="visible"
                  variants={mediaAnimations[t.animation] || mediaAnimations.fade}
                >
                  {t.content}
                </motion.div>
              ))}
            </div>

            <div className="relative w-full h-[600px] overflow-hidden" onClick={(e) => { if (e.target === e.currentTarget) setSelectedItem(null); }}>
              {/* Media (draggable + resizable) */}
              <AnimatePresence>
                {(greetingData.media || []).map((mediaItem, idx) => (
                  <Rnd
                    key={idx}
                    size={{ width: mediaItem.width || 300, height: mediaItem.height || 200 }}
                    position={{ x: mediaItem.x || 0, y: mediaItem.y || 0 }}
                    onDrag={(e, d) => canEdit && liveUpdate('media', idx, { ...mediaItem, x: d.x, y: d.y })}
                    onDragStop={(e, d) => canEdit && applyUpdate('media', idx, { ...mediaItem, x: d.x, y: d.y })}
                    onResizeStop={(e, dir, ref, delta, pos) => canEdit && applyUpdate('media', idx, { ...mediaItem, width: ref.offsetWidth, height: ref.offsetHeight, x: pos.x, y: pos.y })}
                    disableDragging={!canEdit}
                    enableResizing={canEdit}
                    bounds="parent"
                    grid={snapGrid ? [snapGrid, snapGrid] : undefined}
                    resizeGrid={snapGrid ? [snapGrid, snapGrid] : undefined}
                    className={selectedItem && selectedItem.type === 'media' && selectedItem.index === idx ? 'z-50' : 'z-10'}
                  >
                    <motion.div
                      className={`relative group ${selectedItem && selectedItem.type === 'media' && selectedItem.index === idx ? 'ring-2 ring-primary ring-opacity-70 rounded-lg' : ''}`}
                      onClick={() => canEdit && setSelectedItem({ type: 'media', index: idx })}
                      role="button"
                      aria-pressed={selectedItem && selectedItem.type === 'media' && selectedItem.index === idx}
                      tabIndex={0}
                    >
                      <MediaFrame frameType={mediaItem.frameType || frameStyle} index={idx}>
                        <div className="w-full h-full overflow-hidden rounded-lg bg-gray-50">
                          {mediaItem.type === 'image' ? (
                            <img src={mediaItem.url} alt={mediaItem.alt || 'Media'} className="w-full h-full object-cover" />
                          ) : (
                            <video src={mediaItem.url} className="w-full h-full object-cover" controls />
                          )}
                        </div>
                      </MediaFrame>

                      {/* Inline controls */}
                      {selectedItem && selectedItem.type === 'media' && selectedItem.index === idx && canEdit && (
                        <div className="absolute -top-10 left-0 flex gap-1 bg-background/90 backdrop-blur rounded-md p-1 shadow-lg z-20">
                          <Button size="sm" variant="ghost" className="h-6 w-6 p-0" onClick={(e) => { e.stopPropagation(); const media = [...(greetingData.media || [])]; media.splice(idx, 1); onDataChange({ ...greetingData, media }); setSelectedItem(null); }}>
                            <Trash2 className="h-3 w-3 text-destructive" />
                          </Button>
                        </div>
                      )}

                      {/* Position indicator while selected */}
                      {selectedItem && selectedItem.type === 'media' && selectedItem.index === idx && canEdit && (
                        <div className="absolute -bottom-10 left-0 bg-black/60 text-white text-xs px-2 py-1 rounded pointer-events-none z-20">
                          x: {mediaItem.x ?? 0}, y: {mediaItem.y ?? 0} • {mediaItem.width ?? 0}×{mediaItem.height ?? 0}
                        </div>
                      )}

                    </motion.div>
                  </Rnd>
                ))}
              </AnimatePresence>

              {/* Text items (draggable) */}
              <AnimatePresence>
                {(greetingData.texts || []).map((textItem, idx) => (
                  <Rnd
                    key={idx}
                    size={{ width: textItem.width || 'auto', height: textItem.height || 'auto' }}
                    position={{ x: textItem.x || 0, y: textItem.y || 0 }}
                    onDrag={(e, d) => canEdit && liveUpdate('text', idx, { ...textItem, x: d.x, y: d.y })}
                    onDragStop={(e, d) => canEdit && applyUpdate('text', idx, { ...textItem, x: d.x, y: d.y })}
                    disableDragging={!canEdit}
                    enableResizing={canEdit}
                    bounds="parent"
                    grid={snapGrid ? [snapGrid, snapGrid] : undefined}
                    className={selectedItem && selectedItem.type === 'text' && selectedItem.index === idx ? 'z-50' : 'z-10'}
                  >
                    <motion.div
                      className={`relative group ${selectedItem && selectedItem.type === 'text' && selectedItem.index === idx ? 'ring-2 ring-primary ring-opacity-70 rounded-lg' : ''}`}
                      onClick={() => canEdit && setSelectedItem({ type: 'text', index: idx })}
                      role="button"
                      aria-pressed={selectedItem && selectedItem.type === 'text' && selectedItem.index === idx}
                      tabIndex={0}
                    >
                      <div className="p-4 bg-white/80 backdrop-blur-sm rounded-lg shadow-lg"
                        style={{
                          fontSize: textItem.style?.fontSize || '16px',
                          fontWeight: textItem.style?.fontWeight || 'normal',
                          color: textItem.style?.color || '#333333',
                          textAlign: textItem.style?.textAlign || 'left',
                          fontFamily: textItem.style?.fontFamily || 'inherit'
                        }}
                      >
                        {textItem.content}
                      </div>
                    
                      {/* Inline controls */}
                      {selectedItem && selectedItem.type === 'text' && selectedItem.index === idx && canEdit && (
                        <div className="absolute -top-10 left-0 flex gap-1 bg-background/90 backdrop-blur rounded-md p-1 shadow-lg z-20">
                          <Button size="sm" variant="ghost" className="h-6 w-6 p-0" onClick={(e) => { e.stopPropagation(); const texts = [...(greetingData.texts || [])]; texts.splice(idx, 1); onDataChange({ ...greetingData, texts }); setSelectedItem(null); }}>
                            <Trash2 className="h-3 w-3 text-destructive" />
                          </Button>
                        </div>
                      )}

                      {/* Position indicator while selected */}
                      {selectedItem && selectedItem.type === 'text' && selectedItem.index === idx && canEdit && (
                        <div className="absolute -bottom-10 left-0 bg-black/60 text-white text-xs px-2 py-1 rounded pointer-events-none z-20">
                          x: {textItem.x ?? 0}, y: {textItem.y ?? 0}
                        </div>
                      )}

                    </motion.div>
                  </Rnd>
                ))}
              </AnimatePresence>

              {/* Emojis layer - static (non-editable) */}
              <div className="absolute inset-0 pointer-events-none">
                {(greetingData.emojis || []).map((emoji, i) => (
                  <motion.div key={i} className="absolute select-none" style={{ left: `${emoji.position.x}%`, top: `${emoji.position.y}%`, fontSize: `${emoji.size}px` }} variants={mediaAnimations[emoji.animation] || mediaAnimations.float} initial="hidden" animate="visible">
                    {emoji.emoji}
                  </motion.div>
                ))}
              </div>

              <SenderSection greetingData={greetingData} />

              {/* Edit Mode Instructions */}
              {isEditable && (
                <div className="absolute bottom-4 left-4 z-10"><DragDropInstructions /></div>
              )}

            </div>

            <ShareActions greetingData={greetingData} greetingRef={greetingRef} selectedEvent={selectedEvent} />
          </div>
        </BorderContainer>

        {/* Audio indicator */}
        {greetingData.audioUrl && (
          <div className="absolute top-4 left-4 z-20">
            <div className="flex items-center gap-2 bg-background/80 backdrop-blur-sm rounded-full px-3 py-1 text-sm">
              <Volume2 className="h-4 w-4 text-primary animate-pulse" />
              <span>Music available</span>
            </div>
          </div>
        )}

        {/* Side editing panel (live updates) */}
        {selectedItem && isEditable && (
          <SideEditingPanel
            selectedItem={selectedItem}
            greetingData={greetingData}
            onDataChange={onDataChange}
            onDuplicate={duplicateSelected}
            onReset={resetSelectedPosition}
            onZOrder={changeZOrder}
            onQuickStyle={toggleQuickStyle}
            onDelete={deleteSelected}
          />
        )}

      </div>
    </BackgroundWrapper>
  );
}
