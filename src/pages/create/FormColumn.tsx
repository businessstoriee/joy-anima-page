// src/pages/create/FormColumn.tsx
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import BasicDetailsForm from "@/components/greeting/contentEditor/BasicDetailsForm";
import ContentForm from "@/components/greeting/form/ContentForm";
import CustomizationForm from "@/components/greeting/form/CustomizationForm";
import ActionsForm from "@/components/share/ActionsForm";
import { GreetingFormData, TextContent, MediaItem, EventType } from "@/types/greeting";

type Props = {
  formData: GreetingFormData;
  selectedEvent: EventType | null;
  customEvent: EventType | null;
  onEventChange: (value: string) => void;
  onInputChange: (field: string, value: any) => void;
  onTextChange: (texts: TextContent[]) => void;
  onMediaChange: (media: MediaItem[]) => void;
  onEmojiChange: (emojis: any[]) => void;
  onBackgroundChange: (s: any) => void;
  onBorderChange: (s: any) => void;
  onLayoutChange: (layout: string) => void;
  onAnimationChange: (anim: string) => void;
  onFrameStyleChange:(frame:string) => void;
  onCustomEventCreate: (e: EventType) => void;
  onGenerateLink: () => void;
};

export default function FormColumn(props: Props) {
  const {
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
    onGenerateLink,
  } = props;

  return (
    <Card className="animate-slide-in shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">🎨 Customize Your Greeting</CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        <BasicDetailsForm
          eventType={formData.eventType}
          senderName={formData.senderName}
          receiverName={formData.receiverName}
          customEvent={customEvent}
          onEventChange={(value) => {
            onEventChange(value);
          }}
          onInputChange={onInputChange}
          onCustomEventCreate={onCustomEventCreate}
        />

        <Separator />

        <ContentForm
          texts={formData.texts}
          media={formData.media}
          onTextChange={onTextChange}
          onMediaChange={onMediaChange}
        />

        <Separator />

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

        <ActionsForm
          greetingData={formData}
          onGenerateLink={onGenerateLink}
          selectedEvent={selectedEvent}
        />
      </CardContent>
    </Card>
  );
}
