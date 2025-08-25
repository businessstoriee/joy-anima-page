// src/components/background/controls/TspControls.tsx
import React from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";

const tspSubtypes = [
  { value: "constellation", label: "Constellation" },
  { value: "nebula", label: "Nebula" },
  { value: "matrix", label: "Matrix Rain" },
  { value: "snow", label: "Snow" },
  { value: "fireworks", label: "Fireworks-like" },
];

type Props = {
  options: any;
  onChange: (o: any) => void;
};

export default function TspControls({ options, onChange }: Props) {
  return (
    <div className="space-y-3 mt-3">
      

      <div className="grid grid-cols-2 gap-3">
       
        <div>
        <Label className="text-xs">Particle Size</Label>
        <Slider value={[options.size ?? 3]} onValueChange={([v]) => onChange({ size: v })} min={1} max={16} step={1} />
      </div>
        <div>
          <Label className="text-xs">Particle Count</Label>
          <Slider value={[options.particleCount ?? 80]} onValueChange={([v]) => onChange({ particleCount: v })} min={10} max={400} step={5} />
        </div>
      </div>
      <div className="w-full flex gap-3">
        <div className="w-full">
<Label className="text-xs">Particles Pattern</Label>
      <Select value={options.subtype || "constellation"} onValueChange={(v) => onChange({ subtype: v })}>
        <SelectTrigger className="h-9"><SelectValue placeholder="Choose pattern" /></SelectTrigger>
        <SelectContent>
          {tspSubtypes.map((s) => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
        </SelectContent>
      </Select>
</div>
 <div className="w-full">
          <Label className="text-xs">Particle Color</Label>
          <Input type="color" value={options.particleColor || "#ffffff"} onChange={(e) => onChange({ particleColor: e.target.value })} className="w-12 h-10 rounded-lg" />
        </div>
      

      <div className="w-full">
        <Label className="text-xs">Links</Label>
        <Select value={(options.links ? "on" : "off")} onValueChange={(v) => onChange({ links: v === "on" })}>
          <SelectTrigger className="h-9"><SelectValue placeholder="Links" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="on">Enabled</SelectItem>
            <SelectItem value="off">Disabled</SelectItem>
          </SelectContent>
        </Select>
      </div>
      </div>
    </div>
  );
}
