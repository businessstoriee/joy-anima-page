import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { GreetingFormData, EventType } from '@/types/greeting';
import { Palette, Type, Image, Sparkles, Settings, Share } from 'lucide-react';
import BasicDetailsForm from '../contentEditor/BasicDetailsForm';
import ContentForm from './ContentForm';
import AdvancedMediaUploader from '../contentEditor/mediaUploader/AdvancedMediaUploader';
import EmojiSelector from '@/components/greeting/contentEditor/EmojiSelector/EmojiSelector';
import CustomizationForm from './CustomizationForm';

interface CompactFormColumnProps {
  formData: GreetingFormData;
  selectedEvent: EventType | null;
  customEvent: EventType | null;
  onEventChange: (value: string) => void;
  onInputChange: (field: string, value: any) => void;
  onTextChange: (texts: any[]) => void;
  onMediaChange: (media: any[]) => void;
  onEmojiChange: (emojis: any[]) => void;
  onBackgroundChange: (settings: any) => void;
  onBorderChange: (settings: any) => void;
  onLayoutChange: (layout: string) => void;
  onAnimationChange: (animation: string) => void;
  onFrameStyleChange:(frame:string) => void;
  onCustomEventCreate: (event: EventType) => void;
  onGenerateLink: () => void;
}

