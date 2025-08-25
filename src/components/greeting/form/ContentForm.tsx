import AITextSuggestions from '../contentEditor/AITextSuggestions';
import GIFSearchWidget from '@/components/greeting/contentEditor/mediaUploader/GIFSearchWidget';

import SaveGreetingButton from '@/components/share/SaveGreetingButton';
import { TextContent, MediaItem } from '@/types/greeting';
import AdvancedTextEditor from '../contentEditor/textEditor/AdvancedTextEditor';
import AdvancedMediaUploader from '../contentEditor/mediaUploader/AdvancedMediaUploader';

interface ContentFormProps {
  texts: TextContent[];
  media: MediaItem[];
  onTextChange: (texts: TextContent[]) => void;
  onMediaChange: (media: MediaItem[]) => void
}

const ContentForm = ({
  texts,
  media,
  onTextChange,
  onMediaChange,
}: ContentFormProps) => {
  return (
    <>
      {/* Advanced Text Editor */}
      <AdvancedTextEditor
        texts={texts}
        onChange={onTextChange}
      />

      {/* <Separator />

      {/* Advanced Media Uploader */}
      {/* <AdvancedMediaUploader
        media={media}
        onChange={onMediaChange}
      />  */}
     
    </>
  );
};

export default ContentForm;