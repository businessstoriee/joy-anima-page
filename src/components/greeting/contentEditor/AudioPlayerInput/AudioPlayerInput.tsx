import React, { useEffect, useId, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Play, Pause, AlertCircle, Upload, X, Volume2, VolumeX, Music } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface Props {
  value: string;
  onChange: (value: string) => void;
  autoPlay?: boolean;
  className?: string;
}

// TypeScript declaration for YouTube API
declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

/** --- YouTube IFrame API loader (singleton) --- */
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
    
    const firstScript = document.getElementsByTagName("script")[0];
    firstScript?.parentNode?.insertBefore(tag, firstScript);

    window.onYouTubeIframeAPIReady = () => resolve();
    
    // Timeout fallback
    setTimeout(() => {
      if (window.YT && window.YT.Player) {
        resolve();
      } else {
        reject(new Error("YouTube API loading timeout"));
      }
    }, 5000);
  });

  return ytApiLoader;
}

export default function AudioPlayerInput({ value, onChange, autoPlay = false, className }: Props) {
  const playerHostId = useId();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const ytPlayerRef = useRef<any>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isYoutubePlaying, setIsYoutubePlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [supported, setSupported] = useState(true);
  const [statusMsg, setStatusMsg] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const lastBlobUrlRef = useRef<string | null>(null);

  const isYouTube = (u?: string) => {
    if (!u) return false;
    try {
      const url = new URL(u);
      return /(^|\.)youtube\.com$|(^|\.)youtu\.be$|(^|\.)music\.youtube\.com$/.test(url.hostname);
    } catch {
      return false;
    }
  };
  

const extractYouTubeVideoId = (urlStr: string): string | null => {
  if (!urlStr) return null;
  // quick regexp fallback (matches typical 11-character YT id)
  const idRegex = /(?:v=|\/embed\/|\.be\/|\/shorts\/)([A-Za-z0-9_-]{11})/;

  try {
    const url = new URL(urlStr);

    // youtu.be short link -> pathname is /<id>
    if (url.hostname.includes("youtu.be")) {
      const id = url.pathname.replace(/^\/+/, "").split(/[?#]/)[0];
      return id && id.length >= 6 ? id : null; // tolerate some variance but prefer length
    }

    // youtube.com or music.youtube.com
    if (url.hostname.includes("youtube.com") || url.hostname.includes("music.youtube.com")) {
      // common case: ?v=VIDEOID
      const v = url.searchParams.get("v");
      if (v) return v;

      // /embed/VIDEOID or /shorts/VIDEOID or other path-based forms
      const pathMatch = url.pathname.match(/\/(embed|shorts)\/([A-Za-z0-9_-]{6,})/);
      if (pathMatch && pathMatch[2]) return pathMatch[2];

      // fallback: try regex on entire url string
      const fallback = urlStr.match(idRegex);
      if (fallback && fallback[1]) return fallback[1];

      return null;
    }

    // fallback: regex against whole string (covers some odd cases)
    const fallback2 = urlStr.match(idRegex);
    return fallback2 ? fallback2[1] : null;
  } catch (err) {
    // if URL parsing fails (user pasted only ID or malformed string), try regex directly
    const m = urlStr.match(idRegex);
    return m ? m[1] : null;
  }
};


  const isLikelyDirectAudio = (u?: string) => {
    if (!u) return false;
    try {
      const url = new URL(u);
      return /\.(mp3|wav|ogg|m4a|flac|aac)(\?.*)?$/i.test(url.pathname);
    } catch {
      return false;
    }
  };

  const checkSupportedUrl = (u?: string) => {
    if (!u) return true;
    if (isYouTube(u)) return true;
    try {
      const hostname = new URL(u).hostname;
      const blocked = ["spotify.com", "soundcloud.com", "music.apple.com", "apple.com", "deezer.com", "tidal.com"];
      if (blocked.some((d) => hostname.includes(d))) return false;
      return true;
    } catch {
      return false;
    }
  };

  /** ---------- Manage value changes ---------- */
  useEffect(() => {
    setSupported(checkSupportedUrl(value));
    setStatusMsg("");
    setIsLoading(!!value);

    // Reset state
    setIsPlaying(false);
    setIsYoutubePlaying(false);

    const a = audioRef.current;

    // If empty
    if (!value) {
      if (a) {
        a.pause();
        a.removeAttribute("src");
        a.load();
      }
      if (ytPlayerRef.current) {
        try { ytPlayerRef.current.destroy(); } catch {}
        ytPlayerRef.current = null;
      }
      setIsLoading(false);
      return;
    }

    // If YouTube URL
    if (isYouTube(value)) {
      if (a) {
        a.pause();
        a.removeAttribute("src");
        a.load();
      }

      loadYouTubeAPI()
        .then(() => {
          const videoId = extractYouTubeVideoId(value);
          if (!videoId || !window.YT) {
            setStatusMsg("Invalid YouTube URL");
            setIsLoading(false);
            return;
          }

          if (ytPlayerRef.current) {
            try { ytPlayerRef.current.destroy(); } catch {}
            ytPlayerRef.current = null;
          }

          const hostEl = document.getElementById(playerHostId);
          if (!hostEl) {
            setIsLoading(false);
            return;
          }

          ytPlayerRef.current = new window.YT.Player(hostEl, {
            height: "1",
            width: "1",
            videoId,
            playerVars: {
              playsinline: 1,
              modestbranding: 1,
              rel: 0,
              controls: 0,
              fs: 0,
              enablejsapi: 1
            },
            events: {
              onReady: (e: any) => {
                setIsLoading(false);
                if (autoPlay) {
                  try {
                    e.target.mute();
                    setIsMuted(true);
                    e.target.playVideo()
                      .then(() => {
                        setIsYoutubePlaying(true);
                        setStatusMsg("Playing (muted)");
                      })
                      .catch(() => {
                        setStatusMsg("Press Play to start");
                      });
                  } catch {
                    setStatusMsg("Press Play to start");
                  }
                } else {
                  setStatusMsg("Ready to play");
                }
              },
              onStateChange: (event: any) => {
                if (event.data === 1) setIsYoutubePlaying(true);
                if (event.data === 2 || event.data === 0) setIsYoutubePlaying(false);
              },
              onError: () => {
                setIsLoading(false);
                setStatusMsg("YouTube playback error");
                toast({
                  title: "YouTube error",
                  description: "Failed to play this video",
                  variant: "destructive",
                });
              },
            },
          });
        })
        .catch(() => {
          setIsLoading(false);
          setStatusMsg("YouTube API failed to load");
        });

      return;
    }

    // Direct audio
    if (ytPlayerRef.current) {
      try { ytPlayerRef.current.destroy(); } catch {}
      ytPlayerRef.current = null;
    }

    if (!a) {
      setIsLoading(false);
      return;
    }

    try {
      a.src = value;
      a.load();
      setIsLoading(true);
      
      const playAudio = () => {
        if (autoPlay) {
          a.play()
            .then(() => {
              setIsPlaying(true);
              setStatusMsg("Playing");
              setIsLoading(false);
            })
            .catch(() => {
              setStatusMsg("Press Play to start");
              setIsLoading(false);
            });
        } else {
          setStatusMsg("Ready to play");
          setIsLoading(false);
        }
      };

      if (a.readyState >= 2) {
        playAudio();
      } else {
        a.addEventListener('canplay', playAudio, { once: true });
        a.addEventListener('error', () => {
          setIsLoading(false);
          setStatusMsg("Failed to load audio");
        }, { once: true });
      }
    } catch {
      setIsLoading(false);
      setStatusMsg("Invalid audio URL");
    }
  }, [value, autoPlay, playerHostId]);

  /** ---------- Cleanup ---------- */
  useEffect(() => {
    return () => {
      if (ytPlayerRef.current) {
        try { ytPlayerRef.current.destroy(); } catch {}
      }
      if (lastBlobUrlRef.current) {
        URL.revokeObjectURL(lastBlobUrlRef.current);
      }
    };
  }, []);

  /** ---------- Audio events ---------- */
  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;

    const events = {
      ended: () => { setIsPlaying(false); setStatusMsg("Ended"); },
      pause: () => { setIsPlaying(false); setStatusMsg("Paused"); },
      play: () => { setIsPlaying(true); setStatusMsg("Playing"); },
      error: () => {
        setIsPlaying(false);
        setIsLoading(false);
        setStatusMsg("Audio error");
      }
    };

    Object.entries(events).forEach(([event, handler]) => {
      a.addEventListener(event, handler);
    });

    return () => {
      Object.entries(events).forEach(([event, handler]) => {
        a.removeEventListener(event, handler);
      });
    };
  }, []);

  /** ---------- Controls ---------- */
  const togglePlay = async () => {
    if (!value) {
      toast({ title: "No audio", description: "Add a URL or upload a file" });
      return;
    }

    if (isYouTube(value)) {
      const player = ytPlayerRef.current;
      if (!player) return;

      try {
        if (isYoutubePlaying) {
          player.pauseVideo();
        } else {
          player.playVideo();
        }
      } catch {
        toast({ title: "YouTube error", variant: "destructive" });
      }
      return;
    }

    const a = audioRef.current;
    if (!a) return;

    try {
      if (isPlaying) {
        a.pause();
      } else {
        await a.play();
      }
    } catch {
      toast({ title: "Playback failed", variant: "destructive" });
    }
  };

  const toggleMute = () => {
    if (isYouTube(value)) {
      const player = ytPlayerRef.current;
      if (!player) return;

      try {
        if (isMuted) {
          player.unMute();
          setIsMuted(false);
        } else {
          player.mute();
          setIsMuted(true);
        }
      } catch {}
      return;
    }

    const a = audioRef.current;
    if (!a) return;

    a.muted = !a.muted;
    setIsMuted(a.muted);
  };

  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  const onFileSelected = (file?: File | null) => {
    if (!file) return;
    
    if (lastBlobUrlRef.current) {
      URL.revokeObjectURL(lastBlobUrlRef.current);
    }

    const blobUrl = URL.createObjectURL(file);
    lastBlobUrlRef.current = blobUrl;
    onChange(blobUrl);

    toast({ title: "Audio uploaded", description: file.name });
  };

  const clearValue = () => {
    if (ytPlayerRef.current) {
      try { ytPlayerRef.current.destroy(); } catch {}
      ytPlayerRef.current = null;
    }
    
    const a = audioRef.current;
    if (a) {
      a.pause();
      a.removeAttribute("src");
      a.load();
    }
    
    if (lastBlobUrlRef.current) {
      URL.revokeObjectURL(lastBlobUrlRef.current);
      lastBlobUrlRef.current = null;
    }
    
    onChange("");
    setIsPlaying(false);
    setIsYoutubePlaying(false);
    setIsMuted(false);
    setStatusMsg("");
  };

  const getStatusText = () => {
    if (!value) return "Paste audio URL";
    if (!supported) return "Platform not supported";
    if (isLoading) return "Loading...";
    if (statusMsg) return statusMsg;
    if (isYouTube(value)) return "YouTube audio ready";
    return "Audio file ready";
  };

  return (
    <div className={cn("flex flex-col gap-3 bg-gradient-to-br from-muted/20 to-muted/10 rounded-lg", className)}>
      {/* Hidden elements */}
      <audio ref={audioRef} className="hidden" />
      <input
        ref={fileInputRef}
        type="file"
        accept="audio/*"
        className="hidden"
        onChange={(e) => onFileSelected(e.target.files?.[0])}
      />
      <div id={playerHostId} aria-hidden="true" className="w-px h-px overflow-hidden" />

      {/* Input and controls */}
      <div className="flex flex-col gap-3">
  <div className="flex flex-wrap min-w-0 relative">
    <Input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Paste YouTube URL"
      className={cn(
        "pr-10 transition-all truncate", // ✅ prevent overflow
        !supported && value && "border-destructive",
        isLoading && "animate-pulse"
      )}
      disabled={isLoading}
    />
    {value && (
      <button
        onClick={clearValue}
        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-muted rounded"
        disabled={isLoading}
        aria-label="Clear input"
      >
        <X className="h-4 w-4" />
      </button>
    )}
  </div>





        {/* Player controls */}
        <div className="flex items-center gap-2">
          <Button
            onClick={togglePlay}
            disabled={!value || isLoading || !supported}
            className="flex items-center gap-2 min-w-[100px]"
          >
            {isLoading ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            ) : isYouTube(value) ? (
              isYoutubePlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />
            ) : (
              isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />
            )}
            {isLoading ? "Loading" : isYouTube(value) 
              ? (isYoutubePlaying ? "Pause" : "Play") 
              : (isPlaying ? "Pause" : "Play")}
          </Button>

          <Button
            onClick={toggleMute}
            variant="outline"
            size="icon"
            disabled={!value || isLoading}
          >
            {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </Button>

          <div className="flex-1 min-w-0">
            <div className="text-sm text-muted-foreground truncate">
              {getStatusText()}
            </div>
          </div>
        </div>
      </div>

      {/* Error indicator */}
      {!supported && value && (
        <div className="flex items-center gap-2 text-destructive text-sm">
          <AlertCircle className="h-4 w-4" />
          <span>This platform may not support direct playback</span>
        </div>
      )}
    </div>
  );
}