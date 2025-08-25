import React, { useEffect, useRef } from "react";

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

interface Props {
  url: string;            // full YouTube URL (watch or youtu.be)
  autoPlay?: boolean;     // attempt autoplay
  muted?: boolean;        // start muted to satisfy autoplay policies
  onReady?: () => void;
  onError?: (e?: any) => void;
}

/**
 * Minimal hidden YouTube player for background audio.
 * We keep the iframe at 0x0, no controls, and loop.
 */
const YouTubeBackground: React.FC<Props> = ({
  url,
  autoPlay = true,
  muted = true,
  onReady,
  onError,
}) => {
  const containerId = useRef(`yt-bg-${Math.random().toString(36).slice(2)}`);
  const playerRef = useRef<any>(null);

  const extractVideoId = (link: string): string | null => {
    try {
      const u = new URL(link);
      if (u.hostname.includes("youtu.be")) {
        return u.pathname.replace("/", "");
      }
      if (u.hostname.includes("youtube.com")) {
        return u.searchParams.get("v");
      }
      return null;
    } catch {
      return null;
    }
  };

  useEffect(() => {
    const videoId = extractVideoId(url);
    if (!videoId) return;

    const init = () => {
      if (!window.YT || !window.YT.Player) return;

      playerRef.current = new window.YT.Player(containerId.current, {
        height: "0",
        width: "0",
        videoId,
        playerVars: {
          autoplay: autoPlay ? 1 : 0,
          controls: 0,
          disablekb: 1,
          fs: 0,
          modestbranding: 1,
          rel: 0,
          loop: 1,
          playlist: videoId, // needed for loop
        },
        events: {
          onReady: (e: any) => {
            try {
              if (muted) e.target.mute();
              if (autoPlay) e.target.playVideo();
            } catch (err) {
              onError?.(err);
            }
            onReady?.();
          },
          onError: (e: any) => {
            onError?.(e);
          },
        },
      });
    };

    // load YouTube API if needed
    if (!window.YT || !window.YT.Player) {
      const scriptId = "youtube-iframe-api";
      if (!document.getElementById(scriptId)) {
        const tag = document.createElement("script");
        tag.id = scriptId;
        tag.src = "https://www.youtube.com/iframe_api";
        document.body.appendChild(tag);
      }
      const prev = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        prev?.();
        init();
      };
    } else {
      init();
    }

    return () => {
      try {
        if (playerRef.current && playerRef.current.destroy) {
          playerRef.current.destroy();
        }
      } catch {}
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, autoPlay, muted]);

  // absolutely hidden, but present in DOM
  return (
    <div
      id={containerId.current}
      style={{
        position: "fixed",
        width: 0,
        height: 0,
        overflow: "hidden",
        opacity: 0,
        pointerEvents: "none",
      }}
      aria-hidden
    />
  );
};

export default YouTubeBackground;
