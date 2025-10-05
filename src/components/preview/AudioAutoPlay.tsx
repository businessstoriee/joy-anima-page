import React, { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

interface AudioAutoPlayProps {
  audioUrl?: string;
  className?: string;
  autoPlay?: boolean;
}

const AudioAutoPlay: React.FC<AudioAutoPlayProps> = ({
  audioUrl,
  className = "",
  autoPlay = true
}) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (!audioUrl || !audioRef.current) return;

    const audio = audioRef.current;
    
    // Reset states
    setHasError(false);
    setIsMuted(false);
    audio.muted = false;

    const attemptAutoPlay = async () => {
      if (!autoPlay) return;
      
      try {
        // Load and play immediately
        await audio.play();
        setIsPlaying(true);
        console.log('✅ Audio auto-play successful');
      } catch (error) {
        console.log('⚠️ Auto-play prevented, trying with user interaction:', error);
        
        // If autoplay blocked, try on first user interaction
        const playOnInteraction = async () => {
          try {
            await audio.play();
            setIsPlaying(true);
            console.log('✅ Audio started after user interaction');
            // Remove listeners after successful play
            document.removeEventListener('click', playOnInteraction);
            document.removeEventListener('touchstart', playOnInteraction);
          } catch (err) {
            console.error('❌ Failed to play audio:', err);
          }
        };
        
        document.addEventListener('click', playOnInteraction, { once: true });
        document.addEventListener('touchstart', playOnInteraction, { once: true });
      }
    };

    const handleCanPlay = () => {
      attemptAutoPlay();
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => setIsPlaying(false);
    const handleError = () => {
      setHasError(true);
      setIsPlaying(false);
    };

    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    // Load the audio
    audio.load();

    return () => {
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
    };
  }, [audioUrl, autoPlay]);

  const togglePlay = () => {
    if (!audioRef.current || hasError) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch((error) => {
        console.error('Failed to play audio:', error);
        setHasError(true);
      });
    }
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    
    const newMutedState = !isMuted;
    audioRef.current.muted = newMutedState;
    setIsMuted(newMutedState);
    
    // If unmuting and not playing, resume playback
    if (!newMutedState && !isPlaying) {
      audioRef.current.play().catch(err => console.error('Failed to resume:', err));
    }
  };

  if (!audioUrl || hasError) return null;

  return (
    <div className={`fixed bottom-4 right-4 z-50 ${className}`}>
      <audio
        ref={audioRef}
        src={audioUrl}
        loop
        preload="auto"
        playsInline
      />
      
      <AnimatePresence>
        {audioUrl && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.8, x: 20 }}
            className="flex items-center gap-2 bg-background/90 backdrop-blur-sm border border-border/50 rounded-full p-2 shadow-lg"
          >
            <Button
              variant="ghost"
              size="sm"
              onClick={togglePlay}
              className="rounded-full w-10 h-10 p-2 hover:bg-primary/10"
            >
              {isPlaying ? (
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  <Volume2 className="w-4 h-4 text-primary" />
                </motion.div>
              ) : (
                <Volume2 className="w-4 h-4 text-muted-foreground" />
              )}
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMute}
              className="rounded-full w-8 h-8 p-1 hover:bg-primary/10"
            >
              {isMuted ? (
                <VolumeX className="w-3 h-3 text-muted-foreground" />
              ) : (
                <Volume2 className="w-3 h-3 text-primary" />
              )}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AudioAutoPlay;