// src/components/background/controls/PaletteEditor.tsx
import React, { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from '@/components/ui/button';


type Props = {
  options: any;
  onChange: (o: any) => void;
  maxColors?: number;
};

export default function PaletteEditor({ options, onChange, maxColors = 8 }: Props) {
  // parse incoming palette string to array
  const parse = (p?: string) =>
    (p || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
      .slice(0, maxColors);

  const [colors, setColors] = useState<string[]>(parse(options.palette));
  const [pasteValue, setPasteValue] = useState<string>("");

  // sync external changes (if options.palette is updated from outside)
  useEffect(() => {
    const parsed = parse(options.palette);
    // only update if different
    if (parsed.join(",") !== colors.join(",")) setColors(parsed);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options.palette]);

  const emit = (newColors: string[]) => {
    setColors(newColors);
    // write back as comma-separated string to remain compatible with engine
    onChange({ palette: newColors.join(",") });
  };

  const updateColor = (idx: number, value: string) => {
    const next = [...colors];
    // make sure value is a hex (browser color input returns valid hex)
    next[idx] = value || "#ffffff";
    emit(next);
  };

  const addColor = () => {
    if (colors.length >= maxColors) return;
    const next = [...colors, "#ffffff"];
    emit(next);
  };

  const removeColor = (idx: number) => {
    const next = colors.filter((_, i) => i !== idx);
    emit(next);
  };

  const applyPaste = () => {
    const parsed = pasteValue
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
      .slice(0, maxColors);
    if (parsed.length) {
      emit(parsed);
      setPasteValue("");
    }
  };

  return (
    <div className="space-y-2">

      {/* Swatches */}
      <div className="flex flex-wrap gap-2 items-center">
        {colors.map((c, i) => (
          <div key={i} className="flex items-center gap-2 bg-white/5 p-1 rounded">
            {/* color picker */}
            <Input
              type="color"
              value={c}
              onChange={(e) => updateColor(i, e.target.value)}
              className="w-9 h-9 p-0 rounded-md cursor-pointer"
            />
            {/* hex text */}
            <div className="text-xs font-mono text-muted-foreground select-all">{c}</div>
            {/* remove button */}
            <button
              type="button"
              aria-label={`Remove color ${c}`}
              onClick={() => removeColor(i)}
              className="text-sm px-2 py-1 rounded bg-red-600/80 hover:bg-red-600 text-white ml-1"
            >
              Remove
            </button>
          </div>
        ))}

        {/* Add button */}
        <div>
          <button
            type="button"
            onClick={addColor}
            disabled={colors.length >= maxColors}
            className="text-sm px-3 py-1 rounded bg-green-600/80 hover:bg-green-600 text-white disabled:opacity-50"
          >
            + Add color
          </button>
        </div>
      </div>

      {/* Paste/import box (comma-separated) */}
      <div className="flex gap-2 items-center">
        <Input
          placeholder="#FF5C5C,#FFD166,#06D6A0"
          value={pasteValue}
          onChange={(e) => setPasteValue(e.target.value)}
          className="flex-1"
        />
        <Button
          type="button"
          onClick={applyPaste}
          variant="ghost"
          className="text-sm  rounded bg-blue-600 hover:bg-blue-600/90 text-white"
        >
          Apply
        </Button>
      </div>

      <div className="text-xs text-muted-foreground">
        Tip: paste a comma-separated list or add colors with the picker. Max {maxColors} colors.
      </div>
    </div>
  );
}
