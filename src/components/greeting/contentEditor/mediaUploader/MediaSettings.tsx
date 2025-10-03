import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MediaItem } from "@/types/greeting";
import { frameStyles } from "@/components/preview/MediaFrames";
import { animationOptions } from "@/types/animations";
import { frameStyleOptions } from "@/types/frames";
import { layoutStyles } from "@/types/layouts";

interface MediaSettingsProps {
  item: MediaItem;
  index: number;
  updateMedia: (index: number, field: keyof MediaItem, value: any) => void;
}

const MediaSettings: React.FC<MediaSettingsProps> = ({ item, index, updateMedia }) => {
  return (
    <div className="space-y-3 p-3 rounded-md border border-pink-200">
      {/* Size Controls */}
      <div className="hidden md:block">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Width (px)</Label>
          <Input
            type="number"
             min={100}  // consistent minimum
             max={400} // desktop max width
            value={item.position.width}
             onChange={(e) =>
               updateMedia(index, "position", { ...item.position, width: Number(e.target.value) })
             }
          />
        </div>
        <div>
          <Label>Height (px)</Label>
          <Input
            type="number"
             min={100}  // consistent minimum
             max={350} // desktop max height
            value={item.position.height}
             onChange={(e) =>
               updateMedia(index, "position", { ...item.position, height: Number(e.target.value) })
             }
          />
        </div>
      </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {/* Animation Select */}
        <div>
          <Label>Animation</Label>
          <Select
            value={item.animation || "fade"}
            onValueChange={(val) => updateMedia(index, "animation", val)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select animation" />
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

        {/* Frame Style */}
        <div>
          <Label>Frame Style</Label>
          <Select
            value={item.frameStyle || "classic"}
            onValueChange={(val) => updateMedia(index, "frameStyle" as keyof MediaItem, val)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select frame style" />
            </SelectTrigger>
            <SelectContent>
              {frameStyleOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

      {/* Layout Selection for Individual Media */}
      <div>
        <Label>Photo Layout</Label>
        <Select
          value={item.layout || "grid"}
          onValueChange={(val) => updateMedia(index, "layout" as keyof MediaItem, val)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select layout" />
          </SelectTrigger>
          <SelectContent>
            {layoutStyles.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      </div>
    </div>
  );
}; 

export default MediaSettings;