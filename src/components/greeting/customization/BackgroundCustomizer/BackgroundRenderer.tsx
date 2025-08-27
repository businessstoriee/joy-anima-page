import React, { useEffect, useMemo, useRef } from "react";
import "./backgroundAnimations.css";
import { BackgroundSettings } from "@/types/background";
import { cn } from "@/lib/utils";
import { initTspEngine } from "./engines/tspEngine";
import { initFireworksEngine } from "./engines/fireworksEngine";
import { initThreeEngine } from "./engines/threeEngine";

export type BackgroundRendererProps = {
  settings: BackgroundSettings | undefined;
  className?: string;
  children?: React.ReactNode;
  passive?: boolean;
};

export const BG_GRADIENT_DIRECTIONS = [
  { value: "to right", label: "Left → Right" },
  { value: "to left", label: "Right → Left" },
  { value: "to bottom", label: "Top → Bottom" },
  { value: "to top", label: "Bottom → Top" },
  { value: "to bottom right", label: "Diagonal ↘" },
  { value: "to bottom left", label: "Diagonal ↙" },
  { value: "to top right", label: "Diagonal ↗" },
  { value: "to top left", label: "Diagonal ↖" },
] as const;

export const BG_PATTERN_OPTIONS = [
  { value: "grid", label: "Grid Lines" },
  { value: "diagonal", label: "Diagonal Stripes" },
  { value: "circles", label: "Concentric Circles" },
  { value: "checkerboard", label: "Checkerboard" },
  { value: "crosshatch", label: "Crosshatch" },
] as const;

export const BG_ANIMATION_OPTIONS = [
  { value: "bubbles", label: "🫧 Rising Bubbles" },
  { value: "aurora", label: "🌌 Aurora" },
  { value: "threejs", label: "🪐 Galaxy" },
  { value: "tsparticles", label: "🔵 Particles" },
  { value: "fireworks-js", label: "🎆 Fireworks" },
] as const;

declare global {
  interface Window {
    tsParticles?: any;
    THREE?: any;
    confetti?: any;
  }
}

function getPatternBackgroundCSS(type: string): string {
  switch (type) {
    case "dots":
      return "radial-gradient(currentColor 1px, transparent 1px)";
    case "grid":
      return `linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)`;
    case "diagonal":
      return "repeating-linear-gradient(45deg, currentColor 0 2px, transparent 2px 16px)";
    case "waves":
      return `radial-gradient(50% 100% at 50% 0%, currentColor 2px, transparent 3px), radial-gradient(50% 100% at 50% 100%, currentColor 2px, transparent 3px)`;
    case "hexagon":
      return `radial-gradient(circle at 10px 10px, currentColor 2px, transparent 2px), radial-gradient(circle at 20px 25px, currentColor 2px, transparent 2px), radial-gradient(circle at 30px 10px, currentColor 2px, transparent 2px)`;
    case "circles":
      return "repeating-radial-gradient(circle, currentColor 0 2px, transparent 2px 16px)";
    case "checkerboard":
      return `linear-gradient(45deg, currentColor 25%, transparent 25%) -8px 0/16px 16px, linear-gradient(-45deg, currentColor 25%, transparent 25%) -8px 0/16px 16px, linear-gradient(45deg, transparent 75%, currentColor 75%) -8px 0/16px 16px, linear-gradient(-45deg, transparent 75%, currentColor 75%) -8px 0/16px 16px`;
    case "crosshatch":
      return `repeating-linear-gradient(0deg, currentColor 0 1px, transparent 1px 12px), repeating-linear-gradient(90deg, currentColor 0 1px, transparent 1px 12px)`;
    case "triangles":
      return `linear-gradient(30deg, currentColor 12%, transparent 12.1%) 0 0/20px 35px, linear-gradient(150deg, currentColor 12%, transparent 12.1%) 0 0/20px 35px, linear-gradient(210deg, currentColor 12%, transparent 12.1%) 0 0/20px 35px, linear-gradient(330deg, currentColor 12%, transparent 12.1%) 0 0/20px 35px`;
    case "noise":
      return `radial-gradient(circle at 10% 20%, currentColor 0.5px, transparent 1px), radial-gradient(circle at 80% 0%, currentColor 0.5px, transparent 1px), radial-gradient(circle at 50% 80%, currentColor 0.5px, transparent 1px)`;
    default:
      return "";
  }
}

