import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { SmilePlus } from "lucide-react";

interface ElementPickerProps {
  onSelect: (value: string) => void;
  type: "emoji" | "image";
}

const predefinedEmojis = [
  "⭐", "✨", "🎉", "💖", "🌸", "🌟", "🔥", "🍀", "🎂", "🎁", "🥳", "🌈", "🦋", "🍩", "🎶"
];

const predefinedImages = [
  "https://cdn-icons-png.flaticon.com/512/888/888879.png",
  "https://cdn-icons-png.flaticon.com/512/616/616408.png",
  "https://cdn-icons-png.flaticon.com/512/2917/2917995.png",
  "https://cdn-icons-png.flaticon.com/512/826/826963.png",
  "https://cdn-icons-png.flaticon.com/512/535/535188.png"
];

export default function ElementPicker({ onSelect, type }: ElementPickerProps) {
  const items = type === "emoji" ? predefinedEmojis : predefinedImages;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="ml-2 h-8 w-8 p-0">
          <SmilePlus className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="grid grid-cols-6 gap-2 w-64 p-3">
        {items.map((item, i) => (
          <button
            key={i}
            onClick={() => onSelect(item)}
            className="flex items-center justify-center rounded-lg hover:bg-muted transition h-10 w-10 text-xl"
          >
            {type === "emoji" ? (
              item
            ) : (
              <img src={item} alt="decor" className="h-6 w-6" />
            )}
          </button>
        ))}
      </PopoverContent>
    </Popover>
  );
}
