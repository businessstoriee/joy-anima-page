import React, { useEffect, useRef, useState, useId, useCallback } from "react";
import { Play, Pause, Volume2, VolumeX, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

// ✅ YT type
declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

interface BackgroundAudioPlayerProps {
  audioUrl?: string;
  autoPlay?: boolean;
  loop?: boolean;
  className?: string;
}

/** --- YouTube API Loader Singleton --- */
let ytApiLoader: Promise<void> | null = null;
function loadYouTubeAPI(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.YT && window.YT.Player) return Promise.resolve();
  if (ytApiLoader) return ytApiLoader;

  ytApiLoader = new Promise<void>((resolve, reject) => {
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    tag.async = true;
    tag.onerror = () => reject(new Error("Failed to load YouTube API"));

    document.body.appendChild(tag);

    window.onYouTubeIframeAPIReady = () => resolve();

    setTimeout(() => {
      if (window.YT && window.YT.Player) resolve();
      else reject(new Error("YouTube API timeout"));
    }, 5000);
  });

  return ytApiLoader;
}

/** --- Extract YT Video ID --- */
function extractYouTubeVideoId(urlStr?: string): string | null {
  if (!urlStr) return null;
  try {
    const url = new URL(urlStr);
    if (url.hostname.includes("youtu.be")) {
      return url.pathname.replace("/", "").split("?")[0] || null;
    }
    if (url.hostname.includes("youtube.com")) {
      return url.searchParams.get("v");
    }
    return null;
  } catch {
    return null;
  }
}

/** --- Detect URL Type --- */
function detectUrlType(url?: string): "youtube" | "audio" | "unsupported" | null {
  if (!url) return null;
  const ytId = extractYouTubeVideoId(url);
  if (ytId) return "youtube";

  // Check audio file extensions
  if (/\.(mp3|wav|ogg|m4a|aac|flac)(\?.*)?$/i.test(url)) {
    return "audio";
  }

  // If Spotify / Instagram / etc.
  try {
    const host = new URL(url).hostname;
    if (host.includes("spotify.com") || host.includes("soundcloud.com")) {
      return "unsupported"; // need SDK integration
    }
  } catch {}

  return "unsupported";
}

