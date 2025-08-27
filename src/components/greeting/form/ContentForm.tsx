import { TextContent, MediaItem } from '@/types/greeting';
import AdvancedTextEditor from '../contentEditor/textEditor/AdvancedTextEditor';

interface ContentFormProps {
  texts: TextContent[];
  media: MediaItem[];
  eventType: string;
  onTextChange: (texts: TextContent[]) => void;
  onMediaChange: (media: MediaItem[]) => void;
}

const ContentForm = ({
  texts,
  onTextChange,
}: ContentFormProps) => {
  return (
    <>
      {/* Advanced Text Editor */}
      <AdvancedTextEditor
        texts={texts}
        onChange={onTextChange}
      />
    </>
  );
};

export default ContentForm;