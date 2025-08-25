import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Play, Pause, AlertCircle, Music2, Loader2, Plus, Upload, Youtube } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import YouTubeBackground from "./YouTubeBackground";

interface AudioPlayerInputProps {
  value: string;
  onChange: (value: string) => void;
  autoPlay?: boolean;
}

interface Track {
  id: string | number;
  previewURL: string;
  fullURL: string;
  tags: string;
  duration?: number;
  source: "pixabay" | "freesound";
}

const PIXABAY_KEY = "YOUR_PIXABAY_API_KEY";      // 🔧 replace in prod
const FREESOUND_KEY = "";                         // 🔧 optional. If empty, we show a helpful message.

export default function AudioPlayerInput({
  value,
  onChange,
  autoPlay = false,
}: AudioPlayerInputProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const previewRef = useRef<HTMLAudioElement | null>(null); // for previews
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [isSupportedUrl, setIsSupportedUrl] = useState(true);
  const [showPicker, setShowPicker] = useState(false);

  const [activeTab, setActiveTab] = useState<"pixabay" | "freesound" | "youtube" | "upload">("pixabay");
  const [searchTerm, setSearchTerm] = useState("happy");
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(false);

  // responsive
  useEffect(() => {
    const checkScreenSize = () => setIsSmallScreen(window.innerWidth < 768);
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // validate + autoplay (for non-YouTube sources)
  useEffect(() => {
    const isYT = isYouTubeUrl(value);
    if (isYT) {
      // YouTube is handled by YouTubeBackground component
      setIsSupportedUrl(true);
      setIsPlaying(autoPlay); // we "assume" it tries to play; actual state inside YT
      return;
    }

    if (value) {
      const supported = checkSupportedUrl(value);
      setIsSupportedUrl(supported);

      if (supported && audioRef.current) {
        audioRef.current.src = value;
        audioRef.current.load();

        if (autoPlay) {
          const playPromise = audioRef.current.play();
          if (playPromise !== undefined) {
            playPromise
              .then(() => setIsPlaying(true))
              .catch(() => {
                setIsPlaying(false);
                toast({
                  title: "Tap to play music 🎵",
                  description: "Your browser blocked autoplay. Please tap Play.",
                });
              });
          }
        }
      }
    } else {
      setIsPlaying(false);
      setIsSupportedUrl(true);
    }
  }, [value, autoPlay]);

  const isYouTubeUrl = (url: string): boolean => {
    if (!url) return false;
    try {
      const u = new URL(url);
      return /youtube\.com|youtu\.be/.test(u.hostname);
    } catch {
      return false;
    }
  };

  const checkSupportedUrl = (url: string): boolean => {
    try {
      new URL(url);
      const unsupportedDomains = [
        "jiosaavn.com",
        "gaana.com",
        "spotify.com",
        "soundcloud.com", // most are not direct MP3
      ];
      // (We DO support pixabay direct .mp3 now, earlier you excluded it.)
      // YouTube is handled via iframe; don't block it here.
      if (isYouTubeUrl(url)) return true;
      return !unsupportedDomains.some((domain) => url.includes(domain));
    } catch {
      return false;
    }
  };

  const togglePlayPause = () => {
    if (isYouTubeUrl(value)) {
      // For YouTube, just instruct user if it didn't auto play; no direct control here.
      toast({
        title: "YouTube playing in background",
        description: "If you can't hear it, unmute system volume or try another track.",
      });
      return;
    }

    if (!audioRef.current || !isSupportedUrl) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setIsPlaying(true))
          .catch(() => {
            setIsPlaying(false);
            toast({
              title: "Playback failed",
              description: "Please use a direct audio file (.mp3, .wav) or pick from the library.",
              variant: "destructive",
            });
          });
      }
    }
  };

  /** ---------------- Fetchers ---------------- */

  const fetchPixabay = async (query: string) => {
    setLoading(true);
    try {
      if (!PIXABAY_KEY || PIXABAY_KEY.startsWith("YOUR_")) {
        toast({
          title: "Pixabay key missing",
          description: "Set PIXABAY_KEY in AudioPlayerInput.tsx.",
        });
        setTracks([]);
        return;
      }
      const res = await fetch(
        `https://pixabay.com/api/music/?key=${PIXABAY_KEY}&q=${encodeURIComponent(
          query
        )}&per_page=12`
      );
      const data = await res.json();
      const mapped: Track[] = (data.hits || []).map((t: any) => ({
        id: t.id,
        previewURL: t.audio,         // mp3 preview
        fullURL: t.audio,            // use same as background (royalty-free)
        tags: t.tags || t.title || "Track",
        duration: t.duration,
        source: "pixabay",
      }));
      setTracks(mapped);
    } catch (err) {
      toast({
        title: "Error fetching music (Pixabay)",
        description: "Try again later.",
        variant: "destructive",
      });
      setTracks([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchFreesound = async (query: string) => {
    setLoading(true);
    try {
      if (!FREESOUND_KEY) {
        toast({
          title: "Freesound key missing",
          description: "Add FREESOUND_KEY in AudioPlayerInput.tsx to enable this tab.",
        });
        setTracks([]);
        return;
      }
      // Basic text search -> get previews (mp3)
      const res = await fetch(
        `https://freesound.org/apiv2/search/text/?query=${encodeURIComponent(
          query
        )}&fields=id,name,previews,tags,duration&token=${FREESOUND_KEY}`
      );
      const data = await res.json();
      const mapped: Track[] = (data.results || []).map((t: any) => ({
        id: t.id,
        previewURL: t.previews?.["preview-hq-mp3"] || t.previews?.["preview-lq-mp3"],
        fullURL: t.previews?.["preview-hq-mp3"] || t.previews?.["preview-lq-mp3"], // previews are mp3 CDN, fine for BG
        tags: (t.tags || []).join(", ") || t.name,
        duration: t.duration,
        source: "freesound",
      })).filter((x: Track) => !!x.previewURL);
      setTracks(mapped);
    } catch (err) {
      toast({
        title: "Error fetching music (Freesound)",
        description: "Try again later.",
        variant: "destructive",
      });
      setTracks([]);
    } finally {
      setLoading(false);
    }
  };

  /** ---------------- Select / Preview ---------------- */

  const stopPreview = () => {
    if (previewRef.current) {
      try { previewRef.current.pause(); } catch {}
      previewRef.current = null;
    }
  };

  const previewTrack = (track: Track) => {
    stopPreview();
    const a = new Audio(track.previewURL);
    previewRef.current = a;
    a.play().catch(() => {
      toast({
        title: "Preview failed",
        description: "Could not play preview.",
        variant: "destructive",
      });
    });
  };

  const handleSelectTrack = (track: Track) => {
    stopPreview();
    onChange(track.fullURL);     // triggers autoplay via useEffect
    setShowPicker(false);
    toast({ title: "Background music set", description: track.tags });
  };

  const handleSelectYouTube = (ytUrl: string) => {
    if (!isYouTubeUrl(ytUrl)) {
      toast({ title: "Invalid YouTube link", description: "Paste a valid YouTube URL.", variant: "destructive" });
      return;
    }
    onChange(ytUrl); // handled by YouTubeBackground
    setShowPicker(false);
    toast({ title: "YouTube background enabled", description: "Playing in the background." });
  };

  /** ---------------- UI ---------------- */

  const SearchBar = (
    <div className="flex gap-2">
      <Input
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search music..."
      />
      <Button
        onClick={() => {
          if (activeTab === "pixabay") fetchPixabay(searchTerm);
          if (activeTab === "freesound") fetchFreesound(searchTerm);
        }}
        disabled={loading}
        variant="secondary"
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Search"}
      </Button>
    </div>
  );

  return (
    <div className="flex flex-col gap-3 w-full">
      {/* Hidden native audio for non-YouTube */}
      <audio
        ref={audioRef}
        onEnded={() => setIsPlaying(false)}
        onPause={() => setIsPlaying(false)}
        className="hidden"
      />

      {/* Hidden YT player if value is YouTube */}
      {isYouTubeUrl(value) && (
        <YouTubeBackground
          url={value}
          autoPlay={autoPlay}
          muted={true}
          onError={() =>
            toast({
              title: "YouTube playback blocked",
              description: "Autoplay might be blocked. Try tapping play or choose an MP3.",
            })
          }
        />
      )}

      {/* Control row */}
      <div className="flex items-center gap-2 w-full">
        <div className="relative flex-1">
          <Input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Paste direct audio URL or YouTube link, or pick below"
            type="url"
            className={!isSupportedUrl && value ? "border-destructive" : ""}
          />
          {!isSupportedUrl && value && !isYouTubeUrl(value) && (
            <div className="absolute right-2 top-2 text-destructive">
              <AlertCircle className="h-5 w-5" />
            </div>
          )}
        </div>

        <Button
          type="button"
          variant="outline"
          size={isSmallScreen ? "icon" : "default"}
          onClick={togglePlayPause}
          disabled={!value}
          className="shrink-0"
        >
          {isSmallScreen ? (
            isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />
          ) : isPlaying ? (
            <>
              <Pause className="h-4 w-4 mr-2" /> Pause
            </>
          ) : (
            <>
              <Play className="h-4 w-4 mr-2" /> Play
            </>
          )}
        </Button>

        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={() => {
            const newShow = !showPicker;
            setShowPicker(newShow);
            if (newShow) {
              setActiveTab("pixabay");
              fetchPixabay(searchTerm);
            } else {
              stopPreview();
            }
          }}
          title="Open Music Picker"
        >
          <Music2 className="h-5 w-5" />
        </Button>
      </div>

      {/* Picker Panel */}
      {showPicker && (
        <Card className="border rounded-xl shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Choose Background Music</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <Tabs value={activeTab} onValueChange={(v) => { setActiveTab(v as any); stopPreview(); }} className="w-full">
              <TabsList className="grid grid-cols-4 gap-2 mb-3">
                <TabsTrigger value="pixabay">Pixabay</TabsTrigger>
                <TabsTrigger value="freesound">Freesound</TabsTrigger>
                <TabsTrigger value="youtube" className="flex gap-1"><Youtube className="h-4 w-4" />YouTube</TabsTrigger>
                <TabsTrigger value="upload" className="flex gap-1"><Upload className="h-4 w-4" />Upload</TabsTrigger>
              </TabsList>

              {/* Pixabay */}
              <TabsContent value="pixabay" className="space-y-3">
                {SearchBar}
                <div className="grid gap-2 max-h-60 overflow-y-auto">
                  {tracks.map((t) => (
                    <div
                      key={`${t.source}-${t.id}`}
                      className="flex items-center justify-between p-2 rounded-md hover:bg-muted cursor-pointer transition"
                    >
                      <div className="min-w-0">
                        <div className="text-sm font-medium truncate">{t.tags}</div>
                        {t.duration ? (
                          <div className="text-xs text-muted-foreground">{Math.round(t.duration)}s • Pixabay</div>
                        ) : (
                          <div className="text-xs text-muted-foreground">Pixabay</div>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Button size="icon" variant="outline" onClick={() => previewTrack(t)}>
                          <Play className="h-4 w-4" />
                        </Button>
                        <Button size="sm" onClick={() => handleSelectTrack(t)}>
                          <Plus className="h-4 w-4 mr-1" /> Use
                        </Button>
                      </div>
                    </div>
                  ))}
                  {!loading && tracks.length === 0 && (
                    <div className="text-sm text-muted-foreground px-1">No tracks yet. Try a different search.</div>
                  )}
                </div>
              </TabsContent>

              {/* Freesound */}
              <TabsContent value="freesound" className="space-y-3">
                {SearchBar}
                {!FREESOUND_KEY && (
                  <div className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-md p-2">
                    Add your Freesound API key in <code>AudioPlayerInput.tsx</code> to enable this tab.
                  </div>
                )}
                <div className="grid gap-2 max-h-60 overflow-y-auto">
                  {tracks.map((t) => (
                    <div
                      key={`${t.source}-${t.id}`}
                      className="flex items-center justify-between p-2 rounded-md hover:bg-muted cursor-pointer transition"
                    >
                      <div className="min-w-0">
                        <div className="text-sm font-medium truncate">{t.tags}</div>
                        {t.duration ? (
                          <div className="text-xs text-muted-foreground">{Math.round(t.duration)}s • Freesound</div>
                        ) : (
                          <div className="text-xs text-muted-foreground">Freesound</div>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Button size="icon" variant="outline" onClick={() => previewTrack(t)}>
                          <Play className="h-4 w-4" />
                        </Button>
                        <Button size="sm" onClick={() => handleSelectTrack(t)}>
                          <Plus className="h-4 w-4 mr-1" /> Use
                        </Button>
                      </div>
                    </div>
                  ))}
                  {!loading && tracks.length === 0 && (
                    <div className="text-sm text-muted-foreground px-1">No tracks yet. Try a different search.</div>
                  )}
                </div>
              </TabsContent>

              {/* YouTube */}
              <TabsContent value="youtube" className="space-y-3">
                <div className="flex gap-2">
                  <Input
                    placeholder="Paste YouTube link (e.g., https://youtube.com/watch?v=...)"
                    onKeyDown={(e) => {
                      const val = (e.target as HTMLInputElement).value;
                      if (e.key === "Enter") handleSelectYouTube(val);
                    }}
                  />
                  <Button
                    onClick={() => {
                      const el = document.querySelector<HTMLInputElement>('[data-yt-input]');
                      const val = el?.value?.trim() ?? "";
                      handleSelectYouTube(val);
                    }}
                    variant="secondary"
                  >
                    Use
                  </Button>
                </div>
                <Input data-yt-input placeholder="(Optional) Paste link here and click Use" />
                <div className="text-xs text-muted-foreground">
                  Tip: Video is hidden/minimized; audio plays as background. Autoplay may start muted due to browser policy.
                </div>
              </TabsContent>

              {/* Upload */}
              <TabsContent value="upload" className="space-y-3">
                <Input
                  type="file"
                  accept="audio/*"
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      stopPreview();
                      const url = URL.createObjectURL(e.target.files[0]);
                      onChange(url);
                      setShowPicker(false);
                      toast({ title: "Background music set (local file)" });
                    }
                  }}
                />
                <div className="text-xs text-muted-foreground">
                  Your file will play locally in the browser as background music.
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
