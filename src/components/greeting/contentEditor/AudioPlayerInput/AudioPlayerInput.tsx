// src/components/greeting/AudioPlayerInput.tsx
import React, { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Play, Pause, AlertCircle, Upload, X } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Props {
  value: string;
  onChange: (value: string) => void;
  autoPlay?: boolean;
}

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

export default function AudioPlayerInput({ value, onChange, autoPlay = false }: Props) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const youtubeIframeRef = useRef<HTMLIFrameElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [small, setSmall] = useState(false);
  const [supported, setSupported] = useState(true);
  const [loadedSuccessfully, setLoadedSuccessfully] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [youtubePlayer, setYoutubePlayer] = useState<any>(null);
  const [isYoutubePlaying, setIsYoutubePlaying] = useState(false);

  // responsive
  useEffect(() => {
    const check = () => setSmall(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // helpers
  const isYouTube = (u?: string) => {
    if (!u) return false;
    try {
      const url = new URL(u);
      return /youtube\.com|youtu\.be|music\.youtube\.com/.test(url.hostname);
    } catch {
      return false;
    }
  };

  const extractVideoId = (url: string): string | null => {
    try {
      const u = new URL(url);
      
      if (u.hostname.includes("youtu.be")) {
        return u.pathname.replace("/", "").split('?')[0];
      }
      
      if (u.hostname.includes("youtube.com")) {
        return u.searchParams.get("v");
      }
      
      return null;
    } catch {
      return null;
    }
  };

  // Load YouTube API
  useEffect(() => {
    if (!showVideo) return;

    // Check if API is already loaded
    if (window.YT) {
      initializeYouTubePlayer();
      return;
    }

    // Load YouTube IFrame API
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    if (firstScriptTag && firstScriptTag.parentNode) {
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }

    window.onYouTubeIframeAPIReady = () => {
      initializeYouTubePlayer();
    };

    return () => {
      if (youtubePlayer) {
        try {
          youtubePlayer.destroy();
        } catch (e) {
          console.warn("Error destroying YouTube player:", e);
        }
      }
    };
  }, [showVideo]);

  const initializeYouTubePlayer = () => {
    const videoId = extractVideoId(value);
    if (!videoId || !window.YT) return;

    try {
      const player = new window.YT.Player('youtube-player', {
        height: '200',
        width: '100%',
        videoId: videoId,
        playerVars: {
          'playsinline': 1,
          'modestbranding': 1,
          'rel': 0,
          'controls': 1,
          'enablejsapi': 1
        },
        events: {
          'onReady': (event: any) => {
            setYoutubePlayer(event.target);
            if (autoPlay) {
              event.target.playVideo();
              setIsYoutubePlaying(true);
            }
          },
          'onStateChange': (event: any) => {
            // YouTube player states: -1=unstarted, 0=ended, 1=playing, 2=paused, 3=buffering, 5=video cued
            if (event.data === 1) {
              setIsYoutubePlaying(true);
            } else if (event.data === 2 || event.data === 0) {
              setIsYoutubePlaying(false);
            }
          },
          'onError': (event: any) => {
            toast({
              title: "YouTube playback error",
              description: "Failed to play the video. Please try another video.",
              variant: "destructive"
            });
          }
        }
      });
    } catch (error) {
      console.error("Failed to initialize YouTube player:", error);
    }
  };

  const toggleYouTubePlayback = () => {
    if (!youtubePlayer) return;

    try {
      if (isYoutubePlaying) {
        youtubePlayer.pauseVideo();
      } else {
        youtubePlayer.playVideo();
      }
    } catch (error) {
      console.error("Error controlling YouTube playback:", error);
    }
  };

  const isLikelyDirectAudio = (u?: string) => {
    if (!u) return false;
    try {
      const url = new URL(u);
      return /\.(mp3|wav|ogg|m4a|flac)(\?.*)?$/i.test(url.pathname) || url.hostname.includes("archive.org");
    } catch {
      return false;
    }
  };

  const checkSupportedUrl = (u?: string) => {
    if (!u) return true;
    if (isYouTube(u)) return true;
    try {
      const hostname = new URL(u).hostname;
      const blocked = [
        "spotify.com",
        "soundcloud.com",
        "apple.com",
        "music.apple.com",
        "deezer.com",
        "tidal.com",
      ];
      if (blocked.some((d) => hostname.includes(d))) return false;
      return true;
    } catch {
      return false;
    }
  };

  // load/play direct audio when value changes
  useEffect(() => {
    const supportedUrl = checkSupportedUrl(value);
    setSupported(supportedUrl);
    setLoadedSuccessfully(false);

    if (!audioRef.current) return;

    if (!value) {
      audioRef.current.removeAttribute("src");
      audioRef.current.load();
      setIsPlaying(false);
      setShowVideo(false);
      return;
    }

    if (isYouTube(value)) {
      setShowVideo(true);
      audioRef.current.pause();
      audioRef.current.removeAttribute("src");
      setIsPlaying(false);
      return;
    }

    // For direct audio files
    setShowVideo(false);
    try {
      audioRef.current.src = value;
      audioRef.current.load();

      if (autoPlay) {
        audioRef.current.play()
          .then(() => setIsPlaying(true))
          .catch((err) => {
            setIsPlaying(false);
            toast({
              title: "Autoplay prevented",
              description: "Click Play to start audio (browser blocked autoplay).",
            });
          });
      }
    } catch (err) {
      console.error("Failed to set audio src:", err);
      toast({ title: "Invalid audio", description: "Could not use this URL as audio." });
      setIsPlaying(false);
    }
  }, [value, autoPlay]);

  // handle audio events
  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    const onEnded = () => setIsPlaying(false);
    const onPause = () => setIsPlaying(false);
    const onCanPlay = () => setLoadedSuccessfully(true);
    const onError = () => {
      setIsPlaying(false);
      setLoadedSuccessfully(false);
      toast({
        title: "Audio load error",
        description: "The audio failed to load/play.",
        variant: "destructive",
      });
    };

    a.addEventListener("ended", onEnded);
    a.addEventListener("pause", onPause);
    a.addEventListener("canplay", onCanPlay);
    a.addEventListener("error", onError);

    return () => {
      a.removeEventListener("ended", onEnded);
      a.removeEventListener("pause", onPause);
      a.removeEventListener("canplay", onCanPlay);
      a.removeEventListener("error", onError);
    };
  }, []);

  const togglePlay = async () => {
    if (isYouTube(value)) {
      toggleYouTubePlayback();
      return;
    }

    if (!audioRef.current) return;

    if (!value) {
      toast({ title: "No audio URL", description: "Paste a direct audio URL or upload a file first." });
      return;
    }

    try {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        await audioRef.current.play();
        setIsPlaying(true);
      }
    } catch (err) {
      setIsPlaying(false);
      console.error("Play failed", err);
      toast({
        title: "Playback failed",
        description: "Playback failed. Try uploading a local file or use a direct .mp3 URL.",
        variant: "destructive",
      });
    }
  };

  // open file dialog programmatically
  const openFilePicker = () => {
    if (!fileInputRef.current) return;
    fileInputRef.current.value = "";
    fileInputRef.current.click();
  };

  // handle file selection
  const onFileSelected = (file?: File | null) => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    onChange(url);
    toast({ title: "Local audio selected", description: file.name });
    setTimeout(() => {
      if (!audioRef.current) return;
      audioRef.current.src = url;
      audioRef.current.load();
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {
        setIsPlaying(false);
      });
    }, 50);
  };

  const pasteHelperText = () => {
    if (!value) return "Paste direct MP3/WAV URL, YouTube link, or upload a local file";
    if (isYouTube(value)) return "YouTube link detected - use the video controls to play";
    if (!supported) return "This platform may not provide direct audio streams.";
    if (!isLikelyDirectAudio(value))
      return "This URL may not be a direct audio file. Try a direct .mp3/.wav or use YouTube / local upload.";
    return "Direct audio URL detected - click Play to start.";
  };

  return (
    <div className="flex flex-col gap-3 w-full">
      {/* hidden audio element */}
      <audio ref={(el) => (audioRef.current = el)} className="hidden" />

      {/* hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="audio/*"
        className="hidden"
        onChange={(e) => onFileSelected(e.target.files?.[0] ?? null)}
      />

      {/* YouTube video preview */}
      {/* {showVideo && (
        <div className="relative">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">YouTube Preview</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowVideo(false)}
              className="h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="relative bg-black rounded-lg overflow-hidden">
            <div id="youtube-player" className="w-full aspect-video"></div>
          </div>
        </div>
      )} */}

       {/* Show video toggle button for YouTube URLs */}
      {isYouTube(value) && !showVideo && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowVideo(true)}
          className="self-start"
        >
          Show YouTube Video
        </Button>
      )}

      {/* control row */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Paste direct MP3/WAV URL or YouTube link, or upload a file"
            type="url"
            className={!supported && value ? "border-destructive" : ""}
          />
          {!supported && value && (
            <div className="absolute right-2 top-2 text-destructive">
              <AlertCircle className="h-5 w-5" />
            </div>
          )}
        </div>

  {/* YouTube video preview */}
  {showVideo && (
      <div className="relative bg-black rounded-lg overflow-hidden" style={{ width: '150px', height: '40px' }}>
        <div id="youtube-player" className="w-full h-full"></div>
      </div>
  )}
        <Button
          type="button"
          variant="outline"
          size={small ? "icon" : "default"}
          onClick={togglePlay}
          disabled={!value}
        >
          {small ? (
            isYouTube(value) ? (
              isYoutubePlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />
            ) : (
              isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />
            )
          ) : isYouTube(value) ? (
            isYoutubePlaying ? (<><Pause className="h-4 w-4" /> Pause</>) : (<><Play className="h-4 w-4" /> Play</>)
          ) : (
            isPlaying ? (<><Pause className="h-4 w-4 " /> Pause</>) : (<><Play className="h-4 w-4 " /> Play</>)
          )}
        </Button>

        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={openFilePicker}
          title="Upload audio file"
        >
          <Upload className="h-5 w-5" />
        </Button>
      </div>

      <div className="text-xs text-muted-foreground">{pasteHelperText()}</div>

    </div>
  );
}