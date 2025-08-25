// src/components/background/controls/ThreeControls.tsx
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";

type Props = {
  options: any;
  onChange: (o: any) => void;
};

export default function ThreeControls({ options, onChange }: Props) {
  return (
    <div className="space-y-3 mt-3">

      <div className="grid grid-cols-2 gap-3">
        
        <div>
          <Label className="text-xs">Count</Label>
          <Slider value={[options.count ?? 1200]} onValueChange={([v]) => onChange({ count: v })} min={200} max={5000} step={50} />
        </div>
        <div>
            <Label className="text-xs">Size (visual)</Label>
            <Slider value={[options.size ?? 2]} onValueChange={([v]) => onChange({ size: v })} min={1} max={8} step={1} />
      </div>
      </div>
<div>
          <Label className="text-xs">Color</Label>
          <Input type="color" value={options.color || "#ffffff"} onChange={(e) => onChange({ color: e.target.value })} className="w-12 h-10 rounded-lg" />
        </div>
      
    </div>
  );
}
