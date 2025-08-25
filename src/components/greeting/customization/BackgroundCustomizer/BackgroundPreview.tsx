import React from "react";
import { BackgroundSettings } from "@/types/background";
import BackgroundRenderer, {
  BG_ANIMATION_OPTIONS,
  BG_PATTERN_OPTIONS,
} from "./BackgroundRenderer";

type BackgroundPreviewProps = {
  settings: BackgroundSettings;
  className?: string;
  label?: string;
};

const BackgroundPreview: React.FC<BackgroundPreviewProps> = ({
  settings,
  className,
  label = "Background Preview",
}) => { 
  // Build label text: "✨ Sparkles + Polka Dots"
  const labelText =
    settings.animation?.enabled || settings.pattern?.enabled
      ? [
          settings.animation?.enabled &&
            BG_ANIMATION_OPTIONS.find(
              (a) => a.value === settings.animation.type
            )?.label,
          settings.pattern?.enabled &&
            BG_PATTERN_OPTIONS.find((p) => p.value === settings.pattern.type)
              ?.label,
        ]
          .filter(Boolean)
          .join(" + ")
      : "Static";

  return (
    <div className="w-full">
      <div className="text-xs text-muted-foreground mb-1">{label}</div>
      <div className="w-full h-24 rounded-lg border-2 border-dashed border-border overflow-hidden">
        <BackgroundRenderer settings={settings} className={className || "w-full h-full"}>
          {/* Overlayed label text */}
          <div className="absolute inset-10 flex items-center justify-center text-xs font-medium text-white/90 bg-black/10">
            {labelText}
          </div>
        </BackgroundRenderer>
      </div>
    </div>
  );
};

export default BackgroundPreview;
