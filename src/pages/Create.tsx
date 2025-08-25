// src/pages/create/Create.tsx
import React from "react";
import { cn } from "@/lib/utils";
import { useCreate } from "./create/useCreate";
import BackButton from "@/components/ui/back-button";
import LanguageSelector from "@/components/language/LanguageSelector";
import CompactFormColumn from "@/components/greeting/form/CompactFormColumn";
import LivePreviewCard from "./create/LivePreviewCard";
import PreviewModal from "./create/PreviewModal";
import { useLanguageTranslation } from '@/components/language/useLanguageTranslation';

const CreatePage: React.FC = () => {
  const {
    formData,
    selectedEvent,
    customEvent,
    isPreviewOpen,
    setIsPreviewOpen,
    handleInputChange,
    handleMediaChange,
    handleTextChange,
    handlePreviewClick,
    generateShareableURL,
    previewGreeting,
    onCustomEventCreate,
    setFormData,
    setCustomEvent,
  } = useCreate();

  const { translate } = useLanguageTranslation();

  return (
    <div className="bg-gradient-to-br from-primary/10 via-background to-secondary/20 py-2">
      <div className="flex justify-between items-center w-full mt-4 px-4">
        <BackButton to="/" className="bg-background/80 backdrop-blur">
          Back to Home
        </BackButton>

        <LanguageSelector />
      </div>

      <div className="max-w-6xl mx-auto pt-16">
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-2xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-pink-500 to-violet-500 hover:bg-gradient-to-l bg-clip-text text-transparent animate-bounce">
            ✨ {translate('Create Your Greeting')}
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground font-medium animate-typing overflow-hidden border-r-4 border-r-primary">
            Design a beautiful, personalized greeting to share with someone special
          </p>
        </div>
 
        <div className="grid lg:grid-cols-2 gap-8">
          <CompactFormColumn
            formData={formData}
            selectedEvent={selectedEvent}
            customEvent={customEvent}
            onEventChange={(v) => handleInputChange("eventType", v)}
            onInputChange={(f, v) => handleInputChange(f, v)}
            onTextChange={handleTextChange}
            onMediaChange={handleMediaChange}
            onEmojiChange={(emojis) => setFormData((p: any) => ({ ...p, emojis }))}
            onBackgroundChange={(s) => setFormData((p: any) => ({ ...p, backgroundSettings: s }))}
            onBorderChange={(s) => setFormData((p: any) => ({ ...p, borderSettings: s }))}
            onLayoutChange={(layout) => handleInputChange("layout", layout)}
            onAnimationChange={(anim) => handleInputChange("animationStyle", anim)}
            onFrameStyleChange={(frame) => handleInputChange("framenStyle", frame)}
            onCustomEventCreate={onCustomEventCreate}
            onGenerateLink={generateShareableURL}
          />

          <div className={cn("space-y-6")}>
            <LivePreviewCard 
              formData={formData} 
              selectedEvent={selectedEvent} 
              onOpenPreview={handlePreviewClick} 
              onGenerateLink={generateShareableURL}
              onDataChange={setFormData}
            />

            {/* Enhanced preview modal with editing capabilities */}
            <PreviewModal 
              isOpen={isPreviewOpen} 
              onClose={() => setIsPreviewOpen(false)} 
              greetingData={formData} 
              selectedEvent={selectedEvent}
              onDataChange={setFormData}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePage;