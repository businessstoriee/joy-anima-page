import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Smile, Eye, EyeOff } from "lucide-react";
import { EventEmojiSettings, EventType } from "@/types/greeting";
import ElementPicker from "../../customization/BorderCustomizer/ElementPicker";
import { animationOptions } from "@/types/animations";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

interface EventEmojiCustomizerProps {
  eventEmojiSettings: EventEmojiSettings;
  selectedEvent: EventType | null;
  onChange: (settings: EventEmojiSettings) => void;

  // Controlled props (optional) — if provided, component will use these instead of internal state
  expanded?: boolean;
  onToggleExpanded?: () => void;

  visible?: boolean;
  onToggleVisible?: () => void;
}

const EventEmojiCustomizer: React.FC<EventEmojiCustomizerProps> = ({
  eventEmojiSettings,
  selectedEvent,
  onChange,
  expanded: controlledExpanded,
  onToggleExpanded,
  visible: controlledVisible,
  onToggleVisible,
}) => {
  // Fallback local state if parent doesn't control these props
  const [localExpanded, setLocalExpanded] = useState(false);
  const [localVisible, setLocalVisible] = useState(true);

  const expanded = typeof controlledExpanded === "boolean" ? controlledExpanded : localExpanded;
  const visible = typeof controlledVisible === "boolean" ? controlledVisible : localVisible;

  const setExpanded = (next?: boolean) => {
    if (typeof controlledExpanded === "boolean") {
      onToggleExpanded?.();
    } else {
      setLocalExpanded((prev) => (typeof next === "boolean" ? next : !prev));
    }
  };

  const setVisible = (next?: boolean) => {
    if (typeof controlledVisible === "boolean") {
      onToggleVisible?.();
    } else {
      setLocalVisible((prev) => (typeof next === "boolean" ? next : !prev));
    }
  };

  // Defensive defaults for eventEmojiSettings object (in case it's undefined)
  const settings = useMemo<EventEmojiSettings>(() => ({
    emoji: eventEmojiSettings?.emoji ?? (selectedEvent?.emoji ?? "🎉"),
    size: eventEmojiSettings?.size ?? 48,
    animation: eventEmojiSettings?.animation ?? "",
    rotateSpeed: eventEmojiSettings?.rotateSpeed ?? 1.0,
    position: eventEmojiSettings?.position ?? { x: 0, y: 0 },
    textAlign: eventEmojiSettings?.textAlign ?? "center",
    effects: {
      ...((eventEmojiSettings && eventEmojiSettings.effects) || {}),
    }
  }), [eventEmojiSettings, selectedEvent]);

  const updateField = (field: keyof EventEmojiSettings, value: any) => {
    onChange({ ...settings, [field]: value });
  };

  const updateEffect = (field: string, value: any) => {
    onChange({
      ...settings,
      effects: { ...(settings.effects || {}), [field]: value },
    });
  };

  const defaultEmoji = selectedEvent?.emoji ?? "🎉";

  return (
    <div>


      {/* Expand/Collapse with Animation */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <CardContent className="space-y-4">

              <AnimatePresence initial={false}>
                {expanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4"
                  >
                    {/* Emoji Selection */}
                    <div className="space-y-2">
                      <Label className="text-xs font-medium">Event Emoji</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          value={settings.emoji}
                          onChange={(e) => updateField("emoji", e.target.value)}
                          placeholder={defaultEmoji}
                          className="flex-1 text-sm"
                        />
                        <ElementPicker
                          type="emoji"
                          onSelect={(emoji: string) => updateField("emoji", emoji)}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">Default: {defaultEmoji}</p>
                    </div>

                    {/* Settings Grid */}
                    <div className="grid grid-cols-2 gap-3">
                      {/* Size */}
                      <div className="space-y-2">
                        <Label className="text-xs">Size ({settings.size}px)</Label>
                        <Slider
                          value={[settings.size]}
                          onValueChange={([size]) => updateField("size", size)}
                          min={24}
                          max={128}
                          step={4}
                        />
                      </div>

                      {/* Rotation Speed */}
                      <div className="space-y-2">
                        <Label className="text-xs">Rotation Speed ({(settings.rotateSpeed ?? 1).toFixed(1)}s)</Label>
                        <Slider
                          value={[settings.rotateSpeed ?? 1]}
                          onValueChange={([speed]) => updateField("rotateSpeed", speed)}
                          min={0.5}
                          max={5}
                          step={0.1}
                        />
                      </div>

                      {/* Text Align */}
                      <div className="space-y-2">
                        <Label className="text-xs">Text Align</Label>
                        <Select
                          value={settings.textAlign || "center"}
                          onValueChange={(v) => updateField("textAlign", v)}
                        >
                          <SelectTrigger className="text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="left">Left</SelectItem>
                            <SelectItem value="center">Center</SelectItem>
                            <SelectItem value="right">Right</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Animation */}
                      <div className="space-y-2">
                        <Label className="text-xs">Animation</Label>
                        <Select
                          value={settings.animation || ""}
                          onValueChange={(v) => updateField("animation", v)}
                        >
                          <SelectTrigger className="text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {animationOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Glow Effect */}
                      <div className="space-y-2">
                        <Label className="text-xs flex items-center gap-1">
                          Glow Effect
                          <span className="text-[10px] text-muted-foreground">(Toggle to enable)</span>
                        </Label>
                        <div>
                          <Switch
                            checked={!!settings.effects?.glow}
                            onCheckedChange={(checked) => updateEffect("glow", checked)}
                          />
                        </div>
                      </div>

                      {/* Glow Color - Only enabled when glow is active */}
                      <div className="space-y-2">
                        <Label className="text-xs flex items-center gap-1">
                          Glow Color
                          {!settings.effects?.glow && (
                            <span className="text-[10px] text-muted-foreground">(Enable glow first)</span>
                          )}
                        </Label>
                        <Input
                          type="color"
                          value={settings.effects?.glowColor || "#ecdc46ff"}
                          onChange={(e) => updateEffect("glowColor", e.target.value)}
                          disabled={!settings.effects?.glow}
                          className="h-10 w-2/6 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                          title={!settings.effects?.glow ? "Enable glow effect to change color" : "Select glow color"}
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EventEmojiCustomizer;