const CompactFormColumn: React.FC<CompactFormColumnProps> = ({
  formData,
  selectedEvent,
  customEvent,
  onEventChange,
  onInputChange,
  onTextChange,
  onMediaChange,
  onEmojiChange,
  onBackgroundChange,
  onBorderChange,
  onLayoutChange,
  onAnimationChange,
  onFrameStyleChange,
  onCustomEventCreate,
  onGenerateLink
}) => {
  const getTabBadgeCount = (tab: string) => {
    switch (tab) {
      case 'content':
        return formData.texts.length;
      case 'media':
        return formData.media.length;
      case 'emojis':
        return formData.emojis.length;
      default:
        return 0;
    }

  //   const getCombinedTabCount = (): number => {
  // const textCount = formData.texts?.length || 0;
  // const mediaCount = formData.media?.length || 0;
  // const emojiCount = formData.emojis?.length || 0;
  // return textCount + mediaCount + emojiCount;

  // };
  };

  return (
    <Card className="w-full border-2 border-primary/20 shadow-xl bg-gradient-to-br from-background to-secondary/10">
      {/* <CardHeader className="pb-4">
        <CardTitle className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Design Your Greeting
        </CardTitle>
      </CardHeader> */}

      <CardContent className="space-y-6 mt-6">
  <Tabs defaultValue="basics" className="w-full">
    <TabsList className="grid w-full grid-cols-4 h-auto p-1 gap-1 bg-muted/20 rounded-lg">
      {/* Basics Tab */}
      <TabsTrigger 
        value="basics" 
        className="flex flex-col items-center gap-1 py-2 relative rounded-md transition-all duration-200
                  hover:bg-primary/10 hover:text-primary
                  data-[state=active]:bg-primary data-[state=active]:text-primary-foreground
                  data-[state=active]:shadow-sm"
      >
        <Settings className="h-4 w-4" />
        <span className="text-xs">Basics</span>
        {/* Active indicator */}
        <span className="absolute bottom-0 h-[2px] w-0 bg-primary transition-all duration-300 
                        data-[state=active]:w-4/5" />
      </TabsTrigger>
      
      {/* Content Tab */}
      <TabsTrigger 
        value="content" 
        className="flex flex-col items-center gap-1 py-2 relative rounded-md transition-all duration-200
                  hover:bg-primary/10 hover:text-primary
                  data-[state=active]:bg-primary data-[state=active]:text-primary-foreground
                  data-[state=active]:shadow-sm"
      >
        <Type className="h-4 w-4" />
        <span className="text-xs">Content</span>
        {getTabBadgeCount('content') > 0 && (
          <Badge 
            variant="secondary" 
            className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-xs
                      data-[state=active]:bg-primary-foreground data-[state=active]:text-primary"
          >
            {getTabBadgeCount('content')}
          </Badge>
        )}
        {/* Active indicator */}
        <span className="absolute bottom-0 h-[2px] w-0 bg-primary transition-all duration-300 
                        data-[state=active]:w-4/5" />
      </TabsTrigger>
      
      {/* Media Tab */}
      <TabsTrigger 
        value="media" 
        className="flex flex-col items-center gap-1 py-2 relative rounded-md transition-all duration-200
                  hover:bg-primary/10 hover:text-primary
                  data-[state=active]:bg-primary data-[state=active]:text-primary-foreground
                  data-[state=active]:shadow-sm"
      >
        <Image className="h-4 w-4" />
        <span className="text-xs">Media</span>
        {getTabBadgeCount('media') > 0 && (
          <Badge 
            variant="secondary" 
            className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-xs
                      data-[state=active]:bg-primary-foreground data-[state=active]:text-primary"
          >
            {getTabBadgeCount('media')}
          </Badge>
        )}
        {/* Active indicator */}
        <span className="absolute bottom-0 h-[2px] w-0 bg-primary transition-all duration-300 
                        data-[state=active]:w-4/5" />
      </TabsTrigger>
      
      {/* Design Tab */}
      <TabsTrigger 
        value="design" 
        className="flex flex-col items-center gap-1 py-2 relative rounded-md transition-all duration-200
                  hover:bg-primary/10 hover:text-primary
                  data-[state=active]:bg-primary data-[state=active]:text-primary-foreground
                  data-[state=active]:shadow-sm"
      >
        <Palette className="h-4 w-4" />
        <span className="text-xs">Design</span>
        {getTabBadgeCount('emojis') > 0 && (
          <Badge 
            variant="secondary" 
            className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-xs
                      data-[state=active]:bg-primary-foreground data-[state=active]:text-primary"
          >
            {getTabBadgeCount('emojis')}
          </Badge>
        )}
        {/* Active indicator */}
        <span className="absolute bottom-0 h-[2px] w-0 bg-primary transition-all duration-300 
                        data-[state=active]:w-4/5" />
      </TabsTrigger>
    </TabsList>

    {/* Tab Content */}
    <div className="mt-6">
      <TabsContent value="basics" className="space-y-4 mt-0 animate-fade-in">
        <BasicDetailsForm
          eventType={formData.eventType}
          receiverName={formData.receiverName}
          senderName={formData.senderName}
          customEvent={customEvent}
          onEventChange={onEventChange}
          onInputChange={onInputChange}
          onCustomEventCreate={onCustomEventCreate}
        />
      </TabsContent>

      <TabsContent value="content" className="space-y-4 mt-0 animate-fade-in">
        <ContentForm
          texts={formData.texts}
          media={formData.media}
          onTextChange={onTextChange}
          onMediaChange={onMediaChange}
        />
      </TabsContent>

      <TabsContent value="media" className="space-y-4 mt-0 animate-fade-in">
        <AdvancedMediaUploader
          media={formData.media}
          onChange={onMediaChange}
          maxItems={20}
        />
      </TabsContent>

      <TabsContent value="design" className="space-y-4 mt-0 animate-fade-in">
        <div className="space-y-6">
          <CustomizationForm
            emojis={formData.emojis}
            onEmojiChange={onEmojiChange}
            backgroundSettings={formData.backgroundSettings}
            borderSettings={formData.borderSettings}
            layout={formData.layout}
            frameStyle={formData.frameStyle} 
            animationStyle={formData.animationStyle}
            onBackgroundChange={onBackgroundChange}
            onBorderChange={onBorderChange}
            onLayoutChange={onLayoutChange}
            onAnimationChange={onAnimationChange}
            onFrameStyleChange={onFrameStyleChange}
          />
        </div>
      </TabsContent>
    </div>
  </Tabs>
</CardContent>
    </Card>
  ); 
};

export default CompactFormColumn;