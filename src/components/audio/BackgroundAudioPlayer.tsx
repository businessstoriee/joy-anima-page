import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Play, Pause, Volume2, VolumeX, Music, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';

interface BackgroundAudioPlayerProps {
  audioUrl: string;
  onAudioUrlChange: (url: string) => void;
  autoPlay?: boolean;
  showControls?: boolean;
  className?: string;
}

const BackgroundAudioPlayer: React.FC<BackgroundAudioPlayerProps> = ({
  audioUrl,
  onAudioUrlChange,
  autoPlay = false,
  showControls = true,
  className
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState([50]);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const { toast } = useToast();

  // Convert various URLs to playable format
  const getPlayableUrl = (url: string): string => {
    if (!url) return '';
    
    // YouTube URL conversion (for demonstration - in real app, you'd need YouTube API)
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      toast({
        title: "YouTube URLs",
        description: "YouTube URLs need special handling. Please use direct audio file URLs for now.",
        variant: "destructive",
      });
      return '';
    }
    
    // Instagram, Facebook URLs would need similar handling
    if (url.includes('instagram.com') || url.includes('facebook.com')) {
      toast({
        title: "Social Media URLs",
        description: "Social media URLs need special handling. Please use direct audio file URLs.",
        variant: "destructive",
      });
      return '';
    }
    
    // Direct audio file URLs
    return url;
  };

  const playableUrl = getPlayableUrl(audioUrl);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
      setIsLoading(false);
      setError(null);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    const handleError = () => {
      setError('Failed to load audio');
      setIsLoading(false);
      setIsPlaying(false);
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
    };
  }, [playableUrl]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume[0] / 100;
    }
  }, [volume]);

  useEffect(() => {
    if (autoPlay && playableUrl && audioRef.current) {
      handlePlay();
    }
  }, [autoPlay, playableUrl]);

  const handlePlay = async () => {
    const audio = audioRef.current;
    if (!audio || !playableUrl) return;

    try {
      setIsLoading(true);
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        await audio.play();
        setIsPlaying(true);
      }
    } catch (error) {
      setError('Failed to play audio');
      toast({
        title: "Playback Error",
        description: "Unable to play the audio file. Please check the URL.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSeek = (value: number[]) => {
    const audio = audioRef.current;
    if (audio && duration) {
      const seekTime = (value[0] / 100) * duration;
      audio.currentTime = seekTime;
      setCurrentTime(seekTime);
    }
  };

  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleUrlSubmit = () => {
    if (audioUrl) {
      setError(null);
      setIsLoading(true);
    }
  };

  return (
    <Card className={`w-full ${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Music className="h-5 w-5 text-primary" />
          Background Music
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* URL Input */}
        <div className="space-y-2">
          <Label htmlFor="audio-url" className="text-sm font-medium">
            Audio URL
          </Label>
          <div className="flex gap-2">
            <Input
              id="audio-url"
              type="url"
              placeholder="Enter audio file URL (mp3, wav, etc.)"
              value={audioUrl}
              onChange={(e) => onAudioUrlChange(e.target.value)}
              className="flex-1"
            />
            <Button
              onClick={handleUrlSubmit}
              variant="outline"
              size="sm"
              className="px-3"
            >
              <ExternalLink className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Supported: Direct audio file URLs (mp3, wav, ogg). YouTube and social media URLs require special handling.
          </p>
        </div>

        <Separator />

        {/* Audio Element */}
        {playableUrl && (
          <audio
            ref={audioRef}
            src={playableUrl}
            preload="metadata"
            loop
            className="hidden"
          />
        )}

        {/* Error Display */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Controls */}
        {showControls && playableUrl && (
          <div className="space-y-4">
            {/* Play/Pause and Volume */}
            <div className="flex items-center gap-4">
              <Button
                onClick={handlePlay}
                variant="outline"
                size="sm"
                disabled={isLoading || !playableUrl}
                className="flex items-center gap-2"
              >
                {isLoading ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                ) : isPlaying ? (
                  <Pause className="h-4 w-4" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
                {isLoading ? 'Loading...' : isPlaying ? 'Pause' : 'Play'}
              </Button>

              <div className="flex items-center gap-2 flex-1">
                {volume[0] === 0 ? (
                  <VolumeX className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Volume2 className="h-4 w-4 text-muted-foreground" />
                )}
                <Slider
                  value={volume}
                  onValueChange={setVolume}
                  max={100}
                  step={1}
                  className="flex-1 max-w-[100px]"
                />
                <span className="text-xs text-muted-foreground w-8">
                  {volume[0]}%
                </span>
              </div>
            </div>

            {/* Progress Bar */}
            {duration > 0 && (
              <div className="space-y-2">
                <Slider
                  value={[duration ? (currentTime / duration) * 100 : 0]}
                  onValueChange={handleSeek}
                  max={100}
                  step={0.1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Auto-play indicator */}
        {autoPlay && playableUrl && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/30 p-2 rounded">
            <Music className="h-3 w-3" />
            Background music will auto-play when greeting loads
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BackgroundAudioPlayer;