// src/pages/create/LivePreviewCard.tsx
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Preview from "@/components/preview/Preview";
import { Button } from "@/components/ui/button";
import ActionsForm from '@/components/share/ActionsForm';
import { useLanguageTranslation } from '@/components/language/useLanguageTranslation';


type Props = {
  formData: any;
  selectedEvent: any;
  onOpenPreview: () => void;
  onGenerateLink: () => void;
  onDataChange?: (data: any) => void;
};

export default function LivePreviewCard({ formData, selectedEvent, onOpenPreview, onGenerateLink, onDataChange }: Props) {
  const { translate } = useLanguageTranslation();

  return (
    <Card
      className={` animate-zoom-in shadow-xl ${selectedEvent?.theme || ""} transition-all duration-300 hover:shadow-2xl hover:scale-[1.01]`}
    >
      <CardHeader className="relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-r from-pink-200 to-violet-200 hover:bg-gradient-to-l text-white opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="absolute text-xl opacity-0 group-hover:opacity-100 group-hover:animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.2}s`,
            }}
          >
            ✨
          </div>
        ))}

        <CardTitle onClick={onOpenPreview} className="cursor-pointer flex items-center gap-2 relative z-10">
          <span className="inline-block group-hover:animate-bounce">👀 {translate('Live Preview')} (Click to Expand)</span>
        </CardTitle>
      </CardHeader>

      <CardContent>
        {formData.eventType ? ( 
          <div>
          <Preview 
            greetingData={formData} 
            selectedEvent={selectedEvent} 
            //onDataChange={onDataChange}
          />

          <ActionsForm greetingData={formData} onGenerateLink={onGenerateLink} selectedEvent={selectedEvent}/>

          </div>
        ) : (
          <div className="text-center text-muted-foreground py-12">
            <div className="text-4xl mb-4">🎨</div>
            <p>Select an event type to see your greeting preview</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}