const BackgroundAudioPlayer: React.FC<BackgroundAudioPlayerProps> = ({
  audioUrl,
  autoPlay = true,
  loop = true,
  className,
}) => {
  const ytPlayerId = useId();
  const ytPlayerRef = useRef<any>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const userInteractedRef = useRef(false);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const urlType = detectUrlType(audioUrl);

  // Handle user interaction to unmute
  const handleFirstInteraction = useCallback(() => {
    if (userInteractedRef.current) return;
    
    userInteractedRef.current = true;
    
    // Remove all event listeners
    document.removeEventListener("click", handleFirstInteraction);
    document.removeEventListener("scroll", handleFirstInteraction);
    document.removeEventListener("keydown", handleFirstInteraction);
    document.removeEventListener("touchstart", handleFirstInteraction);
    
    // Unmute the audio
    if (urlType === "youtube" && ytPlayerRef.current) {
      try {
        ytPlayerRef.current.unMute();
        setIsMuted(false);
      } catch (error) {
        console.error("Failed to unmute YouTube player:", error);
      }
    } else if (urlType === "audio" && audioRef.current) {
      try {
        audioRef.current.muted = false;
        setIsMuted(false);
      } catch (error) {
        console.error("Failed to unmute audio element:", error);
      }
    }
  }, [urlType]);

  // Set up interaction listeners
  useEffect(() => {
    if (!audioUrl || userInteractedRef.current) return;

    // Add event listeners for user interaction
    document.addEventListener("click", handleFirstInteraction, { once: true });
    document.addEventListener("scroll", handleFirstInteraction, { once: true, passive: true });
    document.addEventListener("keydown", handleFirstInteraction, { once: true });
    document.addEventListener("touchstart", handleFirstInteraction, { once: true, passive: true });

    return () => {
      document.removeEventListener("click", handleFirstInteraction);
      document.removeEventListener("scroll", handleFirstInteraction);
      document.removeEventListener("keydown", handleFirstInteraction);
      document.removeEventListener("touchstart", handleFirstInteraction);
    };
  }, [audioUrl, handleFirstInteraction]);

  /** --- YouTube Init --- */
  useEffect(() => {
    if (urlType !== "youtube" || !audioUrl) return;

    const videoId = extractYouTubeVideoId(audioUrl);
    if (!videoId) {
      setError("Invalid YouTube URL");
      return;
    }

    setIsLoading(true);
    setError(null);

    loadYouTubeAPI()
      .then(() => {
        if (ytPlayerRef.current) {
          try { ytPlayerRef.current.destroy(); } catch {}
          ytPlayerRef.current = null;
        }

        ytPlayerRef.current = new window.YT.Player(ytPlayerId, {
          videoId,
          height: "0",
          width: "0",
          playerVars: {
            autoplay: autoPlay ? 1 : 0,
            loop: loop ? 1 : 0,
            playlist: loop ? videoId : undefined,
            controls: 0,
            fs: 0,
            modestbranding: 1,
            rel: 0,
            playsinline: 1,
          },
          events: {
            onReady: (e: any) => {
              setIsLoading(false);
              try {
                // Start muted to comply with autoplay policies
                e.target.mute();
                if (autoPlay) e.target.playVideo();
                setIsMuted(true);
                setIsPlaying(autoPlay);
              } catch {
                setError("Autoplay failed");
              }
            },
            onStateChange: (event: any) => {
              if (event.data === window.YT.PlayerState.PLAYING) setIsPlaying(true);
              if (event.data === window.YT.PlayerState.PAUSED) setIsPlaying(false);
              if (event.data === window.YT.PlayerState.ENDED && loop) {
                event.target.playVideo();
              }
            },
            onError: () => {
              setIsLoading(false);
              setError("YouTube playback error");
              toast({
                title: "YouTube Error",
                description: "Failed to play this video",
                variant: "destructive",
              });
            },
          },
        });
      })
      .catch(() => {
        setError("Failed to load YouTube API");
        setIsLoading(false);
      });

    return () => {
      if (ytPlayerRef.current) {
        try { ytPlayerRef.current.destroy(); } catch {}
      }
    };
  }, [audioUrl, autoPlay, loop, ytPlayerId, urlType]);

  /** --- HTML Audio Init --- */
  useEffect(() => {
    if (urlType !== "audio" || !audioRef.current || !audioUrl) return;
    const el = audioRef.current;

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onError = () => setError("Failed to play audio file");

    el.addEventListener("play", onPlay);
    el.addEventListener("pause", onPause);
    el.addEventListener("error", onError);

    // Set audio properties
    el.loop = loop;
    el.preload = "metadata";
    
    // Start muted to comply with autoplay policies
    el.muted = true;
    
    if (autoPlay) {
      el.play().catch(() => {
        setError("Autoplay blocked, click play");
      });
    }

    return () => {
      el.removeEventListener("play", onPlay);
      el.removeEventListener("pause", onPause);
      el.removeEventListener("error", onError);
    };
  }, [audioUrl, autoPlay, loop, urlType]);

  /** --- Controls --- */
  const togglePlayPause = () => {
    // Trigger user interaction for unmuting
    handleFirstInteraction();
    
    if (urlType === "youtube" && ytPlayerRef.current) {
      isPlaying ? ytPlayerRef.current.pauseVideo() : ytPlayerRef.current.playVideo();
    } else if (urlType === "audio" && audioRef.current) {
      isPlaying ? audioRef.current.pause() : audioRef.current.play().catch(error => {
        console.error("Play error:", error);
        setError("Failed to play audio");
      });
    }
  };

  const toggleMute = () => {
    // Trigger user interaction for unmuting
    handleFirstInteraction();
    
    if (urlType === "youtube" && ytPlayerRef.current) {
      if (isMuted) {
        ytPlayerRef.current.unMute();
        setIsMuted(false);
      } else {
        ytPlayerRef.current.mute();
        setIsMuted(true);
      }
    } else if (urlType === "audio" && audioRef.current) {
      audioRef.current.muted = !audioRef.current.muted;
      setIsMuted(audioRef.current.muted);
    }
  };

  if (!audioUrl) return null;

  return (
    <div
      className={cn(
        "flex items-center gap-1 sm:gap-2 bg-background/70 backdrop-blur-sm rounded-full px-1 sm:px-2 py-1",
        className
      )}
    >
      {/* Hidden players */}
      {urlType === "youtube" && (
        <div id={ytPlayerId} className="w-0 h-0 overflow-hidden" aria-hidden="true" />
      )}
      {urlType === "audio" && (
        <audio ref={audioRef} src={audioUrl} loop={loop} preload="auto" hidden />
      )}


  {/* Play/Pause */}
  <Button
    size="sm"
    variant="outline"
    onClick={togglePlayPause}
    disabled={isLoading || !!error || urlType === "unsupported"}
    aria-label={isPlaying ? "Pause" : "Play"}
    className="h-8 w-8 p-0 hover:bg-gray-300 rounded-md border-primary"
  >
    {isLoading ? (
      <Loader2 className="h-7 w-7 animate-spin text-blue-600" />
    ) : isPlaying ? (
      <Pause className="h-7 w-7 text-red-600" />
    ) : (
      <Play className="h-7 w-7 text-green-600" />
    )}
  </Button>

  {/* Mute */}
  <Button
    size="sm"
    variant="outline"
    onClick={toggleMute} 
    disabled={!!error || urlType === "unsupported"}
    aria-label={isMuted ? "Unmute" : "Mute"}
    className="h-8 w-8 p-0 hover:bg-gray-300 rounded-md border-primary"
  >
    {isMuted ? (
      <VolumeX className="h-7 w-7 text-amber-600" />
    ) : (
      <Volume2 className="h-7 w-7 text-blue-600" />
    )}
  </Button>



      {/* Status indicator */}
      {/* {isMuted && !error && urlType !== "unsupported" && (
        <span className="text-xs text-muted-foreground ml-1" title="Click anywhere to unmute">
          Muted
        </span>
      )} */}

      {/* Error */}
      {(error || urlType === "unsupported") && (
        <div className="flex items-center gap-1 ml-1">
          <AlertCircle className="h-3 w-3 text-destructive" />
          <span className="text-xs text-destructive truncate">
            {error || "Unsupported URL"}
          </span>
        </div>
      )}
    </div>
  );
};

export default BackgroundAudioPlayer;