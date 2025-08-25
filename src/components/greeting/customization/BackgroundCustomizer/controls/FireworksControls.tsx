// src/components/background/controls/FireworksControls.tsx
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import PaletteEditor from "./PaletteEditor";

type Props = {
  options: any;
  onChange: (o: any) => void;
};

export default function FireworksControls({ options, onChange }: Props) {
  return (
    <div className="space-y-3 mt-5">
      

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="text-xs">Burst Count</Label>
          <Slider value={[options.burstCount ?? 40]} onValueChange={([v]) => onChange({ burstCount: v })} min={6} max={200} step={2} />
        </div>
        <div>
          <Label className="text-xs">Spawn Interval</Label>
          <Slider value={[options.spawnInterval ?? 800]} onValueChange={([v]) => onChange({ spawnInterval: v })} min={200} max={3000} step={50} />
        </div>
      </div>
      <div>
        <Label className="text-xs">Color Palette </Label>
        <PaletteEditor options={options} onChange={onChange} maxColors={8} />
      </div>
    </div>
  );
}
