import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Palette, Sparkles } from "lucide-react";
import { BackgroundSettings } from "@/types/background";
import BackgroundPreview from "./BackgroundPreview";
import { BG_ANIMATION_OPTIONS, BG_GRADIENT_DIRECTIONS, BG_PATTERN_OPTIONS } from "./BackgroundRenderer";
import TspControls from "./controls/TspControls";
import ThreeControls from "./controls/ThreeControls";
import FireworksControls from "./controls/FireworksControls";
import BackgroundImageUploader from "./BackgroundImageUploader";
import { AnimatePresence, motion } from "framer-motion";

interface BackgroundCustomizerProps {
  settings: BackgroundSettings;
  onChange: (settings: BackgroundSettings) => void;
}

const panelAnim = {
  initial: { height: 0, opacity: 0 },
  animate: { height: "auto", opacity: 1 },
  exit: { height: 0, opacity: 0 },
};

const DEFAULT_SAMPLE_IMAGE =
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&q=80&auto=format&fit=crop";

const BackgroundCustomizer = ({ settings, onChange }: BackgroundCustomizerProps) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(!!settings.enabled);

  // Local toggle for the image panel (expands/collapses)
  const [imageEnabled, setImageEnabled] = useState<boolean>(!!settings.image);

  useEffect(() => {
    setImageEnabled(!!settings.image);
  }, [settings.image]);

  // merge helpers
  const merge = (field: keyof BackgroundSettings, value: any) => {
    const current = (settings as any)[field];
    if (current && typeof current === "object" && !Array.isArray(current)) {
      onChange({ ...settings, [field]: { ...current, ...value } });
    } else {
      onChange({ ...settings, [field]: value });
    }
  };

  const mergeAnimationOptions = (value: any) => {
    const opts = settings.animation.options || {};
    merge("animation", { options: { ...opts, ...value } });
  };

  const toggleEnabled = (enabled: boolean) => {
    onChange({ ...settings, enabled });
    setIsExpanded(enabled);
  };

  const animType = settings.animation.type;

  // When enabling gradient, clear image (mutual exclusivity)
  const setGradientEnabled = (enabled: boolean) => {
    if (enabled) {
      onChange({
        ...settings,
        gradient: { ...settings.gradient, enabled: true },
        image: undefined,
        imageOpacity: undefined,
      });
      setImageEnabled(false);
    } else {
      onChange({ ...settings, gradient: { ...settings.gradient, enabled: false } });
    }
  };

  // Toggle image panel; when enabling and no image present, set default sample image.
  const handleImageToggle = (enabled: boolean) => {
    setImageEnabled(enabled);

    if (!enabled) {
      onChange({ ...settings, image: undefined, imageOpacity: undefined });
      return;
    }

    // enable: ensure gradient is disabled and provide default sample image if none exists
    onChange({
      ...settings,
      gradient: { ...settings.gradient, enabled: false },
      image: settings.image || DEFAULT_SAMPLE_IMAGE,
      imageOpacity: settings.imageOpacity ?? 90,
    });
  };

  // Called from uploader when user picks/removes image
  const handleImageApplied = (imageUrl: string | null) => {
    if (imageUrl) {
      onChange({
        ...settings,
        image: imageUrl,
        imageOpacity: settings.imageOpacity ?? 90,
        gradient: { ...settings.gradient, enabled: false },
      });
      setImageEnabled(true);
    } else {
      onChange({ ...settings, image: undefined, imageOpacity: undefined });
      setImageEnabled(false);
    }
  };

  return (
    <Card className="border border-orange-300 shadow-lg rounded-xl overflow-hidden">
      <CardHeader className="p-4 border-b">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <Palette className="h-4 w-4 text-purple-500" />
            Background Customization
          </CardTitle>
          <Switch checked={!!settings.enabled} onCheckedChange={toggleEnabled} />
        </div>
      </CardHeader>

      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            key="content"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22 }}
          >
            <CardContent className="p-4 space-y-6">
              {/* Base Color */}
              <div className="space-y-2">
                <Label>Base Color</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={settings.color}
                    onChange={(e) => onChange({ ...settings, color: e.target.value })}
                    className="w-12 h-12 rounded-lg cursor-pointer"
                  />
                  <Input
                    value={settings.color}
                    onChange={(e) => onChange({ ...settings, color: e.target.value })}
                    placeholder="#000000"
                    className="flex-1"
                  />
                </div>
              </div>

              {/* Gradient */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Gradient Background</Label>
                  <Switch checked={!!settings.gradient.enabled} onCheckedChange={setGradientEnabled} />
                </div>

                <AnimatePresence initial={false}>
                  {settings.gradient.enabled && (
                    <motion.div
                      key="grad"
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      variants={panelAnim}
                      transition={{ duration: 0.18 }}
                      className="space-y-3 ml-4 pl-4 border-l"
                    >
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-2 sm:gap-4">
                          <div className="space-y-1">
                            <Label className="text-xs">Start</Label>
                            <Input
                              type="color"
                              value={settings.gradient.colors[0]}
                              onChange={(e) =>
                                merge("gradient", { colors: [e.target.value, settings.gradient.colors[1]] })
                              }
                              className="w-10 h-10 rounded-lg"
                            />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs">End</Label>
                            <Input
                              type="color"
                              value={settings.gradient.colors[1]}
                              onChange={(e) =>
                                merge("gradient", { colors: [settings.gradient.colors[0], e.target.value] })
                              }
                              className="w-10 h-10 rounded-lg"
                            />
                          </div>
                        </div>
                        <div>
                          <Label className="text-xs">Direction</Label>
                          <Select value={settings.gradient.direction} onValueChange={(direction) => merge("gradient", { direction })}>
                            <SelectTrigger className="h-9">
                              <SelectValue placeholder="Select direction" />
                            </SelectTrigger>
                            <SelectContent>
                              {BG_GRADIENT_DIRECTIONS.map((d) => (
                                <SelectItem key={d.value} value={d.value}>
                                  {d.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

  {/* Background Image */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Background Image</Label>
                  <Switch checked={imageEnabled} onCheckedChange={handleImageToggle} />
                </div>

                <AnimatePresence initial={false}>
                  {imageEnabled && (
                    <motion.div
                      key="imagePanel"
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      variants={panelAnim}
                      transition={{ duration: 0.18 }}
                      className="ml-4 pl-4 border-l"
                    >
                      <BackgroundImageUploader
                        currentImageUrl={settings.image ?? undefined}
                        opacity={settings.imageOpacity ?? 100}
                        onImageChange={handleImageApplied}
                        onOpacityChange={(opacity) => onChange({ ...settings, imageOpacity: opacity })}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Animation */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-yellow-500" /> Background Animation
                  </Label>
                  <Switch checked={!!settings.animation.enabled} onCheckedChange={(enabled) => merge("animation", { enabled })} />
                </div>

                <AnimatePresence initial={false}>
                  {settings.animation.enabled && (
                    <motion.div
                      key="anim"
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      variants={panelAnim}
                      transition={{ duration: 0.18 }}
                      className="space-y-3 ml-4 pl-4 border-l"
                    >
                      <div>
                        <Label className="text-xs">Animation Type</Label>
                        <Select value={settings.animation.type} onValueChange={(type) => merge("animation", { type })}>
                          <SelectTrigger className="h-9">
                            <SelectValue placeholder="Choose animation" />
                          </SelectTrigger>
                          <SelectContent>
                            {BG_ANIMATION_OPTIONS.map((opt) => (
                              <SelectItem key={opt.value} value={opt.value}>
                                {opt.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-xs">Speed ({settings.animation.speed}s)</Label>
                          <Slider
                            value={[settings.animation.speed]}
                            onValueChange={([v]) => merge("animation", { speed: v })}
                            min={0.5}
                            max={10}
                            step={0.5}
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Intensity ({settings.animation.intensity}%)</Label>
                          <Slider
                            value={[settings.animation.intensity]}
                            onValueChange={([v]) => merge("animation", { intensity: v })}
                            min={10}
                            max={200}
                            step={10}
                          />
                        </div>
                      </div>

                      {animType === "tsparticles" && <TspControls options={settings.animation.options || {}} onChange={mergeAnimationOptions} />}
                      {animType === "threejs" && <ThreeControls options={settings.animation.options || {}} onChange={mergeAnimationOptions} />}
                      {animType === "fireworks-js" && <FireworksControls options={settings.animation.options || {}} onChange={mergeAnimationOptions} />}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Pattern */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Pattern Overlay</Label>
                  <Switch checked={!!settings.pattern.enabled} onCheckedChange={(enabled) => merge("pattern", { enabled })} />
                </div>

                <AnimatePresence initial={false}>
                  {settings.pattern.enabled && (
                    <motion.div
                      key="pattern"
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      variants={panelAnim}
                      transition={{ duration: 0.18 }}
                      className="space-y-3 ml-4 pl-4 border-l"
                    >
                      <div>
                        <Label className="text-xs">Pattern Type</Label>
                        <Select value={settings.pattern.type} onValueChange={(type) => merge("pattern", { type })}>
                          <SelectTrigger className="h-9">
                            <SelectValue placeholder="Choose pattern" />
                          </SelectTrigger>
                          <SelectContent>
                            {BG_PATTERN_OPTIONS.map((p) => (
                              <SelectItem key={p.value} value={p.value}>
                                {p.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label className="text-xs">Opacity ({settings.pattern.opacity}%)</Label>
                        <Slider value={[settings.pattern.opacity]} onValueChange={([v]) => merge("pattern", { opacity: v })} min={5} max={80} step={5} />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <BackgroundPreview settings={settings} />
            </CardContent>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
};

export default BackgroundCustomizer;
