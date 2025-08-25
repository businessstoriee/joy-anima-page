import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MediaItem } from "@/types/greeting";
import { frameStyles } from "@/components/preview/MediaFrames";

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
             min={50}  // optional lower bound
             max={500} // enforce max width
            value={item.position.width}
            onChange={(e) =>
              updateMedia(index, "position", { width: Number(e.target.value) })
            }
          />
        </div>
        <div>
          <Label>Height (px)</Label>
          <Input
            type="number"
             min={40}  // optional lower bound
             max={400} // enforce max width
            value={item.position.height}
            onChange={(e) =>
              updateMedia(index, "position", { height: Number(e.target.value) })
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
            <SelectItem value="fadeIn">Fade In</SelectItem>
            <SelectItem value="slideUp">Slide Up</SelectItem>
            <SelectItem value="zoomIn">Zoom In</SelectItem>
            <SelectItem value="rotateIn">Rotate In</SelectItem>
            <SelectItem value="bounceIn">Bounce In</SelectItem>

            <SelectItem value="fadeUpStagger">Fade Up Stagger</SelectItem>
            <SelectItem value="slideLeft">Slide Left</SelectItem>
            <SelectItem value="flipIn">Flip In</SelectItem>
            <SelectItem value="swingIn">Swing In</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Frame Style */}
      <div>
        <Label>Frame Style</Label>
        <Select
          value={(item as any).frameStyle || "classic"}
          onValueChange={(val) => updateMedia(index, "frameStyle" as any, val)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select frame style" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(frameStyles).map(([key, frame]) => (
              <SelectItem key={key} value={key}>
                {frame.name}
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