const BackgroundRenderer: React.FC<BackgroundRendererProps> = ({ settings, className, children, passive }) => {
  const enabled = !!settings?.enabled;
  const animContainerRef = useRef<HTMLDivElement | null>(null);
  const engineInstance = useRef<any>(null);

  useEffect(() => {
    if (!settings?.animation?.enabled || !animContainerRef.current) return;
    const container = animContainerRef.current;

    const reset = async () => {
      try {
        if (engineInstance.current?.destroy) await engineInstance.current.destroy();
      } catch {}
      engineInstance.current = null;
      container.innerHTML = "";
    };

    (async () => {
      await reset();
      const type = settings.animation.type;
      try {
        if (type === "tsparticles") {
          engineInstance.current = await initTspEngine(container, settings);
        } else if (type === "fireworks-js") {
          engineInstance.current = await initFireworksEngine(container, settings);
        } else if (type === "threejs") {
          engineInstance.current = await initThreeEngine(container, settings);
        } else {
          // CSS handled for other animations
        }
      } catch (err) {
        // swallow
      }
    })();

    return () => {
      (async () => {
        try {
          if (engineInstance.current?.destroy) await engineInstance.current.destroy();
        } catch {}
        engineInstance.current = null;
        try { container.innerHTML = ""; } catch {}
      })();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings?.animation?.type, settings?.animation?.enabled, settings?.animation?.speed, settings?.animation?.intensity, JSON.stringify(settings?.animation?.options || {})]);

  const baseStyle = useMemo<React.CSSProperties>(() => {
    if (!enabled || !settings) return {};
    const s: React.CSSProperties = {
      ["--bg-speed" as any]: `${settings.animation?.speed ?? 6}s`,
      ["--bg-intensity" as any]: (settings.animation?.intensity ?? 80) / 100,
      ["--pattern-opacity" as any]: (settings.pattern?.opacity ?? 20) / 100,
      color: "rgba(255,255,255,0.35)",
    };

    // Gradient takes precedence in base style
    if (settings.gradient?.enabled) {
      const [c1, c2] = settings.gradient.colors ?? ["#000000", "#111111"];
      s.background = `linear-gradient(${settings.gradient.direction || "to bottom"}, ${c1}, ${c2})`;
    } else if (settings.color) {
      s.background = settings.color;
    }
    // don't set image here; image is rendered as a dedicated layer so opacity works.
    return s;
  }, [enabled, settings]);

  const pattern = settings?.pattern?.enabled ? settings.pattern.type : "";
  const anim = settings?.animation?.enabled ? settings.animation.type : "";

  return (
    <div className={cn("relative overflow-hidden", className)} style={baseStyle}>
      {/* Image layer (separate so opacity works) */}
      {settings?.image && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: `url(${settings.image})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            opacity: (settings.imageOpacity ?? 100) / 100,
            zIndex: 0,
          }}
        />
      )}

      {/* Pattern overlay (on top of base/image) */}
      {enabled && pattern && (
        <div
          aria-hidden="true"
          className={cn("pointer-events-none absolute inset-0", passive ? "opacity-100" : "")}
          style={{
            backgroundImage: getPatternBackgroundCSS(pattern),
            backgroundSize:
              pattern === "grid"
                ? "40px 40px, 40px 40px"
                : pattern === "hexagon"
                ? "40px 35px"
                : pattern === "checkerboard"
                ? "16px 16px, 16px 16px, 16px 16px, 16px 16px"
                : pattern === "waves"
                ? "40px 20px, 40px 20px"
                : pattern === "crosshatch"
                ? "12px 12px, 12px 12px"
                : "24px 24px",
            opacity: (settings?.pattern?.opacity ?? 20) / 100,
            mixBlendMode: "overlay",
            zIndex: 5,
          }}
        />
      )}

      {/* CSS animation overlays */}
      {enabled && anim && !["tsparticles", "fireworks-js", "threejs"].includes(anim) && (
        <div
          aria-hidden="true"
          className={cn("pointer-events-none absolute inset-0", `bg-anim-${anim}`)}
          style={{
            ["--bg-speed" as any]: `${settings?.animation?.speed ?? 6}s`,
            ["--bg-intensity" as any]: (settings?.animation?.intensity ?? 80) / 100,
            zIndex: 6,
          }}
        />
      )}

      {/* JS animation container */}
      {enabled && anim && ["tsparticles", "fireworks-js", "threejs"].includes(anim) && (
        <div
          ref={animContainerRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{ opacity: (settings?.animation?.intensity ?? 80) / 100, zIndex: 6 }}
        />
      )}

      {/* Children (content) */}
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export default BackgroundRenderer;
