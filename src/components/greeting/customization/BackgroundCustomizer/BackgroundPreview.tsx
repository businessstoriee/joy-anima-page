import React from "react";
import { BackgroundSettings } from "@/types/background";
import BackgroundRenderer, { BG_ANIMATION_OPTIONS, BG_PATTERN_OPTIONS } from "./BackgroundRenderer";

type BackgroundPreviewProps = {
  settings: BackgroundSettings;
  className?: string;
  label?: string;
};

const pillStyle = "inline-flex items-center gap-2 px-2 py-0.5 rounded-full text-xs font-medium";

const BackgroundPreview: React.FC<BackgroundPreviewProps> = ({
  settings,
  className,
  label = "Background Preview",
}) => {
  // label text like "✨ Sparkles + Polka Dots"
  const labelText =
    settings.animation?.enabled || settings.pattern?.enabled
      ? [
          settings.animation?.enabled &&
            BG_ANIMATION_OPTIONS.find((a) => a.value === settings.animation.type)?.label,
          settings.pattern?.enabled &&
            BG_PATTERN_OPTIONS.find((p) => p.value === settings.pattern.type)?.label,
        ]
          .filter(Boolean)
          .join(" + ")
      : "Static";

  // active base: Image > Gradient > Color
  const activeBase = settings.image ? "Image" : settings.gradient?.enabled ? "Gradient" : "Color";

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-1">
        <div className="text-xs text-muted-foreground">{label}</div>
        <div>
          <span
            className={`${pillStyle} ${
              activeBase === "Image" ? "bg-emerald-100 text-emerald-700" :
              activeBase === "Gradient" ? "bg-sky-100 text-sky-700" : "bg-gray-100 text-gray-700"
            }`}
            title={`Active base: ${activeBase}`}
          >
            {activeBase}
          </span>
        </div>
      </div>

      <div className="w-full h-24 rounded-lg border-2 border-dashed border-border overflow-hidden relative">
        <BackgroundRenderer settings={settings} className={className || "w-full h-full"}>
          {/* Overlay text */}
          <div className="absolute inset-10 flex items-center justify-center text-xs font-medium text-white/90 pointer-events-none">
            {labelText}
          </div>
        </BackgroundRenderer>
      </div>
    </div>
  );
};

export default BackgroundPreview;
